import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-primary flex items-center justify-center flex-col z-50">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center"
      >
        <div className="w-20 h-20 relative mb-4">
          <motion.div
            animate={{ 
              rotate: 360,
              borderRadius: ["50% 50% 50% 50%", "60% 40% 60% 40%", "50% 50% 50% 50%"] 
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity,
              repeatType: "loop"
            }}
            className="absolute inset-0 border-4 border-accent"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="h-10 w-10 text-white animate-spin" />
          </div>
        </div>
        <h2 className="text-accent text-xl font-semibold">Loading...</h2>
      </motion.div>
    </div>
  );
};

export default LoadingScreen;