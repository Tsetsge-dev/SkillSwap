import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowRightLeft,
  Search,
<<<<<<< HEAD
  Sparkles,
=======
  Compass,
>>>>>>> 2a62fa6b7a13aa05662930812d05cb32d53c64e0
  Bot,
  UserCheck,
  MessageSquare,
  Calendar,
<<<<<<< HEAD
  User as UserIcon,
=======
>>>>>>> 2a62fa6b7a13aa05662930812d05cb32d53c64e0
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { requestsAPI } from '../services/api';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    if (isAuthenticated) {
      requestsAPI
        .getIncoming()
        .then((res) => setPendingCount(res.data.length))
        .catch(() => {});
    }
  }, [isAuthenticated, location.pathname]);

  const navLinks = [
<<<<<<< HEAD
    { name: 'Хайх & Match', path: '/explore', icon: Search },
    { name: 'Чадварын зөвлөмж', path: '/recommendations', icon: Sparkles },
    { name: 'AI Туслах', path: '/chatbot', icon: Bot, highlight: true },
    {
      name: 'Хүсэлтүүд',
=======
    { name: 'Нүүр', path: '/', icon: ArrowRightLeft },
    { name: 'Хүмүүс', path: '/explore', icon: Search },
    { name: 'Сонирхлоо тодорхойлох', path: '/assessment', icon: Compass },
    { name: 'Чадварын туслах', path: '/chatbot', icon: Bot },
  ];

  const memberLinks = [
    {
      name: 'Хүсэлт',
>>>>>>> 2a62fa6b7a13aa05662930812d05cb32d53c64e0
      path: '/requests',
      icon: UserCheck,
      badge: pendingCount > 0 ? pendingCount : null,
    },
    { name: 'Зурвас', path: '/chat', icon: MessageSquare },
<<<<<<< HEAD
    { name: 'Хуваарь', path: '/sessions', icon: Calendar },
=======
    { name: 'Хичээлийн хуваарь', path: '/sessions', icon: Calendar },
>>>>>>> 2a62fa6b7a13aa05662930812d05cb32d53c64e0
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
<<<<<<< HEAD
    <nav className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-indigo-100/60 shadow-sm">
=======
    <nav aria-label="Үндсэн цэс" className="site-nav sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 shadow-sm shadow-slate-900/[0.03] backdrop-blur-xl">
>>>>>>> 2a62fa6b7a13aa05662930812d05cb32d53c64e0
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
<<<<<<< HEAD
          <Link to="/" className="flex items-center group">
            <img
              src="/logo.jpg"
              alt="SkillSwap"
              className="h-10 w-auto object-contain group-hover:scale-105 transition-transform"
            />
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
=======
          <Link to="/" className="flex items-center gap-2 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-indigo-400/30 bg-gradient-to-br from-indigo-600 to-blue-700 text-white shadow-md shadow-indigo-900/15 transition-transform group-hover:scale-105">
              <ArrowRightLeft className="w-4 h-4" />
            </div>
            <span className="text-base font-bold text-slate-800 tracking-tight">
              Skill<span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">Swap</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-1">
>>>>>>> 2a62fa6b7a13aa05662930812d05cb32d53c64e0
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
<<<<<<< HEAD
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-violet-600 text-white font-bold shadow-sm'
                      : 'text-slate-500 hover:text-violet-600 hover:bg-violet-50'
                  } ${link.highlight && !isActive ? 'text-violet-500' : ''}`}
=======
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
                    isActive
                      ? 'bg-indigo-700 text-white font-bold shadow-sm shadow-indigo-900/15'
                      : 'text-slate-600 hover:bg-indigo-50 hover:text-indigo-800'
                  }`}
>>>>>>> 2a62fa6b7a13aa05662930812d05cb32d53c64e0
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.name}</span>
                  {link.badge && (
                    <span className="px-1.5 py-0.2 bg-violet-600 text-white text-[10px] font-black rounded-full">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Section */}
<<<<<<< HEAD
          <div className="hidden md:flex items-center gap-2.5">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-violet-50 border border-slate-200 transition-colors"
=======
          <div className="hidden lg:flex items-center gap-2">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                {memberLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      aria-label={link.badge ? `${link.name}, ${link.badge} шинэ хүсэлт` : link.name}
                      title={link.name}
                      className={`relative grid h-9 w-9 place-items-center rounded-xl transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${location.pathname === link.path ? 'bg-indigo-50 text-indigo-800' : 'text-slate-500 hover:bg-slate-100 hover:text-indigo-700'}`}
                    >
                      <Icon className="h-4 w-4" aria-hidden="true" />
                      {link.badge && <span className="absolute -right-1 -top-1 min-w-4 rounded-full bg-indigo-700 px-1 text-center text-[9px] font-bold leading-4 text-white">{link.badge}</span>}
                    </Link>
                  );
                })}
                <Link
                  to="/profile"
                  className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 transition-colors hover:border-indigo-100 hover:bg-indigo-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
