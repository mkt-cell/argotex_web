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

// Industries with a local final-product photo in /public/industries.
const INDUSTRY_PHOTO_SLUGS = ['pharma', 'biotech', 'medical-device', 'food', 'cosmetics'];

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

  const hasStaticPhoto = INDUSTRY_PHOTO_SLUGS.includes(slug);
  const cmsPhotoUrl = industry.photoUrl;

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

        {cmsPhotoUrl ? (
          <figure className="mb-10">
            <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden border border-slate-200">
              <Image
                src={cmsPhotoUrl}
                alt={industry.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </figure>
        ) : hasStaticPhoto && (
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
