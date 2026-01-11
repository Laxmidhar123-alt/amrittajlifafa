import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Sparkles, X, Check, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUser } from '@/contexts/UserContext';
import { toast } from '@/hooks/use-toast';

interface ClaimLifafaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ClaimLifafaModal({ isOpen, onClose }: ClaimLifafaModalProps) {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const [reward, setReward] = useState(0);
  const { addTransaction } = useUser();

  const handleClaim = async () => {
    if (!code.trim()) {
      toast({ title: 'Please enter a code', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Random reward between 10-100
    const randomReward = Math.floor(Math.random() * 91) + 10;
    setReward(randomReward);
    
    addTransaction({
      type: 'lifafa',
      amount: randomReward,
      status: 'completed',
      description: `Claimed Lifafa: ${code}`,
    });

    setIsLoading(false);
    setClaimed(true);
  };

  const handleClose = () => {
    setCode('');
    setClaimed(false);
    setReward(0);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 50 }}
            onClick={e => e.stopPropagation()}
            className="bg-card rounded-2xl p-6 w-full max-w-sm shadow-elevated relative overflow-hidden"
          >
            {/* Header decoration */}
            <div className="absolute top-0 left-0 right-0 h-24 lifafa-gradient" />
            
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 bg-white/20 rounded-full z-10"
            >
              <X className="w-4 h-4 text-white" />
            </button>

            <div className="relative pt-8">
              <motion.div
                animate={claimed ? { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] } : {}}
                className="w-20 h-20 mx-auto mb-4 lifafa-gradient rounded-full flex items-center justify-center shadow-elevated"
              >
                {claimed ? (
                  <Sparkles className="w-10 h-10 text-white" />
                ) : (
                  <Gift className="w-10 h-10 text-white" />
                )}
              </motion.div>

              {!claimed ? (
                <>
                  <h2 className="text-xl font-bold text-center mb-2">Claim Lifafa</h2>
                  <p className="text-sm text-muted-foreground text-center mb-6">
                    Enter the Lifafa code to claim your reward
                  </p>

                  <Input
                    placeholder="Enter Lifafa Code"
                    value={code}
                    onChange={e => setCode(e.target.value.toUpperCase())}
                    className="text-center text-lg font-semibold uppercase mb-4"
                  />

                  <Button
                    onClick={handleClaim}
                    disabled={isLoading}
                    className="w-full lifafa-gradient hover:opacity-90"
                  >
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1 }}
                      >
                        <Sparkles className="w-5 h-5" />
                      </motion.div>
                    ) : (
                      'Claim Reward'
                    )}
                  </Button>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center"
                >
                  <h2 className="text-xl font-bold mb-2 text-secondary">
                    🎉 Congratulations!
                  </h2>
                  <p className="text-muted-foreground mb-4">You've received</p>
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="text-4xl font-bold text-primary mb-6"
                  >
                    ₹{reward}
                  </motion.div>
                  <Button onClick={handleClose} className="w-full hero-gradient">
                    <Check className="w-4 h-4 mr-2" />
                    Done
                  </Button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}