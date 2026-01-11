import { motion } from 'framer-motion';
import { Wallet, TrendingUp, TrendingDown, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useUser } from '@/contexts/UserContext';

export default function BalanceCard() {
  const { user } = useUser();
  const [showBalance, setShowBalance] = useState(true);

  if (!user) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="hero-gradient p-6 rounded-2xl shadow-elevated relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/5 rounded-full blur-xl" />
      </div>

      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-white/20 rounded-full">
              <Wallet className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-primary-foreground/80 font-medium">Total Balance</span>
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowBalance(!showBalance)}
            className="p-2 bg-white/10 rounded-full"
          >
            {showBalance ? (
              <Eye className="w-4 h-4 text-primary-foreground" />
            ) : (
              <EyeOff className="w-4 h-4 text-primary-foreground" />
            )}
          </motion.button>
        </div>

        {/* Balance */}
        <motion.div
          key={showBalance ? 'visible' : 'hidden'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6"
        >
          <span className="text-4xl font-bold text-primary-foreground">
            {showBalance ? `₹${user.balance.toLocaleString('en-IN')}` : '₹ ••••'}
          </span>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-emerald-light" />
              <span className="text-xs text-primary-foreground/70">Total Earned</span>
            </div>
            <span className="text-lg font-bold text-primary-foreground">
              ₹{user.totalEarned.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-1">
              <TrendingDown className="w-4 h-4 text-gold-light" />
              <span className="text-xs text-primary-foreground/70">Withdrawn</span>
            </div>
            <span className="text-lg font-bold text-primary-foreground">
              ₹{user.totalWithdrawn.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}