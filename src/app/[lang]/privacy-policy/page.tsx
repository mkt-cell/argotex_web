import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getDictionary, Locale } from '@/lib/dictionaries';

interface PageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  return {
    title: `${dict.legal.privacy.title} | Argotex Co., Ltd.`,
    description: dict.legal.privacy.meta_description
  };
}

export default async function PrivacyPolicyPage({ params }: PageProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

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

        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-800 mb-2">
          {dict.legal.privacy.title}
        </h1>
        <p className="text-xs text-slate-400 mb-8">
          {dict.legal.updated_label}: {dict.legal.updated_date}
        </p>

        <div className="cms-article" dangerouslySetInnerHTML={{ __html: dict.legal.privacy.body }} />
      </div>
    </article>
  );
}
