import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ 
  icon: Icon, 
  title, 
  description, 
  actionText, 
  onAction 
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center p-12 text-center border border-slate-800/50 rounded-2xl bg-slate-900/20 backdrop-blur-sm"
    >
      <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center mb-6 border border-slate-700/50">
        <Icon className="w-8 h-8 text-slate-400" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2 font-heading">{title}</h3>
      <p className="text-slate-400 max-w-md mb-8">{description}</p>
      
      {actionText && onAction && (
        <button 
          onClick={onAction}
          className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold rounded-lg transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)]"
        >
          {actionText}
        </button>
      )}
    </motion.div>
  );
};
