import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  Gift, 
  ShoppingBag, 
  Smartphone,
  ArrowLeft,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import BottomNav from '@/components/BottomNav';
import { useUser } from '@/contexts/UserContext';
import { Navigate, Link } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

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
    color: 'hero-gradient',
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
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  const selectedMethod = withdrawOptions.find(o => o.id === selectedOption);

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

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    addTransaction({
      type: 'withdraw',
      amount: -amountNum,
      status: 'pending',
      description: `${selectedMethod.name} Withdrawal`,
    });

    setIsLoading(false);
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
              Your request for ₹{amount} has been submitted
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
          className="flex items-center gap-4 mb-6"
        >
          {selectedOption ? (
            <button onClick={() => setSelectedOption(null)}>
              <ArrowLeft className="w-6 h-6" />
            </button>
          ) : null}
          <div>
            <h1 className="text-2xl font-bold">Withdraw</h1>
            <p className="text-muted-foreground">
              Balance: <span className="text-primary font-bold">₹{user?.balance.toLocaleString('en-IN')}</span>
            </p>
          </div>
        </motion.div>

        {!selectedOption ? (
          // Options Grid
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
        ) : (
          // Withdrawal Form
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {selectedMethod && (
              <div className={`bg-gradient-to-br ${selectedMethod.color} rounded-2xl p-6 mb-6 text-center`}>
                <selectedMethod.icon className="w-12 h-12 mx-auto mb-3 text-white" />
                <h2 className="text-xl font-bold text-white">{selectedMethod.name}</h2>
                <p className="text-white/80 text-sm">Min: ₹{selectedMethod.minAmount}</p>
              </div>
            )}

            <div className="space-y-4">
              {selectedOption === 'upi' && (
                <div>
                  <label className="text-sm font-medium mb-2 block">UPI ID</label>
                  <Input
                    placeholder="yourname@upi"
                    value={upiId}
                    onChange={e => setUpiId(e.target.value)}
                    className="h-14 text-base rounded-xl"
                  />
                </div>
              )}

              <div>
                <label className="text-sm font-medium mb-2 block">Amount (₹)</label>
                <Input
                  type="number"
                  placeholder={`Min ₹${selectedMethod?.minAmount}`}
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  className="h-14 text-xl font-bold rounded-xl"
                />
              </div>

              {/* Quick Amount Buttons */}
              <div className="grid grid-cols-4 gap-2">
                {[100, 200, 500, 1000].map(amt => (
                  <button
                    key={amt}
                    onClick={() => setAmount(amt.toString())}
                    className={`py-2 rounded-lg font-semibold transition-all ${
                      amount === amt.toString()
                        ? 'hero-gradient text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    ₹{amt}
                  </button>
                ))}
              </div>

              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full h-14 text-lg font-bold hero-gradient hover:opacity-90 rounded-xl mt-6"
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
          </motion.div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}