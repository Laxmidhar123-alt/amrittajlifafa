import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  Gift, 
  ShoppingBag, 
  Smartphone,
  Check,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import BottomNav from '@/components/BottomNav';
import { useUser } from '@/contexts/UserContext';
import { Navigate, Link } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

const withdrawOptions = [
  { 
    id: 'upi', 
    name: 'UPI', 
    icon: Smartphone, 
    minAmount: 50, 
    color: 'from-purple-500 to-indigo-500',
    description: 'Instant transfer to any UPI ID'
  },
  { 
    id: 'amazon', 
    name: 'Amazon Gift Card', 
    icon: ShoppingBag, 
    minAmount: 100, 
    color: 'from-orange-500 to-amber-500',
    description: 'Get Amazon shopping voucher'
  },
  { 
    id: 'google', 
    name: 'Google Play', 
    icon: Gift, 
    minAmount: 75, 
    color: 'from-green-500 to-emerald-500',
    description: 'Redeem for apps & games'
  },
  { 
    id: 'flipkart', 
    name: 'Flipkart Gift Card', 
    icon: CreditCard, 
    minAmount: 100, 
    color: 'from-blue-500 to-cyan-500',
    description: 'Shop on Flipkart'
  },
];

export default function WithdrawPage() {
  const { isAuthenticated, user, addTransaction } = useUser();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [amount, setAmount] = useState('');
  const [upiId, setUpiId] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  const selectedMethod = withdrawOptions.find(o => o.id === selectedOption);

  const resetForm = () => {
    setAmount('');
    setUpiId('');
    setEmail('');
  };

  const closeDialog = () => {
    setSelectedOption(null);
    resetForm();
  };

  const handleSubmit = async () => {
    if (!selectedMethod) return;
    
    const amountNum = parseInt(amount);
    
    if (!amountNum || amountNum < selectedMethod.minAmount) {
      toast({ 
        title: `Minimum withdrawal is ₹${selectedMethod.minAmount}`, 
        variant: 'destructive' 
      });
      return;
    }

    if (user && amountNum > user.balance) {
      toast({ title: 'Insufficient balance', variant: 'destructive' });
      return;
    }

    if (selectedOption === 'upi' && !upiId.includes('@')) {
      toast({ title: 'Please enter valid UPI ID', variant: 'destructive' });
      return;
    }

    if (selectedOption !== 'upi' && !email.includes('@')) {
      toast({ title: 'Please enter valid email address', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    addTransaction({
      type: 'withdraw',
      amount: -amountNum,
      status: 'pending',
      description: `${selectedMethod.name} Withdrawal`,
    });

    setIsLoading(false);
    setSelectedOption(null);
    resetForm();
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background pb-24">
        <div className="max-w-lg mx-auto px-4 py-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: 3, duration: 0.5 }}
              className="w-24 h-24 mx-auto mb-6 money-gradient rounded-full flex items-center justify-center"
            >
              <Check className="w-12 h-12 text-secondary-foreground" />
            </motion.div>
            <h1 className="text-2xl font-bold mb-2">Withdrawal Submitted!</h1>
            <p className="text-muted-foreground mb-2">
              Your withdrawal request has been submitted
            </p>
            <p className="text-sm text-muted-foreground mb-8">
              You'll receive it within 24-48 hours
            </p>
            <Link to="/">
              <Button className="hero-gradient">Back to Home</Button>
            </Link>
          </motion.div>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-bold">Withdraw</h1>
          <p className="text-muted-foreground">
            Balance: <span className="text-primary font-bold">₹{user?.balance.toLocaleString('en-IN')}</span>
          </p>
        </motion.div>

        {/* Options Grid */}
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground mb-4">
            Choose withdrawal method
          </p>
          {withdrawOptions.map((option, index) => (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedOption(option.id)}
              className="bg-card rounded-2xl p-4 shadow-card cursor-pointer hover:shadow-elevated transition-shadow flex items-center gap-4"
            >
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${option.color} flex items-center justify-center flex-shrink-0`}>
                <option.icon className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold">{option.name}</h3>
                <p className="text-sm text-muted-foreground">{option.description}</p>
                <p className="text-xs text-primary mt-1">Min: ₹{option.minAmount}</p>
              </div>
              <motion.div whileHover={{ x: 5 }} className="text-muted-foreground">
                →
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Withdrawal Dialog */}
      <Dialog open={!!selectedOption} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="max-w-sm mx-auto rounded-2xl">
          <DialogHeader>
            {selectedMethod && (
              <div className={`w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br ${selectedMethod.color} flex items-center justify-center`}>
                <selectedMethod.icon className="w-8 h-8 text-white" />
              </div>
            )}
            <DialogTitle className="text-center">{selectedMethod?.name}</DialogTitle>
            <DialogDescription className="text-center">
              Min: ₹{selectedMethod?.minAmount}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {/* Amount Input */}
            <div>
              <Label htmlFor="amount">Amount (₹)</Label>
              <Input
                id="amount"
                type="number"
                placeholder={`Min ₹${selectedMethod?.minAmount}`}
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="h-12 text-lg font-bold rounded-xl mt-1"
              />
            </div>

            {/* Quick Amount Buttons */}
            <div className="grid grid-cols-4 gap-2">
              {[100, 200, 500, 1000].map(amt => (
                <button
                  key={amt}
                  onClick={() => setAmount(amt.toString())}
                  className={`py-2 rounded-lg font-semibold text-sm transition-all ${
                    amount === amt.toString()
                      ? 'hero-gradient text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  ₹{amt}
                </button>
              ))}
            </div>

            {/* UPI ID for UPI option */}
            {selectedOption === 'upi' && (
              <div>
                <Label htmlFor="upiId">VPA (UPI ID)</Label>
                <Input
                  id="upiId"
                  placeholder="yourname@upi"
                  value={upiId}
                  onChange={e => setUpiId(e.target.value)}
                  className="h-12 rounded-xl mt-1"
                />
              </div>
            )}

            {/* Email for Gift Card options */}
            {selectedOption !== 'upi' && (
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="h-12 rounded-xl mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Gift card code will be sent to this email
                </p>
              </div>
            )}

            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full h-12 text-lg font-bold hero-gradient hover:opacity-90 rounded-xl"
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="w-6 h-6 border-2 border-primary-foreground border-t-transparent rounded-full"
                />
              ) : (
                'Withdraw Now'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <BottomNav />
    </div>
  );
}