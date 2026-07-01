import 'server-only';

const dictionaries = {
  th: () => import('@/dictionaries/th.json').then((module) => module.default),
  en: () => import('@/dictionaries/en.json').then((module) => module.default),
};

export type Locale = 'th' | 'en';

export const getDictionary = async (locale: Locale) => {
  return dictionaries[locale] ? await dictionaries[locale]() : await dictionaries['th']();
};
