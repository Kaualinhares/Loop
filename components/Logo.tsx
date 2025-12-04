import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = "", size = 40, showText = true }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
        {/* We use an SVG to replicate the "Interlaced Loops" visual provided */}
        <svg 
            width={size} 
            height={size} 
            viewBox="0 0 100 100" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <linearGradient id="loopGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#06b6d4" /> {/* Cyan */}
                    <stop offset="100%" stopColor="#9333ea" /> {/* Purple */}
                </linearGradient>
            </defs>
            {/* Left Loop */}
            <circle cx="35" cy="50" r="25" stroke="url(#loopGradient)" strokeWidth="12" fill="none" />
            {/* Right Loop */}
            <circle cx="65" cy="50" r="25" stroke="url(#loopGradient)" strokeWidth="12" fill="none" style={{ mixBlendMode: 'multiply' }} />
        </svg>
        {showText && (
            <span className="font-bold text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-purple-600">
                Loop
            </span>
        )}
    </div>
  );
};