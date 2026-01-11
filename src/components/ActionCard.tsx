import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ActionCardProps {
  icon: LucideIcon;
  label: string;
  to: string;
  variant?: 'primary' | 'secondary' | 'accent' | 'success';
}

const variants = {
  primary: 'hero-gradient',
  secondary: 'bg-secondary',
  accent: 'gold-gradient',
  success: 'money-gradient',
};

const iconVariants = {
  primary: 'text-primary-foreground',
  secondary: 'text-secondary-foreground',
  accent: 'text-accent-foreground',
  success: 'text-secondary-foreground',
};

export default function ActionCard({ icon: Icon, label, to, variant = 'primary' }: ActionCardProps) {
  return (
    <Link to={to}>
      <motion.div
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        className={`${variants[variant]} p-4 rounded-xl shadow-card flex flex-col items-center gap-2 cursor-pointer transition-shadow hover:shadow-elevated`}
      >
        <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
          <Icon className={`w-6 h-6 ${iconVariants[variant]}`} />
        </div>
        <span className={`text-sm font-semibold ${iconVariants[variant]}`}>
          {label}
        </span>
      </motion.div>
    </Link>
  );
}