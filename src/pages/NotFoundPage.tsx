import React from 'react';
import { Building2, Home, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F5F1E8] text-[#0B6B4E] flex items-center justify-center p-6 text-center">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-emerald-900/10 space-y-6">
        <div className="w-16 h-16 bg-[#0B6B4E] text-white rounded-full flex items-center justify-center mx-auto shadow">
          <Building2 className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <div className="font-heading font-extrabold text-5xl text-[#D64545]">404</div>
          <h2 className="font-heading font-bold text-xl text-[#0B6B4E]">Page Not Found</h2>
          <p className="text-xs text-emerald-900/80">
            The page or route you are looking for does not exist on Rafah-E-Aam Medical Center portal.
          </p>
        </div>

        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 bg-[#0B6B4E] hover:bg-[#08523c] text-white font-bold py-3 px-6 rounded-xl text-xs shadow transition-colors w-full"
        >
          <Home className="w-4 h-4" />
          <span>Return to Homepage</span>
        </Link>
      </div>
    </div>
  );
};
