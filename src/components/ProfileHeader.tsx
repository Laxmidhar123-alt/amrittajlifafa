import { motion } from 'framer-motion';
import { User, Settings, Bell, LogOut } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { Link, useNavigate } from 'react-router-dom';

export default function ProfileHeader() {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <div className="flex items-center justify-between py-4">
      <Link to="/wallet" className="flex items-center gap-3">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="w-12 h-12 hero-gradient rounded-full flex items-center justify-center shadow-card"
        >
          <User className="w-6 h-6 text-primary-foreground" />
        </motion.div>
        <div>
          <h2 className="font-bold text-foreground">{user.name}</h2>
          <p className="text-sm text-muted-foreground">{user.mobile}</p>
          <p className="text-xs text-primary font-medium">{user.id}</p>
        </div>
      </Link>
      
      <div className="flex items-center gap-2">
        <Link to="/history">
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="p-3 bg-muted rounded-full hover:bg-muted/80 transition-colors"
          >
            <Bell className="w-5 h-5 text-muted-foreground" />
          </motion.button>
        </Link>
        <Link to="/help">
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="p-3 bg-muted rounded-full hover:bg-muted/80 transition-colors"
          >
            <Settings className="w-5 h-5 text-muted-foreground" />
          </motion.button>
        </Link>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleLogout}
          className="p-3 bg-destructive/10 rounded-full hover:bg-destructive/20 transition-colors"
        >
          <LogOut className="w-5 h-5 text-destructive" />
        </motion.button>
      </div>
    </div>
  );
}