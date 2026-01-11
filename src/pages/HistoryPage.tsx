import { motion } from 'framer-motion';
import { ArrowLeft, ArrowUpRight, ArrowDownLeft, Gift, CheckCircle, Clock, XCircle } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { useUser } from '@/contexts/UserContext';
import { Navigate, Link } from 'react-router-dom';

const statusIcons = {
  completed: CheckCircle,
  pending: Clock,
  failed: XCircle,
};

const statusColors = {
  completed: 'text-secondary',
  pending: 'text-accent',
  failed: 'text-destructive',
};

const typeIcons = {
  deposit: ArrowDownLeft,
  withdraw: ArrowUpRight,
  lifafa: Gift,
  reward: Gift,
  task: CheckCircle,
};

const typeColors = {
  deposit: 'bg-secondary/20 text-secondary',
  withdraw: 'bg-destructive/20 text-destructive',
  lifafa: 'bg-ruby/20 text-ruby',
  reward: 'bg-accent/20 text-accent',
  task: 'bg-primary/20 text-primary',
};

export default function HistoryPage() {
  const { isAuthenticated, user } = useUser();

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

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
          <h1 className="text-2xl font-bold">Transaction History</h1>
        </motion.div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {['All', 'Deposits', 'Withdrawals', 'Rewards'].map(filter => (
            <button
              key={filter}
              className="px-4 py-2 bg-muted rounded-full text-sm font-medium whitespace-nowrap first:hero-gradient first:text-primary-foreground"
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Transactions List */}
        <div className="space-y-3">
          {user?.transactions.map((tx, index) => {
            const Icon = typeIcons[tx.type];
            const StatusIcon = statusIcons[tx.status];
            return (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-card rounded-xl p-4 shadow-card flex items-center gap-4"
              >
                <div className={`w-12 h-12 rounded-xl ${typeColors[tx.type]} flex items-center justify-center`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">{tx.description}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <StatusIcon className={`w-3 h-3 ${statusColors[tx.status]}`} />
                    <span className="text-xs text-muted-foreground">{tx.date}</span>
                  </div>
                </div>
                <span className={`font-bold ${tx.amount >= 0 ? 'text-secondary' : 'text-destructive'}`}>
                  {tx.amount >= 0 ? '+' : ''}₹{Math.abs(tx.amount)}
                </span>
              </motion.div>
            );
          })}
        </div>

        {(!user?.transactions || user.transactions.length === 0) && (
          <div className="text-center py-12">
            <Gift className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No transactions yet</p>
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}