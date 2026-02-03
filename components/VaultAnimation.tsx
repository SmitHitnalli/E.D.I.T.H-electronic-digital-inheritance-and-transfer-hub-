import React from 'react';
import { motion } from 'framer-motion';

const VaultAnimation: React.FC = () => {
  return (
    <div className="relative w-full h-[400px] md:h-[600px] flex items-center justify-center overflow-visible perspective-container">
      {/* Highlighting Glass Backplate */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, delay: 0.5 }}
        className="absolute w-[80%] h-[80%] glass rounded-[80px] border border-white/10 dark:bg-white/[0.02] bg-accent/5 -z-10 shadow-3d rotate-3"
      />

      {/* 3D Vault Structure */}
      <motion.div 
        initial={{ rotateY: -30, rotateX: 10, opacity: 0 }}
        animate={{ rotateY: -15, rotateX: 5, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="relative z-10 w-64 h-64 md:w-96 md:h-96 tilt-element"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="absolute inset-0 glass rounded-[60px] shadow-3d border border-white/10 flex items-center justify-center">
          {/* Inner Depth Layer */}
          <div className="absolute inset-4 rounded-[45px] border border-white/5 bg-gradient-to-br from-white/5 to-transparent shadow-inner" />
          
          {/* Vault Wheel (3D) */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="w-48 h-48 md:w-72 md:h-72 rounded-full border-[16px] border-void-900/80 bg-void-800 shadow-glass flex items-center justify-center relative"
            style={{ transform: 'translateZ(50px)' }}
          >
            {/* Spokes */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
              <div 
                key={deg} 
                className="absolute w-2 h-[80%] bg-gradient-to-t from-transparent via-accent/40 to-transparent"
                style={{ transform: `rotate(${deg}deg)` }}
              />
            ))}
            {/* Center Handle */}
            <div className="w-12 h-12 md:w-24 md:h-24 bg-void-950 rounded-full border-4 border-accent/30 shadow-accent-glow flex items-center justify-center">
               <div className="w-4 h-4 bg-accent rounded-full animate-pulse shadow-[0_0_10px_#9333EA]" />
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Floating Interactive Nodes */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-accent rounded-full shadow-accent-glow"
          animate={{
            y: [0, -200, 0],
            opacity: [0.1, 0.7, 0.1],
            scale: [0.8, 1.4, 0.8],
            x: [0, (i % 2 === 0 ? 250 : -250), 0]
          }}
          transition={{
            duration: 6 + Math.random() * 6,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: "easeInOut"
          }}
          style={{
            top: `${10 + Math.random() * 80}%`,
            left: `${10 + Math.random() * 80}%`
          }}
        />
      ))}
    </div>
  );
};

export default VaultAnimation;