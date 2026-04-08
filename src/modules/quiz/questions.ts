export type SchoolLevel = 'CP' | 'CE1' | 'CE2' | 'CM1' | 'CM2';

export interface QuizQuestion {
  id: number;
  context: string;        // Sentence with the word to choose
  choices: string[];      // 2-4 spelling options
  correctIndex: number;   // index of the correct answer
  level: SchoolLevel;
  hint?: string;          // Optional explanation shown after answering
}

export const QUESTIONS: QuizQuestion[] = [
  // ─── CP — Sons simples, mots de base ─────────────
  { id: 1, context: 'Le ___ dort.', choices: ['chat', 'cha', 'chât'], correctIndex: 0, level: 'CP' },
  { id: 2, context: 'Il fait ___.', choices: ['bo', 'beau', 'beaux'], correctIndex: 1, level: 'CP' },
  { id: 3, context: 'Je vois la ___.', choices: ['lune', 'lunne', 'luine'], correctIndex: 0, level: 'CP' },
  { id: 4, context: 'C\'est mon ___.', choices: ['ami', 'amis', 'amie'], correctIndex: 0, level: 'CP' },
  { id: 5, context: 'La ___ est belle.', choices: ['fleur', 'flère', 'flaire'], correctIndex: 0, level: 'CP' },
  { id: 6, context: 'Le chien ___.', choices: ['ouaf', 'aboie', 'aboit'], correctIndex: 1, level: 'CP' },
  { id: 7, context: 'Je mange une ___.', choices: ['pome', 'pomme', 'pomes'], correctIndex: 1, level: 'CP' },
  { id: 8, context: 'Il y a un ___.', choices: ['oiseau', 'oiseaux', 'oizeau'], correctIndex: 0, level: 'CP' },
  { id: 9, context: 'Le ciel est ___.', choices: ['blau', 'bleu', 'bleux'], correctIndex: 1, level: 'CP' },
  { id: 10, context: 'J\'ai un ___.', choices: ['livre', 'livr', 'libre'], correctIndex: 0, level: 'CP' },
  { id: 11, context: 'Le bébé ___.', choices: ['rit', 'rie', 'rid'], correctIndex: 0, level: 'CP' },
  { id: 12, context: 'Voici une ___.', choices: ['table', 'tabl', 'tabbe'], correctIndex: 0, level: 'CP' },
  { id: 13, context: 'Je bois du ___.', choices: ['lait', 'lai', 'laits'], correctIndex: 0, level: 'CP' },
  { id: 14, context: 'Mon ___ est noir.', choices: ['cha', 'chat', 'chât'], correctIndex: 1, level: 'CP' },
  { id: 15, context: 'Il fait ___.', choices: ['froid', 'frwa', 'froit'], correctIndex: 0, level: 'CP' },
  { id: 16, context: 'La ___ est rouge.', choices: ['fleur', 'pomme', 'pome'], correctIndex: 1, level: 'CP' },
  { id: 17, context: 'Le ___ brille.', choices: ['solèil', 'soleil', 'soleille'], correctIndex: 1, level: 'CP' },
  { id: 18, context: 'C\'est une ___.', choices: ['maison', 'maizon', 'mèson'], correctIndex: 0, level: 'CP' },
  { id: 19, context: 'Le ___ est grand.', choices: ['arbre', 'arbr', 'harbre'], correctIndex: 0, level: 'CP' },
  { id: 20, context: 'Voici mon ___.', choices: ['vélo', 'velo', 'vèlo'], correctIndex: 0, level: 'CP' },

  // ─── CE1 — Homophones simples (a/à, et/est) ──────
  { id: 21, context: 'Marie ___ une amie.', choices: ['a', 'à'], correctIndex: 0, level: 'CE1', hint: '"a" = verbe avoir' },
  { id: 22, context: 'Je vais ___ l\'école.', choices: ['a', 'à'], correctIndex: 1, level: 'CE1', hint: '"à" = préposition de lieu' },
  { id: 23, context: 'Léa ___ Tom jouent.', choices: ['et', 'est'], correctIndex: 0, level: 'CE1', hint: '"et" = en plus' },
  { id: 24, context: 'Le ciel ___ bleu.', choices: ['et', 'est'], correctIndex: 1, level: 'CE1', hint: '"est" = verbe être' },
  { id: 25, context: 'Mon ___ est gentil.', choices: ['chien', 'chiens', 'chient'], correctIndex: 0, level: 'CE1' },
  { id: 26, context: 'Les ___ chantent.', choices: ['oiseau', 'oiseaux', 'oiseaus'], correctIndex: 1, level: 'CE1' },
  { id: 27, context: 'J\'aime les ___.', choices: ['pomme', 'pommes', 'pommez'], correctIndex: 1, level: 'CE1' },
  { id: 28, context: 'Tu ___ gentil.', choices: ['est', 'es', 'ait'], correctIndex: 1, level: 'CE1', hint: '"es" = tu es (verbe être)' },
  { id: 29, context: 'Il ___ beau aujourd\'hui.', choices: ['fait', 'fais', 'faix'], correctIndex: 0, level: 'CE1' },
  { id: 30, context: 'Le chat ___ sur le tapis.', choices: ['dort', 'dord', 'dor'], correctIndex: 0, level: 'CE1' },
  { id: 31, context: 'J\'ai mangé une ___.', choices: ['orange', 'oranje', 'orenge'], correctIndex: 0, level: 'CE1' },
  { id: 32, context: 'Mon ___ est rouge.', choices: ['ballon', 'ballons', 'balon'], correctIndex: 0, level: 'CE1' },
  { id: 33, context: 'Voici une ___.', choices: ['fraise', 'frèse', 'fraize'], correctIndex: 0, level: 'CE1' },
  { id: 34, context: 'C\'est ___ sœur.', choices: ['ma', 'mas', 'mat'], correctIndex: 0, level: 'CE1' },
  { id: 35, context: 'Les ___ courent.', choices: ['enfant', 'enfants', 'enfens'], correctIndex: 1, level: 'CE1' },
  { id: 36, context: 'Le poisson ___.', choices: ['nage', 'nag', 'naje'], correctIndex: 0, level: 'CE1' },
  { id: 37, context: 'J\'aime le ___.', choices: ['chocolat', 'chokolat', 'chocola'], correctIndex: 0, level: 'CE1' },
  { id: 38, context: 'Le lapin a de longues ___.', choices: ['oreille', 'oreilles', 'oreile'], correctIndex: 1, level: 'CE1' },
  { id: 39, context: 'Papa ___ du pain.', choices: ['mange', 'manje', 'mang'], correctIndex: 0, level: 'CE1' },
  { id: 40, context: 'Le ___ aboie fort.', choices: ['chien', 'chein', 'shein'], correctIndex: 0, level: 'CE1' },

  // ─── CE2 — Accents, ç, on/ont, son/sont ──────────
  { id: 41, context: 'Les enfants ___ contents.', choices: ['son', 'sont'], correctIndex: 1, level: 'CE2', hint: '"sont" = verbe être (3ème personne pluriel)' },
  { id: 42, context: 'C\'est ___ frère.', choices: ['son', 'sont'], correctIndex: 0, level: 'CE2', hint: '"son" = adjectif possessif' },
  { id: 43, context: 'Ils ___ une nouvelle voiture.', choices: ['on', 'ont'], correctIndex: 1, level: 'CE2', hint: '"ont" = verbe avoir' },
  { id: 44, context: '___ joue dans le jardin.', choices: ['On', 'Ont'], correctIndex: 0, level: 'CE2', hint: '"on" = pronom (= nous)' },
  { id: 45, context: 'Le ___ est bon.', choices: ['gateau', 'gâteau', 'gatô'], correctIndex: 1, level: 'CE2' },
  { id: 46, context: 'Voici mon ___.', choices: ['frere', 'frère', 'frêre'], correctIndex: 1, level: 'CE2' },
  { id: 47, context: 'C\'est la ___.', choices: ['fete', 'fête', 'fête'], correctIndex: 1, level: 'CE2' },
  { id: 48, context: 'Le petit ___ joue.', choices: ['garcon', 'garçon', 'garson'], correctIndex: 1, level: 'CE2' },
  { id: 49, context: 'Le ___ avance lentement.', choices: ['chemin', 'chemain', 'shemin'], correctIndex: 0, level: 'CE2' },
  { id: 50, context: 'Je vais ___ école.', choices: ['a l\'', 'à l\''], correctIndex: 1, level: 'CE2' },
  { id: 51, context: 'Il a ___ ans.', choices: ['huit', 'uit', 'huitt'], correctIndex: 0, level: 'CE2' },
  { id: 52, context: 'Le ___ porte une couronne.', choices: ['roi', 'roit', 'roie'], correctIndex: 0, level: 'CE2' },
  { id: 53, context: 'La ___ des bois.', choices: ['ferret', 'forêt', 'foret'], correctIndex: 1, level: 'CE2' },
  { id: 54, context: 'Mon père ___ avec moi.', choices: ['joue', 'jou', 'joux'], correctIndex: 0, level: 'CE2' },
  { id: 55, context: 'Les nuages ___ blancs.', choices: ['son', 'sont'], correctIndex: 1, level: 'CE2' },
  { id: 56, context: 'J\'ai un ___ mal de tête.', choices: ['petit', 'peti', 'petits'], correctIndex: 0, level: 'CE2' },
  { id: 57, context: 'La ___ chante.', choices: ['cigale', 'sigale', 'cigalle'], correctIndex: 0, level: 'CE2' },
  { id: 58, context: 'Le ___ sort de sa coquille.', choices: ['escargot', 'éscargot', 'eskargo'], correctIndex: 0, level: 'CE2' },
  { id: 59, context: 'C\'est une ___ d\'eau.', choices: ['goutte', 'goute', 'gout'], correctIndex: 0, level: 'CE2' },
  { id: 60, context: 'Le clown est ___.', choices: ['rigolo', 'rigolot', 'rigollo'], correctIndex: 0, level: 'CE2' },

  // ─── CM1 — Conjugaisons, ces/ses, ou/où ──────────
  { id: 61, context: '___ habites-tu ?', choices: ['Ou', 'Où'], correctIndex: 1, level: 'CM1', hint: '"où" avec accent = lieu' },
  { id: 62, context: 'Tu veux du jus ___ de l\'eau ?', choices: ['ou', 'où'], correctIndex: 0, level: 'CM1', hint: '"ou" sans accent = choix' },
  { id: 63, context: 'J\'aime ___ chaussures.', choices: ['ces', 'ses'], correctIndex: 0, level: 'CM1', hint: '"ces" = celles-ci (démonstratif)' },
  { id: 64, context: 'Léa range ___ jouets.', choices: ['ces', 'ses'], correctIndex: 1, level: 'CM1', hint: '"ses" = les siens (possessif)' },
  { id: 65, context: 'Ils ___ leur déjeuner.', choices: ['mangent', 'manges', 'mangeais'], correctIndex: 0, level: 'CM1', hint: '"ils" → terminaison -ent' },
  { id: 66, context: 'Tu ___ très vite.', choices: ['cours', 'court', 'courre'], correctIndex: 0, level: 'CM1', hint: '"tu" → terminaison -s' },
  { id: 67, context: 'Nous ___ contents.', choices: ['sommes', 'somme', 'sont'], correctIndex: 0, level: 'CM1' },
  { id: 68, context: 'J\'ai vu un ___.', choices: ['cheval', 'chevaux', 'chevale'], correctIndex: 0, level: 'CM1' },
  { id: 69, context: 'Les ___ courent.', choices: ['cheval', 'chevaux', 'chevals'], correctIndex: 1, level: 'CM1', hint: 'pluriel irrégulier : -al → -aux' },
  { id: 70, context: 'Hier, je ___ au parc.', choices: ['suis allé', 'suit alé', 'sui alé'], correctIndex: 0, level: 'CM1' },
  { id: 71, context: 'Le ___ est dur.', choices: ['travail', 'travaille', 'travaie'], correctIndex: 0, level: 'CM1' },
  { id: 72, context: 'Ma mère ___ un livre.', choices: ['lit', 'lis', 'lie'], correctIndex: 0, level: 'CM1' },
  { id: 73, context: 'Le ___ est long.', choices: ['voyage', 'voiage', 'vouayage'], correctIndex: 0, level: 'CM1' },
  { id: 74, context: 'Cet ___ est beau.', choices: ['oiseau', 'oizeau', 'oisaux'], correctIndex: 0, level: 'CM1' },
  { id: 75, context: 'L\'___ va à l\'école.', choices: ['élève', 'eleve', 'éléve'], correctIndex: 0, level: 'CM1' },
  { id: 76, context: 'Il ___ ses devoirs.', choices: ['fait', 'fais', 'faix'], correctIndex: 0, level: 'CM1' },
  { id: 77, context: 'La ___ neige.', choices: ['montagne', 'montagn', 'montaigne'], correctIndex: 0, level: 'CM1' },
  { id: 78, context: 'Je ___ que tu viennes.', choices: ['veux', 'veut', 'veu'], correctIndex: 0, level: 'CM1' },
  { id: 79, context: 'L\'___ est grand.', choices: ['éléphant', 'éléfant', 'eleephant'], correctIndex: 0, level: 'CM1' },
  { id: 80, context: 'Mon ___ est nouveau.', choices: ['cahier', 'caier', 'cahiez'], correctIndex: 0, level: 'CM1' },

  // ─── CM2 — Conjugaisons complexes, accord ───────
  { id: 81, context: 'Les fleurs sont ___.', choices: ['cueillies', 'cueillis', 'cueillit'], correctIndex: 0, level: 'CM2', hint: 'accord avec "fleurs" (féminin pluriel)' },
  { id: 82, context: 'Elle ___ son cadeau.', choices: ['a recu', 'a reçue', 'a reçu'], correctIndex: 2, level: 'CM2' },
  { id: 83, context: 'La lettre que j\'ai ___.', choices: ['écrit', 'écrite', 'écrites'], correctIndex: 1, level: 'CM2', hint: 'COD avant le verbe → accord' },
  { id: 84, context: 'Quand il ___ là, on partira.', choices: ['sera', 'serait', 'sera'], correctIndex: 0, level: 'CM2' },
  { id: 85, context: 'Si j\'___ assez d\'argent...', choices: ['avais', 'aurai', 'aurais'], correctIndex: 0, level: 'CM2' },
  { id: 86, context: 'Il faut que tu ___.', choices: ['viens', 'viennes', 'viendras'], correctIndex: 1, level: 'CM2', hint: 'subjonctif après "il faut que"' },
  { id: 87, context: 'Les ___ que j\'ai vus.', choices: ['amis', 'amies', 'ami'], correctIndex: 0, level: 'CM2' },
  { id: 88, context: 'C\'est ___ je préfère.', choices: ['celui que', 'celui qui', 'celui qu\''], correctIndex: 0, level: 'CM2' },
  { id: 89, context: 'Quel ___ a-t-il ?', choices: ['âge', 'age', 'âje'], correctIndex: 0, level: 'CM2' },
  { id: 90, context: 'L\'___ est lente.', choices: ['hirondelle', 'irondelle', 'hironnelle'], correctIndex: 0, level: 'CM2' },
  { id: 91, context: 'Le ___ est riche.', choices: ['vocabulaire', 'vocabulère', 'vocabulair'], correctIndex: 0, level: 'CM2' },
  { id: 92, context: 'Ils ___ partir demain.', choices: ['veulent', 'veullent', 'voulent'], correctIndex: 0, level: 'CM2' },
  { id: 93, context: 'C\'est un ___ rusé.', choices: ['renard', 'renar', 'renart'], correctIndex: 0, level: 'CM2' },
  { id: 94, context: 'Nous ___ patients.', choices: ['serons', 'serions', 'sommes'], correctIndex: 0, level: 'CM2', hint: 'futur simple : nous serons' },
  { id: 95, context: 'La ___ de l\'année.', choices: ['fin', 'fain', 'fint'], correctIndex: 0, level: 'CM2' },
  { id: 96, context: 'Il est ___ de partir.', choices: ['nécessaire', 'necessaire', 'nessessaire'], correctIndex: 0, level: 'CM2' },
  { id: 97, context: 'Une ___ extraordinaire.', choices: ['découverte', 'décourverte', 'decouverte'], correctIndex: 0, level: 'CM2' },
  { id: 98, context: 'Je m\'___ Marc.', choices: ['appelle', 'appele', 'apelle'], correctIndex: 0, level: 'CM2' },
  { id: 99, context: 'Les enfants se sont ___.', choices: ['lavés', 'lavé', 'lavées'], correctIndex: 0, level: 'CM2' },
  { id: 100, context: 'Quelle ___ magnifique !', choices: ['journée', 'journé', 'journnée'], correctIndex: 0, level: 'CM2' },
];

export function getRandomQuestion(level: SchoolLevel, excludeIds: number[]): QuizQuestion | null {
  const available = QUESTIONS.filter((q) => q.level === level && !excludeIds.includes(q.id));
  if (available.length === 0) return null;
  return available[Math.floor(Math.random() * available.length)]!;
}
