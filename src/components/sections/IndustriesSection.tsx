import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Factory, Dna, Stethoscope, ShieldAlert, Sparkles } from 'lucide-react';

// Icon mapper for industries
const getIcon = (id: string) => {
  switch (id) {
    case 'pharma': return <Factory className="w-8 h-8 text-medical-teal" />;
    case 'biotech': return <Dna className="w-8 h-8 text-medical-teal" />;
    case 'medical-device': return <Stethoscope className="w-8 h-8 text-medical-teal" />;
    case 'food': return <ShieldAlert className="w-8 h-8 text-medical-teal" />;
    case 'cosmetics': return <Sparkles className="w-8 h-8 text-medical-teal" />;
    default: return <Factory className="w-8 h-8 text-medical-teal" />;
  }
};

interface IndustryItem {
  id: string;
  title: string;
  desc: string;
}

interface IndustriesSectionProps {
  lang: 'th' | 'en';
  dict: {
    title: string;
    subtitle: string;
    items: IndustryItem[];
  };
}

export const IndustriesSection: React.FC<IndustriesSectionProps> = ({ lang, dict }) => {
  return (
    <section className="py-20 bg-slate-100 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header of Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-slate-800">
            {dict.title}
          </h2>
          <p className="text-slate-500 text-base md:text-lg leading-relaxed">
            {dict.subtitle}
          </p>
        </div>

        {/* Grid of Clickable Industries */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {dict.items.map((item) => (
            <Link 
              key={item.id} 
              href={`/${lang}/industries/${item.id}`}
              className="group block no-underline focus:outline-none"
            >
              <Card className="h-full p-8 transition-all duration-300 border border-slate-200 bg-white hover:border-medical-teal hover:shadow-md group-hover:-translate-y-1">
                <div className="flex flex-col h-full justify-between">
                  <div>
                    {/* Icon Area */}
                    <div className="mb-6 p-3 bg-slate-50 rounded-lg inline-block w-fit group-hover:bg-medical-teal/10 transition-colors duration-300">
                      {getIcon(item.id)}
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-xl font-heading font-bold text-slate-800 mb-3 group-hover:text-medical-teal transition-colors duration-200">
                      {item.title}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-slate-500 text-sm leading-relaxed mb-6">
                      {item.desc}
                    </p>
                  </div>

                  {/* Action Link text */}
                  <div className="text-medical-teal font-semibold text-sm inline-flex items-center gap-1 group-hover:gap-2 transition-all duration-200">
                    {lang === 'th' ? 'ดูรายละเอียดระบบการผลิต' : 'Explore Solutions'} &rarr;
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
