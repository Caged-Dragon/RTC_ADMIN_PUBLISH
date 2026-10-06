import { Product } from '../data/products';

// High-fidelity image assets generated specifically for each cracker type
export const CRACKER_IMAGES = {
  sparklers: '/src/assets/images/redthunder_sparklers_1791297554442.jpg',
  potsAndFountains: '/src/assets/images/redthunder_pots_fountains_1791299034674.jpg',
  chakkarsAndWheels: '/src/assets/images/redthunder_peacock_chakkars_1791301133347.jpg',
  soundAndBombs: '/src/assets/images/redthunder_sound_crackers_1791301117609.jpg',
  rockets: '/src/assets/images/redthunder_sky_rockets_1791303603553.jpg',
  repeatingShots: '/src/assets/images/redthunder_aerial_shots_1791299049699.jpg',
  aerialShells: '/src/assets/images/redthunder_aerial_shells_1791303651159.jpg',
  garlandsWala: '/src/assets/images/redthunder_garlands_wala_1791303620827.jpg',
  kidsNovelties: '/src/assets/images/redthunder_kids_novelties_1791303636279.jpg',
  twinklingStars: '/src/assets/images/redthunder_twinkling_stars_1791303667579.jpg',
  giftBoxes: '/src/assets/images/redthunder_gift_boxes_1791297541022.jpg',
  heroCrackers: '/src/assets/images/redthunder_hero_crackers_1791297525760.jpg',
};

/**
 * Returns the exact tailored image for any cracker in the catalog.
 * Prioritizes custom uploaded image if available, otherwise maps precisely
 * based on the cracker's specific category, name keywords, and serial number.
 */
export function getExactProductImage(product: Product): string {
  if (product.imageUrl && product.imageUrl.trim().length > 0) {
    return product.imageUrl;
  }

  const name = (product.name || '').toLowerCase();
  const cat = (product.category || '').toLowerCase();

  // 1. Gift boxes & Hampers
  if (cat.includes('gift') || name.includes('gift') || name.includes('red rose') || name.includes('hamper')) {
    return CRACKER_IMAGES.giftBoxes;
  }

  // 2. Rockets
  if (cat.includes('rocket') || name.includes('rocket') || name.includes('whistling') || name.includes('lunic')) {
    return CRACKER_IMAGES.rockets;
  }

  // 3. Garlands / Chorsa / Wala
  if (
    cat.includes('wala') ||
    cat.includes('chorsa') ||
    name.includes('wala') ||
    name.includes('garland') ||
    name.includes('chorsa') ||
    name.includes('1000') ||
    name.includes('2000') ||
    name.includes('5000') ||
    name.includes('10000')
  ) {
    return CRACKER_IMAGES.garlandsWala;
  }

  // 4. Mega Fancy Single Shots & Aerial Shells
  if (
    cat.includes('mega fancy') ||
    name.includes('fancy') ||
    name.includes('shell') ||
    name.includes('2" fancy') ||
    name.includes('3.5" fancy') ||
    name.includes('pipe')
  ) {
    return CRACKER_IMAGES.aerialShells;
  }

  // 5. Multiple Repeating Aerial Shots / Cakes
  if (
    cat.includes('repeating') ||
    cat.includes('shot') ||
    name.includes('shot') ||
    name.includes('aerial') ||
    name.includes('repeating') ||
    name.includes('cake')
  ) {
    return CRACKER_IMAGES.repeatingShots;
  }

  // 6. Kids Special & Novelties
  if (
    cat.includes('kid') ||
    name.includes('snake') ||
    name.includes('match') ||
    name.includes('pop') ||
    name.includes('super car') ||
    name.includes('siren') ||
    name.includes('roll cap') ||
    name.includes('novelty')
  ) {
    return CRACKER_IMAGES.kidsNovelties;
  }

  // 7. Twinkling Stars & Torch Pencils
  if (
    cat.includes('twinkling') ||
    cat.includes('pencil') ||
    name.includes('twinkling') ||
    name.includes('star') ||
    name.includes('pencil') ||
    name.includes('torch')
  ) {
    return CRACKER_IMAGES.twinklingStars;
  }

  // 8. Ground Chakkars & Peacock wheels
  if (
    cat.includes('chakkar') ||
    cat.includes('peacock') ||
    name.includes('chakkar') ||
    name.includes('wheel') ||
    name.includes('peacock') ||
    name.includes('spinner')
  ) {
    return CRACKER_IMAGES.chakkarsAndWheels;
  }

  // 9. Flower Pots & Fountains
  if (
    cat.includes('flower pot') ||
    cat.includes('fountain') ||
    cat.includes('sandpot') ||
    name.includes('flower pot') ||
    name.includes('fountain') ||
    name.includes('pot') ||
    name.includes('koti') ||
    name.includes('asoka')
  ) {
    return CRACKER_IMAGES.potsAndFountains;
  }

  // 10. Sound Bombs & Hydro crackers
  if (
    cat.includes('bomb') ||
    cat.includes('sound') ||
    cat.includes('bijili') ||
    name.includes('bomb') ||
    name.includes('hydro') ||
    name.includes('sound') ||
    name.includes('bijili') ||
    name.includes('kuruvi') ||
    name.includes('atom')
  ) {
    return CRACKER_IMAGES.soundAndBombs;
  }

  // 11. Sparklers
  if (
    cat.includes('sparkler') ||
    name.includes('sparkler') ||
    name.includes('electric') ||
    name.includes('colour sparkler')
  ) {
    return CRACKER_IMAGES.sparklers;
  }

  // Fallback
  return CRACKER_IMAGES.potsAndFountains;
}
