import React from 'react';
import logo from '../assets/mw-logo.png';

interface LogoProps {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className = "h-auto w-full" }) => {
  return (
    <img 
      src={logo}
      alt="MW Servicio Comercial"
      className={className}
    />
  );
};

export default Logo;
