export interface InteriorStyle {
  id: string;
  name: string;
  tagline: string;
  description: string;
  aestheticPrompt: string;
  palette: { name: string; hex: string }[];
  keyMaterials: string[];
  signatureElements: string[];
  sampleImage: string;
  previewThumbnail: string;
}

export interface SampleRoom {
  id: string;
  name: string;
  roomType: string;
  description: string;
  originalImage: string;
  defaultMakeovers: Record<string, string>; // styleId -> makeover image URL
}

export interface ShoppableItem {
  id: string;
  name: string;
  category: 'Furniture' | 'Lighting' | 'Textiles' | 'Decor' | 'Art' | 'Plants';
  retailer: string;
  priceRange: string;
  matchScore: number;
  description: string;
  searchQuery: string;
  colorway?: string;
  material?: string;
  productUrl?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestedAction?: {
    type: 'restyle' | 'refine_image';
    prompt: string;
    label: string;
  };
  shoppableItems?: ShoppableItem[];
}

export interface RedesignResult {
  imageUrl: string;
  styleId: string;
  styleName: string;
  promptUsed: string;
  designNotes?: string;
  shoppableItems?: ShoppableItem[];
  isAiGenerated: boolean;
}
