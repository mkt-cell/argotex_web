'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface CookieConsentProps {
  dict: any;
  lang: string;
}

const STORAGE_KEY = 'argotex-cookie-consent';

export const CookieConsent: React.FC<CookieConsentProps> = ({ dict, lang }) => {
  // Start hidden and only reveal after mount — reading localStorage during
  // render would cause a hydration mismatch between server and client.
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) {
        setVisible(true);
      }
    } catch {
      // localStorage unavailable (private mode / blocked) — show the banner
      // so the choice is still offered; the decision just won't persist.
      setVisible(true);
    }
  }, []);

  const decide = (choice: 'accepted' | 'essential') => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ choice, at: new Date().toISOString() })
      );
    } catch {
      // Ignore persistence failures — dismissing the banner is still correct UX.
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label={dict.pdpa.cookie_message}
      className="fixed inset-x-0 bottom-0 z-[90] p-3 sm:p-4"
    >
      <div className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-2xl shadow-lg p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed flex-1">
          {dict.pdpa.cookie_message}{' '}
          <Link
            href={`/${lang}/privacy-policy`}
            className="text-medical-teal font-medium underline underline-offset-2 hover:text-medical-teal/80"
          >
            {dict.pdpa.cookie_link}
          </Link>
        </p>
        <div className="flex gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={() => decide('essential')}
            className="px-4 py-2 rounded-md border border-slate-200 text-slate-700 text-xs font-medium hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap"
          >
            {dict.pdpa.cookie_decline}
          </button>
          <button
            type="button"
            onClick={() => decide('accepted')}
            className="px-4 py-2 rounded-md bg-medical-teal text-white text-xs font-bold hover:bg-medical-teal/90 transition-colors cursor-pointer whitespace-nowrap shadow-sm"
          >
            {dict.pdpa.cookie_accept}
          </button>
        </div>
      </div>
    </div>
  );
};
