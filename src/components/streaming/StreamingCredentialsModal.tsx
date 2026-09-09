import { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  KeyRound,
  Eye,
  EyeOff,
  Copy,
  Check,
  ExternalLink,
  Trash2,
  Plus,
  ShieldCheck,
  Info,
  Tv,
} from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/hooks/use-auth';
import { useRoomStore } from '@/stores/room-store';
import { useSignalR } from '@/hooks/use-signalr';
import { StreamingCredential } from '@/types';
import toast from 'react-hot-toast';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  roomId: string;
}

interface ServicePreset {
  name: string;
  url: string;
  badgeBg: string;
  badgeBorder: string;
  badgeColor: string;
  iconText: string;
}

const SERVICE_PRESETS: Record<string, ServicePreset> = {
  Netflix: {
    name: 'Netflix',
    url: 'https://www.netflix.com',
    badgeBg: 'bg-red-500/10',
    badgeBorder: 'border-red-500/30',
    badgeColor: 'text-red-400',
    iconText: 'N',
  },
  'Disney+': {
    name: 'Disney+',
    url: 'https://www.disneyplus.com',
    badgeBg: 'bg-blue-500/10',
    badgeBorder: 'border-blue-500/30',
    badgeColor: 'text-blue-400',
    iconText: 'D+',
  },
  'Prime Video': {
    name: 'Prime Video',
    url: 'https://www.primevideo.com',
    badgeBg: 'bg-cyan-500/10',
    badgeBorder: 'border-cyan-500/30',
    badgeColor: 'text-cyan-400',
    iconText: 'PV',
  },
  'HBO Max': {
    name: 'HBO Max',
    url: 'https://www.max.com',
    badgeBg: 'bg-purple-500/10',
    badgeBorder: 'border-purple-500/30',
    badgeColor: 'text-purple-400',
    iconText: 'MAX',
  },
  Crunchyroll: {
    name: 'Crunchyroll',
    url: 'https://www.crunchyroll.com',
    badgeBg: 'bg-amber-500/10',
    badgeBorder: 'border-amber-500/30',
    badgeColor: 'text-amber-400',
    iconText: 'CR',
  },
  Hulu: {
    name: 'Hulu',
    url: 'https://www.hulu.com',
    badgeBg: 'bg-emerald-500/10',
    badgeBorder: 'border-emerald-500/30',
    badgeColor: 'text-emerald-400',
    iconText: 'H',
  },
  'Apple TV+': {
    name: 'Apple TV+',
    url: 'https://tv.apple.com',
    badgeBg: 'bg-zinc-500/10',
    badgeBorder: 'border-zinc-500/30',
    badgeColor: 'text-zinc-300',
    iconText: 'tv',
  },
  Other: {
    name: 'Other Service',
    url: '',
    badgeBg: 'bg-indigo-500/10',
    badgeBorder: 'border-indigo-500/30',
    badgeColor: 'text-indigo-400',
    iconText: 'LIVE',
  },
};

