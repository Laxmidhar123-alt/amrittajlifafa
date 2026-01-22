import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Gift, Gamepad2, Coins, Sparkles, Plus, X, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { toast } from '@/hooks/use-toast';
import BottomNav from '@/components/BottomNav';

type GameType = 'none' | 'dice' | 'toss' | 'scratch';

interface VerifyChannel {
  id: string;
  link: string;
  channelId: string;
}

export default function CreateLifafaPage() {
  const navigate = useNavigate();
  const { user, addTransaction } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    perUserAmount: '',
    totalUsers: '',
    channelName: '',
    redirectLink: '',
    gameType: 'none' as GameType,
    giveawayCode: '',
    referEarnAmount: '',
  });

  const [verifyChannels, setVerifyChannels] = useState<VerifyChannel[]>([]);
  const [newChannel, setNewChannel] = useState({ link: '', channelId: '' });

  const gameOptions: { type: GameType; label: string; icon: React.ReactNode; color: string }[] = [
    { type: 'none', label: 'None', icon: <Gift className="w-5 h-5" />, color: 'bg-muted-foreground' },
    { type: 'dice', label: 'Dice', icon: <Gamepad2 className="w-5 h-5" />, color: 'bg-blue-500' },
    { type: 'toss', label: 'Coin Toss', icon: <Coins className="w-5 h-5" />, color: 'bg-yellow-500' },
    { type: 'scratch', label: 'Scratch Card', icon: <Sparkles className="w-5 h-5" />, color: 'bg-purple-500' },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addVerifyChannel = () => {
    if (!newChannel.link || !newChannel.channelId) {
      toast({ title: 'Please fill both channel link and ID', variant: 'destructive' });
      return;
    }
    
    setVerifyChannels(prev => [...prev, { 
      id: Math.random().toString(36).substr(2, 9),
      link: newChannel.link,
      channelId: newChannel.channelId
    }]);
    setNewChannel({ link: '', channelId: '' });
    toast({ title: 'Channel added successfully!' });
  };

  const removeVerifyChannel = (id: string) => {
    setVerifyChannels(prev => prev.filter(channel => channel.id !== id));
  };

  const handleCreate = async () => {
    const { title, perUserAmount, totalUsers, channelName } = formData;
    
    if (!title || !perUserAmount || !totalUsers || !channelName) {
      toast({ title: 'Please fill all required fields', variant: 'destructive' });
      return;
    }

    const amount = parseInt(perUserAmount);
    const users = parseInt(totalUsers);
    const totalAmount = amount * users;

    if (user && totalAmount > user.balance) {
      toast({ title: 'Insufficient balance', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    const code = 'LF' + Math.random().toString(36).substr(2, 6).toUpperCase();
    setGeneratedCode(code);

    addTransaction({
      type: 'lifafa',
      amount: -totalAmount,
      status: 'completed',
      description: `Created Lifafa: ${title}`,
    });

    setIsLoading(false);
    toast({ title: 'Lifafa Created Successfully! 🎉' });
  };

  const copyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    toast({ title: 'Code copied!' });
  };

  const resetForm = () => {
    setGeneratedCode('');
    setFormData({ 
      title: '', 
      perUserAmount: '', 
      totalUsers: '', 
      channelName: '', 
      redirectLink: '', 
      gameType: 'none',
      giveawayCode: '',
      referEarnAmount: '',
    });
    setVerifyChannels([]);
  };

  if (!user) {
    navigate('/auth');
    return null;
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-lg mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-3 py-4">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full bg-card">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold">Create Lifafa</h1>
        </div>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lifafa-gradient rounded-2xl p-6 mb-6 text-center"
        >
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <Gift className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-white font-bold text-lg">Create Your Lifafa</h2>
          <p className="text-white/80 text-sm">Share rewards with your channel members</p>
        </motion.div>

        {generatedCode ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-2xl p-6 shadow-card text-center"
          >
            <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Lifafa Created!</h3>
            <p className="text-muted-foreground mb-4">Share this code with your channel</p>
            
            <div className="bg-muted rounded-xl p-4 mb-4">
              <p className="text-2xl font-bold text-primary">{generatedCode}</p>
            </div>
            
            <div className="flex gap-3">
              <Button onClick={copyCode} variant="outline" className="flex-1">
                Copy Code
              </Button>
              <Button onClick={resetForm} className="flex-1 hero-gradient">
                Create Another
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            {/* Basic Form Fields */}
            <div className="bg-card rounded-2xl p-4 shadow-card space-y-4">
              <div>
                <Label htmlFor="title">Lifafa Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., New Year Bonus"
                  value={formData.title}
                  onChange={e => handleInputChange('title', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="perUserAmount">Per User Amount (₹) *</Label>
                  <Input
                    id="perUserAmount"
                    type="number"
                    placeholder="10"
                    value={formData.perUserAmount}
                    onChange={e => handleInputChange('perUserAmount', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="totalUsers">Total Users *</Label>
                  <Input
                    id="totalUsers"
                    type="number"
                    placeholder="100"
                    value={formData.totalUsers}
                    onChange={e => handleInputChange('totalUsers', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="channelName">Channel Name *</Label>
                <Input
                  id="channelName"
                  placeholder="@yourchannel"
                  value={formData.channelName}
                  onChange={e => handleInputChange('channelName', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="redirectLink">Redirect Link (Optional)</Label>
                <Input
                  id="redirectLink"
                  placeholder="https://t.me/yourchannel"
                  value={formData.redirectLink}
                  onChange={e => handleInputChange('redirectLink', e.target.value)}
                />
              </div>
            </div>

            {/* Channel Verify Section */}
            <div className="bg-card rounded-2xl p-4 shadow-card space-y-4">
              <Label className="text-base font-semibold">Telegram Channel Verify</Label>
              
              {/* Warning Card */}
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 flex gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-sm text-amber-600 dark:text-amber-400">
                  Add <span className="font-bold">@myverifyBot</span> to your channel before adding your channel to Lifafa channel verify
                </p>
              </div>

              {/* Added Channels */}
              {verifyChannels.length > 0 && (
                <div className="space-y-2">
                  {verifyChannels.map(channel => (
                    <div key={channel.id} className="bg-muted rounded-lg p-3 flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{channel.channelId}</p>
                        <p className="text-xs text-muted-foreground truncate">{channel.link}</p>
                      </div>
                      <button 
                        onClick={() => removeVerifyChannel(channel.id)}
                        className="p-1.5 rounded-full bg-destructive/10 text-destructive hover:bg-destructive/20"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add New Channel */}
              <div className="space-y-3">
                <Input
                  placeholder="Channel/Group Link (e.g., https://t.me/channel)"
                  value={newChannel.link}
                  onChange={e => setNewChannel(prev => ({ ...prev, link: e.target.value }))}
                />
                <Input
                  placeholder="Channel ID (e.g., @mychannel)"
                  value={newChannel.channelId}
                  onChange={e => setNewChannel(prev => ({ ...prev, channelId: e.target.value }))}
                />
                <Button 
                  onClick={addVerifyChannel}
                  variant="outline" 
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Channel
                </Button>
              </div>
            </div>

            {/* Optional Fields */}
            <div className="bg-card rounded-2xl p-4 shadow-card space-y-4">
              <Label className="text-base font-semibold">Optional Settings</Label>
              
              <div>
                <Label htmlFor="giveawayCode">Giveaway Code (Optional)</Label>
                <Input
                  id="giveawayCode"
                  placeholder="e.g., NEWYEAR2024"
                  value={formData.giveawayCode}
                  onChange={e => handleInputChange('giveawayCode', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="referEarnAmount">Refer & Earn Amount ₹ (Optional)</Label>
                <Input
                  id="referEarnAmount"
                  type="number"
                  placeholder="e.g., 5"
                  value={formData.referEarnAmount}
                  onChange={e => handleInputChange('referEarnAmount', e.target.value)}
                />
              </div>
            </div>

            {/* Game Selection */}
            <div className="bg-card rounded-2xl p-4 shadow-card">
              <Label className="mb-3 block">Select Game Type</Label>
              <div className="grid grid-cols-4 gap-2">
                {gameOptions.map(game => (
                  <motion.button
                    key={game.type}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleInputChange('gameType', game.type)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      formData.gameType === game.type
                        ? 'border-primary bg-primary/10'
                        : 'border-border bg-muted'
                    }`}
                  >
                    <div className={`w-10 h-10 ${game.color} rounded-full flex items-center justify-center mx-auto mb-2 text-white`}>
                      {game.icon}
                    </div>
                    <p className="text-sm font-medium">{game.label}</p>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Total Cost */}
            {formData.perUserAmount && formData.totalUsers && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-muted rounded-xl p-4 text-center"
              >
                <p className="text-sm text-muted-foreground">Total Cost</p>
                <p className="text-2xl font-bold text-primary">
                  ₹{parseInt(formData.perUserAmount) * parseInt(formData.totalUsers)}
                </p>
              </motion.div>
            )}

            {/* Create Button */}
            <Button
              onClick={handleCreate}
              disabled={isLoading}
              className="w-full h-12 lifafa-gradient hover:opacity-90 text-lg font-semibold"
            >
              {isLoading ? (
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                  <Sparkles className="w-5 h-5" />
                </motion.div>
              ) : (
                'Create Lifafa'
              )}
            </Button>
          </motion.div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
