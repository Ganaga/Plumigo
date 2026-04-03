export interface Lesson {
  id: string;
  number: number;
  title: string;
  phase: number;
  keys: string[];
  text: string;
}

export const LESSONS: Lesson[] = [
  // Phase 1: Home row
  {
    id: 'lesson-1', number: 1, title: 'F et J', phase: 1,
    keys: ['f', 'j'],
    text: 'f j f j j f f j j f f j f j f j j f f j f j j f j f f j j f',
  },
  {
    id: 'lesson-2', number: 2, title: 'D et K', phase: 1,
    keys: ['d', 'k', 'f', 'j'],
    text: 'd k d k f j d k f d k j f d j k d f k j d k f j k d f j d k',
  },
  {
    id: 'lesson-3', number: 3, title: 'S et L', phase: 1,
    keys: ['s', 'l', 'd', 'k', 'f', 'j'],
    text: 's l s l d k s l f j s l d s k l f s j l d k s l f j s l d k',
  },
  {
    id: 'lesson-4', number: 4, title: 'Q et M', phase: 1,
    keys: ['q', 'm', 's', 'l', 'd', 'k', 'f', 'j'],
    text: 'q m q m s l q m d k q m f j q m s q l m d q k m f q j m q m',
  },
  {
    id: 'lesson-5', number: 5, title: 'G et H', phase: 1,
    keys: ['g', 'h', 'f', 'j', 'd', 'k', 's', 'l', 'q', 'm'],
    text: 'g h g h f g h j d g k h s g l h q g m h f g j h g h f j g h',
  },
  // Phase 2: Top row
  {
    id: 'lesson-6', number: 6, title: 'R et U', phase: 2,
    keys: ['r', 'u', 'f', 'j'],
    text: 'r u r u f r j u r f u j r u f r j u r u f j r u f r u j r u',
  },
  {
    id: 'lesson-7', number: 7, title: 'E et I', phase: 2,
    keys: ['e', 'i', 'r', 'u', 'd', 'k'],
    text: 'e i e i r e u i d e k i r e i u e d i k e i r u e i d k e i',
  },
  {
    id: 'lesson-8', number: 8, title: 'Z et O', phase: 2,
    keys: ['z', 'o', 'e', 'i', 's', 'l'],
    text: 'z o z o e z i o s z l o e z o i z s o l z o e i z o s l z o',
  },
  {
    id: 'lesson-9', number: 9, title: 'A et P', phase: 2,
    keys: ['a', 'p', 'z', 'o', 'q', 'm'],
    text: 'a p a p z a o p q a m p z a p o a q p m a p z o a p q m a p',
  },
  {
    id: 'lesson-10', number: 10, title: 'T et Y', phase: 2,
    keys: ['t', 'y', 'r', 'u', 'g', 'h'],
    text: 't y t y r t u y g t h y r t y u t g y h t y r u t y g h t y',
  },
  // Phase 3: Bottom row
  {
    id: 'lesson-11', number: 11, title: 'V et N', phase: 3,
    keys: ['v', 'n', 'f', 'j'],
    text: 'v n v n f v j n v f n j v n f v j n v n f j v n f v n j v n',
  },
  {
    id: 'lesson-12', number: 12, title: 'C et virgule', phase: 3,
    keys: ['c', ',', 'd', 'k', 'v', 'n'],
    text: 'c , c , d c k , v c n , d c , k c v , n c , d k c , v n c ,',
  },
  {
    id: 'lesson-13', number: 13, title: 'X et point', phase: 3,
    keys: ['x', '.', 's', 'l', 'c', ','],
    text: 'x . x . s x l . c x , . s x . l x c . , x . s l x . c , x .',
  },
  {
    id: 'lesson-14', number: 14, title: 'W et !', phase: 3,
    keys: ['w', '!', 'x', '.', 'q', 'm'],
    text: 'w ! w ! x w . ! q w m ! x w ! . w q ! m w ! x . w ! q m w !',
  },
  // Phase 4: Words and sentences
  {
    id: 'lesson-15', number: 15, title: 'Mots simples', phase: 4,
    keys: [],
    text: 'le la du de mal sol fil jus sud ski dame fils jade golf disk',
  },
  {
    id: 'lesson-16', number: 16, title: 'Mots courants', phase: 4,
    keys: [],
    text: 'faire dire voir aller petit rouge maison livre table chaise',
  },
  {
    id: 'lesson-17', number: 17, title: 'Phrases courtes', phase: 4,
    keys: [],
    text: 'le chat dort. il fait beau. je suis la. tu es grand. elle rit.',
  },
  {
    id: 'lesson-18', number: 18, title: 'Accents', phase: 4,
    keys: [],
    text: 'école été forêt père mère frère fenêtre éléphant château bientôt',
  },
  {
    id: 'lesson-19', number: 19, title: 'Chiffres', phase: 4,
    keys: [],
    text: '1 2 3 4 5 6 7 8 9 0 12 34 56 78 90 100 200 365 2024 42',
  },
  {
    id: 'lesson-20', number: 20, title: 'Défi final', phase: 4,
    keys: [],
    text: 'Le petit chat joue dans le jardin. Il attrape une feuille qui tombe. Le soleil brille et les oiseaux chantent.',
  },
];

export function getLessonById(id: string): Lesson | undefined {
  return LESSONS.find((l) => l.id === id);
}

export function getPhaseLabel(phase: number): string {
  const labels: Record<number, string> = {
    1: 'Rangée du milieu',
    2: 'Rangée du haut',
    3: 'Rangée du bas',
    4: 'Mots et phrases',
  };
  return labels[phase] ?? '';
}