export default function StreamingCredentialsModal({ isOpen, onClose, roomId }: Props) {
  const { user } = useAuth();
  const { members } = useRoomStore();
  const signalr = useSignalR(roomId);

  const [credentials, setCredentials] = useState<StreamingCredential[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'vault' | 'add'>('vault');

  // Form states
  const [selectedPreset, setSelectedPreset] = useState('Netflix');
  const [serviceName, setServiceName] = useState('Netflix');
  const [directUrl, setDirectUrl] = useState('https://www.netflix.com');
  const [accountIdentifier, setAccountIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [profileName, setProfileName] = useState('');
  const [profilePin, setProfilePin] = useState('');
  const [instructions, setInstructions] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Visibility states for passwords
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const currentMember = members.find((m) => m.userId === user?.id);
  const isHostOrMod = currentMember?.role === 'Host' || currentMember?.role === 'Mod' || currentMember?.role === 'Moderator';

  // Load credentials
  const loadCredentials = useCallback(async () => {
    if (!roomId) return;
    try {
      setLoading(true);
      const data = await api.rooms.getCredentials(roomId);
      setCredentials(data);
    } catch (err: any) {
      console.error('Failed to load credentials:', err);
    } finally {
      setLoading(false);
    }
  }, [roomId]);

  useEffect(() => {
    if (isOpen && roomId) {
      loadCredentials();
    }
  }, [isOpen, roomId, loadCredentials]);

  // Real-time updates via SignalR
  useEffect(() => {
    if (!roomId) return;

    const onAdded = (newCred: StreamingCredential) => {
      setCredentials((prev) => {
        if (prev.some((c) => c.id === newCred.id)) return prev;
        return [newCred, ...prev];
      });
      toast.success(`New streaming account shared: ${newCred.serviceName}`);
    };

    const onRemoved = (removedId: string) => {
      setCredentials((prev) => prev.filter((c) => c.id !== removedId));
    };

    signalr.on('StreamingCredentialAdded', onAdded);
    signalr.on('StreamingCredentialRemoved', onRemoved);

    return () => {
      signalr.off('StreamingCredentialAdded', onAdded);
      signalr.off('StreamingCredentialRemoved', onRemoved);
    };
  }, [roomId, signalr]);

  const handleSelectPreset = (presetKey: string) => {
    setSelectedPreset(presetKey);
    const preset = SERVICE_PRESETS[presetKey];
    if (preset) {
      setServiceName(presetKey === 'Other' ? '' : preset.name);
      setDirectUrl(preset.url);
    }
  };

  const handleCopy = (text: string, key: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    toast.success(`${label} copied to clipboard!`);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const togglePasswordVisibility = (id: string) => {
    setVisiblePasswords((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceName.trim() || !accountIdentifier.trim() || !password.trim()) {
      toast.error('Please fill in Service Name, Email/Username, and Password');
      return;
    }

    setIsSubmitting(true);
    try {
      const added = await api.rooms.addCredential(roomId, {
        serviceName: serviceName.trim(),
        accountIdentifier: accountIdentifier.trim(),
        password: password.trim(),
        profileName: profileName.trim() || null,
        profilePin: profilePin.trim() || null,
        instructions: instructions.trim() || null,
        directUrl: directUrl.trim() || null,
      });

      setCredentials((prev) => [added, ...prev.filter((c) => c.id !== added.id)]);
      toast.success('Streaming account shared with the room!');
      // Reset form
      setAccountIdentifier('');
      setPassword('');
      setProfileName('');
      setProfilePin('');
      setInstructions('');
      setActiveTab('vault');
    } catch (err: any) {
      toast.error(err.message || 'Failed to share account');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (credentialId: string, name: string) => {
    if (!confirm(`Remove shared credentials for ${name}?`)) return;
    try {
      await api.rooms.deleteCredential(roomId, credentialId);
      setCredentials((prev) => prev.filter((c) => c.id !== credentialId));
      toast.success('Credential removed');
    } catch (err: any) {
      toast.error(err.message || 'Failed to remove credential');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] flex flex-col bg-[#12131a]/95 border-white/10 text-white backdrop-blur-xl p-0 overflow-hidden shadow-2xl">
        <DialogHeader className="p-6 pb-4 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary shadow-inner">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold flex items-center gap-2">
                  Streaming Credentials Vault
                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30 font-medium">
                    {credentials.length} {credentials.length === 1 ? 'account' : 'accounts'}
                  </span>
                </DialogTitle>
                <p className="text-xs text-slate-400 mt-0.5">
                  Securely share and access streaming accounts inside this room
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-2 mt-4 pt-2">
            <button
              onClick={() => setActiveTab('vault')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
                activeTab === 'vault'
                  ? 'bg-white/10 text-white shadow-sm border border-white/10'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Tv className="w-3.5 h-3.5" />
              Shared Accounts ({credentials.length})
            </button>
            <button
              onClick={() => setActiveTab('add')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
                activeTab === 'add'
                  ? 'bg-primary text-white shadow-sm shadow-primary/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              Share An Account
            </button>
          </div>
        </DialogHeader>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {activeTab === 'vault' && (
            <>
              {loading ? (
                <div className="py-16 text-center text-slate-400">
                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                  <p className="text-sm">Loading streaming accounts...</p>
                </div>
              ) : credentials.length === 0 ? (
                <div className="py-12 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 mx-auto mb-4">
                    <KeyRound className="w-7 h-7 opacity-60" />
                  </div>
                  <h3 className="text-base font-semibold text-slate-200 mb-1">
                    No Streaming Accounts Shared Yet
                  </h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto mb-5">
                    Share a Netflix, Disney+, Prime Video or other subscription so your friends can log in and watch in sync!
                  </p>
                  <Button
                    onClick={() => setActiveTab('add')}
                    size="sm"
                    className="bg-primary hover:bg-primary/90 text-white"
                  >
                    <Plus className="w-4 h-4 mr-1.5" /> Share First Account
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {credentials.map((cred) => {
                    const preset = SERVICE_PRESETS[cred.serviceName] || SERVICE_PRESETS.Other;
                    const isVisible = !!visiblePasswords[cred.id];
                    const canDelete = cred.sharedByUserId === user?.id || isHostOrMod;

                    return (
                      <div
                        key={cred.id}
                        className="rounded-xl border border-white/10 bg-white/[0.03] p-4 transition-all hover:border-white/20 hover:bg-white/[0.05] relative group"
                      >
                        {/* Header */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm border ${preset.badgeBg} ${preset.badgeBorder} ${preset.badgeColor}`}
                            >
                              {preset.iconText}
                            </div>
                            <div>
                              <h4 className="font-semibold text-white text-sm flex items-center gap-2">
                                {cred.serviceName}
                              </h4>
                              <p className="text-[11px] text-slate-400">
                                Shared by <span className="text-slate-300 font-medium">{cred.sharedByUsername}</span>
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5">
                            {cred.directUrl && (
                              <a
                                href={cred.directUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                                title="Open service website"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            )}
                            {canDelete && (
                              <button
                                onClick={() => handleDelete(cred.id, cred.serviceName)}
                                className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                                title="Delete credential"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Fields */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          {/* Account/Email */}
                          <div className="bg-black/40 rounded-lg p-2.5 border border-white/5 flex items-center justify-between">
                            <div className="truncate mr-2">
                              <span className="block text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                                Username / Email
                              </span>
                              <span className="font-mono text-slate-200 select-all">
                                {cred.accountIdentifier}
                              </span>
                            </div>
                            <button
                              onClick={() => handleCopy(cred.accountIdentifier, `${cred.id}-user`, 'Username')}
                              className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                              title="Copy username"
                            >
                              {copiedKey === `${cred.id}-user` ? (
                                <Check className="w-3.5 h-3.5 text-green-400" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>

                          {/* Password */}
                          <div className="bg-black/40 rounded-lg p-2.5 border border-white/5 flex items-center justify-between">
                            <div className="truncate mr-2">
                              <span className="block text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                                Password
                              </span>
                              <span className="font-mono text-slate-200 select-all">
                                {isVisible ? cred.password : '••••••••••••'}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => togglePasswordVisibility(cred.id)}
                                className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                                title={isVisible ? 'Hide password' : 'Show password'}
                              >
                                {isVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                              </button>
                              <button
                                onClick={() => handleCopy(cred.password, `${cred.id}-pass`, 'Password')}
                                className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                                title="Copy password"
                              >
                                {copiedKey === `${cred.id}-pass` ? (
                                  <Check className="w-3.5 h-3.5 text-green-400" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Extra details (PIN, Profile, Instructions) */}
                        {(cred.profileName || cred.profilePin || cred.instructions) && (
                          <div className="mt-2.5 pt-2 border-t border-white/5 text-[11px] space-y-1 text-slate-300">
                            <div className="flex flex-wrap items-center gap-3">
                              {cred.profileName && (
                                <div>
                                  <span className="text-slate-500 font-medium">Profile: </span>
                                  <span className="font-semibold text-primary/90">{cred.profileName}</span>
                                </div>
                              )}
                              {cred.profilePin && (
                                <div>
                                  <span className="text-slate-500 font-medium">PIN: </span>
                                  <span className="font-mono font-bold bg-white/10 px-1.5 py-0.5 rounded text-white">
                                    {cred.profilePin}
                                  </span>
                                </div>
                              )}
                            </div>
                            {cred.instructions && (
                              <p className="text-slate-400 italic bg-white/[0.02] p-2 rounded border border-white/5">
                                "{cred.instructions}"
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* DRM & Security Tip */}
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3.5 text-xs text-amber-200/90 flex gap-3">
                <Info className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-amber-300 block mb-0.5">DRM & Screen Share Note</strong>
                  If Netflix or Disney+ shows a black screen during screen sharing, members can log in using these shared credentials directly on their own browser, or turn off "Hardware Acceleration" in browser settings.
                </div>
              </div>
            </>
          )}

          {activeTab === 'add' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Preset buttons */}
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-2">
                  Select Streaming Service
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {Object.keys(SERVICE_PRESETS).map((key) => {
                    const isSelected = selectedPreset === key;
                    const preset = SERVICE_PRESETS[key];
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => handleSelectPreset(key)}
                        className={`p-2 rounded-xl text-xs font-semibold border transition-all text-center flex flex-col items-center justify-center gap-1 ${
                          isSelected
                            ? `${preset.badgeBg} ${preset.badgeBorder} ${preset.badgeColor} ring-2 ring-primary/40`
                            : 'bg-white/[0.02] border-white/10 text-slate-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <span className="font-bold text-xs">{preset.iconText}</span>
                        <span className="truncate w-full text-[11px]">{preset.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {selectedPreset === 'Other' && (
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Service Name
                  </label>
                  <Input
                    value={serviceName}
                    onChange={(e) => setServiceName(e.target.value)}
                    placeholder="e.g. Paramount+, Peacock, AnimeFlix"
                    className="bg-black/30 border-white/10 text-white text-sm"
                    required
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Account Email / Username *
                  </label>
                  <Input
                    value={accountIdentifier}
                    onChange={(e) => setAccountIdentifier(e.target.value)}
                    placeholder="name@example.com"
                    className="bg-black/30 border-white/10 text-white text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Password *
                  </label>
                  <Input
                    type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Account password"
                    className="bg-black/30 border-white/10 text-white text-sm font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Assigned Profile Name (optional)
                  </label>
                  <Input
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    placeholder="e.g. Profile 3 or Guest"
                    className="bg-black/30 border-white/10 text-white text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Profile PIN (optional)
                  </label>
                  <Input
                    value={profilePin}
                    onChange={(e) => setProfilePin(e.target.value)}
                    placeholder="e.g. 1234"
                    maxLength={10}
                    className="bg-black/30 border-white/10 text-white text-sm font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  Service Website Link (optional)
                </label>
                <Input
                  value={directUrl}
                  onChange={(e) => setDirectUrl(e.target.value)}
                  placeholder="https://..."
                  className="bg-black/30 border-white/10 text-white text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  Instructions / Rules (optional)
                </label>
                <textarea
                  value={instructions}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInstructions(e.target.value)}
                  placeholder="e.g. Please do not change account password or settings. Use the guest profile."
                  className="w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-white text-xs resize-none h-16 shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                />
              </div>

              <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-3 text-xs text-blue-200/90 flex gap-2.5 items-center">
                <ShieldCheck className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span>
                  Credentials are only visible to active members inside this room. You can delete them at any time.
                </span>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActiveTab('vault')}
                  className="flex-1 border-white/10 hover:bg-white/5"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || !serviceName.trim() || !accountIdentifier.trim() || !password.trim()}
                  className="flex-1 bg-primary hover:bg-primary/90 text-white"
                >
                  {isSubmitting ? 'Sharing...' : 'Share with Room'}
                </Button>
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
