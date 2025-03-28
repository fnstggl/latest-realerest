
import React from 'react';

const FlatIllustration: React.FC = () => {
  return (
    <div className="w-full max-w-md mx-auto">
      <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* House */}
        <path d="M150 220H270V110L210 70L150 110V220Z" fill="#FFDEE2" stroke="#0A2342" strokeWidth="3" />
        
        {/* Roof */}
        <path d="M140 110L210 60L280 110" stroke="#0A2342" strokeWidth="3" strokeLinecap="round" />
        <path d="M150 110L210 70L270 110" fill="#F9A826" stroke="#0A2342" strokeWidth="3" />
        
        {/* Door */}
        <rect x="195" y="180" width="30" height="40" fill="#D3E4FD" stroke="#0A2342" strokeWidth="2" />
        <circle cx="205" cy="200" r="2" fill="#0A2342" />
        
        {/* Windows */}
        <rect x="170" y="130" width="20" height="20" fill="#D3E4FD" stroke="#0A2342" strokeWidth="2" />
        <rect x="230" y="130" width="20" height="20" fill="#D3E4FD" stroke="#0A2342" strokeWidth="2" />
        
        {/* Ground */}
        <line x1="120" y1="220" x2="300" y2="220" stroke="#0A2342" strokeWidth="2" />
        
        {/* Person */}
        <circle cx="110" cy="190" r="15" fill="#F9A826" stroke="#0A2342" strokeWidth="2" />
        <line x1="110" y1="205" x2="110" y2="230" stroke="#0A2342" strokeWidth="2" />
        <line x1="110" y1="215" x2="95" y2="225" stroke="#0A2342" strokeWidth="2" />
        <line x1="110" y1="215" x2="125" y2="225" stroke="#0A2342" strokeWidth="2" />
        <line x1="110" y1="230" x2="100" y2="250" stroke="#0A2342" strokeWidth="2" />
        <line x1="110" y1="230" x2="120" y2="250" stroke="#0A2342" strokeWidth="2" />
        
        {/* Plants */}
        <path d="M300 220C300 210 305 200 315 195C325 190 330 200 330 210" stroke="#0A2342" strokeWidth="2" />
        <path d="M330 220C330 210 335 195 345 195C355 195 360 210 360 220" stroke="#0A2342" strokeWidth="2" />
        <path d="M315 195C315 185 320 175 330 170C340 165 350 175 350 185" stroke="#0A2342" strokeWidth="2" />
        <rect x="329" y="220" width="5" height="30" fill="#0A2342" />
        <path d="M300 220C300 210 305 200 315 195C325 190 330 200 330 210" fill="#F2FCE2" />
        <path d="M330 220C330 210 335 195 345 195C355 195 360 210 360 220" fill="#F2FCE2" />
        <path d="M315 195C315 185 320 175 330 170C340 165 350 175 350 185" fill="#F2FCE2" />
        
        {/* Hand pointing */}
        <path d="M60 180C60 180 65 170 75 180C85 190 90 190 95 180" stroke="#0A2342" strokeWidth="2" fill="#FFDEE2" />
        <line x1="75" y1="180" x2="65" y2="160" stroke="#0A2342" strokeWidth="2" />
      </svg>
    </div>
  );
};

export default FlatIllustration;
