import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, Check, Plus, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddTaskModal({ isOpen, onClose }: AddTaskModalProps) {
  const [channelName, setChannelName] = useState('');
  const [channelLink, setChannelLink] = useState('');
  const [rewardAmount, setRewardAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [created, setCreated] = useState(false);

  const handleCreate = async () => {
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

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    setCreated(true);
    toast({ title: 'Task channel added successfully!' });
  };

  const handleClose = () => {
    setChannelName('');
    setChannelLink('');
    setRewardAmount('');
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
            className="bg-card rounded-2xl p-6 w-full max-w-sm shadow-elevated relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-r from-blue-500 to-cyan-400" />
            
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 bg-white/20 rounded-full z-10"
            >
              <X className="w-4 h-4 text-white" />
            </button>

            <div className="relative pt-8">
              <motion.div
                className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full flex items-center justify-center shadow-elevated"
              >
                <Send className="w-10 h-10 text-white" />
              </motion.div>

              {!created ? (
                <>
                  <h2 className="text-xl font-bold text-center mb-2">Add Task Channel</h2>
                  <p className="text-sm text-muted-foreground text-center mb-6">
                    Add a Telegram channel for tasks
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Channel Name</label>
                      <Input
                        placeholder="e.g., My Telegram Channel"
                        value={channelName}
                        onChange={e => setChannelName(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-1 block">Channel Link</label>
                      <Input
                        placeholder="https://t.me/yourchannel"
                        value={channelLink}
                        onChange={e => setChannelLink(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-1 block">Reward per Join (₹)</label>
                      <Input
                        type="number"
                        placeholder="10"
                        value={rewardAmount}
                        onChange={e => setRewardAmount(e.target.value)}
                      />
                    </div>

                    <Button
                      onClick={handleCreate}
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 hover:opacity-90"
                    >
                      {isLoading ? 'Adding...' : (
                        <>
                          <Plus className="w-4 h-4 mr-2" />
                          Add Channel
                        </>
                      )}
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
                  <h2 className="text-xl font-bold mb-2">Channel Added!</h2>
                  <p className="text-muted-foreground mb-6">
                    Your task channel is now live
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