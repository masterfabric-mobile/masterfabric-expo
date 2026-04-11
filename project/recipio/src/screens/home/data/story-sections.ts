/**
 * Story section definitions for the home stories strip.
 * Each section appears as a circular item; tap opens full-screen with section title and mock images.
 */
export type StorySectionId =
  | 'mostViewed'
  | 'starsOfWeek'
  | 'newlyAdded'
  | 'trendingNow'
  | 'chefsPick'
  | 'quickMeals';

export interface StorySectionItem {
  id: string;
  image: string;
  title: string;
}

export interface StorySection {
  id: StorySectionId;
  /** i18n key for section title, e.g. home.stories.mostViewed */
  titleKey: string;
  /** Cover image for the circular on home */
  coverImage: string;
  /** Mock items shown in full-screen when this section is opened */
  items: StorySectionItem[];
}

const BASE = 'https://images.unsplash.com/photo-';
const PICSUM = 'https://picsum.photos/seed/';

export const STORY_SECTIONS: StorySection[] = [
  {
    id: 'mostViewed',
    titleKey: 'home.stories.mostViewed',
    coverImage: `${BASE}1504674900247-0877df9cc836?w=400`,
    items: [
      { id: 'mv1', image: `${PICSUM}r1/400/300`, title: 'Mantarlı Risotto' },
      { id: 'mv2', image: `${PICSUM}r2/400/300`, title: 'Fırın Tavuk' },
      { id: 'mv3', image: `${PICSUM}r3/400/300`, title: 'Avokado Toast' },
      { id: 'mv4', image: `${PICSUM}r4/400/300`, title: 'Mercimek Çorbası' },
      { id: 'mv5', image: `${PICSUM}r5/400/300`, title: 'Izgara Sebzeler' },
    ],
  },
  {
    id: 'starsOfWeek',
    titleKey: 'home.stories.starsOfWeek',
    coverImage: `${BASE}1565299624946-b28f40a0ae38?w=400`,
    items: [
      { id: 'sw1', image: `${PICSUM}s1/400/300`, title: 'Pizza Margherita' },
      { id: 'sw2', image: `${PICSUM}s2/400/300`, title: 'Somon Füme' },
      { id: 'sw3', image: `${PICSUM}s3/400/300`, title: 'Pasta Carbonara' },
      { id: 'sw4', image: `${PICSUM}s4/400/300`, title: 'Humus' },
      { id: 'sw5', image: `${PICSUM}s5/400/300`, title: 'Çikolatalı Browni' },
    ],
  },
  {
    id: 'newlyAdded',
    titleKey: 'home.stories.newlyAdded',
    coverImage: `${BASE}1546069901-ba9599a7e63c?w=400`,
    items: [
      { id: 'na1', image: `${PICSUM}n1/400/300`, title: 'Kabak Mücver' },
      { id: 'na2', image: `${PICSUM}n2/400/300`, title: 'Balkabağı Çorbası' },
      { id: 'na3', image: `${PICSUM}n3/400/300`, title: 'Peynirli Makarna' },
      { id: 'na4', image: `${PICSUM}n4/400/300`, title: 'Kısır' },
      { id: 'na5', image: `${PICSUM}n5/400/300`, title: 'Zeytinyağlı Taze Fasulye' },
    ],
  },
  {
    id: 'trendingNow',
    titleKey: 'home.stories.trendingNow',
    coverImage: `${BASE}1567620905732-2d1ec7ab7445?w=400`,
    items: [
      { id: 'tn1', image: `${PICSUM}t1/400/300`, title: 'Pancake' },
      { id: 'tn2', image: `${PICSUM}t2/400/300`, title: 'Acai Bowl' },
      { id: 'tn3', image: `${PICSUM}t3/400/300`, title: 'Smoothie Bowl' },
      { id: 'tn4', image: `${PICSUM}t4/400/300`, title: 'Avokado Ekmek' },
      { id: 'tn5', image: `${PICSUM}t5/400/300`, title: 'Granola' },
    ],
  },
  {
    id: 'chefsPick',
    titleKey: 'home.stories.chefsPick',
    coverImage: `${BASE}1556910103-1c02745aae4d?w=400`,
    items: [
      { id: 'cp1', image: `${PICSUM}c1/400/300`, title: 'Şefin Özel Soslu Tavuk' },
      { id: 'cp2', image: `${PICSUM}c2/400/300`, title: 'Truffle Makarna' },
      { id: 'cp3', image: `${PICSUM}c3/400/300`, title: 'Süzme Yoğurtlu Meze' },
      { id: 'cp4', image: `${PICSUM}c4/400/300`, title: 'Deniz Ürünleri Risotto' },
      { id: 'cp5', image: `${PICSUM}c5/400/300`, title: 'Tiramisu' },
    ],
  },
  {
    id: 'quickMeals',
    titleKey: 'home.stories.quickMeals',
    coverImage: `${BASE}1604329760661-e71dc83f2b26?w=400`,
    items: [
      { id: 'qm1', image: `${PICSUM}q1/400/300`, title: '15 Dakika Makarna' },
      { id: 'qm2', image: `${PICSUM}q2/400/300`, title: 'Tost' },
      { id: 'qm3', image: `${PICSUM}q3/400/300`, title: 'Yumurta Menemen' },
      { id: 'qm4', image: `${PICSUM}q4/400/300`, title: 'Salata Kasesi' },
      { id: 'qm5', image: `${PICSUM}q5/400/300`, title: 'Sandviç' },
    ],
  },
];

export function getStorySectionById(id: string | null): StorySection | null {
  if (!id) return null;
  return STORY_SECTIONS.find((s) => s.id === id) ?? null;
}
