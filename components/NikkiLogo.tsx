import React from 'react';

export const NikkiLogo: React.FC<{ size?: 'sm' | 'lg' }> = ({ size = 'lg' }) => {
  const fontSize = size === 'lg' ? 'text-8xl' : 'text-3xl';
  const tracking = size === 'lg' ? 'tracking-tighter' : 'tracking-tight';

  return (
    <div className={`font-display font-black ${fontSize} ${tracking} select-none flex items-center`}>
      <span className="text-white">NI</span>
      <span className="text-nikki-accent">KK</span>
      <span className="text-white">I</span>
    </div>
  );
};
