export interface Product {
  id: number;
  sNo: number;
  name: string;
  category: string;
  unit: 'Box' | 'Pkt' | 'Tube';
  rate: number;
  description: string;
  popular?: boolean;
  featured?: boolean;
  pieces?: string;
  imageUrl?: string;
  stockStatus?: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';
}

export interface StoreInfo {
  name: string;
  brandCode: string;
  year: number;
  phone: string;
  phoneDisplay: string;
  address: string;
  pincode: string;
  city: string;
  state: string;
  tagline: string;
  logoUrl?: string;
}

export const STORE_INFO: StoreInfo = {
  name: 'REDTHUNDER CRACKERS',
  brandCode: 'RT CRACKERS',
  year: 2026,
  phone: '918124100501',
  phoneDisplay: '+91 8124100501',
  address: 'D No. 4/2017/A, Pothigai Nagar, Kila Thiruthangal',
  city: 'Sivakasi',
  state: 'Tamil Nadu',
  pincode: '626189',
  tagline: 'Light Up Your Celebrations with Joy & Safety',
};

export const CATEGORIES = [
  'All Items',
  'Colourful Sparklers',
  'Single Sound Crackers',
  'Flower Pots',
  'Ground Chakkar',
  'Twinkling Stars',
  'Bombs',
  'Paper Bombs',
  'Bijili Crackers',
  'Pencil Showers',
  'Peacock Showers',
  'Fancy Rockets',
  'Fountain Special',
  'Mega Fancy Varieties',
  'Multiple Repeating Shots',
  'Chorsa & Wala',
  'Kids Special',
  'Colourfull Sandpots',
  'Gift Boxes',
] as const;

