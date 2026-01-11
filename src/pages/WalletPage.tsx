import { motion } from 'framer-motion';
import { ArrowLeft, Wallet, TrendingUp, TrendingDown, Gift, Award, Target } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { useUser } from '@/contexts/UserContext';
import { Navigate, Link } from 'react-router-dom';

export default function WalletPage() {
  const { isAuthenticated, user } = useUser();

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  const stats = [
    { label: 'Current Balance', value: `₹${user?.balance.toLocaleString('en-IN')}`, icon: Wallet, color: 'hero-gradient' },
    { label: 'Total Earned', value: `₹${user?.totalEarned.toLocaleString('en-IN')}`, icon: TrendingUp, color: 'money-gradient' },
    { label: 'Total Withdrawn', value: `₹${user?.totalWithdrawn.toLocaleString('en-IN')}`, icon: TrendingDown, color: 'gold-gradient' },
  ];

  const achievements = [
    { label: 'Tasks Completed', value: '47', icon: Target },
    { label: 'Lifafa Claimed', value: '12', icon: Gift },
    { label: 'Referrals', value: '8', icon: Award },
  ];

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
          <h1 className="text-2xl font-bold">My Wallet</h1>
        </motion.div>

        {/* User Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl p-6 shadow-card mb-6 text-center"
        >
          <div className="w-20 h-20 mx-auto mb-4 hero-gradient rounded-full flex items-center justify-center text-3xl font-bold text-primary-foreground">
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <h2 className="text-xl font-bold">{user?.name}</h2>
          <p className="text-muted-foreground">{user?.mobile}</p>
          <p className="text-sm text-primary font-medium mt-1">{user?.id}</p>
        </motion.div>

        {/* Balance Cards */}
        <div className="space-y-3 mb-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`${stat.color} rounded-xl p-4 flex items-center gap-4`}
            >
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-white/80 text-sm">{stat.label}</p>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-2xl p-4 shadow-card"
        >
          <h3 className="font-bold mb-4">🏆 Achievements</h3>
          <div className="grid grid-cols-3 gap-4">
            {achievements.map(ach => (
              <div key={ach.label} className="text-center">
                <div className="w-12 h-12 mx-auto mb-2 bg-muted rounded-full flex items-center justify-center">
                  <ach.icon className="w-6 h-6 text-primary" />
                </div>
                <p className="text-xl font-bold">{ach.value}</p>
                <p className="text-xs text-muted-foreground">{ach.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 mt-6">
          <Link to="/deposit">
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="w-full py-4 money-gradient rounded-xl font-semibold text-secondary-foreground"
            >
              + Add Money
            </motion.button>
          </Link>
          <Link to="/withdraw">
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="w-full py-4 hero-gradient rounded-xl font-semibold text-primary-foreground"
            >
              Withdraw
            </motion.button>
          </Link>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}