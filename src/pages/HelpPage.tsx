import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  MessageCircle, 
  Mail, 
  Phone, 
  FileText, 
  Shield,
  HelpCircle,
  ChevronRight
} from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { useUser } from '@/contexts/UserContext';
import { Navigate, Link } from 'react-router-dom';

const helpItems = [
  { icon: HelpCircle, label: 'FAQs', description: 'Common questions answered' },
  { icon: MessageCircle, label: 'Live Chat', description: '24/7 support available' },
  { icon: Mail, label: 'Email Us', description: 'support@cashinreward.in' },
  { icon: Phone, label: 'Call Us', description: '+91 98765 43210' },
];

const legalItems = [
  { icon: FileText, label: 'Terms of Service', to: '/terms' },
  { icon: Shield, label: 'Privacy Policy', to: '/terms' },
];

export default function HelpPage() {
  const { isAuthenticated } = useUser();

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
          <h1 className="text-2xl font-bold">Help & Support</h1>
        </motion.div>

        {/* Contact Options */}
        <div className="space-y-3 mb-8">
          {helpItems.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card rounded-xl p-4 shadow-card flex items-center gap-4 cursor-pointer hover:shadow-elevated transition-shadow"
            >
              <div className="w-12 h-12 hero-gradient rounded-xl flex items-center justify-center">
                <item.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{item.label}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </motion.div>
          ))}
        </div>

        {/* Legal Links */}
        <h2 className="font-bold mb-4">Legal</h2>
        <div className="space-y-3">
          {legalItems.map((item, index) => (
            <Link key={item.label} to={item.to}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="bg-card rounded-xl p-4 shadow-card flex items-center gap-4"
              >
                <item.icon className="w-5 h-5 text-muted-foreground" />
                <span className="flex-1 font-medium">{item.label}</span>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </motion.div>
            </Link>
          ))}
        </div>

        {/* App Version */}
        <div className="text-center mt-8 py-4">
          <p className="text-sm text-muted-foreground">Cash IN Reward v1.0.0</p>
          <p className="text-xs text-muted-foreground">Made with ❤️ in India</p>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}