import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowRightLeft,
  Compass,
  Search,
  Sparkles,
  Bot,
  UserCheck,
  MessageSquare,
  Calendar,
  User as UserIcon,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { requestsAPI } from '../services/api';
import LanguageSwitcher from './LanguageSwitcher';

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
    { name: 'Нүүр', path: '/', icon: ArrowRightLeft },
    { name: 'Хүмүүс', path: '/explore', icon: Search },
    { name: 'Сонирхлоо тодорхойлох', path: '/assessment', icon: Compass },
    { name: 'Чадварын туслах', path: '/chatbot', icon: Bot, highlight: true },
    {
      name: 'Хүсэлтүүд',
      path: '/requests',
      icon: UserCheck,
      badge: pendingCount > 0 ? pendingCount : null,
    },
    { name: 'Зурвас', path: '/chat', icon: MessageSquare },
    { name: 'Хуваарь', path: '/sessions', icon: Calendar },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-40 mx-auto mt-4 w-[calc(100%-2rem)] max-w-[1740px] rounded-full border border-[#d1def0] bg-white/90 px-4 shadow-[0_8px_30px_-22px_#243b6355] backdrop-blur-xl sm:mt-5 sm:w-[calc(100%-4rem)] sm:px-6 lg:px-10">
      <div className="px-1">
        <div className="flex h-[76px] items-center justify-between sm:h-[96px]">
          
          {/* Logo */}
          <Link to="/" className="group flex shrink-0 items-center gap-3" aria-label="SkillSwap нүүр хуудас">
            <span className="grid h-11 w-11 place-items-center rounded-[15px] bg-[#a9c1e2] text-white shadow-md transition group-hover:scale-105 sm:h-[54px] sm:w-[54px]"><ArrowRightLeft className="h-6 w-6" /></span>
            <span className="text-xl font-black tracking-tight text-[#29466f] sm:text-2xl">Skill<span className="text-[#a8c0df]">Swap</span></span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-3.5 py-3 rounded-2xl text-sm font-semibold transition-all xl:px-4 ${
                    isActive
                      ? 'bg-[#e7eef8] text-[#29466f] font-bold shadow-sm'
                      : 'text-[#49688f] hover:text-[#29466f] hover:bg-[#f3f7fc]'
                  } ${link.highlight && !isActive ? 'text-violet-500' : ''}`}
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
          <div className="hidden lg:flex items-center gap-5">
            <LanguageSwitcher compact />
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-violet-50 border border-slate-200 transition-colors"
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
                  className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                  title="Гарах"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3 py-3 text-sm font-semibold text-[#49688f] transition-colors hover:text-[#29466f]"
                >
                  Нэвтрэх
                </Link>
                <Link
                  to="/register"
                  className="rounded-full bg-[#5277aa] px-6 py-3 text-sm font-extrabold text-white shadow-md transition hover:bg-[#456b9c]"
                >
                  Бүртгүүлэх
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <LanguageSwitcher compact />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-slate-600 hover:text-violet-600"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 border-b border-indigo-100 px-4 py-3 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold ${
                  isActive ? 'bg-violet-50 text-violet-600' : 'text-slate-600'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{link.name}</span>
                </div>
                {link.badge && (
                  <span className="px-1.5 py-0.2 bg-violet-600 text-white text-[10px] font-bold rounded-full">
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
                  className="text-xs font-semibold text-slate-700"
                >
                  Миний профайл
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="text-xs font-semibold text-red-500"
                >
                  Гарах
                </button>
              </div>
            ) : (
              <div className="flex gap-2 pt-1">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 py-1.5 text-center text-xs font-semibold text-slate-600 bg-slate-100 rounded-xl"
                >
                  Нэвтрэх
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 py-1.5 text-center text-xs font-bold bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white rounded-xl"
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

