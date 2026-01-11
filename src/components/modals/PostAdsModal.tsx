import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Megaphone, X, Check, Upload, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';

interface PostAdsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PostAdsModal({ isOpen, onClose }: PostAdsModalProps) {
  const [adTitle, setAdTitle] = useState('');
  const [adDescription, setAdDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [duration, setDuration] = useState('7');
  const [isLoading, setIsLoading] = useState(false);
  const [created, setCreated] = useState(false);

  const handleCreate = async () => {
    if (!adTitle.trim()) {
      toast({ title: 'Please enter ad title', variant: 'destructive' });
      return;
    }
    if (!budget || parseInt(budget) < 100) {
      toast({ title: 'Minimum budget is ₹100', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    setCreated(true);
    toast({ title: 'Ad posted successfully!' });
  };

  const handleClose = () => {
    setAdTitle('');
    setAdDescription('');
    setBudget('');
    setDuration('7');
    setCreated(false);
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
            className="bg-card rounded-2xl p-6 w-full max-w-sm shadow-elevated relative overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-r from-purple-500 to-pink-400" />
            
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 bg-white/20 rounded-full z-10"
            >
              <X className="w-4 h-4 text-white" />
            </button>

            <div className="relative pt-8">
              <motion.div
                className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-pink-400 rounded-full flex items-center justify-center shadow-elevated"
              >
                <Megaphone className="w-10 h-10 text-white" />
              </motion.div>

              {!created ? (
                <>
                  <h2 className="text-xl font-bold text-center mb-2">Post Advertisement</h2>
                  <p className="text-sm text-muted-foreground text-center mb-6">
                    Promote your brand to our users
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Ad Title</label>
                      <Input
                        placeholder="Your ad headline"
                        value={adTitle}
                        onChange={e => setAdTitle(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-1 block">Description</label>
                      <Textarea
                        placeholder="Describe your offer..."
                        value={adDescription}
                        onChange={e => setAdDescription(e.target.value)}
                        rows={3}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-1 block">Upload Banner (Optional)</label>
                      <div className="border-2 border-dashed border-border rounded-xl p-4 text-center cursor-pointer hover:bg-muted/50 transition-colors">
                        <Image className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Click to upload</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-1 block">Budget (₹)</label>
                        <Input
                          type="number"
                          placeholder="Min ₹100"
                          value={budget}
                          onChange={e => setBudget(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Duration (Days)</label>
                        <Input
                          type="number"
                          placeholder="7"
                          value={duration}
                          onChange={e => setDuration(e.target.value)}
                          min="1"
                        />
                      </div>
                    </div>

                    <Button
                      onClick={handleCreate}
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-400 hover:opacity-90"
                    >
                      {isLoading ? 'Posting...' : 'Post Ad'}
                    </Button>
                  </div>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 mx-auto mb-4 bg-secondary rounded-full flex items-center justify-center">
                    <Check className="w-8 h-8 text-secondary-foreground" />
                  </div>
                  <h2 className="text-xl font-bold mb-2">Ad Posted!</h2>
                  <p className="text-muted-foreground mb-6">
                    Your ad is now under review
                  </p>
                  <Button onClick={handleClose} className="w-full hero-gradient">
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