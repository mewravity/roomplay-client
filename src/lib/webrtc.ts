// Screen sharing
export async function startScreenShare(): Promise<MediaStream | null> {
  try {
    return await navigator.mediaDevices.getDisplayMedia({
      video: { frameRate: { max: 30 }, width: { max: 1920 }, height: { max: 1080 } },
      audio: true,
    });
  } catch { return null; }
}

// Voice chat  
export async function getUserAudio(): Promise<MediaStream | null> {
  try {
    return await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
  } catch { return null; }
}

// Video chat
export async function getUserVideo(): Promise<MediaStream | null> {
  try {
    return await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
  } catch { return null; }
}

// Peer connection creation
export function createPeerConnection(config?: RTCConfiguration): RTCPeerConnection {
  return new RTCPeerConnection(config ?? {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
    ],
  });
}

// Voice activity detection
export function createVoiceDetector(stream: MediaStream, onSpeaking: (speaking: boolean) => void): () => void {
  const ctx = new AudioContext();
  const analyser = ctx.createAnalyser();
  analyser.fftSize = 512;
  analyser.smoothingTimeConstant = 0.4;
  const source = ctx.createMediaStreamSource(stream);
  source.connect(analyser);
  const data = new Uint8Array(analyser.frequencyBinCount);
  let raf: number;
  const check = () => {
    analyser.getByteFrequencyData(data);
    const avg = data.reduce((a, b) => a + b, 0) / data.length;
    onSpeaking(avg > 25);
    raf = requestAnimationFrame(check);
  };
  check();
  return () => { cancelAnimationFrame(raf); source.disconnect(); ctx.close(); };
}
