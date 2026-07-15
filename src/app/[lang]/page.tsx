import React from 'react';
import { getDictionary, Locale } from '@/lib/dictionaries';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ContactForm } from '@/components/home/ContactForm';
import { CatalogDownloadModal } from '@/components/home/CatalogDownloadModal';
import { IndustriesSection } from '@/components/sections/IndustriesSection';
import { Hero } from '@/components/sections/Hero';
import { getDynamicIndustries, getDynamicSolutions } from '@/lib/api';
import {
  Award,
  CheckCircle2,
  Clock,
  Cpu,
  FileDown,
  FileText,
  ShieldCheck,
  Users,
  ArrowRight,
  Check,
  Syringe,
  PillBottle,
  Container,
  BottleWine
} from 'lucide-react';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ lang: string }>;
}

// Maps the static copy's solution ids to the slugs configured in Directus
const SOLUTION_SLUGS: Record<string, string> = {
  sterile: 'sterile-production',
  solid: 'solid-dosage',
  semisolid: 'semi-solid-dosage',
  liquid: 'liquid-dosage'
};

interface SolutionCopy {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  desc: string;
  specs: string;
  features: string[];
  products: string[];
}

export default async function Page({ params }: PageProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);
  const [cmsIndustries, cmsSolutions] = await Promise.all([
    getDynamicIndustries(lang as 'th' | 'en'),
    getDynamicSolutions(lang as 'th' | 'en')
  ]);
  const industriesDict = {
    ...dict.industries,
    items: cmsIndustries.length > 0 ? cmsIndustries : dict.industries.items
  };

  // Static copy carries rich fields (badge/specs/features/products) the CMS
  // doesn't model yet — overlay CMS title/subtitle/desc onto it by slug so
  // published edits in Directus show up without losing that structured layout.
  const solutionsDict = {
    ...dict.solutions,
    items: (dict.solutions.items as SolutionCopy[]).map((item) => {
      const cmsItem = cmsSolutions.find((s) => s.slug === SOLUTION_SLUGS[item.id]);
      if (!cmsItem) return item;
      return {
        ...item,
        title: cmsItem.title || item.title,
        subtitle: cmsItem.subtitle || item.subtitle,
        desc: cmsItem.content || item.desc
      };
    })
  };

  // Icon mapping for Trust Metrics
  const trustIcons = [
    <Users key="users" className="h-6 w-6 text-medical-teal" />,
    <CheckCircle2 key="check" className="h-6 w-6 text-medical-teal" />,
    <Cpu key="cpu" className="h-6 w-6 text-medical-teal" />
  ];

  // Icon mapping for Solutions
  const solutionIcons = {
    sterile: <Syringe className="h-8 w-8 text-medical-teal" />,
    solid: <PillBottle className="h-8 w-8 text-medical-teal" />,
    semisolid: <Container className="h-8 w-8 text-medical-teal" />,
    liquid: <BottleWine className="h-8 w-8 text-medical-teal" />
  };

  // Small icon set for the quick-glance capabilities strip below the Hero
  const quickSolutionIcons: Record<string, React.ReactNode> = {
    sterile: <Syringe className="h-5 w-5 text-medical-teal" />,
    solid: <PillBottle className="h-5 w-5 text-medical-teal" />,
    semisolid: <Container className="h-5 w-5 text-medical-teal" />,
    liquid: <BottleWine className="h-5 w-5 text-medical-teal" />
  };

  return (
    <div className="font-sans antialiased text-slate-800 bg-slate-50">
      {/* 1. Hero Section */}
      <Hero dict={dict} lang={lang} />

      {/* 1b. Quick-glance capabilities strip — signals all 4 solution formats above the fold */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6">
            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 whitespace-nowrap">
              {dict.hero.capabilities_label}
            </p>
            <div className="flex flex-wrap justify-center sm:justify-start gap-2 sm:gap-3 w-full">
              {solutionsDict.items.map((item: SolutionCopy) => (
                <Link
                  key={item.id}
                  href={`/${lang}#solutions`}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 hover:border-medical-teal hover:bg-medical-teal/5 transition-colors"
                >
                  {quickSolutionIcons[item.id]}
                  <span className="text-xs font-semibold text-slate-600 whitespace-nowrap">{item.subtitle}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Trust Metrics Section */}
      <section className="bg-white py-12 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { val: dict.trust.exp_value, lbl: dict.trust.exp_label },
              { val: dict.trust.val_value, lbl: dict.trust.val_label },
              { val: dict.trust.compliance_value, lbl: dict.trust.compliance_label }
            ].map((metric, i) => (
              <div key={metric.val} className="flex gap-4 p-4 items-start">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex-shrink-0">
                  {trustIcons[i]}
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl font-bold text-slate-800 font-heading tracking-tight">{metric.val}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-sans">{metric.lbl}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Target Industries Section */}
      <IndustriesSection lang={lang as 'th' | 'en'} dict={industriesDict} />

      {/* 3. Production Solutions Section */}
      <section id="solutions" className="py-20 lg:py-24 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header */}
          <div className="max-w-3xl space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-800 font-heading">
              {solutionsDict.title}
            </h2>
            <p className="text-sm sm:text-base text-slate-500 max-w-2xl leading-relaxed font-sans">
              {solutionsDict.desc}
            </p>
          </div>

          {/* Solutions Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {solutionsDict.items.map((item: any) => (
              <Card key={item.id} className="flex flex-col justify-between gap-6 p-8 relative overflow-hidden group">
                <div className="space-y-6">
                  {/* Top Header */}
                  <div className="flex justify-between items-start">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 group-hover:bg-medical-teal/5 transition-colors">
                      {solutionIcons[item.id as keyof typeof solutionIcons]}
                    </div>
                    <Badge className="border-validation-green/30 bg-validation-green/5 text-[9px]">
                      {item.badge}
                    </Badge>
                  </div>

                  {/* Copy */}
                  <div className="space-y-2">
                    <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-800 group-hover:text-medical-teal transition-colors font-heading">
                      {item.title}
                    </h3>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-sans">
                      {item.subtitle}
                    </p>
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed pt-2 font-sans">
                      {item.desc}
                    </p>
                  </div>

                  {/* Specs & Features */}
                  <div className="border-t border-slate-100 pt-4 space-y-3 font-sans">
                    <div className="text-xs font-semibold text-slate-800">
                      Technical Spec Summary:
                      <span className="block font-normal text-slate-500 mt-1">{item.specs}</span>
                    </div>
                    <div className="space-y-1.5">
                      <span className="block text-xs font-semibold text-slate-800">Key Features:</span>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5">
                        {item.features.map((feat: string) => (
                          <li key={feat} className="text-xs text-slate-500 flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-medical-teal flex-shrink-0" />
                            {feat}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Products Tag list */}
                <div className="border-t border-slate-100 pt-4 flex flex-wrap gap-2 items-center font-sans">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Typical Outputs:</span>
                  {item.products.map((prod: string) => (
                    <span key={prod} className="bg-slate-50 text-slate-600 border border-slate-200 rounded px-2 py-0.5 text-xs font-medium">
                      {prod}
                    </span>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Project Lifecycle Section */}
      <section id="lifecycle" className="py-20 lg:py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Header */}
          <div className="max-w-3xl space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-800 font-heading">
              {dict.lifecycle.title}
            </h2>
            <p className="text-sm sm:text-base text-slate-500 max-w-2xl leading-relaxed font-sans">
              {dict.lifecycle.desc}
            </p>
          </div>

          {/* Steps Vertical Timeline */}
          <div className="relative border-l border-slate-200 ml-4 md:ml-6 space-y-12">
            {dict.lifecycle.steps.map((step: any) => (
              <div key={step.num} className="relative pl-8 sm:pl-12 group">
                {/* Timeline Bullet */}
                <span className="absolute -left-[17px] top-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 border-2 border-slate-200 text-xs font-bold text-slate-400 group-hover:bg-medical-teal group-hover:border-medical-teal group-hover:text-white transition-all duration-300">
                  {step.num}
                </span>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-12">
                  {/* Info Column */}
                  <div className="lg:col-span-2 space-y-3">
                    <div className="space-y-1">
                      <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-medical-teal font-sans">
                        {step.std}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-800 group-hover:text-medical-teal transition-colors font-heading">
                        {step.title}
                      </h3>
                      <p className="text-xs text-slate-400 font-semibold font-sans">{step.subtitle}</p>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-sans pt-1">
                      {step.desc}
                    </p>
                  </div>

                  {/* Deliverables Column */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/50 flex flex-col justify-center gap-2.5 font-sans">
                    <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Deliverables / ผลส่งมอบ:</p>
                    <ul className="space-y-1.5">
                      {step.deliverables.map((deliv: string) => (
                        <li key={deliv} className="text-xs text-slate-600 flex items-start gap-2">
                          <CheckCircle2 className="h-3.5 w-3.5 text-validation-green mt-0.5 flex-shrink-0" />
                          <span className="leading-snug">{deliv}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Why Argotex Section */}
      <section className="py-20 lg:py-24 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header */}
          <div className="max-w-3xl space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-800 font-heading">
              {dict.why.title}
            </h2>
            <p className="text-sm sm:text-base text-slate-500 max-w-2xl leading-relaxed font-sans">
              {dict.why.desc}
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {dict.why.items.map((item: any, idx: number) => {
              const icons = [
                <Award key="aw" className="h-6 w-6 text-medical-teal" />,
                <ShieldCheck key="sc" className="h-6 w-6 text-medical-teal" />,
                <Clock key="cl" className="h-6 w-6 text-medical-teal" />
              ];
              return (
                <Card key={item.title} className="flex flex-col gap-4 p-6 hover:border-medical-teal/30">
                  <div className="p-2.5 bg-slate-50 rounded-lg w-fit border border-slate-100">
                    {icons[idx]}
                  </div>
                  <h3 className="text-base sm:text-lg font-bold tracking-tight text-slate-800 font-heading">{item.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-sans">{item.desc}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. Downloads Section */}
      <section id="downloads" className="py-20 lg:py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header */}
          <div className="max-w-3xl space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-800 font-heading">
              {dict.downloads.title}
            </h2>
            <p className="text-sm sm:text-base text-slate-500 max-w-2xl leading-relaxed font-sans">
              {dict.downloads.desc}
            </p>
          </div>

          {/* Resource Card */}
          <div className="max-w-4xl bg-slate-50 rounded-2xl border border-slate-200 p-8 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex gap-4 items-start max-w-xl">
              <div className="p-4 bg-medical-teal/10 rounded-xl text-medical-teal flex-shrink-0">
                <FileDown className="h-8 w-8" />
              </div>
              <div className="space-y-2">
                <Badge className="border-validation-green/30 bg-validation-green/5 text-[9px] mb-1">
                  PDF Asset Gated
                </Badge>
                <h3 className="text-lg sm:text-xl font-bold tracking-tight text-slate-800 font-heading">
                  {dict.downloads.doc_title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed font-sans">
                  {dict.downloads.doc_desc}
                </p>
              </div>
            </div>
            
            <CatalogDownloadModal dict={dict} />
          </div>
        </div>
      </section>

      {/* 7. Lead Gateway Section (Contact Form) */}
      <section id="contact" className="py-20 lg:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Info Column */}
            <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28 font-sans">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-800 leading-tight font-heading">
                {dict.contact.title}
              </h2>
              <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
                {dict.contact.desc}
              </p>
              
            </div>

            {/* Form Column */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-10 rounded-2xl border border-slate-200 shadow-sm">
              <ContactForm dict={dict} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
