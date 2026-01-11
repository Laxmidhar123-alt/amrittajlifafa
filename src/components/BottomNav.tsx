import { Home, ListTodo, Wallet } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const navItems = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/task', icon: ListTodo, label: 'Task' },
  { path: '/withdraw', icon: Wallet, label: 'Withdraw' },
];

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-elevated">
      <div className="max-w-lg mx-auto flex justify-around items-center py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className="relative flex flex-col items-center py-2 px-6"
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -top-2 left-1/2 -translate-x-1/2 w-12 h-1 hero-gradient rounded-full"
                  transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                />
              )}
              <motion.div
                whileTap={{ scale: 0.9 }}
                className={`p-2 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'hero-gradient shadow-card' 
                    : 'bg-transparent'
                }`}
              >
                <item.icon 
                  className={`w-6 h-6 ${
                    isActive ? 'text-primary-foreground' : 'text-muted-foreground'
                  }`} 
                />
              </motion.div>
              <span 
                className={`text-xs mt-1 font-medium ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}