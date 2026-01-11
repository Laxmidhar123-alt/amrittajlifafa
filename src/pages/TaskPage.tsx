import { motion } from 'framer-motion';
import { ExternalLink, CheckCircle2, Gift, Star, Users, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BottomNav from '@/components/BottomNav';
import { useUser } from '@/contexts/UserContext';
import { Navigate } from 'react-router-dom';

const tasks = [
  { id: 1, title: 'Join Telegram Channel', reward: 25, icon: MessageCircle, status: 'available', color: 'from-blue-500 to-cyan-400' },
  { id: 2, title: 'Follow on Instagram', reward: 20, icon: Star, status: 'available', color: 'from-pink-500 to-rose-400' },
  { id: 3, title: 'Subscribe YouTube', reward: 30, icon: Star, status: 'completed', color: 'from-red-500 to-orange-400' },
  { id: 4, title: 'Refer a Friend', reward: 50, icon: Users, status: 'available', color: 'hero-gradient' },
  { id: 5, title: 'Daily Check-in', reward: 10, icon: Gift, status: 'completed', color: 'from-emerald-500 to-green-400' },
  { id: 6, title: 'Complete Survey', reward: 100, icon: CheckCircle2, status: 'available', color: 'from-purple-500 to-indigo-400' },
];

export default function TaskPage() {
  const { isAuthenticated } = useUser();

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  const handleStartTask = () => {
    window.open('https://t.me/taskwebbot', '_blank');
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-bold mb-1">Complete Tasks</h1>
          <p className="text-muted-foreground">Earn rewards by completing simple tasks</p>
        </motion.div>

        {/* Stats Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="hero-gradient rounded-2xl p-4 mb-6 relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-2 right-2 w-20 h-20 border-2 border-white rounded-full" />
          </div>
          <div className="relative flex justify-between items-center">
            <div>
              <p className="text-primary-foreground/80 text-sm">Available Tasks</p>
              <p className="text-3xl font-bold text-primary-foreground">12</p>
            </div>
            <div className="text-right">
              <p className="text-primary-foreground/80 text-sm">Potential Earnings</p>
              <p className="text-3xl font-bold text-primary-foreground">₹285</p>
            </div>
          </div>
        </motion.div>

        {/* Main CTA Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Button
            onClick={handleStartTask}
            className="w-full h-16 text-lg font-bold hero-gradient hover:opacity-90 rounded-2xl shadow-elevated"
          >
            <ExternalLink className="w-6 h-6 mr-3" />
            Start Earning on Telegram
          </Button>
          <p className="text-center text-sm text-muted-foreground mt-2">
            Complete tasks and earn ₹10-100 per task
          </p>
        </motion.div>

        {/* Task List */}
        <div>
          <h2 className="font-bold text-lg mb-4">Featured Tasks</h2>
          <div className="space-y-3">
            {tasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                className={`bg-card rounded-xl p-4 shadow-card flex items-center gap-4 ${
                  task.status === 'completed' ? 'opacity-60' : ''
                }`}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${task.color} flex items-center justify-center flex-shrink-0`}>
                  <task.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{task.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    Earn <span className="text-primary font-bold">₹{task.reward}</span>
                  </p>
                </div>
                {task.status === 'completed' ? (
                  <div className="px-3 py-1 bg-secondary/20 rounded-full">
                    <span className="text-xs font-semibold text-secondary">Done ✓</span>
                  </div>
                ) : (
                  <Button
                    size="sm"
                    onClick={handleStartTask}
                    className="hero-gradient hover:opacity-90"
                  >
                    Start
                  </Button>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}