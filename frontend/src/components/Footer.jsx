import React from "react";
import { Phone } from "lucide-react";
import BrandLogo from "./BrandLogo";

const Footer = () => (
  <footer className="border-t border-white/80 bg-white/45 px-5 py-7 text-[#29466f] shadow-[0_-12px_36px_-32px_#243b6366] backdrop-blur-2xl">
    <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-4 text-center">
      <BrandLogo className="h-12 w-auto max-w-[180px]" />
      <p className="max-w-3xl text-sm font-semibold leading-6 text-[#385779]">
        Б. Цэцэгжаргал, Б. Чимэддорж нар энэхүү вэбсайтыг Girls&lt;/&gt;BoysCode2026 хөтөлбөрт зориулан бүтээв.
      </p>
      <a href="tel:+97685757578" className="inline-flex items-center gap-2 rounded-full border border-[#c9d8ec] bg-white/75 px-4 py-2 text-sm font-bold text-[#315f9d] transition hover:bg-white">
        <Phone className="h-4 w-4" /> Холбоо барих: +976 85757578
      </a>
      <span className="text-xs text-[#526b8d]">© {new Date().getFullYear()} SkillSwap</span>
    </div>
  </footer>
);

export default Footer;

