"use client";

import Link from "next/link";
import { MoveLeft, Ghost, Search, FileX, Terminal, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import ClickSpark from "@/components/reactbits/ClickSpark";

export default function NotFound() {
  return (
    <div 
      className="min-h-[100dvh] bg-zinc-50 dark:bg-[#050505] flex flex-col items-center justify-center p-6 text-center overflow-hidden relative selection:bg-indigo-500/30"
    >
      {/* Immersive Topo/Grid Background */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none" 
           style={{ backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`, backgroundSize: '40px 40px' }} />
      
      {/* Dynamic Ambient Blurs */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
          x: [-20, 20, -20],
          y: [-20, 20, -20]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[600px] bg-indigo-500/10 dark:bg-indigo-600/20 blur-[140px] rounded-full -z-10" 
      />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-500/5 dark:bg-emerald-500/10 blur-[120px] rounded-full -z-10" />

      {/* Large Hero Text with Modern Styling */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none -z-10 overflow-hidden">
        <motion.h1 
          initial={{ opacity: 0, scale: 0.9, y: 100 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.5, ease: "circOut" }}
          className="text-[28vw] sm:text-[24rem] font-black text-zinc-900/[0.03] dark:text-white/[0.02] leading-none tracking-tighter uppercase whitespace-nowrap"
        >
          Lost Archive
        </motion.h1>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-2xl w-full space-y-12 relative z-10"
      >
        {/* The Ghost Avatar - Premium Container */}
        <div className="relative inline-block perspective-1000">
          <motion.div
            animate={{
              y: [0, -25, 0],
              rotate: [0, 8, -8, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="relative z-20 group"
          >
            <div className="relative bg-zinc-950 dark:bg-zinc-100 p-10 rounded-[3rem] shadow-[0_30px_100px_-20px_rgba(0,0,0,0.3)] dark:shadow-[0_30px_100px_-20px_rgba(255,255,255,0.05)] border border-white/10 dark:border-black/5 overflow-hidden">
                {/* Animated Gradient Overlay */}
                <motion.div
                  animate={{ 
                    x: ['-100%', '200%'],
                    opacity: [0, 0.2, 0]
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent skew-x-12 pointer-events-none"
                />
                
                <Ghost className="h-28 w-28 text-white dark:text-zinc-900 relative z-10 filter drop-shadow-2xl" />
                
                {/* Interior Micro-Shadow */}
                <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.2)] dark:shadow-[inset_0_0_40px_rgba(255,255,255,0.1)] pointer-events-none" />
            </div>
          </motion.div>

          {/* Dynamic Ground Shadow */}
          <motion.div 
            animate={{ 
                scale: [0.8, 1.2, 0.8],
                opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="w-32 h-6 bg-zinc-900/10 dark:bg-black/40 blur-xl rounded-full mx-auto mt-10" 
          />
        </div>

        {/* Text Area */}
        <div className="space-y-6">
          <div className="space-y-3">
            <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-6xl md:text-8xl font-black text-zinc-900 dark:text-zinc-50 tracking-tighter leading-[0.85]"
            >
                This Page <br className="sm:hidden" />
                <span className="text-zinc-400 dark:text-zinc-600 block">Dropped Out.</span>
            </motion.h2>
            
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-rose-50 dark:bg-rose-500/10 rounded-2xl border border-rose-100 dark:border-rose-500/20 text-[10px] font-black text-rose-600 dark:text-rose-400 uppercase tracking-[0.2em] shadow-sm"
            >
                <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                Status: Semester Backlog 404
            </motion.div>
          </div>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-zinc-500 dark:text-zinc-400 font-bold text-base md:text-lg leading-relaxed max-w-lg mx-auto"
          >
            It couldn&apos;t handle the pressure of the 6th semester and decided to ghost us. Or maybe you typed something that doesn&apos;t exist—like an easy Internal exam.
          </motion.p>
        </div>

        {/* Improved Actions Layout */}
        <div className="space-y-8 max-w-md mx-auto pt-4">
          <div className="flex flex-col gap-4">
            <ClickSpark className="w-full">
              <Link
                href="/"
                className="group w-full flex justify-center items-center py-6 px-10 bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950 rounded-[2rem] shadow-[0_20px_50px_-10px_rgba(0,0,0,0.3)] dark:shadow-[0_20px_50px_-10px_rgba(255,255,255,0.05)] text-[12px] font-black uppercase tracking-[0.25em] transition-all hover:scale-[1.03] active:scale-95 gap-4 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-indigo-500 opacity-0 group-hover:opacity-10 transition-opacity" />
                <MoveLeft className="h-4 w-4 transition-transform group-hover:-translate-x-2" />
                Teleport to Safety
              </Link>
            </ClickSpark>

            <div className="flex items-center gap-6 py-2">
              <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800" />
              <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.3em] leading-none whitespace-nowrap">Try Searching Instead</span>
              <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800" />
            </div>

            <Link
              href="/vault"
              className="group w-full flex justify-center items-center py-5 px-10 bg-white dark:bg-transparent border-2 border-zinc-200 dark:border-zinc-800 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.25em] text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:border-zinc-400 dark:hover:border-zinc-600 transition-all gap-4"
            >
              <Search className="h-4 w-4 transition-transform group-hover:scale-110" />
              Browse The Vault
            </Link>
          </div>
        </div>

        {/* Premium Terminal Logs Section */}
        <div className="pt-16 space-y-4">
            <div className="inline-flex items-center gap-2 text-zinc-300 dark:text-zinc-700">
                <div className="h-px w-8 bg-current" />
                <Sparkles className="h-3 w-3" />
                <div className="h-px w-8 bg-current" />
            </div>
            
            <div className="flex flex-col items-center gap-2.5 opacity-60 select-none group cursor-default">
                <div className="flex items-center gap-3 text-[10px] font-mono text-zinc-500 dark:text-zinc-500 border border-zinc-200 dark:border-zinc-800 px-4 py-2 rounded-full bg-white dark:bg-black/20 backdrop-blur-sm transition-all group-hover:border-indigo-500/30">
                    <Terminal className="h-3.5 w-3.5 text-indigo-500" />
                    <span className="tracking-tight">
                        <span className="text-indigo-400">librarian@pudl:</span>
                        <span className="text-zinc-400">~$</span> locate_lost_students --force
                    </span>
                </div>
                <div className="text-[10px] font-mono text-emerald-600 dark:text-emerald-500/80 tracking-tight font-medium">
                    <span className="opacity-50">[SUCCESS]</span> Found 0 results. They are probably at the cafeteria.
                </div>
            </div>
        </div>
      </motion.div>

      {/* Cinematic Debris / Floating Elements */}
      <div className="absolute inset-0 pointer-events-none -z-5 overflow-hidden">
        <motion.div 
            animate={{ 
                y: [0, -120, 0], 
                x: [0, 60, 0], 
                rotate: [0, 180, 360],
                opacity: [0.05, 0.15, 0.05]
            }} 
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }} 
            className="absolute top-[15%] left-[8%] text-indigo-500"
        >
            <FileX className="h-16 w-16 stroke-[1px]" />
        </motion.div>
        
        <motion.div 
            animate={{ 
                y: [0, 100, 0], 
                x: [0, -50, 0], 
                rotate: [0, -180, -360],
                opacity: [0.05, 0.15, 0.05]
            }} 
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }} 
            className="absolute bottom-[25%] right-[12%] text-emerald-500"
        >
            <Search className="h-20 w-20 stroke-[1px]" />
        </motion.div>
        
        {/* Subtle Ring Shapes */}
        <div className="absolute top-[35%] right-[5%] border border-zinc-500/5 dark:border-zinc-100/5 w-64 h-64 rounded-full" />
        <div className="absolute bottom-[10%] left-[5%] border border-zinc-500/5 dark:border-zinc-100/5 w-96 h-96 rounded-full" />
      </div>

    </div>
  );
}
