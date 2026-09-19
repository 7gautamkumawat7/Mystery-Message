import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-slate-950 border-t border-slate-900 py-6 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
        <p className="text-slate-500 text-xs sm:text-sm">
          © {new Date().getFullYear()} Mystery Message. All rights reserved.
        </p>

        
      
      </div>
    </footer>
  );
};

export default Footer;