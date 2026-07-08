const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';

// Cache tags used by revalidateTag() in the /api/revalidate webhook (see route.ts).
// Keep in sync with the collection names Directus flows report.
export const CMS_TAGS = {
  industries: 'industries',
  solutions: 'solutions',
  projects: 'projects'
} as const;

export interface IndustryItem {
  id: string;
  title: string;
  desc: string;
}

export interface IndustryDetail {
  slug: string;
  title: string;
  description: string;
  metaDescription: string;
  articleBody: string;
  photoUrl: string | null;
}

export interface SolutionItem {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  content: string;
  industryId: string;
}

export interface ProjectItem {
  id: string;
  clientName: string;
  durationMonths: number;
  projectType: string;
  resultMetric: string;
  title: string;
  successStory: string;
}

// Directus only filters *which items* match `filter[translations][...]` — the
// requested `translations.*` field still comes back with every locale's row
// unless the nested relation itself is filtered with `deep[]`. Without it,
// translations[0] can silently be the wrong language.
function localizedParams(extra: Record<string, string> = {}, lang: string) {
  const params = new URLSearchParams({
    'filter[translations][languages_code][_eq]': lang,
    'deep[translations][_filter][languages_code][_eq]': lang,
    ...extra
  });
  return params.toString();
}

// 1. Fetch Dynamic Industries with i18n
export async function getDynamicIndustries(lang: 'th' | 'en'): Promise<IndustryItem[]> {
  try {
    const params = localizedParams({ fields: 'id,slug,icon_name,translations.*' }, lang);
    const res = await fetch(`${DIRECTUS_URL}/items/industries?${params}`, {
      next: { revalidate: 3600, tags: [CMS_TAGS.industries] } // ISR Cache: revalidate every hour, or on-demand via webhook
    });

    if (!res.ok) throw new Error(`Failed to fetch industries from CMS (status ${res.status})`);

    const { data } = await res.json();

    return data.map((item: any) => ({
      id: item.slug,
      title: item.translations[0]?.title || '',
      desc: item.translations[0]?.description || ''
    }));
  } catch (error) {
    console.error(`Error fetching industries from CMS (lang=${lang}):`, error);
    return []; // Fallback empty array so frontend doesn't crash if CMS is down
  }
}

// 1b. Fetch a single Industry (detail page) by slug, with i18n
export async function getIndustryBySlug(lang: 'th' | 'en', slug: string): Promise<IndustryDetail | null> {
  try {
    const params = localizedParams(
      { fields: 'slug,photo,translations.*', 'filter[slug][_eq]': slug },
      lang
    );
    const res = await fetch(`${DIRECTUS_URL}/items/industries?${params}`, {
      next: { revalidate: 3600, tags: [CMS_TAGS.industries] }
    });

    if (!res.ok) throw new Error(`Failed to fetch industry detail from CMS (status ${res.status})`);

    const { data } = await res.json();
    const item = data[0];
    if (!item) return null;

    const t = item.translations[0];
    return {
      slug: item.slug,
      title: t?.title || '',
      description: t?.description || '',
      metaDescription: t?.meta_description || t?.description || '',
      articleBody: t?.article_body || '',
      photoUrl: item.photo ? `${DIRECTUS_URL}/assets/${item.photo}` : null
    };
  } catch (error) {
    console.error(`Error fetching industry detail from CMS (slug=${slug}, lang=${lang}):`, error);
    return null;
  }
}

// 2. Fetch Dynamic Solutions with i18n
export async function getDynamicSolutions(lang: 'th' | 'en'): Promise<SolutionItem[]> {
  try {
    const params = localizedParams(
      { fields: 'id,slug,status,industry_id,translations.*', 'filter[status][_eq]': 'published' },
      lang
    );
    const res = await fetch(`${DIRECTUS_URL}/items/solutions?${params}`, {
      next: { revalidate: 3600, tags: [CMS_TAGS.solutions] }
    });

    if (!res.ok) throw new Error(`Failed to fetch solutions from CMS (status ${res.status})`);

    const { data } = await res.json();

    return data.map((item: any) => ({
      id: item.id,
      slug: item.slug,
      title: item.translations[0]?.title || '',
      subtitle: item.translations[0]?.subtitle || '',
      content: item.translations[0]?.content || '',
      industryId: item.industry_id
    }));
  } catch (error) {
    console.error(`Error fetching solutions from CMS (lang=${lang}):`, error);
    return [];
  }
}

// 3. Fetch Dynamic Projects with i18n
export async function getDynamicProjects(lang: 'th' | 'en'): Promise<ProjectItem[]> {
  try {
    const params = localizedParams(
      { fields: 'id,client_name,duration_months,project_type,result_metric,translations.*' },
      lang
    );
    const res = await fetch(`${DIRECTUS_URL}/items/projects?${params}`, {
      next: { revalidate: 3600, tags: [CMS_TAGS.projects] }
    });

    if (!res.ok) throw new Error(`Failed to fetch projects from CMS (status ${res.status})`);

    const { data } = await res.json();

    return data.map((item: any) => ({
      id: item.id,
      clientName: item.client_name,
      durationMonths: item.duration_months,
      projectType: item.project_type,
      resultMetric: item.result_metric,
      title: item.translations[0]?.title || '',
      successStory: item.translations[0]?.success_story || ''
    }));
  } catch (error) {
    console.error(`Error fetching projects from CMS (lang=${lang}):`, error);
    return [];
  }
}
