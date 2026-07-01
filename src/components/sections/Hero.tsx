import React from 'react';
import Link from 'next/link';
import { HeroAnimation } from '@/components/home/HeroAnimation';

interface HeroProps {
  dict: any;
  lang: string;
}

export const Hero: React.FC<HeroProps> = ({ dict, lang }) => {
  const badge1 = dict.hero.badge.split(' · ')[0] || '';
  const badge2 = dict.hero.badge.split(' · ')[1] || '';

  return (
    <section className="relative min-h-[calc(100vh-76px)] flex items-center bg-white py-12 lg:py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative">
        {/* Grid 10 columns: Left 3 (30%) | Right 7 (70%) */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 lg:gap-12 items-center">
          
          {/* CONTENT SIDE (30%) */}
          <div className="lg:col-span-3 flex flex-col justify-center z-10 order-2 lg:order-1">
            {/* Badges */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              <span className="bg-slate-100 text-slate-800 text-[11px] px-2 py-0.5 rounded font-medium">
                {badge1}
              </span>
              <span className="bg-validation-green/10 text-validation-green text-[11px] px-2 py-0.5 rounded font-medium">
                {badge2}
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-slate-800 leading-tight tracking-tight mb-4">
              {dict.hero.title}
            </h1>

            {/* Description */}
            <p className="text-slate-500 text-xs md:text-sm leading-relaxed mb-6 max-w-prose">
              {dict.hero.desc}
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-2.5">
              <Link href={`/${lang}#contact`} className="w-full sm:w-auto lg:w-full xl:w-auto">
                <button className="w-full bg-medical-teal text-white px-4 py-2.5 rounded-md font-medium text-xs hover:bg-medical-teal/90 transition-all text-center cursor-pointer shadow-xs">
                  {dict.cta.consult}
                </button>
              </Link>
              <Link href={`/${lang}#downloads`} className="w-full sm:w-auto lg:w-full xl:w-auto">
                <button className="w-full border border-slate-200 text-slate-800 px-4 py-2.5 rounded-md font-medium text-xs hover:bg-slate-50 transition-all text-center cursor-pointer">
                  {dict.cta.catalog}
                </button>
              </Link>
            </div>
            
            {/* Credit */}
            <p className="text-[11px] text-slate-400 mt-4 border-l-2 border-slate-200 pl-2">
              {dict.hero.credit}
            </p>
          </div>

          {/* VISUAL HERO SIDE (70%) */}
          <div className="lg:col-span-7 w-full order-1 lg:order-2">
            <HeroAnimation />
          </div>

        </div>
      </div>
    </section>
  );
};
