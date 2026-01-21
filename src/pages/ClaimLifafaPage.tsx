import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Gift, Sparkles, Check, Phone, Hash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { toast } from '@/hooks/use-toast';
import BottomNav from '@/components/BottomNav';

export default function ClaimLifafaPage() {
  const navigate = useNavigate();
  const { user, addTransaction } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const [reward, setReward] = useState(0);
  
  const [formData, setFormData] = useState({
    mobileNumber: '',
    lifafaCode: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleClaim = async () => {
    const { mobileNumber, lifafaCode } = formData;
    
    if (!mobileNumber || mobileNumber.length !== 10) {
      toast({ title: 'Please enter a valid 10-digit mobile number', variant: 'destructive' });
      return;
    }

    if (!lifafaCode.trim()) {
      toast({ title: 'Please enter the Lifafa code', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate random reward between 10-100
    const randomReward = Math.floor(Math.random() * 91) + 10;
    setReward(randomReward);

    addTransaction({
      type: 'lifafa',
      amount: randomReward,
      status: 'completed',
      description: `Claimed Channel Lifafa: ${lifafaCode}`,
    });

    setIsLoading(false);
    setClaimed(true);
  };

  const handleReset = () => {
    setClaimed(false);
    setReward(0);
    setFormData({ mobileNumber: '', lifafaCode: '' });
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
          <h1 className="text-xl font-bold">Claim Channel Lifafa</h1>
        </div>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lifafa-gradient rounded-2xl p-6 mb-6 text-center relative overflow-hidden"
        >
          <motion.div
            animate={claimed ? { scale: [1, 1.3, 1], rotate: [0, 15, -15, 0] } : { y: [0, -5, 0] }}
            transition={{ repeat: claimed ? 0 : Infinity, duration: 2 }}
            className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3"
          >
            {claimed ? (
              <Sparkles className="w-10 h-10 text-white" />
            ) : (
              <Gift className="w-10 h-10 text-white" />
            )}
          </motion.div>
          <h2 className="text-white font-bold text-lg">
            {claimed ? '🎉 Congratulations!' : 'Claim Your Reward'}
          </h2>
          <p className="text-white/80 text-sm">
            {claimed ? 'You have successfully claimed the Lifafa!' : 'Enter your details to claim the channel Lifafa'}
          </p>
        </motion.div>

        {claimed ? (
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
              <Check className="w-8 h-8 text-white" />
            </motion.div>
            
            <h3 className="text-lg font-bold mb-2">Reward Claimed!</h3>
            <p className="text-muted-foreground mb-4">You've received</p>
            
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="text-5xl font-bold text-primary mb-6"
            >
              ₹{reward}
            </motion.div>
            
            <p className="text-sm text-muted-foreground mb-6">
              The amount has been added to your wallet
            </p>
            
            <div className="flex gap-3">
              <Button onClick={handleReset} variant="outline" className="flex-1">
                Claim Another
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
                <Label htmlFor="mobile" className="flex items-center gap-2 mb-2">
                  <Phone className="w-4 h-4 text-primary" />
                  Mobile Number
                </Label>
                <Input
                  id="mobile"
                  type="tel"
                  maxLength={10}
                  placeholder="Enter 10-digit mobile number"
                  value={formData.mobileNumber}
                  onChange={e => handleInputChange('mobileNumber', e.target.value.replace(/\D/g, ''))}
                  className="text-lg"
                />
              </div>

              <div>
                <Label htmlFor="code" className="flex items-center gap-2 mb-2">
                  <Hash className="w-4 h-4 text-primary" />
                  Lifafa Code
                </Label>
                <Input
                  id="code"
                  placeholder="Enter Lifafa code (e.g., LF123ABC)"
                  value={formData.lifafaCode}
                  onChange={e => handleInputChange('lifafaCode', e.target.value.toUpperCase())}
                  className="text-lg font-semibold uppercase"
                />
              </div>
            </div>

            {/* Info Card */}
            <div className="bg-muted rounded-xl p-4">
              <h4 className="font-semibold mb-2 text-sm">How it works:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Enter your registered mobile number</li>
                <li>• Enter the Lifafa code shared by the channel</li>
                <li>• Play the game and win instant rewards!</li>
              </ul>
            </div>

            {/* Claim Button */}
            <Button
              onClick={handleClaim}
              disabled={isLoading}
              className="w-full h-14 lifafa-gradient hover:opacity-90 text-lg font-semibold"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                    <Sparkles className="w-5 h-5" />
                  </motion.div>
                  <span>Claiming...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Gift className="w-5 h-5" />
                  <span>Claim Lifafa</span>
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
