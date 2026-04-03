export const WRITING_PROMPTS: string[] = [
  'Il était une fois un dragon qui avait peur du feu...',
  'Un jour, dans l\'espace, un astronaute découvre...',
  'Le chat magique pouvait parler, et il dit...',
  'Dans une forêt enchantée, un arbre se mit à marcher...',
  'Le robot avait un secret : il savait cuisiner...',
  'Pendant la nuit, les jouets prennent vie et...',
  'Un pirate trouve une carte au trésor qui mène à...',
  'Le plus petit dinosaure du monde voulait...',
  'Une princesse décide de devenir exploratrice et...',
  'Le jour où il a neigé en été...',
  'Mon meilleur ami est un extraterrestre qui...',
  'La porte mystérieuse au fond du jardin cachait...',
  'Le livre magique transportait ses lecteurs dans...',
  'Un poisson rouge qui rêvait de voler...',
  'Le jour où j\'ai rencontré un fantôme gentil...',
  'Dans un monde fait de bonbons...',
  'Le super-héros le plus bizarre avait le pouvoir de...',
  'Une île flottante dans le ciel abritait...',
  'Le miroir montrait un monde complètement différent...',
  'Ma machine à voyager dans le temps m\'a emmené en...',
];

export function getRandomPrompt(): string {
  return WRITING_PROMPTS[Math.floor(Math.random() * WRITING_PROMPTS.length)]!;
}
