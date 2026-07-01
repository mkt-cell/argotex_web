'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Globe, Menu, X } from 'lucide-react';

interface NavbarProps {
  dict: any;
}

export const Navbar: React.FC<NavbarProps> = ({ dict }) => {
  const params = useParams();
  const lang = (params?.lang as string) || 'th';
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: dict.navbar.home, href: `/${lang}` },
    { name: dict.navbar.solutions, href: `/${lang}#solutions` },
    { name: dict.navbar.lifecycle, href: `/${lang}#lifecycle` },
    { name: dict.navbar.downloads, href: `/${lang}#downloads` },
    { name: dict.navbar.contact, href: `/${lang}#contact` },
  ];

  const switchLanguage = () => {
    const nextLang = lang === 'th' ? 'en' : 'th';
    const newPath = pathname.replace(`/${lang}`, `/${nextLang}`);
    router.push(newPath);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top Banner */}
      <div className="bg-slate-800 text-white text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="font-medium text-center sm:text-left">{dict.topbar.text}</p>
          <span className="bg-slate-700 text-slate-300 px-2 py-0.5 rounded text-[10px] font-mono whitespace-nowrap">
            {dict.topbar.badge}
          </span>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link href={`/${lang}`} className="flex items-center">
            <Image
              src="/argotex.svg"
              alt="Argotex Logo"
              width={134}
              height={40}
              className="h-9 w-auto object-contain"
              priority
            />
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center space-x-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-slate-500 hover:text-medical-teal transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Action Controls */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Language Switcher */}
          <button
            onClick={switchLanguage}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-200 text-xs font-semibold text-slate-500 hover:bg-slate-50 cursor-pointer"
            aria-label="Switch Language"
          >
            <Globe className="h-3.5 w-3.5" />
            <span className="uppercase">{lang === 'th' ? 'EN' : 'TH'}</span>
          </button>

          {/* Primary CTA */}
          <Button variant="primary" onClick={() => router.push(`/${lang}#contact`)}>
            {dict.cta.consult}
          </Button>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          {/* Mobile Language Switcher */}
          <button
            onClick={switchLanguage}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-slate-200 text-xs font-semibold text-slate-500 hover:bg-slate-50 cursor-pointer"
          >
            <Globe className="h-3.5 w-3.5" />
            <span className="uppercase">{lang === 'th' ? 'EN' : 'TH'}</span>
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-slate-500 hover:text-slate-800 p-1.5 rounded-md border border-slate-200"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3">
          <div className="flex flex-col space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-slate-500 hover:text-medical-teal py-2 transition-colors border-b border-slate-100"
              >
                {item.name}
              </Link>
            ))}
          </div>
          <div className="pt-2">
            <Button variant="primary" className="w-full" onClick={() => {
              setMobileMenuOpen(false);
              router.push(`/${lang}#contact`);
            }}>
              {dict.cta.consult}
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};
