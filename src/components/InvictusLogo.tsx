import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
  textColor?: string;
  alignment?: 'start' | 'center';
}

export default function InvictusLogo({ 
  className = '', 
  size = 40, 
  showText = false, 
  textColor = 'text-white',
  alignment = 'start'
}: LogoProps) {
  return (
    <div className={`flex items-center gap-3 ${alignment === 'center' ? 'flex-col sm:flex-row' : ''} ${className}`}>
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 200 200" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 drop-shadow-[0_4px_12px_rgba(251,191,36,0.15)]"
      >
        <defs>
          <linearGradient id="invictus-gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF2C2" />
            <stop offset="15%" stopColor="#FBBF24" />
            <stop offset="50%" stopColor="#D97706" />
            <stop offset="85%" stopColor="#B45309" />
            <stop offset="100%" stopColor="#78350F" />
          </linearGradient>
          <filter id="gold-shimmer" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <g filter="url(#gold-shimmer)">
          {/* LEFT HALF OF THE SPARTAN HELMET */}
          <path 
            d="M 94,36 
               L 81,36 
               C 74,48 59,57 59,57
               L 59,96
               C 59,101 54,105 49,105
               L 49,112
               C 52,112 55,115 55,120
               L 55,145
               C 55,148 61,155 68,160
               L 81,126
               L 81,105
               L 94,92
               L 94,48
               Z" 
            fill="url(#invictus-gold-grad)" 
          />
          {/* Left Cheek accent / tooth */}
          <path
            d="M 49,118
               L 41,126
               L 49,134
               Z"
            fill="url(#invictus-gold-grad)"
          />
          {/* Left top crest step */}
          <path
            d="M 94,22
               L 81,32
               L 94,40
               Z"
            fill="url(#invictus-gold-grad)"
          />

          {/* RIGHT HALF OF THE SPARTAN HELMET */}
          <path 
            d="M 106,36 
               L 119,36 
               C 126,48 141,57 141,57
               L 141,96
               C 141,101 146,105 151,105
               L 151,112
               C 148,112 145,115 145,120
               L 145,145
               C 145,148 139,155 132,160
               L 119,126
               L 119,105
               L 106,92
               L 106,48
               Z" 
            fill="url(#invictus-gold-grad)" 
          />
          {/* Right Cheek accent / tooth */}
          <path
            d="M 151,118
               L 159,126
               L 151,134
               Z"
            fill="url(#invictus-gold-grad)"
          />
          {/* Right top crest step */}
          <path
            d="M 106,22
               L 119,32
               L 106,40
               Z"
            fill="url(#invictus-gold-grad)"
          />

          {/* Central Crest Cap (Split top) */}
          <path
            d="M 94,10 
               L 94,18
               L 88,18
               Z"
            fill="url(#invictus-gold-grad)"
          />
          <path
            d="M 106,10 
               L 106,18
               L 112,18
               Z"
            fill="url(#invictus-gold-grad)"
          />
        </g>
      </svg>
      {showText && (
        <span className={`font-accent tracking-[0.18em] text-[15px] xs:text-[18px] sm:text-[22px] font-black uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#FFE699] via-[#FBBF24] to-[#B45309] filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] select-none ${textColor}`}>
          INVICTUS PERFORMANCE
        </span>
      )}
    </div>
  );
}
