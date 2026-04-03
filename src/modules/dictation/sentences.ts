export interface DictationSentence {
  id: number;
  text: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export const SENTENCES: DictationSentence[] = [
  // EASY (3-5 words)
  { id: 1, text: 'Le chat dort.', difficulty: 'easy' },
  { id: 2, text: 'Il fait beau.', difficulty: 'easy' },
  { id: 3, text: 'Je mange une pomme.', difficulty: 'easy' },
  { id: 4, text: 'Le soleil brille.', difficulty: 'easy' },
  { id: 5, text: 'Elle aime les fleurs.', difficulty: 'easy' },
  { id: 6, text: 'Mon chien est gentil.', difficulty: 'easy' },
  { id: 7, text: 'Le livre est rouge.', difficulty: 'easy' },
  { id: 8, text: 'Papa fait un gâteau.', difficulty: 'easy' },
  { id: 9, text: 'Les oiseaux chantent.', difficulty: 'easy' },
  { id: 10, text: 'Je suis content.', difficulty: 'easy' },
  { id: 11, text: 'La lune est ronde.', difficulty: 'easy' },
  { id: 12, text: 'Il pleut dehors.', difficulty: 'easy' },
  { id: 13, text: 'Le bébé rit.', difficulty: 'easy' },
  { id: 14, text: 'Maman lit un livre.', difficulty: 'easy' },

  // MEDIUM (6-10 words)
  { id: 15, text: 'Le petit garçon joue dans le jardin.', difficulty: 'medium' },
  { id: 16, text: 'Ma sœur aime beaucoup les fraises rouges.', difficulty: 'medium' },
  { id: 17, text: 'Les enfants courent dans la cour de récréation.', difficulty: 'medium' },
  { id: 18, text: 'Le chat noir dort sur le canapé.', difficulty: 'medium' },
  { id: 19, text: 'Nous allons à la plage cet été.', difficulty: 'medium' },
  { id: 20, text: 'Le chien aboie quand il voit le facteur.', difficulty: 'medium' },
  { id: 21, text: 'Elle dessine une maison avec un grand jardin.', difficulty: 'medium' },
  { id: 22, text: 'Les étoiles brillent dans le ciel noir.', difficulty: 'medium' },
  { id: 23, text: 'Mon frère joue de la guitare le soir.', difficulty: 'medium' },
  { id: 24, text: 'La maîtresse écrit la leçon au tableau.', difficulty: 'medium' },
  { id: 25, text: 'Le vent souffle fort dans les arbres.', difficulty: 'medium' },
  { id: 26, text: 'Je prends mon petit déjeuner tous les matins.', difficulty: 'medium' },
  { id: 27, text: 'Les poissons nagent dans la rivière claire.', difficulty: 'medium' },

  // HARD (11+ words)
  { id: 28, text: 'Pendant les vacances, nous avons visité un très beau château.', difficulty: 'hard' },
  { id: 29, text: 'Le petit prince a découvert une rose magnifique sur sa planète.', difficulty: 'hard' },
  { id: 30, text: 'Les papillons multicolores volent au-dessus des fleurs du jardin.', difficulty: 'hard' },
  { id: 31, text: 'Ma grand-mère prépare toujours de délicieux gâteaux au chocolat.', difficulty: 'hard' },
  { id: 32, text: 'Les élèves de la classe ont organisé une fête pour la fin de l\'année.', difficulty: 'hard' },
  { id: 33, text: 'Le renard rusé se cache derrière le buisson pour observer les poules.', difficulty: 'hard' },
  { id: 34, text: 'Chaque matin, les oiseaux chantent une mélodie joyeuse dans les arbres.', difficulty: 'hard' },
  { id: 35, text: 'La bibliothèque de l\'école contient des centaines de livres passionnants.', difficulty: 'hard' },
  { id: 36, text: 'Mon meilleur ami et moi aimons construire des cabanes dans la forêt.', difficulty: 'hard' },
  { id: 37, text: 'Le boulanger se lève très tôt pour préparer le pain et les croissants.', difficulty: 'hard' },
  { id: 38, text: 'Après la pluie, un magnifique arc-en-ciel est apparu dans le ciel.', difficulty: 'hard' },
  { id: 39, text: 'Les astronautes voyagent dans l\'espace pour découvrir de nouvelles planètes.', difficulty: 'hard' },
  { id: 40, text: 'Le petit écureuil ramasse des noisettes pour les garder pendant l\'hiver.', difficulty: 'hard' },
];

export function getSentences(difficulty: 'easy' | 'medium' | 'hard'): DictationSentence[] {
  return SENTENCES.filter((s) => s.difficulty === difficulty);
}

export function getRandomSentence(difficulty: 'easy' | 'medium' | 'hard', excludeIds: number[]): DictationSentence | null {
  const available = SENTENCES.filter((s) => s.difficulty === difficulty && !excludeIds.includes(s.id));
  if (available.length === 0) return null;
  return available[Math.floor(Math.random() * available.length)]!;
}