>>>>>>> 2a62fa6b7a13aa05662930812d05cb32d53c64e0
                >
                  <img
                    src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.full_name}`}
                    alt={user?.full_name}
                    className="w-6 h-6 rounded-lg object-cover"
                  />
                  <span className="text-xs font-semibold text-slate-700 truncate max-w-[100px]">
                    {user?.full_name?.split(' ')[0]}
                  </span>
                </Link>

                <button
                  onClick={handleLogout}
<<<<<<< HEAD
                  className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
=======
                  aria-label="Гарах"
                  className="cursor-pointer rounded-xl p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
>>>>>>> 2a62fa6b7a13aa05662930812d05cb32d53c64e0
                  title="Гарах"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
<<<<<<< HEAD
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-violet-600 transition-colors"
=======
                  className="rounded-lg px-3 py-2 text-xs font-semibold text-slate-600 transition-colors hover:text-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
>>>>>>> 2a62fa6b7a13aa05662930812d05cb32d53c64e0
                >
                  Нэвтрэх
                </Link>
                <Link
                  to="/register"
<<<<<<< HEAD
                  className="px-3.5 py-1.5 text-xs font-bold bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white rounded-xl transition-all shadow-md"
=======
                  className="rounded-xl bg-gradient-to-r from-indigo-700 to-blue-700 px-3.5 py-2 text-xs font-bold text-white shadow-md shadow-indigo-900/10 transition-all hover:-translate-y-0.5 hover:from-indigo-800 hover:to-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700"
>>>>>>> 2a62fa6b7a13aa05662930812d05cb32d53c64e0
                >
                  Бүртгүүлэх
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
<<<<<<< HEAD
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-slate-600 hover:text-violet-600"
=======
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              aria-label={mobileMenuOpen ? 'Цэс хаах' : 'Цэс нээх'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
              className="rounded-xl p-2 text-slate-600 transition hover:bg-indigo-50 hover:text-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
>>>>>>> 2a62fa6b7a13aa05662930812d05cb32d53c64e0
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
<<<<<<< HEAD
        <div className="md:hidden bg-white/95 border-b border-indigo-100 px-4 py-3 space-y-1">
          {navLinks.map((link) => {
=======
        <div id="mobile-navigation" className="lg:hidden space-y-1 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur-xl">
          {[...navLinks, ...(isAuthenticated ? memberLinks : [])].map((link) => {
>>>>>>> 2a62fa6b7a13aa05662930812d05cb32d53c64e0
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
<<<<<<< HEAD
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold ${
                  isActive ? 'bg-violet-50 text-violet-600' : 'text-slate-600'
=======
                aria-current={isActive ? 'page' : undefined}
                className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
                  isActive ? 'bg-indigo-50 text-indigo-800' : 'text-slate-600 hover:bg-slate-50'
>>>>>>> 2a62fa6b7a13aa05662930812d05cb32d53c64e0
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{link.name}</span>
                </div>
                {link.badge && (
<<<<<<< HEAD
                  <span className="px-1.5 py-0.2 bg-violet-600 text-white text-[10px] font-bold rounded-full">
=======
                  <span className="rounded-full bg-indigo-700 px-1.5 py-0.5 text-[10px] font-bold text-white">
>>>>>>> 2a62fa6b7a13aa05662930812d05cb32d53c64e0
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}

          <div className="pt-2 border-t border-slate-200">
            {isAuthenticated ? (
              <div className="flex items-center justify-between pt-1">
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
<<<<<<< HEAD
                  className="text-xs font-semibold text-slate-700"
=======
                  className="rounded-lg px-2 py-1 text-xs font-semibold text-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
>>>>>>> 2a62fa6b7a13aa05662930812d05cb32d53c64e0
                >
                  Миний профайл
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
<<<<<<< HEAD
                  className="text-xs font-semibold text-red-500"
=======
                  className="rounded-lg px-2 py-1 text-xs font-semibold text-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
>>>>>>> 2a62fa6b7a13aa05662930812d05cb32d53c64e0
                >
                  Гарах
                </button>
              </div>
            ) : (
              <div className="flex gap-2 pt-1">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
<<<<<<< HEAD
                  className="flex-1 py-1.5 text-center text-xs font-semibold text-slate-600 bg-slate-100 rounded-xl"
=======
                  className="flex-1 rounded-xl bg-slate-100 py-2.5 text-center text-xs font-semibold text-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
>>>>>>> 2a62fa6b7a13aa05662930812d05cb32d53c64e0
                >
                  Нэвтрэх
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
<<<<<<< HEAD
                  className="flex-1 py-1.5 text-center text-xs font-bold bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white rounded-xl"
=======
                  className="flex-1 rounded-xl bg-gradient-to-r from-indigo-700 to-blue-700 py-2.5 text-center text-xs font-bold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700"
>>>>>>> 2a62fa6b7a13aa05662930812d05cb32d53c64e0
                >
                  Бүртгүүлэх
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
