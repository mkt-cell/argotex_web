import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { getDictionary, Locale } from '@/lib/dictionaries';
import { getStandardBySlug } from '@/lib/api';

interface PageProps {
  params: Promise<{ lang: string; slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  const standard = await getStandardBySlug(lang as 'th' | 'en', slug);

  if (!standard) return {};

  return {
    title: `${standard.title} | Argotex Co., Ltd.`,
    description: standard.metaDescription
  };
}

export default async function StandardDetailPage({ params }: PageProps) {
  const { lang, slug } = await params;
  const dict = await getDictionary(lang as Locale);
  const standard = await getStandardBySlug(lang as 'th' | 'en', slug);

  if (!standard) notFound();

  return (
    <article className="py-16 lg:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href={`/${lang}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-medical-teal hover:gap-2.5 transition-all mb-8"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {dict.navbar.home}
        </Link>

        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-800 mb-8">
          {standard.title}
        </h1>

        <div className="cms-article" dangerouslySetInnerHTML={{ __html: standard.articleBody }} />

        {standard.sourceUrl && (
          <div className="mt-8 pt-6 border-t border-slate-200">
            <a
              href={standard.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-medical-teal transition-colors"
            >
              <ExternalLink className="h-3 w-3" />
              {dict.standards.source_label}: {standard.sourceName}
            </a>
          </div>
        )}

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
