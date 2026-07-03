import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { getDictionary, Locale } from '@/lib/dictionaries';
import { getIndustryBySlug } from '@/lib/api';

interface PageProps {
  params: Promise<{ lang: string; slug: string }>;
}

// Final-product photos for each industry, sourced from Wikimedia Commons under
// CC BY / CC BY-SA licenses. Attribution is required by those licenses.
const INDUSTRY_PHOTOS: Record<string, { credit: string; sourceUrl: string }> = {
  pharma: {
    credit: 'Photo: Tomino de WS / Wikimedia Commons, CC BY-SA 4.0 (cropped)',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Meloxicam_15_mg_tbl.jpg'
  },
  biotech: {
    credit: 'Photo: Hamed Jafarnejad / Wikimedia Commons, CC BY 4.0',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:COVIran_Barekat_vaccine_production_01.jpg'
  },
  'medical-device': {
    credit: 'Photo: FNDE / Wikimedia Commons, CC BY-SA 4.0',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Einwegspritze-2.jpg'
  },
  food: {
    credit: 'Photo: Jernej Furman / Wikimedia Commons, CC BY 2.0',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Omega_3_capsules_in_white_bottle_(52715127894).jpg'
  },
  cosmetics: {
    credit: 'Photo: Benff / Wikimedia Commons, CC BY-SA 4.0',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Day_cream_02.jpg'
  }
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  const industry = await getIndustryBySlug(lang as 'th' | 'en', slug);

  if (!industry) return {};

  return {
    title: `${industry.title} | Argotex Co., Ltd.`,
    description: industry.metaDescription
  };
}

export default async function IndustryDetailPage({ params }: PageProps) {
  const { lang, slug } = await params;
  const dict = await getDictionary(lang as Locale);
  const industry = await getIndustryBySlug(lang as 'th' | 'en', slug);

  if (!industry) notFound();

  const photo = INDUSTRY_PHOTOS[slug];

  return (
    <article className="py-16 lg:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href={`/${lang}#solutions`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-medical-teal hover:gap-2.5 transition-all mb-8"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {dict.navbar.home}
        </Link>

        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-800 mb-4">
          {industry.title}
        </h1>

        <p className="text-base sm:text-lg text-slate-500 leading-relaxed mb-8">
          {industry.description}
        </p>

        {photo && (
          <figure className="mb-10">
            <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden border border-slate-200">
              <Image
                src={`/industries/${slug}.jpg`}
                alt={industry.title}
                fill
                className="object-cover"
                priority
              />
            </div>
            <figcaption className="mt-2 text-[11px] text-slate-400">
              <a href={photo.sourceUrl} target="_blank" rel="noopener noreferrer" className="hover:text-medical-teal transition-colors">
                {photo.credit}
              </a>
            </figcaption>
          </figure>
        )}

        <div className="cms-article" dangerouslySetInnerHTML={{ __html: industry.articleBody }} />

        <div className="mt-14 pt-8 border-t border-slate-200">
          <Link href={`/${lang}#contact`}>
            <button className="bg-medical-teal text-white px-6 py-3 rounded-md font-medium text-sm hover:bg-medical-teal/90 transition-all cursor-pointer">
              {dict.cta.consult}
            </button>
          </Link>
        </div>
      </div>
    </article>
  );
}
