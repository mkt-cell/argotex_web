import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Mail, MapPin, Phone } from 'lucide-react';

interface FooterProps {
  dict: any;
  lang: string;
}

export const Footer: React.FC<FooterProps> = ({ dict, lang }) => {
  return (
    <footer className="bg-slate-800 text-slate-300 font-sans">
      {/* Banner CTA */}
      <div className="bg-gradient-to-r from-medical-teal to-slate-900 text-white py-10 px-4 sm:px-6 lg:px-8 border-b border-slate-700">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-2 max-w-2xl text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-heading">{dict.footer.banner_title}</h3>
            <p className="text-sm text-slate-200">{dict.footer.banner_desc}</p>
          </div>
          <Link href={`/${lang}#contact`}>
            <button className="px-5 py-2.5 rounded-md font-semibold text-sm transition-all duration-200 bg-white text-medical-teal hover:bg-slate-100 shadow-lg cursor-pointer">
              {dict.footer.banner_button}
            </button>
          </Link>
        </div>
      </div>

      {/* Main Footer Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand & Compliance */}
        <div className="space-y-4 md:col-span-1">
          <h4 className="text-lg font-bold text-white tracking-tight font-heading">Argotex Co., Ltd.</h4>
          <p className="text-xs leading-relaxed text-slate-400">
            {dict.footer.company_desc}
          </p>
          <div className="pt-2">
            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-2">Compliance & Standards</p>
            <div className="flex flex-wrap gap-1.5">
              {dict.footer.compliance.map((std: { slug: string; label: string }) => (
                <Link
                  key={std.slug}
                  href={`/${lang}/standards/${std.slug}`}
                  className="bg-slate-700 text-slate-300 text-[9px] font-semibold px-2 py-0.5 rounded border border-slate-600 hover:border-medical-teal hover:text-medical-teal transition-colors"
                >
                  {std.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Columns: Industries */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider font-heading">{dict.footer.title_industries}</h4>
          <ul className="space-y-2 text-xs text-slate-400">
            {dict.footer.industries.map((ind: { slug: string; label: string }) => (
              <li key={ind.slug}>
                <Link href={`/${lang}/industries/${ind.slug}`} className="hover:text-medical-teal transition-colors">
                  {ind.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Columns: Solutions */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider font-heading">{dict.footer.title_solutions}</h4>
          <ul className="space-y-2 text-xs text-slate-400">
            {dict.footer.solutions.map((sol: string) => (
              <li key={sol}>
                <Link href={`/${lang}#solutions`} className="hover:text-medical-teal transition-colors">
                  {sol}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column: Contact info */}
        <div className="space-y-4 text-xs text-slate-400">
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider font-heading">{dict.navbar.contact}</h4>
          <div className="space-y-3">
            <div className="flex gap-2">
              <MapPin className="h-4 w-4 text-medical-teal flex-shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                18/14 Soi Nawamin 111 Yaek 4, Nawamin, Bueng Kum, Bangkok 10230, Thailand
              </p>
            </div>
            <div className="flex gap-2 items-center">
              <Phone className="h-4 w-4 text-medical-teal flex-shrink-0" />
              <div>
                <p>+66 (0) 91 745 8863</p>
                <p>+66 (0) 63 639 9009</p>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <Mail className="h-4 w-4 text-medical-teal flex-shrink-0" />
              <a href="mailto:wasachon@axentragroup.net" className="hover:text-medical-teal transition-colors">
                wasachon@axentragroup.net
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-700 bg-slate-900 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>{dict.footer.copyright}</p>
          <div className="flex gap-4">
            {dict.footer.links.map((link: { slug: string; label: string }) => (
              <Link key={link.slug} href={`/${lang}/${link.slug}`} className="hover:text-slate-300 transition-colors">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
