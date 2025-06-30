import React from 'react';

interface SiriLogoProps {
  className?: string;
  color?: string;
}

const SiriLogo: React.FC<SiriLogoProps> = ({
  className = "h-12 w-12",
  color = "currentColor"
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      className={`transition-all duration-300 ${className}`}
      role="img"
      aria-label="Aqar Zone Logo"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="transition-all duration-300"
      />
      <path
        d="M3 7.59199C9 9.31999 10.5 5 19 5"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="transition-all duration-300"
      />
      <path
        d="M2 12C11 12 13 5.49859 18 5"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="transition-all duration-300"
      />
      <path
        d="M18 19.88C12.7189 21.1446 6.44444 12 2 12"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="transition-all duration-300"
      />
      <path
        d="M4 18C10.5 18 14.6857 10 21 10"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="transition-all duration-300"
      />
    </svg>
  );
};

export default SiriLogo;
