import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, PlusCircle, QrCode, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import BottomNav from '@/components/BottomNav';
import { useUser } from '@/contexts/UserContext';
import { Navigate, Link } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const amounts = [100, 200, 500, 1000, 2000, 5000];

export default function DepositPage() {
  const { isAuthenticated, addTransaction } = useUser();
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  const handleDeposit = async () => {
    const amountNum = parseInt(amount);
    if (!amountNum || amountNum < 50) {
      toast({ title: 'Minimum deposit is ₹50', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    addTransaction({
      type: 'deposit',
      amount: amountNum,
      status: 'completed',
      description: 'Wallet Recharge',
    });

    setIsLoading(false);
    toast({ title: `₹${amountNum} added to your wallet!` });
    setAmount('');
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-lg mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-6"
        >
          <Link to="/">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-2xl font-bold">Deposit</h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="money-gradient rounded-2xl p-6 mb-6 text-center"
        >
          <PlusCircle className="w-12 h-12 mx-auto mb-3 text-secondary-foreground" />
          <h2 className="text-xl font-bold text-secondary-foreground">Add Money</h2>
          <p className="text-secondary-foreground/80 text-sm">Instant wallet recharge</p>
        </motion.div>

        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium mb-2 block">Enter Amount (₹)</label>
            <Input
              type="number"
              placeholder="Min ₹50"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="h-16 text-2xl font-bold text-center rounded-xl"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            {amounts.map(amt => (
              <button
                key={amt}
                onClick={() => setAmount(amt.toString())}
                className={`py-3 rounded-xl font-semibold transition-all ${
                  amount === amt.toString()
                    ? 'hero-gradient text-primary-foreground shadow-card'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                ₹{amt}
              </button>
            ))}
          </div>

          <div className="bg-card rounded-xl p-4 shadow-card">
            <h3 className="font-semibold mb-3">Payment Methods</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 bg-muted rounded-lg cursor-pointer">
                <input type="radio" name="method" defaultChecked className="accent-primary" />
                <QrCode className="w-5 h-5 text-purple" />
                <span>UPI / QR Code</span>
              </label>
              <label className="flex items-center gap-3 p-3 bg-muted rounded-lg cursor-pointer">
                <input type="radio" name="method" className="accent-primary" />
                <CreditCard className="w-5 h-5 text-primary" />
                <span>Card / Net Banking</span>
              </label>
            </div>
          </div>

          <Button
            onClick={handleDeposit}
            disabled={isLoading}
            className="w-full h-14 text-lg font-bold money-gradient hover:opacity-90 rounded-xl"
          >
            {isLoading ? 'Processing...' : 'Add Money'}
          </Button>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}