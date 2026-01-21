import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Send, Check, Plus, Link as LinkIcon, Users, IndianRupee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { toast } from '@/hooks/use-toast';
import BottomNav from '@/components/BottomNav';

export default function AddTaskPage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [created, setCreated] = useState(false);

  const [formData, setFormData] = useState({
    channelName: '',
    channelLink: '',
    rewardAmount: '',
    totalJoins: '',
    description: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCreate = async () => {
    const { channelName, channelLink, rewardAmount, totalJoins } = formData;

    if (!channelName.trim()) {
      toast({ title: 'Please enter channel name', variant: 'destructive' });
      return;
    }
    if (!channelLink.trim()) {
      toast({ title: 'Please enter channel link', variant: 'destructive' });
      return;
    }
    if (!rewardAmount || parseInt(rewardAmount) < 1) {
      toast({ title: 'Please enter reward amount', variant: 'destructive' });
      return;
    }
    if (!totalJoins || parseInt(totalJoins) < 1) {
      toast({ title: 'Please enter total joins required', variant: 'destructive' });
      return;
    }

    const totalCost = parseInt(rewardAmount) * parseInt(totalJoins);
    if (user && totalCost > user.balance) {
      toast({ title: 'Insufficient balance', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    setCreated(true);
    toast({ title: 'Task channel added successfully! 🎉' });
  };

  const handleReset = () => {
    setCreated(false);
    setFormData({
      channelName: '',
      channelLink: '',
      rewardAmount: '',
      totalJoins: '',
      description: '',
    });
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
          <h1 className="text-xl font-bold">Add Task Channel</h1>
        </div>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-500 to-cyan-400 rounded-2xl p-6 mb-6 text-center"
        >
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3"
          >
            <Send className="w-8 h-8 text-white" />
          </motion.div>
          <h2 className="text-white font-bold text-lg">Add Telegram Channel</h2>
          <p className="text-white/80 text-sm">Get users to join your channel</p>
        </motion.div>

        {created ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-2xl p-6 shadow-card text-center"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <Check className="w-8 h-8 text-secondary-foreground" />
            </motion.div>
            
            <h3 className="text-xl font-bold mb-2">Channel Added!</h3>
            <p className="text-muted-foreground mb-6">
              Your task channel is now live and users can start joining
            </p>
            
            <div className="flex gap-3">
              <Button onClick={handleReset} variant="outline" className="flex-1">
                Add Another
              </Button>
              <Button onClick={() => navigate('/')} className="flex-1 hero-gradient">
                Go Home
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
            <div className="bg-card rounded-2xl p-5 shadow-card space-y-5">
              <div>
                <Label htmlFor="channelName" className="flex items-center gap-2 mb-2">
                  <Send className="w-4 h-4 text-primary" />
                  Channel Name
                </Label>
                <Input
                  id="channelName"
                  placeholder="e.g., My Telegram Channel"
                  value={formData.channelName}
                  onChange={e => handleInputChange('channelName', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="channelLink" className="flex items-center gap-2 mb-2">
                  <LinkIcon className="w-4 h-4 text-primary" />
                  Channel Link
                </Label>
                <Input
                  id="channelLink"
                  placeholder="https://t.me/yourchannel"
                  value={formData.channelLink}
                  onChange={e => handleInputChange('channelLink', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="rewardAmount" className="flex items-center gap-2 mb-2">
                    <IndianRupee className="w-4 h-4 text-primary" />
                    Reward per Join (₹)
                  </Label>
                  <Input
                    id="rewardAmount"
                    type="number"
                    placeholder="10"
                    value={formData.rewardAmount}
                    onChange={e => handleInputChange('rewardAmount', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="totalJoins" className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-primary" />
                    Total Joins
                  </Label>
                  <Input
                    id="totalJoins"
                    type="number"
                    placeholder="100"
                    value={formData.totalJoins}
                    onChange={e => handleInputChange('totalJoins', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description" className="mb-2 block">Description (Optional)</Label>
                <Input
                  id="description"
                  placeholder="Brief description about your channel"
                  value={formData.description}
                  onChange={e => handleInputChange('description', e.target.value)}
                />
              </div>
            </div>

            {/* Total Cost */}
            {formData.rewardAmount && formData.totalJoins && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-muted rounded-xl p-4 text-center"
              >
                <p className="text-sm text-muted-foreground">Total Cost</p>
                <p className="text-2xl font-bold text-primary">
                  ₹{parseInt(formData.rewardAmount) * parseInt(formData.totalJoins)}
                </p>
              </motion.div>
            )}

            {/* Info Card */}
            <div className="bg-muted rounded-xl p-4">
              <h4 className="font-semibold mb-2 text-sm">How it works:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Users will see your channel in the task list</li>
                <li>• They join your channel to earn rewards</li>
                <li>• Amount is deducted from your balance</li>
              </ul>
            </div>

            {/* Create Button */}
            <Button
              onClick={handleCreate}
              disabled={isLoading}
              className="w-full h-14 bg-gradient-to-r from-blue-500 to-cyan-400 hover:opacity-90 text-lg font-semibold"
            >
              {isLoading ? (
                <span>Adding Channel...</span>
              ) : (
                <div className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  <span>Add Channel</span>
                </div>
              )}
            </Button>
          </motion.div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
