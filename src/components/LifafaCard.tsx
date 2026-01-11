import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface LifafaCardProps {
  icon: LucideIcon;
  label: string;
  description: string;
  onClick: () => void;
}

export default function LifafaCard({ icon: Icon, label, description, onClick }: LifafaCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="lifafa-gradient p-4 rounded-xl shadow-card cursor-pointer relative overflow-hidden group"
    >
      {/* Decorative pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-2 right-2 w-16 h-16 border-2 border-white rounded-full" />
        <div className="absolute bottom-2 left-2 w-8 h-8 border border-white rounded-full" />
      </div>
      
      <div className="relative flex items-center gap-3">
        <motion.div 
          className="p-3 bg-white/25 rounded-full backdrop-blur-sm"
          whileHover={{ rotate: [0, -10, 10, 0] }}
          transition={{ duration: 0.5 }}
        >
          <Icon className="w-6 h-6 text-white" />
        </motion.div>
        <div className="flex-1">
          <h3 className="text-white font-bold text-base">{label}</h3>
          <p className="text-white/80 text-xs">{description}</p>
        </div>
        <motion.div
          className="text-white/60 group-hover:text-white transition-colors"
          animate={{ x: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          →
        </motion.div>
      </div>
    </motion.div>
  );
}