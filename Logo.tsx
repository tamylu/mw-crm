import React from 'react';

interface LogoProps {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className = "h-auto w-full" }) => {
  return (
    <svg 
      viewBox="0 0 300 120" 
      className={className} 
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="MW Servicio Comercial Logo"
    >
      <title>MW Servicio Comercial</title>
      {/* M Shape */}
      <path 
        d="M60 25 L85 25 L105 85 L125 25 L150 25 L150 95 L130 95 L130 50 L110 95 L100 95 L80 50 L80 95 L60 95 Z" 
        fill="#65a30d" 
      />
      {/* W Shape */}
      <path 
        d="M165 25 L190 25 L195 75 L215 25 L235 25 L240 75 L245 25 L270 25 L260 95 L230 95 L225 55 L220 95 L190 95 L180 95 L175 95 L155 25 Z" 
        fill="#65a30d" 
      />
      
      {/* Subtitle */}
      <text 
        x="165" 
        y="115" 
        textAnchor="middle" 
        fontFamily="sans-serif" 
        fontSize="16" 
        fontWeight="800" 
        letterSpacing="4" 
        fill="#020617"
      >
        SERVICIO COMERCIAL
      </text>
    </svg>
  );
};

export default Logo;