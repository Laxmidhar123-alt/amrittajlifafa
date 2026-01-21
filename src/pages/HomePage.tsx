import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  PlusCircle, 
  Wallet, 
  History, 
  TrendingUp,
  Gift,
  PenSquare,
  Send,
  Megaphone
} from 'lucide-react';
import ProfileHeader from '@/components/ProfileHeader';
import BalanceCard from '@/components/BalanceCard';
import ActionCard from '@/components/ActionCard';
import LifafaCard from '@/components/LifafaCard';
import BottomNav from '@/components/BottomNav';
import AddTaskModal from '@/components/modals/AddTaskModal';
import PostAdsModal from '@/components/modals/PostAdsModal';
import { useUser } from '@/contexts/UserContext';
import { Navigate, useNavigate } from 'react-router-dom';

export default function HomePage() {
  const { isAuthenticated } = useUser();
  const navigate = useNavigate();
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showAdsModal, setShowAdsModal] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  const actionCards = [
    { icon: PlusCircle, label: 'Deposit', to: '/deposit', variant: 'success' as const },
    { icon: Wallet, label: 'Withdraw', to: '/withdraw', variant: 'primary' as const },
    { icon: History, label: 'History', to: '/history', variant: 'accent' as const },
    { icon: TrendingUp, label: 'Payouts', to: '/payouts', variant: 'secondary' as const },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-lg mx-auto px-4">
        {/* Header */}
        <ProfileHeader />

        {/* Balance Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <BalanceCard />
        </motion.div>

        {/* Action Cards Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-4 gap-3 mb-8"
        >
          {actionCards.map((card, index) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + index * 0.05 }}
            >
              <ActionCard {...card} />
            </motion.div>
          ))}
        </motion.div>

        {/* Lifafa Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 lifafa-gradient rounded-lg flex items-center justify-center">
              <Gift className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-lg font-bold">🧧 Lifafa (Gift Envelope)</h2>
          </div>

          <div className="space-y-3">
            <LifafaCard
              icon={Gift}
              label="Claim Channel Lifafa"
              description="Enter code to claim reward"
              onClick={() => navigate('/claim-lifafa')}
            />
            <LifafaCard
              icon={PenSquare}
              label="Create Lifafa"
              description="Create & share with channel"
              onClick={() => navigate('/create-lifafa')}
            />
            <LifafaCard
              icon={Send}
              label="Add Task (Channel)"
              description="Add Telegram channel task"
              onClick={() => setShowTaskModal(true)}
            />
            <LifafaCard
              icon={Megaphone}
              label="Post Ads"
              description="Promote your brand"
              onClick={() => setShowAdsModal(true)}
            />
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 bg-card rounded-2xl p-4 shadow-card"
        >
          <h3 className="font-bold mb-3">📊 Today's Stats</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-primary">12</p>
              <p className="text-xs text-muted-foreground">Tasks Done</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-secondary">₹150</p>
              <p className="text-xs text-muted-foreground">Earned Today</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-accent">5</p>
              <p className="text-xs text-muted-foreground">Referrals</p>
            </div>
          </div>
        </motion.div>
      </div>

      <BottomNav />

      {/* Modals */}
      <AddTaskModal isOpen={showTaskModal} onClose={() => setShowTaskModal(false)} />
      <PostAdsModal isOpen={showAdsModal} onClose={() => setShowAdsModal(false)} />
    </div>
  );
}