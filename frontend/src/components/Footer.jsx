import React from "react";
import BrandLogo from "./BrandLogo";

const Footer = () => {
  return (
    <footer className="border-t border-indigo-100/70 mt-auto bg-white/50 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <BrandLogo className="h-8 w-auto max-w-[112px] rounded-md bg-white px-1" />
          <span>© {new Date().getFullYear()}</span>
        </div>
        <span className="text-[10px] text-slate-400">Skill Swap платформ</span>
      </div>
    </footer>
  );
};

export default Footer;
