import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, X, Copy, Check, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUser } from '@/contexts/UserContext';
import { toast } from '@/hooks/use-toast';

interface MakeLifafaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MakeLifafaModal({ isOpen, onClose }: MakeLifafaModalProps) {
  const [amount, setAmount] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [isLoading, setIsLoading] = useState(false);
  const [created, setCreated] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [copied, setCopied] = useState(false);
  const { user, addTransaction } = useUser();

  const handleCreate = async () => {
    const amountNum = parseInt(amount);
    const qtyNum = parseInt(quantity);
    
    if (!amountNum || amountNum < 10) {
      toast({ title: 'Minimum amount is ₹10', variant: 'destructive' });
      return;
    }
    
    if (!qtyNum || qtyNum < 1) {
      toast({ title: 'Minimum quantity is 1', variant: 'destructive' });
      return;
    }

    const totalAmount = amountNum * qtyNum;
    if (user && totalAmount > user.balance) {
      toast({ title: 'Insufficient balance', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const code = 'LIFAFA' + Math.random().toString(36).substr(2, 6).toUpperCase();
    setGeneratedCode(code);
    
    addTransaction({
      type: 'lifafa',
      amount: -totalAmount,
      status: 'completed',
      description: `Created Lifafa: ${code}`,
    });

    setIsLoading(false);
    setCreated(true);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    toast({ title: 'Code copied!' });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Cash IN Reward Lifafa',
        text: `Claim your Lifafa gift with code: ${generatedCode}`,
        url: window.location.origin,
      });
    } else {
      handleCopy();
    }
  };

  const handleClose = () => {
    setAmount('');
    setQuantity('1');
    setCreated(false);
    setGeneratedCode('');
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
            <div className="absolute top-0 left-0 right-0 h-24 gold-gradient" />
            
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 bg-white/20 rounded-full z-10"
            >
              <X className="w-4 h-4 text-accent-foreground" />
            </button>

            <div className="relative pt-8">
              <motion.div
                animate={created ? { scale: [1, 1.2, 1] } : {}}
                className="w-20 h-20 mx-auto mb-4 gold-gradient rounded-full flex items-center justify-center shadow-elevated"
              >
                <Gift className="w-10 h-10 text-accent-foreground" />
              </motion.div>

              {!created ? (
                <>
                  <h2 className="text-xl font-bold text-center mb-2">Create Lifafa</h2>
                  <p className="text-sm text-muted-foreground text-center mb-6">
                    Share rewards with friends
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Amount per Lifafa (₹)</label>
                      <Input
                        type="number"
                        placeholder="Min ₹10"
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                        className="text-lg font-semibold"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-1 block">Quantity</label>
                      <Input
                        type="number"
                        placeholder="1"
                        value={quantity}
                        onChange={e => setQuantity(e.target.value)}
                        min="1"
                        className="text-lg font-semibold"
                      />
                    </div>

                    {amount && quantity && (
                      <div className="bg-muted p-3 rounded-lg text-center">
                        <span className="text-sm text-muted-foreground">Total: </span>
                        <span className="font-bold text-foreground">
                          ₹{(parseInt(amount || '0') * parseInt(quantity || '1')).toLocaleString('en-IN')}
                        </span>
                      </div>
                    )}

                    <Button
                      onClick={handleCreate}
                      disabled={isLoading}
                      className="w-full gold-gradient hover:opacity-90 text-accent-foreground"
                    >
                      {isLoading ? 'Creating...' : 'Create Lifafa'}
                    </Button>
                  </div>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center"
                >
                  <h2 className="text-xl font-bold mb-2 text-secondary">
                    ✨ Lifafa Created!
                  </h2>
                  <p className="text-muted-foreground mb-4">Share this code</p>
                  
                  <div className="bg-muted p-4 rounded-xl mb-4">
                    <p className="text-2xl font-bold text-primary tracking-wider">
                      {generatedCode}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleCopy} variant="outline" className="flex-1">
                      {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                      {copied ? 'Copied!' : 'Copy'}
                    </Button>
                    <Button onClick={handleShare} className="flex-1 hero-gradient">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}