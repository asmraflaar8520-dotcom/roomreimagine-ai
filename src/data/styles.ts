import { InteriorStyle } from '../types.ts';

export const INTERIOR_STYLES: InteriorStyle[] = [
  {
    id: 'mid-century-modern',
    name: 'Mid-Century Modern',
    tagline: 'Iconic 1950s woodcraft, organic curves & rich ochre tones',
    description: 'Clean geometric lines, tapered peg legs, warm walnut timbers, tactile bouclé, and playful pops of burnt orange, olive green, and mustard.',
    aestheticPrompt: 'Mid-Century Modern interior design transformation. Warm walnut timber credenzas and coffee table, Eames-style lounge chair, tapered brass peg legs, low-profile sofa in warm oatmeal bouclé, abstract geometric brass chandelier, olive green and mustard yellow velvet accent pillows, framed Bauhaus modernist wall art, large fiddle-leaf fig in ceramic planter, natural warm directional daylight.',
    palette: [
      { name: 'Walnut Wood', hex: '#5C4033' },
      { name: 'Ochre Gold', hex: '#C68B29' },
      { name: 'Olive Moss', hex: '#556B2F' },
      { name: 'Warm Cream', hex: '#F4EFEA' },
      { name: 'Brushed Brass', hex: '#D4AF37' }
    ],
    keyMaterials: ['American Walnut', 'Bouclé Fabric', 'Brushed Brass', 'Molded Plywood'],
    signatureElements: ['Sputnik pendant light', 'Tapered leg credenza', 'Abstract geometric rug', 'Sculptural accent armchair'],
    sampleImage: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1400&q=80',
    previewThumbnail: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'scandinavian-warmth',
    name: 'Scandinavian Warmth',
    tagline: 'Hygge serenity, light ash wood, wool blankets & calm daylight',
    description: 'Minimalist functionality meets cozy hygge. Light whitewashed oak, neutral linen drapery, textured wool throws, gentle curving silhouettes, and airy illumination.',
    aestheticPrompt: 'Warm Scandinavian interior design makeover. Light blonde ash and white oak flooring, cozy modular linen sofa in chalk grey, chunky ribbed wool knit throws, ceramic matte vases with dried eucalyptus stems, minimalist Noguchi paper lantern pendant, sheer linen floor-to-ceiling curtains diffusing soft Scandinavian daylight, serene uncluttered calming atmosphere.',
    palette: [
      { name: 'Bleached Ash', hex: '#E8E1D5' },
      { name: 'Chalk White', hex: '#F9F8F6' },
      { name: 'Soft Greige', hex: '#C7BEB5' },
      { name: 'Nordic Sky', hex: '#9AA8B0' },
      { name: 'Charcoal Accent', hex: '#2F3235' }
    ],
    keyMaterials: ['Light Oak', 'Natural Linen', 'Sheared Wool', 'Matte Stoneware'],
    signatureElements: ['Paper lantern pendant', 'Woven wool rug', 'Curved ash wood coffee table', 'Minimalist timber shelving'],
    sampleImage: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1400&q=80',
    previewThumbnail: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'japandi-minimalist',
    name: 'Japandi Minimalist',
    tagline: 'Japanese wabi-sabi balance married with Nordic simplicity',
    description: 'Harmony of Japanese rustic minimalism and Scandinavian warmth. Low-slung furniture, slatted wood screens, textured limewash walls, earth ceramics, and mindful negative space.',
    aestheticPrompt: 'Japandi interior design transformation. Textured beige limewash walls, low-profile minimalist platform furniture, vertical oak slat accent partition, tatami-inspired textured woven jute rug, handmade wabi-sabi imperfect ceramic pottery, single ikebana floral branch, concealed warm ambient LED cove lighting, calm peaceful Zen atmosphere with deliberate negative space.',
    palette: [
      { name: 'Limewash Clay', hex: '#DED3C4' },
      { name: 'Smoked Oak', hex: '#635345' },
      { name: 'Bonsai Pine', hex: '#3B4A3F' },
      { name: 'Soot Black', hex: '#232220' },
      { name: 'Rice Paper', hex: '#F6F3EC' }
    ],
    keyMaterials: ['Slatted Hinoki / Oak', 'Textured Limewash', 'Woven Paper Cord', 'Raw Ceramic'],
    signatureElements: ['Low-profile platform sofa', 'Vertical slat divider', 'Wabi-sabi stoneware urn', 'Ikebana branch art'],
    sampleImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1400&q=80',
    previewThumbnail: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'biophilic-oasis',
    name: 'Biophilic Oasis',
    tagline: 'Lush indoor greenery, raw natural timber & sun-drenched sanctuary',
    description: 'Bringing the outdoors inside. Abundant architectural plants, living wall accents, organic curved travertine, terracotta pots, linen textiles, and daylight maximization.',
    aestheticPrompt: 'Biophilic interior design makeover. Abundant verdant indoor plants including giant bird of paradise, monstera deliciosa, and hanging trailing pothos in terracotta planters, live-edge natural suar wood coffee table, organic ivory linen curved sectional, rough travertine stone accent console, warm natural sunlight streaming through generous windows casting leaf shadows, botanical organic sanctuary.',
    palette: [
      { name: 'Botanical Emerald', hex: '#264E36' },
      { name: 'Terracotta Earth', hex: '#C26D4D' },
      { name: 'Warm Travertine', hex: '#E2DAC8' },
      { name: 'Moss Green', hex: '#4B6858' },
      { name: 'Raw Rattan', hex: '#D4B58A' }
    ],
    keyMaterials: ['Live-Edge Timber', 'Travertine Stone', 'Woven Rattan', 'Handcrafted Terracotta'],
    signatureElements: ['Floor-to-ceiling potted flora', 'Travertine plinth table', 'Rattan woven floor lamps', 'Linen organic modular sofa'],
    sampleImage: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1400&q=80',
    previewThumbnail: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'industrial-loft',
    name: 'Industrial Loft',
    tagline: 'Distressed red brick, matte black steel & rugged caramel leather',
    description: 'Urban architectural character. Exposed reclaimed brickwork, black iron frame partitions, caramel saddle leather sofa, concrete accents, and warm filament ambient lighting.',
    aestheticPrompt: 'Industrial loft interior design makeover. Exposed warm weathered red brick feature wall, distressed caramel cognac leather Chesterfield sofa, matte black welded iron frame shelving and mullioned Crittall glass doors, polished light concrete flooring, Edison filament bulb iron cage chandelier, reclaimed rustic timber and steel cocktail table, expansive warehouse style loft feeling.',
    palette: [
      { name: 'Aged Cognac', hex: '#8E4A28' },
      { name: 'Matte Cast Iron', hex: '#212121' },
      { name: 'Distressed Brick', hex: '#A34836' },
      { name: 'Poured Concrete', hex: '#9E9D9B' },
      { name: 'Warm Amber Light', hex: '#E6A552' }
    ],
    keyMaterials: ['Cognac Leather', 'Blackened Steel', 'Reclaimed Pine', 'Polished Concrete'],
    signatureElements: ['Crittall steel frame mirror', 'Edison bulb chandelier', 'Cognac leather tufted couch', 'Reclaimed wood coffee cart'],
    sampleImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1400&q=80',
    previewThumbnail: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'parisian-chic',
    name: 'Parisian Chic',
    tagline: 'Haussmannian wall mouldings, herringbone parquet & gilded mirrors',
    description: 'Classic European grandeur paired with contemporary Parisian understated elegance. Ornate wall boiserie, chevron hardwood, gilded antique mirror, marble fireplace, and velvet touches.',
    aestheticPrompt: 'Haussmann Parisian chic interior design transformation. Ornate white boiserie wall mouldings, French chevron herringbone blonde parquet wood flooring, grand antique gilded gold baroque floor-standing mirror, modern sculptural cloud white velvet sofa, marble top oval pedestal coffee table, delicate crystal chandelier, effortlessly refined French editorial apartment.',
    palette: [
      { name: 'Antique Gilt Gold', hex: '#CFB53B' },
      { name: 'Alabaster Plaster', hex: '#F7F6F2' },
      { name: 'Noir Lacquer', hex: '#1C1B1A' },
      { name: 'Dusty Rose Velvet', hex: '#B88E8D' },
      { name: 'French Grey', hex: '#B0B4B5' }
    ],
    keyMaterials: ['French Herringbone Parquet', 'Carrara Marble', 'Gilded Wood', 'Silk Velvet'],
    signatureElements: ['Baroque gilt mirror', 'Boiserie wall paneling', 'Sculptural velvet sofa', 'Fluted marble coffee plinth'],
    sampleImage: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=80',
    previewThumbnail: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'modern-organic',
    name: 'Modern Organic',
    tagline: 'Soft sculptural curves, plaster niches & textural cream warmth',
    description: 'Effortlessly elevated and tactile. Rounded bouclé seating, curved plaster architectural niches, lime-wash tones, raw travertine, and serene tonal layering.',
    aestheticPrompt: 'Modern organic interior design transformation. Softly curved architectural plaster wall alcoves and niches, rounded oversized bouclé ivory sectional sofa, custom honed travertine low cocktail table, layered hand-knotted high-pile wool Moroccan rug in cream and charcoal, organic ceramic sculptural table lamps, neutral calm high-end contemporary sanctuary.',
    palette: [
      { name: 'Almond Bouclé', hex: '#EFE8DE' },
      { name: 'Honed Travertine', hex: '#D7CCBE' },
      { name: 'Warm Sandstone', hex: '#C2B19F' },
      { name: 'Espresso Timber', hex: '#3E342F' },
      { name: 'Soft Bone', hex: '#FBF9F5' }
    ],
    keyMaterials: ['Honed Travertine', 'Chunky Bouclé', 'Hand-Knotted Wool', 'Sculptural Plaster'],
    signatureElements: ['Curved asymmetrical sofa', 'Travertine slab table', 'Arched plaster wall niche', 'Ceramic vessel lamp'],
    sampleImage: 'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=1400&q=80',
    previewThumbnail: 'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=400&q=80'
  }
];
