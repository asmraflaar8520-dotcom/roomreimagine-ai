import { SampleRoom } from '../types.ts';

export const SAMPLE_ROOMS: SampleRoom[] = [
  {
    id: 'room-living-standard',
    name: 'Dated Suburban Living Room',
    roomType: 'Living Room',
    description: 'Empty beige living space with basic carpet and plain drywall, ready for an elevated structural redesign.',
    originalImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1400&q=80',
    defaultMakeovers: {
      'mid-century-modern': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1400&q=80',
      'scandinavian-warmth': 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1400&q=80',
      'japandi-minimalist': 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1400&q=80',
      'biophilic-oasis': 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1400&q=80',
      'industrial-loft': 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1400&q=80',
      'parisian-chic': 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=80',
      'modern-organic': 'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=1400&q=80'
    }
  },
  {
    id: 'room-bedroom-plain',
    name: 'Bland Compact Bedroom',
    roomType: 'Bedroom',
    description: 'Stark white bedroom with bare walls and sparse lighting, seeking cozy warmth and architectural texture.',
    originalImage: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80',
    defaultMakeovers: {
      'mid-century-modern': 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1400&q=80',
      'scandinavian-warmth': 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1400&q=80',
      'japandi-minimalist': 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1400&q=80',
      'biophilic-oasis': 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1400&q=80',
      'industrial-loft': 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1400&q=80',
      'parisian-chic': 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1400&q=80',
      'modern-organic': 'https://images.unsplash.com/photo-1540518614846-7ede433c4ef9?auto=format&fit=crop&w=1400&q=80'
    }
  },
  {
    id: 'room-dining-nook',
    name: 'Uninspired Dining Nook',
    roomType: 'Dining Area',
    description: 'Chilly dining alcove with outdated lighting and mismatched furniture, ready for cohesive hospitality.',
    originalImage: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1400&q=80',
    defaultMakeovers: {
      'mid-century-modern': 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1400&q=80',
      'scandinavian-warmth': 'https://images.unsplash.com/photo-1533779283484-8da7979bc658?auto=format&fit=crop&w=1400&q=80',
      'japandi-minimalist': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1400&q=80',
      'biophilic-oasis': 'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1400&q=80',
      'industrial-loft': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1400&q=80',
      'parisian-chic': 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80',
      'modern-organic': 'https://images.unsplash.com/photo-1533779283484-8da7979bc658?auto=format&fit=crop&w=1400&q=80'
    }
  }
];