/** Legacy design-time catalogue only. Runtime product data is loaded from public.products. */
export const PRODUCTS: Product[] = [
  // COLOURFUL SPARKLERS (1-19)
  { id: 1, sNo: 1, name: '10 cm Electric Sparklers', category: 'Colourful Sparklers', unit: 'Box', rate: 24, description: 'Classic bright crackling silver electric sparklers', popular: true },
  { id: 2, sNo: 2, name: '10 cm Colour Sparklers', category: 'Colourful Sparklers', unit: 'Box', rate: 26, description: 'Vibrant multicolor festive sparkling effect' },
  { id: 3, sNo: 3, name: '10 cm Green Sparklers', category: 'Colourful Sparklers', unit: 'Box', rate: 32, description: 'Radiant emerald green illumination sparklers' },
  { id: 4, sNo: 4, name: '10 cm Red Sparklers', category: 'Colourful Sparklers', unit: 'Box', rate: 34, description: 'Ruby crimson red glowing celebratory sparklers' },
  { id: 5, sNo: 5, name: '12 cm Electric Sparklers', category: 'Colourful Sparklers', unit: 'Box', rate: 32, description: '12 cm high discharge electric crackle sparklers' },
  { id: 6, sNo: 6, name: '12 cm Colour Sparklers', category: 'Colourful Sparklers', unit: 'Box', rate: 34, description: '12 cm assorted festive color sparklers' },
  { id: 7, sNo: 7, name: '12 cm Green Sparklers', category: 'Colourful Sparklers', unit: 'Box', rate: 37, description: '12 cm pure green flame sparkler sticks' },
  { id: 8, sNo: 8, name: '12 cm Red Sparklers', category: 'Colourful Sparklers', unit: 'Box', rate: 42, description: '12 cm deep festive red glow sticks' },
  { id: 9, sNo: 9, name: '15 cm Electric Sparklers', category: 'Colourful Sparklers', unit: 'Box', rate: 47, description: 'Longer burning 15 cm bright electric sparks', popular: true },
  { id: 10, sNo: 10, name: '15 cm Colour Sparklers', category: 'Colourful Sparklers', unit: 'Box', rate: 52, description: '15 cm multi-shade glittering sparklers' },
  { id: 11, sNo: 11, name: '15 cm Green Sparklers', category: 'Colourful Sparklers', unit: 'Box', rate: 58, description: '15 cm intense green dazzling sparklers' },
  { id: 12, sNo: 12, name: '15 cm Red Sparklers', category: 'Colourful Sparklers', unit: 'Box', rate: 65, description: '15 cm rich red fireworks sparklers' },
  { id: 13, sNo: 13, name: '30 cm Electric Sparklers', category: 'Colourful Sparklers', unit: 'Box', rate: 47, description: 'Giant 30 cm long handheld electric sparklers' },
  { id: 14, sNo: 14, name: '30 cm Colour Sparklers', category: 'Colourful Sparklers', unit: 'Box', rate: 52, description: 'Giant 30 cm multi-color celebratory sparklers' },
  { id: 15, sNo: 15, name: '30 cm Green Sparklers', category: 'Colourful Sparklers', unit: 'Box', rate: 58, description: 'Giant 30 cm vibrant green sparklers' },
  { id: 16, sNo: 16, name: '30 cm Red Sparklers', category: 'Colourful Sparklers', unit: 'Box', rate: 65, description: 'Giant 30 cm intense ruby red sparklers', popular: true },
  { id: 17, sNo: 17, name: '50 cm Electric Sparklers', category: 'Colourful Sparklers', unit: 'Tube', rate: 208, description: 'Extra long 50 cm mega duration electric tube sparklers' },
  { id: 18, sNo: 18, name: '50 cm Colour Sparklers', category: 'Colourful Sparklers', unit: 'Tube', rate: 234, description: 'Extra long 50 cm mega multi-colour tube sparklers' },
  { id: 19, sNo: 19, name: 'Rotating Sparklers', category: 'Colourful Sparklers', unit: 'Tube', rate: 260, description: 'Dynamic revolving swirl sparkler with double action', popular: true },

  // SINGLE SOUND CRACKERS (20-24)
  { id: 20, sNo: 20, name: '3 1/2 Lakshmi', category: 'Single Sound Crackers', unit: 'Pkt', rate: 21, description: 'Traditional festive Lakshmi single crisp sound cracker' },
  { id: 21, sNo: 21, name: '4” Lakshmi', category: 'Single Sound Crackers', unit: 'Pkt', rate: 30, description: '4 inch loud classical Lakshmi cracker packet', popular: true },
  { id: 22, sNo: 22, name: '4” Gold Lakshmi', category: 'Single Sound Crackers', unit: 'Pkt', rate: 59, description: 'Gold grade double wrapped loud blast Lakshmi' },
  { id: 23, sNo: 23, name: '5” Bahubali Mega', category: 'Single Sound Crackers', unit: 'Pkt', rate: 78, description: 'Heavy sound 5 inch Bahubali mega cracker blast', popular: true },
  { id: 24, sNo: 24, name: '6” Kumki', category: 'Single Sound Crackers', unit: 'Pkt', rate: 78, description: 'Deep bass resounding 6 inch Kumki sound burst' },

  // FLOWER POTS (25-32)
  { id: 25, sNo: 25, name: 'Flower Pot Big', category: 'Flower Pots', unit: 'Box', rate: 91, description: 'High fountain flower pot with golden sparks', popular: true },
  { id: 26, sNo: 26, name: 'Flower Pot Special', category: 'Flower Pots', unit: 'Box', rate: 130, description: 'Special dense shower flower pot with longer duration' },
  { id: 27, sNo: 27, name: 'Flower Pot Asoka', category: 'Flower Pots', unit: 'Box', rate: 156, description: 'Classical Asoka tall fountain silver blossom pot' },
  { id: 28, sNo: 28, name: 'Flower Pot Deluxe', category: 'Flower Pots', unit: 'Box', rate: 195, description: 'Deluxe extra height glittering fountain pot', popular: true },
  { id: 29, sNo: 29, name: 'Flower Pot Colour Koti', category: 'Flower Pots', unit: 'Box', rate: 234, description: 'Multicolor floral umbrella fountain koti pot' },
  { id: 30, sNo: 30, name: 'Colour Koti Green', category: 'Flower Pots', unit: 'Box', rate: 260, description: 'Rich emerald green tall fountain koti' },
  { id: 31, sNo: 31, name: 'Colour Koti Red', category: 'Flower Pots', unit: 'Box', rate: 260, description: 'Intense ruby red tall fountain koti' },
  { id: 32, sNo: 32, name: 'Flower Pot Elegant', category: 'Flower Pots', unit: 'Box', rate: 371, description: 'Super tall multi-stage sparkling elegant flower pot', featured: true },

  // GROUND CHAKKAR (33-37)
  { id: 33, sNo: 33, name: 'Ground Chakkar Big (25pcs)', category: 'Ground Chakkar', unit: 'Box', rate: 104, description: 'Smooth spinning circular wheel of sparks (25 pieces)', pieces: '25 pcs', popular: true },
  { id: 34, sNo: 34, name: 'Ground Chakkar Spl', category: 'Ground Chakkar', unit: 'Box', rate: 104, description: 'Special spinning wheel with crackling stars' },
  { id: 35, sNo: 35, name: 'Ground Chakkar Deluxe', category: 'Ground Chakkar', unit: 'Box', rate: 156, description: 'High speed wide diameter spinning deluxe chakkar', popular: true },
  { id: 36, sNo: 36, name: 'Ground Chakkar Spinner Deluxe', category: 'Ground Chakkar', unit: 'Box', rate: 195, description: 'Dual ring rapid rotation ground spinner' },
  { id: 37, sNo: 37, name: '4x4 Wheel (5pcs)', category: 'Ground Chakkar', unit: 'Box', rate: 241, description: 'High power 4x4 quad wheel fast spinner (5 pieces)', pieces: '5 pcs' },

  // TWINKLING STARS (38-39)
  { id: 38, sNo: 38, name: '1.5 Twinkling Star', category: 'Twinkling Stars', unit: 'Box', rate: 26, description: 'Continuous glittering aerial twinkling white stars' },
  { id: 39, sNo: 39, name: '4” Twinkling Star', category: 'Twinkling Stars', unit: 'Box', rate: 78, description: '4 inch long burn glittering twinkling star shower' },

  // BOMBS (40-41)
  { id: 40, sNo: 40, name: 'Classic Bomb', category: 'Bombs', unit: 'Box', rate: 156, description: 'Traditional Sivakasi loud concussion blast bomb', popular: true },
  { id: 41, sNo: 41, name: 'Digital Bomb', category: 'Bombs', unit: 'Box', rate: 260, description: 'Heavy thunder digital frequency high blast bomb' },

  // PAPER BOMBS (42-44)
  { id: 42, sNo: 42, name: '1/4 kg Paper Bomb', category: 'Paper Bombs', unit: 'Box', rate: 59, description: 'Safe paper wrapped explosive sound cracker (1/4 kg)' },
  { id: 43, sNo: 43, name: '1/2 kg Paper Bomb', category: 'Paper Bombs', unit: 'Box', rate: 117, description: 'Medium heavy paper wrapped hydro blast cracker' },
  { id: 44, sNo: 44, name: '1 kg Paper Bomb', category: 'Paper Bombs', unit: 'Box', rate: 234, description: 'Mega power 1 kg heavy paper bomb explosion', popular: true },

  // BIJILI CRACKERS (45-46)
  { id: 45, sNo: 45, name: 'Red Bijili (100 pcs)', category: 'Bijili Crackers', unit: 'Pkt', rate: 52, description: 'Packet of 100 fast rapid fire red bijili string crackers', pieces: '100 pcs', popular: true },
  { id: 46, sNo: 46, name: 'Stripped Bijili (100 pcs)', category: 'Bijili Crackers', unit: 'Pkt', rate: 91, description: 'High quality stripped rapid crackers (100 pieces)', pieces: '100 pcs' },

  // PENCIL SHOWERS (47-48)
  { id: 47, sNo: 47, name: 'Water Falls Pencil (5 pcs)', category: 'Pencil Showers', unit: 'Box', rate: 312, description: 'Vertical cascading waterfall shower effect pencils', pieces: '5 pcs' },
  { id: 48, sNo: 48, name: 'Sivakasi Special (2 pcs)', category: 'Pencil Showers', unit: 'Box', rate: 312, description: 'Signature Sivakasi artisan two piece pencil shower', pieces: '2 pcs' },

  // PEACOCK SHOWERS (49-50)
  { id: 49, sNo: 49, name: 'Mini Peacock', category: 'Peacock Showers', unit: 'Box', rate: 260, description: 'Fan shaped colorful peacock feather sparkle spread' },
  { id: 50, sNo: 50, name: 'Bada Peacock', category: 'Peacock Showers', unit: 'Box', rate: 520, description: 'Grand mega wide peacock plumage fireworks display', featured: true },

  // FANCY ROCKETS (51-52)
  { id: 51, sNo: 51, name: 'Rocket Bomb', category: 'Fancy Rockets', unit: 'Box', rate: 78, description: 'Sky ascent rocket with thunder air burst finale', popular: true },
  { id: 52, sNo: 52, name: 'Lunik Rocket', category: 'Fancy Rockets', unit: 'Box', rate: 130, description: 'High altitude screaming rocket with colorful stars' },

  // FOUNTAIN SPECIAL (53-83)
  { id: 53, sNo: 53, name: 'I Cone', category: 'Fountain Special', unit: 'Box', rate: 261, description: 'Sleek conical high blast multicolor fountain' },
  { id: 54, sNo: 54, name: 'Super Car', category: 'Fountain Special', unit: 'Box', rate: 203, description: 'Novelty motorized race car ground fireworks fountain' },
  { id: 55, sNo: 55, name: 'Real Pots', category: 'Fountain Special', unit: 'Box', rate: 261, description: 'Authentic clay style heavy spray floral fountain' },
  { id: 56, sNo: 56, name: 'Rock Star', category: 'Fountain Special', unit: 'Box', rate: 116, description: 'Vibrant energetic color changing fountain spray' },
  { id: 57, sNo: 57, name: 'Goodly Torch', category: 'Fountain Special', unit: 'Box', rate: 203, description: 'Handheld celebratory torch with brilliant shower' },
  { id: 58, sNo: 58, name: '3” Inch Fountain', category: 'Fountain Special', unit: 'Box', rate: 218, description: 'Compact high density 3 inch fireworks fountain' },
  { id: 59, sNo: 59, name: '1000 Watts Fountain', category: 'Fountain Special', unit: 'Box', rate: 232, description: 'Super bright high lumen multi-spark fountain' },
  { id: 60, sNo: 60, name: '2000 Watts Fountain', category: 'Fountain Special', unit: 'Box', rate: 276, description: 'Double blast intense 2000W illumination fountain', popular: true },
  { id: 61, sNo: 61, name: '8” Inch Tin Fountain', category: 'Fountain Special', unit: 'Box', rate: 290, description: 'Heavy metal tin container fountain with golden burst' },
  { id: 62, sNo: 62, name: 'Fruit Series Fountain', category: 'Fountain Special', unit: 'Box', rate: 319, description: 'Aromatic & colorful fruity themed novelty fountain' },
  { id: 63, sNo: 63, name: 'Touch Me Falls', category: 'Fountain Special', unit: 'Box', rate: 203, description: 'Silvery soft cascading waterfall safe sparks' },
  { id: 64, sNo: 64, name: 'Vel Candle Fountain', category: 'Fountain Special', unit: 'Box', rate: 290, description: 'Traditional spiritual candle fountain with sacred sparks' },
  { id: 65, sNo: 65, name: 'Motu Patlu', category: 'Fountain Special', unit: 'Box', rate: 450, description: 'Kid friendly cartoon edition dual action fun fountain' },
  { id: 66, sNo: 66, name: 'Cylinder Bomb', category: 'Fountain Special', unit: 'Box', rate: 174, description: 'Cylindrical shell ground bursting shower' },
  { id: 67, sNo: 67, name: 'Madurai Malli', category: 'Fountain Special', unit: 'Box', rate: 348, description: 'Pure fragrant white jasmine flower shower fountain', popular: true },
  { id: 68, sNo: 68, name: 'Photo Flash', category: 'Fountain Special', unit: 'Box', rate: 102, description: 'Instant camera strobe flash white light burst' },
  { id: 69, sNo: 69, name: 'Helicopter', category: 'Fountain Special', unit: 'Box', rate: 131, description: 'Flying rotor blade aerial spinning toy firework' },
  { id: 70, sNo: 70, name: 'Bambara', category: 'Fountain Special', unit: 'Box', rate: 145, description: 'Traditional spinning top style whirlwind spinner' },
  { id: 71, sNo: 71, name: 'Selfie Stick', category: 'Fountain Special', unit: 'Box', rate: 189, description: 'Long hand grip celebratory fountain for photos' },
  { id: 72, sNo: 72, name: 'Butterfly', category: 'Fountain Special', unit: 'Box', rate: 116, description: 'Fluttering wing aerial ascend butterfly firework' },
  { id: 73, sNo: 73, name: 'Siren', category: 'Fountain Special', unit: 'Box', rate: 174, description: 'Whistling siren sound with rising spark fountain' },
  { id: 74, sNo: 74, name: '4” Fountain', category: 'Fountain Special', unit: 'Box', rate: 232, description: 'Mid size 4 inch high shower fireworks pot' },
  { id: 75, sNo: 75, name: 'Golden Globe', category: 'Fountain Special', unit: 'Box', rate: 131, description: 'Spherical golden ball radiant spark emitter' },
  { id: 76, sNo: 76, name: 'Feather Peacock', category: 'Fountain Special', unit: 'Box', rate: 131, description: 'Delicate iridescent peacock feather sparkles' },
  { id: 77, sNo: 77, name: 'Colour Rain', category: 'Fountain Special', unit: 'Box', rate: 131, description: 'Skyward colored shower droplets falling like rain' },
  { id: 78, sNo: 78, name: 'Electric Stone (10 box)', category: 'Fountain Special', unit: 'Box', rate: 98, description: 'Pocket crackling electric stone sparks (10 small boxes)', pieces: '10 boxes' },
  { id: 79, sNo: 79, name: 'Zee Boo Ba (10 box)', category: 'Fountain Special', unit: 'Box', rate: 87, description: 'Novelty magic snap crackling pop stones (10 boxes)', pieces: '10 boxes' },
  { id: 80, sNo: 80, name: 'Crack Jack', category: 'Fountain Special', unit: 'Box', rate: 377, description: 'High tempo continuous crackling fountain column', popular: true },
  { id: 81, sNo: 81, name: 'Jungle Series Fountain', category: 'Fountain Special', unit: 'Box', rate: 290, description: 'Exotic wild safari multicolor erupting fountain' },
  { id: 82, sNo: 82, name: 'Monkey Star', category: 'Fountain Special', unit: 'Box', rate: 290, description: 'Jumping multi-trajectory star fountain' },
  { id: 83, sNo: 83, name: 'Once More', category: 'Fountain Special', unit: 'Box', rate: 290, description: 'Double cycle repeating fountain performance' },

  // MEGA FANCY VARIETIES (84-92)
  { id: 84, sNo: 84, name: 'Penta', category: 'Mega Fancy Varieties', unit: 'Box', rate: 240, description: '5-star colorful aerial shell burst display' },
  { id: 85, sNo: 85, name: '2” Fancy (1pcs)', category: 'Mega Fancy Varieties', unit: 'Box', rate: 165, description: '2 inch single aerial burst sky shell with parachute stars' },
  { id: 86, sNo: 86, name: '2” Fancy (3pcs)', category: 'Mega Fancy Varieties', unit: 'Box', rate: 480, description: '2 inch triple aerial burst sky shells pack', pieces: '3 pcs', popular: true },
  { id: 87, sNo: 87, name: '3 1/2 Fancy', category: 'Mega Fancy Varieties', unit: 'Box', rate: 345, description: '3.5 inch sky king aerial burst with crackling brocade' },
  { id: 88, sNo: 88, name: '3 1/2 Fancy Double', category: 'Mega Fancy Varieties', unit: 'Box', rate: 690, description: 'Double payload 3.5 inch aerial twin blast shells', featured: true },
  { id: 89, sNo: 89, name: '3 1/2 Navagara Falls', category: 'Mega Fancy Varieties', unit: 'Box', rate: 413, description: 'Nine color planetary waterfall aerial descending stars' },
  { id: 90, sNo: 90, name: '3 1/2 Sizzling Crackering', category: 'Mega Fancy Varieties', unit: 'Box', rate: 413, description: 'High decibel sizzling willow crackle aerial umbrella' },
  { id: 91, sNo: 91, name: '4” Special Fancy', category: 'Mega Fancy Varieties', unit: 'Box', rate: 450, description: 'Large caliber 4 inch high altitude professional aerial shell', popular: true },
  { id: 92, sNo: 92, name: '5” Special Fancy', category: 'Mega Fancy Varieties', unit: 'Box', rate: 840, description: 'Grand 5 inch colossal sky crown aerial showstopper', featured: true },

  // MULTIPLE REPEATING SHOTS (93-101)
  { id: 93, sNo: 93, name: '7 Shot', category: 'Multiple Repeating Shots', unit: 'Box', rate: 150, description: '7 consecutive colorful aerial shots', popular: true },
  { id: 94, sNo: 94, name: '7 Thunder', category: 'Multiple Repeating Shots', unit: 'Box', rate: 150, description: '7 rapid succession thunder sound sky blasts' },
  { id: 95, sNo: 95, name: '12 Shot Rider', category: 'Multiple Repeating Shots', unit: 'Box', rate: 250, description: '12 sequence fast firing aerial comet shots' },
  { id: 96, sNo: 96, name: '12 Shot Multi colour', category: 'Multiple Repeating Shots', unit: 'Box', rate: 250, description: '12 vibrant multicolor sky burst sequence', popular: true },
  { id: 97, sNo: 97, name: '30 Shot Multi colour', category: 'Multiple Repeating Shots', unit: 'Box', rate: 650, description: '30 repeating aerial fireworks with gold brocade', popular: true },
  { id: 98, sNo: 98, name: '60 Shot Multi colour', category: 'Multiple Repeating Shots', unit: 'Box', rate: 1300, description: '60 non-stop aerial extravaganza celebration cake', featured: true },
  { id: 99, sNo: 99, name: '120 Shot Multi colour', category: 'Multiple Repeating Shots', unit: 'Box', rate: 2600, description: '120 shot mega display cake with grand finale', featured: true },
  { id: 100, sNo: 100, name: '150 Shot Gujarat Festival', category: 'Multiple Repeating Shots', unit: 'Box', rate: 3000, description: '150 special festival carnival aerial barrage', featured: true },
  { id: 101, sNo: 101, name: '240 Shot Multi colour', category: 'Multiple Repeating Shots', unit: 'Box', rate: 5000, description: 'Ultimate 240 shot professional festival sky symphony', featured: true },

  // CHORSA & WALA (102-111)
  { id: 102, sNo: 102, name: '28 Chorsa', category: 'Chorsa & Wala', unit: 'Pkt', rate: 26, description: '28 pieces quick burst traditional festive chorsa garland', pieces: '28 pcs' },
  { id: 103, sNo: 103, name: '28 Gaint', category: 'Chorsa & Wala', unit: 'Pkt', rate: 40, description: '28 giant loud crackers connected string garland', pieces: '28 pcs' },
  { id: 104, sNo: 104, name: '56 Gaint', category: 'Chorsa & Wala', unit: 'Pkt', rate: 78, description: '56 giant explosive sound garland packet', pieces: '56 pcs' },
  { id: 105, sNo: 105, name: '50 Deluxe', category: 'Chorsa & Wala', unit: 'Pkt', rate: 156, description: '50 deluxe heavy sound strung garland crackers', pieces: '50 pcs', popular: true },
  { id: 106, sNo: 106, name: '100 Wala', category: 'Chorsa & Wala', unit: 'Box', rate: 72, description: '100 roll continuous rapid fire string garland box', pieces: '100 shots', popular: true },
  { id: 107, sNo: 107, name: '200 Wala', category: 'Chorsa & Wala', unit: 'Box', rate: 130, description: '200 roll festive celebration cracker roll', pieces: '200 shots' },
  { id: 108, sNo: 108, name: '1000 Wala', category: 'Chorsa & Wala', unit: 'Box', rate: 350, description: '1000 wala authentic Sivakasi long red roll', pieces: '1000 shots', popular: true },
  { id: 109, sNo: 109, name: '2000 Wala', category: 'Chorsa & Wala', unit: 'Box', rate: 650, description: '2000 wala grand wedding & Diwali celebratory roll', pieces: '2000 shots' },
  { id: 110, sNo: 110, name: '5000 Wala', category: 'Chorsa & Wala', unit: 'Box', rate: 2000, description: '5000 wala mega festival non-stop sound roll', pieces: '5000 shots', featured: true },
  { id: 111, sNo: 111, name: '10000 Wala', category: 'Chorsa & Wala', unit: 'Box', rate: 3500, description: '10,000 wala grand royal celebration garland roll', pieces: '10000 shots', featured: true },

  // KIDS SPECIAL (112-114)
  { id: 112, sNo: 112, name: 'Snake Serpent', category: 'Kids Special', unit: 'Box', rate: 120, description: 'Classic black tablet growing smoke snake novelties', popular: true },
  { id: 113, sNo: 113, name: 'Roll cap', category: 'Kids Special', unit: 'Box', rate: 110, description: 'Toy gun paper roll caps for festive fun' },
  { id: 114, sNo: 114, name: '10 in 1 Mega Super laptop Matches', category: 'Kids Special', unit: 'Box', rate: 275, description: '10 in 1 colorful novelty spark matchbox collection', popular: true },

  // COLOURFULL SANDPOTS (115-117)
  { id: 115, sNo: 115, name: 'Mini pearl Sandpots', category: 'Colourfull Sandpots', unit: 'Box', rate: 338, description: 'Glittering pearlescent color clay sandpot fountain' },
  { id: 116, sNo: 116, name: '2 in 1 Sandpots', category: 'Colourfull Sandpots', unit: 'Box', rate: 728, description: 'Dual layer color transformation fireworks sandpot' },
  { id: 117, sNo: 117, name: 'Ashrafi Sandpots', category: 'Colourfull Sandpots', unit: 'Box', rate: 676, description: 'Golden royal Ashrafi multi-tier spray sandpot', popular: true },

  // GIFT BOXES (118-127)
  { id: 118, sNo: 118, name: 'Red Rose ( 15 Items )', category: 'Gift Boxes', unit: 'Box', rate: 400, description: 'Starter family assortment pack containing 15 popular items', pieces: '15 items', popular: true },
  { id: 119, sNo: 119, name: 'Lilly ( 22 Items )', category: 'Gift Boxes', unit: 'Box', rate: 600, description: 'Value festival gift combo pack with 22 assorted cracker items', pieces: '22 items' },
  { id: 120, sNo: 120, name: 'Poppy ( 26 Items )', category: 'Gift Boxes', unit: 'Box', rate: 750, description: 'Fun variety pack with sparklers, pots, chakkars (26 items)', pieces: '26 items', popular: true },
  { id: 121, sNo: 121, name: 'Lotus ( 31 Items )', category: 'Gift Boxes', unit: 'Box', rate: 900, description: 'Delightful family pack packed with 31 festive selections', pieces: '31 items' },
  { id: 122, sNo: 122, name: 'Tulip ( 35 Items )', category: 'Gift Boxes', unit: 'Box', rate: 1000, description: 'Bestseller ₹1000 celebration pack with 35 balanced items', pieces: '35 items', popular: true, featured: true },
  { id: 123, sNo: 123, name: 'Jasmine ( 42 Items )', category: 'Gift Boxes', unit: 'Box', rate: 1200, description: 'Premium 42 items selection box for joyous celebrations', pieces: '42 items' },
  { id: 124, sNo: 124, name: 'Marry Gold ( 46 Items )', category: 'Gift Boxes', unit: 'Box', rate: 1400, description: 'Grand Marigold festive banquet box with 46 distinct items', pieces: '46 items', popular: true },
  { id: 125, sNo: 125, name: 'Sun flower ( 51 Items )', category: 'Gift Boxes', unit: 'Box', rate: 1800, description: 'Comprehensive 51 items mega pack with aerial & ground shows', pieces: '51 items', featured: true },
  { id: 126, sNo: 126, name: 'Blue Bell ( 60 Items )', category: 'Gift Boxes', unit: 'Box', rate: 2600, description: 'Royal family bumper box loaded with 60 premium fireworks', pieces: '60 items', featured: true },
  { id: 127, sNo: 127, name: 'Lavender Special ( 30 Items )', category: 'Gift Boxes', unit: 'Box', rate: 4000, description: 'Luxury VIP collection of 30 top-tier repeating shots & shells', pieces: '30 items', featured: true },
];
