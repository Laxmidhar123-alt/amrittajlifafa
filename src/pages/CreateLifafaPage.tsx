import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Gift, Gamepad2, Coins, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { toast } from '@/hooks/use-toast';
import BottomNav from '@/components/BottomNav';

type GameType = 'none' | 'dice' | 'toss' | 'scratch';

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
  });

  const gameOptions: { type: GameType; label: string; icon: React.ReactNode; color: string }[] = [
    { type: 'none', label: 'None', icon: <Gift className="w-5 h-5" />, color: 'bg-muted-foreground' },
    { type: 'dice', label: 'Dice', icon: <Gamepad2 className="w-5 h-5" />, color: 'bg-blue-500' },
    { type: 'toss', label: 'Coin Toss', icon: <Coins className="w-5 h-5" />, color: 'bg-yellow-500' },
    { type: 'scratch', label: 'Scratch Card', icon: <Sparkles className="w-5 h-5" />, color: 'bg-purple-500' },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCreate = async () => {
    const { title, perUserAmount, totalUsers, channelName, redirectLink } = formData;
    
    if (!title || !perUserAmount || !totalUsers || !channelName || !redirectLink) {
      toast({ title: 'Please fill all fields', variant: 'destructive' });
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
              <Button onClick={() => { setGeneratedCode(''); setFormData({ title: '', perUserAmount: '', totalUsers: '', channelName: '', redirectLink: '', gameType: 'dice' }); }} className="flex-1 hero-gradient">
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
            {/* Form Fields */}
            <div className="bg-card rounded-2xl p-4 shadow-card space-y-4">
              <div>
                <Label htmlFor="title">Lifafa Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., New Year Bonus"
                  value={formData.title}
                  onChange={e => handleInputChange('title', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="perUserAmount">Per User Amount (₹)</Label>
                  <Input
                    id="perUserAmount"
                    type="number"
                    placeholder="10"
                    value={formData.perUserAmount}
                    onChange={e => handleInputChange('perUserAmount', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="totalUsers">Total Users</Label>
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
                <Label htmlFor="channelName">Channel Name</Label>
                <Input
                  id="channelName"
                  placeholder="@yourchannel"
                  value={formData.channelName}
                  onChange={e => handleInputChange('channelName', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="redirectLink">Redirect Link</Label>
                <Input
                  id="redirectLink"
                  placeholder="https://t.me/yourchannel"
                  value={formData.redirectLink}
                  onChange={e => handleInputChange('redirectLink', e.target.value)}
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
