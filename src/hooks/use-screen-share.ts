import { useCallback, useEffect, useRef } from 'react';
import { useRoomStore } from '../stores/room-store';
import { useAuth } from './use-auth';
import { useSignalR } from './use-signalr';
import { createPeerConnection } from '../lib/webrtc';
import toast from 'react-hot-toast';

export function useScreenShare(roomId?: string) {
  const { user } = useAuth();
  const myUserId = user?.id;
  const signalr = useSignalR(roomId);
  const {
    members,
    isScreenSharing,
    screenShareUserId,
    screenStream,
    setScreenShare,
    setScreenStream,
  } = useRoomStore();

  const localStreamRef = useRef<MediaStream | null>(null);
  const peersRef = useRef<Map<string, RTCPeerConnection>>(new Map());
  const viewerPeerRef = useRef<RTCPeerConnection | null>(null);

  const isPresenter = !!localStreamRef.current || (isScreenSharing && screenShareUserId === myUserId);

  // Presenter: Create offer for a peer
  const sendOfferToPeer = useCallback(
    async (targetUserId: string, stream: MediaStream) => {
      if (!roomId || !targetUserId || targetUserId === myUserId) return;
      try {
        const existingPc = peersRef.current.get(targetUserId);
        if (existingPc) {
          existingPc.close();
          peersRef.current.delete(targetUserId);
        }

        const pc = createPeerConnection();
        peersRef.current.set(targetUserId, pc);

        stream.getTracks().forEach((track) => pc.addTrack(track, stream));

        pc.onicecandidate = (event) => {
          if (event.candidate && signalr.isConnected) {
            signalr
              .invoke('SendIceCandidate', roomId, targetUserId, JSON.stringify(event.candidate))
              .catch(() => {});
          }
        };

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        if (signalr.isConnected) {
          await signalr.invoke('SendWebRTCOffer', roomId, targetUserId, JSON.stringify(offer));
        }
      } catch (err) {
        console.error('Error sending offer to peer:', targetUserId, err);
      }
    },
    [roomId, myUserId, signalr]
  );

  // Stop sharing screen
  const stopShare = useCallback(async () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }

    peersRef.current.forEach((pc) => pc.close());
    peersRef.current.clear();

    if (viewerPeerRef.current) {
      viewerPeerRef.current.close();
      viewerPeerRef.current = null;
    }

    setScreenStream(null);
    setScreenShare(false, null);

    if (roomId && signalr.isConnected) {
      try {
        await signalr.invoke('StopScreenShare', roomId);
      } catch (e) {
        console.error('Failed to notify StopScreenShare:', e);
      }
    }
  }, [roomId, signalr, setScreenShare, setScreenStream]);

  // Start sharing screen
  const startShare = useCallback(async () => {
    if (!roomId) {
      toast.error('Room not connected');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          displaySurface: 'browser' as any,
          frameRate: { ideal: 30, max: 60 },
          width: { ideal: 1920, max: 2560 },
          height: { ideal: 1080, max: 1440 },
        },
        audio: true,
      });

      localStreamRef.current = stream;
      setScreenStream(stream);
      setScreenShare(true, myUserId || null);

      // Listen for browser native stop share button
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.onended = () => {
          stopShare();
        };
      }

      if (signalr.isConnected) {
        await signalr.invoke('StartScreenShare', roomId);
      }

      // Connect to all current room members
      members.forEach((m) => {
        if (m.userId && m.userId !== myUserId) {
          sendOfferToPeer(m.userId, stream);
        }
      });

      toast.success('Screen sharing started!');
    } catch (err: any) {
      if (err.name !== 'NotAllowedError') {
        console.error('Screen share error:', err);
        toast.error('Failed to start screen share');
      }
    }
  }, [roomId, myUserId, signalr, members, setScreenStream, setScreenShare, stopShare, sendOfferToPeer]);

  // Handle SignalR events
  useEffect(() => {
    if (!roomId) return;

    const onScreenShareStarted = (userId: string, username: string) => {
      setScreenShare(userId === myUserId, userId);
      if (userId !== myUserId) {
        toast(`${username} is sharing their screen`, { icon: '🖥️' });
        // Request stream from presenter
        signalr.invoke('RequestScreenShare', roomId, userId).catch(() => {});
      }
    };

    const onScreenShareStopped = (userId: string) => {
      if (viewerPeerRef.current) {
        viewerPeerRef.current.close();
        viewerPeerRef.current = null;
      }
      if (screenShareUserId === userId || !localStreamRef.current) {
        setScreenStream(null);
        setScreenShare(false, null);
      }
    };

    const onScreenShareRequested = (requesterUserId: string, presenterUserId: string) => {
      if (presenterUserId === myUserId && localStreamRef.current) {
        sendOfferToPeer(requesterUserId, localStreamRef.current);
      }
    };

    const onReceiveOffer = async (fromUserId: string, targetUserId: string, offerStr: string) => {
      if (targetUserId !== myUserId) return;
      try {
        if (viewerPeerRef.current) {
          viewerPeerRef.current.close();
          viewerPeerRef.current = null;
        }

        const pc = createPeerConnection();
        viewerPeerRef.current = pc;

        pc.ontrack = (event) => {
          if (event.streams && event.streams[0]) {
            setScreenStream(event.streams[0]);
            setScreenShare(false, fromUserId);
          }
        };

        pc.onicecandidate = (event) => {
          if (event.candidate && signalr.isConnected) {
            signalr
              .invoke('SendIceCandidate', roomId, fromUserId, JSON.stringify(event.candidate))
              .catch(() => {});
          }
        };

        const offer = JSON.parse(offerStr);
        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        if (signalr.isConnected) {
          await signalr.invoke('SendWebRTCAnswer', roomId, fromUserId, JSON.stringify(answer));
        }
      } catch (err) {
        console.error('Error handling WebRTC offer:', err);
      }
    };

    const onReceiveAnswer = async (fromUserId: string, targetUserId: string, answerStr: string) => {
      if (targetUserId !== myUserId) return;
      try {
        const pc = peersRef.current.get(fromUserId);
        if (pc) {
          const answer = JSON.parse(answerStr);
          await pc.setRemoteDescription(new RTCSessionDescription(answer));
        }
      } catch (err) {
        console.error('Error handling WebRTC answer:', err);
      }
    };

    const onReceiveCandidate = async (fromUserId: string, targetUserId: string, candidateStr: string) => {
      if (targetUserId !== myUserId) return;
      try {
        const candidate = JSON.parse(candidateStr);
        const rtcCandidate = new RTCIceCandidate(candidate);

        // If presenter
        const presenterPc = peersRef.current.get(fromUserId);
        if (presenterPc) {
          await presenterPc.addIceCandidate(rtcCandidate);
          return;
        }

        // If viewer
        if (viewerPeerRef.current) {
          await viewerPeerRef.current.addIceCandidate(rtcCandidate);
        }
      } catch (err) {
        console.error('Error adding ICE candidate:', err);
      }
    };

    const onUserJoined = (newUser: any) => {
      const newUserId = newUser.id || newUser.userId;
      if (localStreamRef.current && newUserId && newUserId !== myUserId) {
        sendOfferToPeer(newUserId, localStreamRef.current);
      }
    };

    signalr.on('ScreenShareStarted', onScreenShareStarted);
    signalr.on('ScreenShareStopped', onScreenShareStopped);
    signalr.on('ScreenShareRequested', onScreenShareRequested);
    signalr.on('ReceiveWebRTCOffer', onReceiveOffer);
    signalr.on('ReceiveWebRTCAnswer', onReceiveAnswer);
    signalr.on('ReceiveIceCandidate', onReceiveCandidate);
    signalr.on('UserJoined', onUserJoined);

    return () => {
      signalr.off('ScreenShareStarted', onScreenShareStarted);
      signalr.off('ScreenShareStopped', onScreenShareStopped);
      signalr.off('ScreenShareRequested', onScreenShareRequested);
      signalr.off('ReceiveWebRTCOffer', onReceiveOffer);
      signalr.off('ReceiveWebRTCAnswer', onReceiveAnswer);
      signalr.off('ReceiveIceCandidate', onReceiveCandidate);
      signalr.off('UserJoined', onUserJoined);
    };
  }, [roomId, myUserId, signalr, setScreenShare, setScreenStream, sendOfferToPeer, screenShareUserId]);

  // Request stream if someone is already sharing when we enter the room
  useEffect(() => {
    if (
      roomId &&
      screenShareUserId &&
      screenShareUserId !== myUserId &&
      !screenStream &&
      signalr.isConnected
    ) {
      signalr.invoke('RequestScreenShare', roomId, screenShareUserId).catch(() => {});
    }
  }, [roomId, screenShareUserId, myUserId, screenStream, signalr.isConnected, signalr]);

  return {
    isSharing: isPresenter,
    isViewer: !isPresenter && !!screenStream,
    screenStream,
    screenShareUserId,
    startShare,
    stopShare,
  };
}
