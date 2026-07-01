import type { Metadata } from 'next';
import '../globals.css';
import { getDictionary, Locale } from '@/lib/dictionaries';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export async function generateStaticParams() {
  return [{ lang: 'th' }, { lang: 'en' }];
}

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);
  return {
    title: dict.hero.title + ' | Argotex Co., Ltd.',
    description: dict.hero.desc,
    alternates: {
      languages: {
        'th-TH': '/th',
        'en-US': '/en',
      },
    },
  };
}

export default async function LangLayout({ children, params }: LayoutProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  return (
    <html lang={lang} className="scroll-smooth">
      <body className="bg-slate-50 text-slate-800 font-sans antialiased min-h-screen flex flex-col">
        <Navbar dict={dict} />
        <main className="flex-grow">
          {children}
        </main>
        <Footer dict={dict} lang={lang} />
      </body>
    </html>
  );
}
