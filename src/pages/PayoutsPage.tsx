import { motion } from 'framer-motion';
import { ArrowLeft, TrendingUp, Calendar, IndianRupee } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { useUser } from '@/contexts/UserContext';
import { Navigate, Link } from 'react-router-dom';

const payouts = [
  { id: 1, user: 'Rahul S.', amount: 5000, method: 'UPI', date: '2 hrs ago' },
  { id: 2, user: 'Priya M.', amount: 2500, method: 'Amazon', date: '4 hrs ago' },
  { id: 3, user: 'Amit K.', amount: 1000, method: 'Google Play', date: '6 hrs ago' },
  { id: 4, user: 'Sneha T.', amount: 3000, method: 'UPI', date: '8 hrs ago' },
  { id: 5, user: 'Vikram P.', amount: 750, method: 'Flipkart', date: '10 hrs ago' },
  { id: 6, user: 'Anita D.', amount: 2000, method: 'UPI', date: '12 hrs ago' },
  { id: 7, user: 'Raj B.', amount: 1500, method: 'Amazon', date: '1 day ago' },
  { id: 8, user: 'Meera L.', amount: 4000, method: 'UPI', date: '1 day ago' },
];

export default function PayoutsPage() {
  const { isAuthenticated } = useUser();

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  const totalPaid = payouts.reduce((sum, p) => sum + p.amount, 0);

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
          <h1 className="text-2xl font-bold">Recent Payouts</h1>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="hero-gradient rounded-2xl p-6 mb-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-6 h-6 text-primary-foreground" />
            <span className="text-primary-foreground/80">Total Paid Today</span>
          </div>
          <p className="text-4xl font-bold text-primary-foreground">
            ₹{totalPaid.toLocaleString('en-IN')}
          </p>
          <p className="text-primary-foreground/60 text-sm mt-2">
            {payouts.length} successful withdrawals
          </p>
        </motion.div>

        {/* Live Payouts */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
          <h2 className="font-bold">Live Payouts</h2>
        </div>

        <div className="space-y-3">
          {payouts.map((payout, index) => (
            <motion.div
              key={payout.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-card rounded-xl p-4 shadow-card flex items-center gap-4"
            >
              <div className="w-10 h-10 hero-gradient rounded-full flex items-center justify-center text-sm font-bold text-primary-foreground">
                {payout.user.split(' ')[0].charAt(0)}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-sm">{payout.user}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{payout.method}</span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">{payout.date}</span>
                </div>
              </div>
              <span className="font-bold text-secondary">₹{payout.amount.toLocaleString('en-IN')}</span>
            </motion.div>
          ))}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}