export type SchoolLevel = 'CP' | 'CE1' | 'CE2' | 'CM1' | 'CM2';

export interface DictationSentence {
  id: number;
  text: string;
  level: SchoolLevel;
}

export const SENTENCES: DictationSentence[] = [
  // ─── CP (6-7 ans) — 2-4 mots, sons simples ──────
  { id: 1, text: 'Le chat dort.', level: 'CP' },
  { id: 2, text: 'Il fait beau.', level: 'CP' },
  { id: 3, text: 'Le soleil brille.', level: 'CP' },
  { id: 4, text: 'La lune est ronde.', level: 'CP' },
  { id: 5, text: 'Il pleut dehors.', level: 'CP' },
  { id: 6, text: 'Le bébé rit.', level: 'CP' },
  { id: 7, text: 'Le train arrive.', level: 'CP' },
  { id: 8, text: 'Il neige beaucoup.', level: 'CP' },
  { id: 9, text: 'Le ciel est bleu.', level: 'CP' },
  { id: 10, text: 'Il mange du pain.', level: 'CP' },
  { id: 11, text: 'Elle joue dehors.', level: 'CP' },
  { id: 12, text: 'Le poisson nage.', level: 'CP' },
  { id: 13, text: 'Mon chat est noir.', level: 'CP' },
  { id: 14, text: 'Il dort bien.', level: 'CP' },
  { id: 15, text: 'La table est grande.', level: 'CP' },
  { id: 16, text: 'Le garçon sourit.', level: 'CP' },
  { id: 17, text: 'La fille danse.', level: 'CP' },
  { id: 18, text: 'Je bois du lait.', level: 'CP' },
  { id: 19, text: 'Papa est grand.', level: 'CP' },
  { id: 20, text: 'Le ballon est rond.', level: 'CP' },
  { id: 21, text: 'La pomme est rouge.', level: 'CP' },
  { id: 22, text: 'Il fait très froid.', level: 'CP' },
  { id: 23, text: 'Le vélo est bleu.', level: 'CP' },
  { id: 24, text: 'Le lapin mange.', level: 'CP' },
  { id: 25, text: 'Le livre est rouge.', level: 'CP' },

  // ─── CE1 (7-8 ans) — 4-6 mots, présent, accent é ──
  { id: 26, text: 'Je mange une pomme.', level: 'CE1' },
  { id: 27, text: 'Elle aime les fleurs.', level: 'CE1' },
  { id: 28, text: 'Mon chien est gentil.', level: 'CE1' },
  { id: 29, text: 'Papa fait un gâteau.', level: 'CE1' },
  { id: 30, text: 'Les oiseaux chantent.', level: 'CE1' },
  { id: 31, text: 'Je suis content.', level: 'CE1' },
  { id: 32, text: 'Maman lit un livre.', level: 'CE1' },
  { id: 33, text: 'La porte est ouverte.', level: 'CE1' },
  { id: 34, text: 'Le chien court vite.', level: 'CE1' },
  { id: 35, text: 'Ma sœur chante bien.', level: 'CE1' },
  { id: 36, text: 'La voiture est verte.', level: 'CE1' },
  { id: 37, text: 'Elle court très vite.', level: 'CE1' },
  { id: 38, text: 'Mon frère est petit.', level: 'CE1' },
  { id: 39, text: 'La maison est belle.', level: 'CE1' },
  { id: 40, text: 'Nous sommes contents.', level: 'CE1' },
  { id: 41, text: 'Le petit garçon joue dans le jardin.', level: 'CE1' },
  { id: 42, text: 'Le chat noir dort sur le canapé.', level: 'CE1' },
  { id: 43, text: 'Nous allons à la plage cet été.', level: 'CE1' },
  { id: 44, text: 'Le vent souffle fort dans les arbres.', level: 'CE1' },
  { id: 45, text: 'Mon frère joue de la guitare le soir.', level: 'CE1' },

  // ─── CE2 (8-9 ans) — 5-8 mots, accents variés, ç ──
  { id: 46, text: 'Ma sœur aime beaucoup les fraises rouges.', level: 'CE2' },
  { id: 47, text: 'Les enfants courent dans la cour de récréation.', level: 'CE2' },
  { id: 48, text: 'Le chien aboie quand il voit le facteur.', level: 'CE2' },
  { id: 49, text: 'Elle dessine une maison avec un grand jardin.', level: 'CE2' },
  { id: 50, text: 'Les étoiles brillent dans le ciel noir.', level: 'CE2' },
  { id: 51, text: 'La maîtresse écrit la leçon au tableau.', level: 'CE2' },
  { id: 52, text: 'Je prends mon petit déjeuner tous les matins.', level: 'CE2' },
  { id: 53, text: 'Les poissons nagent dans la rivière claire.', level: 'CE2' },
  { id: 54, text: 'Ma mère prépare une soupe aux légumes.', level: 'CE2' },
  { id: 55, text: 'Le facteur apporte le courrier chaque matin.', level: 'CE2' },
  { id: 56, text: 'Les canards nagent sur le lac tranquille.', level: 'CE2' },
  { id: 57, text: 'Le jardinier arrose les fleurs du parc.', level: 'CE2' },
  { id: 58, text: 'Nous regardons un film ensemble ce soir.', level: 'CE2' },
  { id: 59, text: 'Les nuages blancs traversent le ciel bleu.', level: 'CE2' },
  { id: 60, text: 'Le boulanger vend du pain et des croissants.', level: 'CE2' },
  { id: 61, text: 'Nous jouons au ballon dans le parc.', level: 'CE2' },
  { id: 62, text: 'La neige recouvre les toits des maisons.', level: 'CE2' },
  { id: 63, text: 'Il dessine un bateau sur une feuille blanche.', level: 'CE2' },
  { id: 64, text: 'Mon cousin habite dans une grande ville.', level: 'CE2' },
  { id: 65, text: 'La tortue avance lentement sur le chemin.', level: 'CE2' },
  { id: 66, text: 'Les feuilles tombent des arbres en automne.', level: 'CE2' },
  { id: 67, text: 'Elle range sa chambre avant de sortir.', level: 'CE2' },
  { id: 68, text: 'Le soleil se couche derrière la montagne.', level: 'CE2' },
  { id: 69, text: 'Papa nous emmène au cinéma ce samedi.', level: 'CE2' },
  { id: 70, text: 'Les lapins mangent des carottes dans le potager.', level: 'CE2' },

  // ─── CM1 (9-10 ans) — 7-12 mots, imparfait, homophones ──
  { id: 71, text: 'Mon père répare la voiture dans le garage.', level: 'CM1' },
  { id: 72, text: 'La petite fille ramasse des coquillages sur la plage.', level: 'CM1' },
  { id: 73, text: 'Ma grand-mère tricote une écharpe en laine.', level: 'CM1' },
  { id: 74, text: 'Les hirondelles reviennent au printemps chaque année.', level: 'CM1' },
  { id: 75, text: 'Le docteur soigne les malades à l\'hôpital.', level: 'CM1' },
  { id: 76, text: 'Les abeilles fabriquent du miel dans la ruche.', level: 'CM1' },
  { id: 77, text: 'Le pompier éteint le feu avec la lance.', level: 'CM1' },
  { id: 78, text: 'Le pirate cherche un trésor sur une île.', level: 'CM1' },
  { id: 79, text: 'Ma tante prépare un repas pour toute la famille.', level: 'CM1' },
  { id: 80, text: 'Le hibou chasse la nuit dans la forêt.', level: 'CM1' },
  { id: 81, text: 'Pendant les vacances, nous avons visité un très beau château.', level: 'CM1' },
  { id: 82, text: 'Le petit prince a découvert une rose magnifique sur sa planète.', level: 'CM1' },
  { id: 83, text: 'Les papillons multicolores volent au-dessus des fleurs du jardin.', level: 'CM1' },
  { id: 84, text: 'Ma grand-mère prépare toujours de délicieux gâteaux au chocolat.', level: 'CM1' },
  { id: 85, text: 'Le renard rusé se cache derrière le buisson pour observer les poules.', level: 'CM1' },
  { id: 86, text: 'Chaque matin, les oiseaux chantent une mélodie joyeuse dans les arbres.', level: 'CM1' },
  { id: 87, text: 'Mon meilleur ami et moi aimons construire des cabanes dans la forêt.', level: 'CM1' },
  { id: 88, text: 'Après la pluie, un magnifique arc-en-ciel est apparu dans le ciel.', level: 'CM1' },
  { id: 89, text: 'Le petit écureuil ramasse des noisettes pour les garder pendant l\'hiver.', level: 'CM1' },
  { id: 90, text: 'Le capitaine du bateau observe la mer avec ses grandes jumelles.', level: 'CM1' },
  { id: 91, text: 'Les enfants construisent un bonhomme de neige dans le jardin enneigé.', level: 'CM1' },
  { id: 92, text: 'La princesse traverse la forêt enchantée pour retrouver son château.', level: 'CM1' },
  { id: 93, text: 'Mon grand-père raconte des histoires passionnantes quand nous allons le voir.', level: 'CM1' },
  { id: 94, text: 'Les dauphins jouent dans les vagues bleues de l\'océan Atlantique.', level: 'CM1' },
  { id: 95, text: 'Nous avons planté des tomates et des courgettes dans le potager familial.', level: 'CM1' },

  // ─── CM2 (10-11 ans) — 10+ mots, vocabulaire riche ──
  { id: 96, text: 'Les élèves de la classe ont organisé une fête pour la fin de l\'année.', level: 'CM2' },
  { id: 97, text: 'La bibliothèque de l\'école contient des centaines de livres passionnants.', level: 'CM2' },
  { id: 98, text: 'Le boulanger se lève très tôt pour préparer le pain et les croissants.', level: 'CM2' },
  { id: 99, text: 'Les astronautes voyagent dans l\'espace pour découvrir de nouvelles planètes.', level: 'CM2' },
  { id: 100, text: 'Le chevalier courageux part à la recherche du dragon qui terrorise le village.', level: 'CM2' },
  { id: 101, text: 'Les musiciens de l\'orchestre répètent tous les jours pour le concert de samedi.', level: 'CM2' },
  { id: 102, text: 'La petite souris se faufile sous la porte pour grignoter le fromage.', level: 'CM2' },
  { id: 103, text: 'Pendant la récréation, les enfants jouent à cache-cache derrière les arbres.', level: 'CM2' },
  { id: 104, text: 'Le scientifique observe les étoiles avec un énorme télescope depuis la colline.', level: 'CM2' },
  { id: 105, text: 'Ma famille et moi partons en vacances à la montagne pour faire du ski.', level: 'CM2' },
  { id: 106, text: 'Le peintre mélange les couleurs sur sa palette pour créer un tableau magnifique.', level: 'CM2' },
  { id: 107, text: 'Les tortues de mer pondent leurs œufs sur les plages de sable chaud.', level: 'CM2' },
  { id: 108, text: 'Le magicien sort un lapin blanc de son chapeau devant tous les spectateurs.', level: 'CM2' },
  { id: 109, text: 'Chaque dimanche, nous allons nous promener dans la forêt avec notre chien.', level: 'CM2' },
  { id: 110, text: 'Le cuisinier prépare un repas délicieux avec des légumes frais du marché.', level: 'CM2' },
  { id: 111, text: 'Les explorateurs découvrent une grotte secrète remplie de cristaux brillants.', level: 'CM2' },
  { id: 112, text: 'Ma petite sœur apprend à faire du vélo sans les petites roues.', level: 'CM2' },
  { id: 113, text: 'Le fermier conduit son tracteur dans les champs pour récolter le blé.', level: 'CM2' },
  { id: 114, text: 'Les élèves préparent un spectacle de fin d\'année avec des chansons et des danses.', level: 'CM2' },
  { id: 115, text: 'Le photographe prend de belles photos des animaux sauvages dans la savane.', level: 'CM2' },
  { id: 116, text: 'Nous avons construit une cabane en bois au fond du jardin de mes grands-parents.', level: 'CM2' },
  { id: 117, text: 'Le pilote d\'avion survole les montagnes enneigées avant d\'atterrir à l\'aéroport.', level: 'CM2' },
  { id: 118, text: 'Les grenouilles coassent au bord de la mare quand la nuit commence à tomber.', level: 'CM2' },
  { id: 119, text: 'Le vétérinaire soigne les animaux blessés et leur donne des médicaments.', level: 'CM2' },
  { id: 120, text: 'Le professeur explique la leçon de mathématiques avec beaucoup de patience.', level: 'CM2' },
];

export function getSentences(level: SchoolLevel): DictationSentence[] {
  return SENTENCES.filter((s) => s.level === level);
}

export function getRandomSentence(level: SchoolLevel, excludeIds: number[]): DictationSentence | null {
  const available = SENTENCES.filter((s) => s.level === level && !excludeIds.includes(s.id));
  if (available.length === 0) return null;
  return available[Math.floor(Math.random() * available.length)]!;
}
