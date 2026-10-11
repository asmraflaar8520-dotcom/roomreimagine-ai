import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { INTERIOR_STYLES } from './src/data/styles.ts';
import { SAMPLE_ROOMS } from './src/data/sampleRooms.ts';
import { ShoppableItem } from './src/types.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Support high-resolution image uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Server-side Gemini initialization with required User-Agent header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper to sanitize base64
function parseDataUrl(dataUrl: string): { mimeType: string; base64Data: string } | null {
  if (!dataUrl) return null;
  const match = dataUrl.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
  if (match) {
    return { mimeType: match[1], base64Data: match[2] };
  }
  return null;
}

// Generate curated shoppable items for a given style & refinement
function getCuratedItemsForStyle(styleId: string, customPrompt?: string): ShoppableItem[] {
  const catalog: Record<string, ShoppableItem[]> = {
    'mid-century-modern': [
      {
        id: 'mcm-1',
        name: 'Finn Low-Profile Credenza in American Walnut',
        category: 'Furniture',
        retailer: 'West Elm',
        priceRange: '$999 - $1,299',
        matchScore: 98,
        description: 'Solid walnut and engineered wood with tapered brass peg legs and slatted sliding cabinet doors.',
        searchQuery: 'West Elm walnut credenza tapered legs',
        colorway: 'Rich Walnut',
        material: 'Solid Walnut & Brass'
      },
      {
        id: 'mcm-2',
        name: 'Sputnik 8-Light Brass Chandelier',
        category: 'Lighting',
        retailer: 'CB2',
        priceRange: '$349 - $499',
        matchScore: 96,
        description: 'Sculptural mid-century statement chandelier with antique brass finish and radiating arms.',
        searchQuery: 'CB2 modern sputnik brass chandelier',
        colorway: 'Brushed Brass',
        material: 'Spun Brass'
      },
      {
        id: 'mcm-3',
        name: 'Nova High-Pile Abstract Geometric Wool Rug',
        category: 'Textiles',
        retailer: 'Article',
        priceRange: '$399 - $699',
        matchScore: 94,
        description: 'Hand-tufted 100% New Zealand wool featuring modernist earth-toned geometric ochre and olive forms.',
        searchQuery: 'Article wool geometric area rug 8x10',
        colorway: 'Ochre & Olive',
        material: '100% New Zealand Wool'
      },
      {
        id: 'mcm-4',
        name: 'Kari Organic Bouclé Accent Lounge Chair',
        category: 'Furniture',
        retailer: 'Article',
        priceRange: '$599 - $799',
        matchScore: 95,
        description: 'Soft curved cocoon silhouette wrapped in tactile oatmeal bouclé with tapered solid walnut timber legs.',
        searchQuery: 'Article boucle curved lounge chair walnut',
        colorway: 'Oatmeal Cream',
        material: 'Chunky Bouclé'
      }
    ],
    'scandinavian-warmth': [
      {
        id: 'scan-1',
        name: 'Sven Blonde Oak Modular Coffee Table',
        category: 'Furniture',
        retailer: 'HAY Design',
        priceRange: '$420 - $550',
        matchScore: 97,
        description: 'FSC-certified white oak with soft rounded bullnose edges and smooth organic satin finish.',
        searchQuery: 'HAY light oak coffee table minimalist',
        colorway: 'Bleached Oak',
        material: 'European White Oak'
      },
      {
        id: 'scan-2',
        name: 'Akari 10A Washi Paper Pendant Lantern',
        category: 'Lighting',
        retailer: 'Noguchi / Vitra',
        priceRange: '$380 - $480',
        matchScore: 98,
        description: 'Handmade mulberry washi paper lantern diffusing ethereal, shadowless Nordic ambient glow.',
        searchQuery: 'Akari paper lantern pendant light',
        colorway: 'Chalk White',
        material: 'Mulberry Washi Paper & Bamboo'
      },
      {
        id: 'scan-3',
        name: 'Kivik Chunky Ribbed Wool Throw Blanket',
        category: 'Textiles',
        retailer: 'IKEA / Arket',
        priceRange: '$89 - $149',
        matchScore: 93,
        description: 'Ultra-soft heavyweight pure Scandinavian wool throw in soft heather greige with fringed trim.',
        searchQuery: 'pure wool chunky ribbed throw blanket greige',
        colorway: 'Heather Greige',
        material: 'Pure Virgin Wool'
      },
      {
        id: 'scan-4',
        name: 'Asymmetric Stoneware Ceramic Urn',
        category: 'Decor',
        retailer: 'Ferm Living',
        priceRange: '$95 - $160',
        matchScore: 91,
        description: 'Hand-molded sculptural vase with rough sand texture, perfect for dried lunaria or eucalyptus.',
        searchQuery: 'Ferm Living ceramic sculpted textured vase',
        colorway: 'Matte Bone',
        material: 'Sand Glazed Ceramic'
      }
    ],
    'japandi-minimalist': [
      {
        id: 'jap-1',
        name: 'Kyoto Low Platform Oak Daybed Sofa',
        category: 'Furniture',
        retailer: 'Muuto',
        priceRange: '$1,400 - $1,900',
        matchScore: 98,
        description: 'Minimalist low-profile platform sofa in smoked white oak with firm natural flax linen cushioning.',
        searchQuery: 'Muuto low profile wood platform linen sofa',
        colorway: 'Natural Flax',
        material: 'Smoked Oak & Linen'
      },
      {
        id: 'jap-2',
        name: 'Slatted Hinoki Timber Screen Room Divider',
        category: 'Furniture',
        retailer: 'CB2',
        priceRange: '$599 - $799',
        matchScore: 96,
        description: 'Floor-to-ceiling slatted partition creating subtle architectural privacy and rhythmic linear shadows.',
        searchQuery: 'wood slat folding screen room divider',
        colorway: 'Natural Ash',
        material: 'Solid Hinoki Wood'
      },
      {
        id: 'jap-3',
        name: 'Wabi-Sabi Hand-Knotted Jute Floor Mat',
        category: 'Textiles',
        retailer: 'Armadillo & Co',
        priceRange: '$450 - $750',
        matchScore: 94,
        description: 'Textured organic braided raw jute rug with subtle natural tonal variations and soft underfoot weave.',
        searchQuery: 'Armadillo natural woven jute rug',
        colorway: 'Natural Sand',
        material: 'Organic Jute & Flax'
      },
      {
        id: 'jap-4',
        name: 'Cast Iron & Paper Rice Table Luminaire',
        category: 'Lighting',
        retailer: 'Menu / Audo Copenhagen',
        priceRange: '$220 - $310',
        matchScore: 95,
        description: 'Weighted black cast iron base supporting a translucent ribbed paper shade with integrated dimmer.',
        searchQuery: 'Audo Copenhagen hashira table lamp',
        colorway: 'Charcoal & Rice Paper',
        material: 'Cast Iron & Linen Paper'
      }
    ],
    'biophilic-oasis': [
      {
        id: 'bio-1',
        name: 'Monstera & Ficus Architectural Plant Collection in Terracotta',
        category: 'Plants',
        retailer: 'The Sill',
        priceRange: '$140 - $260',
        matchScore: 99,
        description: 'Mature air-purifying indoor specimens in hand-thrown Italian porous terracotta floor planters.',
        searchQuery: 'The Sill large bird of paradise terracotta planter',
        colorway: 'Verdant Green & Terracotta',
        material: 'Living Flora & Tuscan Clay'
      },
      {
        id: 'bio-2',
        name: 'Live-Edge Suar Hardwood Cocktail Table',
        category: 'Furniture',
        retailer: 'Crate & Barrel',
        priceRange: '$899 - $1,199',
        matchScore: 97,
        description: 'Single continuous slab of sustainably salvaged wood with natural organic bark edge contour.',
        searchQuery: 'Crate and Barrel live edge wood coffee table',
        colorway: 'Warm Amber Wood',
        material: 'Solid Suar Hardwood'
      },
      {
        id: 'bio-3',
        name: 'Handwoven Palm Leaf Floor Dome Lamp',
        category: 'Lighting',
        retailer: 'Anthropologie',
        priceRange: '$298 - $420',
        matchScore: 94,
        description: 'Arched wicker floor lamp that projects warm tropical leaf-patterned ambient light across ceilings.',
        searchQuery: 'Anthropologie woven rattan dome floor lamp',
        colorway: 'Natural Rattan',
        material: 'Braided Palm Leaf & Rattan'
      },
      {
        id: 'bio-4',
        name: 'Curved Cream Bouclé Modular Sectional',
        category: 'Furniture',
        retailer: 'CB2',
        priceRange: '$2,299 - $3,499',
        matchScore: 96,
        description: 'Organic undulating curved 3-piece sectional creating conversation islands and softening room angles.',
        searchQuery: 'CB2 curved boucle sectional sofa cream',
        colorway: 'Ivory Pebble',
        material: 'Textured Pebble Bouclé'
      }
    ],
    'industrial-loft': [
      {
        id: 'ind-1',
        name: 'Distressed Cognac Saddle Leather Chesterfield',
        category: 'Furniture',
        retailer: 'Restoration Hardware / Pottery Barn',
        priceRange: '$2,499 - $3,899',
        matchScore: 98,
        description: 'Hand-burnished Italian top-grain leather with deep button tufting and rich patina that ages gracefully.',
        searchQuery: 'Pottery Barn tufted cognac leather sofa',
        colorway: 'Caramel Cognac',
        material: 'Full-Grain Italian Leather'
      },
      {
        id: 'ind-2',
        name: 'Crittall Blackened Steel Grid Floor Mirror',
        category: 'Decor',
        retailer: 'West Elm',
        priceRange: '$499 - $699',
        matchScore: 96,
        description: 'Multi-pane windowpane standing mirror constructed with industrial welded iron and beveled glass.',
        searchQuery: 'West Elm industrial windowpane floor mirror',
        colorway: 'Matte Iron Black',
        material: 'Blackened Iron & Beveled Mirror'
      },
      {
        id: 'ind-3',
        name: 'Edison Filament Linear Iron Cage Pendant',
        category: 'Lighting',
        retailer: 'CB2',
        priceRange: '$399 - $549',
        matchScore: 95,
        description: 'Architectural beam suspension holding exposed amber tubular filament bulbs in cage frames.',
        searchQuery: 'CB2 industrial linear pendant light chandelier',
        colorway: 'Gunmetal Iron',
        material: 'Raw Welded Steel'
      },
      {
        id: 'ind-4',
        name: 'Cast Iron Wheel Cart Reclaimed Coffee Table',
        category: 'Furniture',
        retailer: 'Wayfair Professional',
        priceRange: '$420 - $650',
        matchScore: 92,
        description: 'Reclaimed pine planks mounted on functional factory iron casters with riveted steel corners.',
        searchQuery: 'factory cart reclaimed wood coffee table wheels',
        colorway: 'Weathered Pine & Iron',
        material: 'Reclaimed Barnwood'
      }
    ],
    'parisian-chic': [
      {
        id: 'par-1',
        name: 'Baroque Gilt Antique Floor Leaner Mirror',
        category: 'Decor',
        retailer: 'Anthropologie',
        priceRange: '$898 - $1,598',
        matchScore: 99,
        description: 'Handcrafted ornate resin and wood frame featuring French neoclassical acanthus leaf cresting.',
        searchQuery: 'Anthropologie gleaming primrose mirror gold 7ft',
        colorway: 'Antique French Gold',
        material: 'Hand-Gilded Cast Wood'
      },
      {
        id: 'par-2',
        name: 'Calacatta Viola Fluted Marble Plinth Table',
        category: 'Furniture',
        retailer: 'CB2',
        priceRange: '$799 - $1,299',
        matchScore: 97,
        description: 'Substantial honed marble plinth with dramatic burgundy veining and architectural fluted facade.',
        searchQuery: 'CB2 marble plinth coffee table viola',
        colorway: 'Viola Burgundy & Cream',
        material: 'Natural Calacatta Marble'
      },
      {
        id: 'par-3',
        name: 'Cloud White Velvet Sculptural Curved Settee',
        category: 'Furniture',
        retailer: 'Lulu and Georgia',
        priceRange: '$1,899 - $2,699',
        matchScore: 95,
        description: 'Couture rounded silhouette upholstered in high-performance liquid-repellent Parisian cotton velvet.',
        searchQuery: 'Lulu and Georgia curved white velvet sofa',
        colorway: 'Alabaster Velvet',
        material: 'Plush Cotton Velvet'
      },
      {
        id: 'par-4',
        name: 'Petite Marie Antoinette Crystal Chandelier',
        category: 'Lighting',
        retailer: 'Visual Comfort',
        priceRange: '$650 - $980',
        matchScore: 94,
        description: 'Draped crystal prisms and gilded candle arms creating sparkling refractive European daylight.',
        searchQuery: 'Visual Comfort traditional crystal chandelier brass',
        colorway: 'Polished Brass & Crystal',
        material: 'Hand-Cut Faceted Crystal'
      }
    ],
    'modern-organic': [
      {
        id: 'org-1',
        name: 'Honed Travertine Slab Low Cocktail Table',
        category: 'Furniture',
        retailer: 'Crate & Barrel',
        priceRange: '$899 - $1,400',
        matchScore: 98,
        description: 'Monolithic geometric block of matte unfilled Roman travertine with soft rounded chamfered corners.',
        searchQuery: 'Crate and Barrel travertine slab coffee table',
        colorway: 'Warm Roman Travertine',
        material: 'Natural Honed Travertine'
      },
      {
        id: 'org-2',
        name: 'Plaster Arc Sculptural Vessel Table Lamp',
        category: 'Lighting',
        retailer: 'Amber Interiors / Shoppe',
        priceRange: '$380 - $520',
        matchScore: 97,
        description: 'Chalky textured plaster base with organic conical linen shade and brass push-turn socket.',
        searchQuery: 'ceramic plaster sculptural table lamp linen shade',
        colorway: 'Bone Plaster',
        material: 'Cast Plaster & Raw Linen'
      },
      {
        id: 'org-3',
        name: 'Hand-Knotted Moroccan Cream & Charcoal Wool Rug',
        category: 'Textiles',
        retailer: 'Nordic Knots',
        priceRange: '$790 - $1,290',
        matchScore: 96,
        description: 'Heavyweight organic wool woven by master artisans with subtle undulating asymmetrical linear art.',
        searchQuery: 'Nordic Knots cream wool rug minimalist',
        colorway: 'Ivory Bone & Charcoal',
        material: '100% High-Pile Wool'
      },
      {
        id: 'org-4',
        name: 'Curved Asymmetrical Cloud Bouclé Sectional',
        category: 'Furniture',
        retailer: 'Sixpenny',
        priceRange: '$2,400 - $3,600',
        matchScore: 95,
        description: 'Down-filled deep modular cloud sofa designed for luxurious relaxed lounging with removable linen slipcover.',
        searchQuery: 'Sixpenny down filled organic curved sofa',
        colorway: 'Warm Oat Linen',
        material: 'Natural Washed Linen & Down'
      }
    ]
  };

  const items = catalog[styleId] || catalog['mid-century-modern'];

  // If user asked for something specific like "blue rug", adjust colorway dynamically
  if (customPrompt && customPrompt.toLowerCase().includes('blue')) {
    return items.map(item => {
      if (item.category === 'Textiles') {
        return {
          ...item,
          name: item.name.replace(/Ochre|Ivory|Heather|Cream/i, 'Deep Indigo & Cobalt'),
          colorway: 'Cobalt / Mineral Blue',
          description: item.description + ' Customized with a deep mineral blue and indigo dyed palette as requested.',
          searchQuery: item.searchQuery + ' navy blue'
        };
      }
      return item;
    });
  }

  return items;
}

// 1. API: List styles & sample rooms
app.get('/api/presets', (_req, res) => {
  res.json({
    styles: INTERIOR_STYLES,
    sampleRooms: SAMPLE_ROOMS,
  });
});

// 2. API: Generate / Refine Room Design Makeover
app.post('/api/generate-design', async (req, res) => {
  try {
    const {
      originalImage,
      styleId,
      customPrompt,
      roomType = 'Living Room',
    } = req.body;

    const selectedStyle = INTERIOR_STYLES.find((s) => s.id === styleId) || INTERIOR_STYLES[0];

    // Determine target prompt combining selected aesthetic + room geometry retention instructions
    const promptText = `
Professional architectural interior makeover photo of the uploaded room.
Style: ${selectedStyle.name}.
Target Room: ${roomType}.
Design Direction: ${selectedStyle.aestheticPrompt}.
${customPrompt ? `Client Specific Customization Request: "${customPrompt}". Ensure this specific change is prominently applied.` : ''}

CRITICAL ARCHITECTURAL CONSTRAINTS:
1. Preserve the architectural layout, room perspective, wall placement, and windows from the source photo.
2. Completely reimagine the furniture, surface materials, lighting, textures, wall colors, flooring, rugs, and accessories according to the chosen style.
3. Photorealistic, high dynamic range, warm architectural interior magazine photography.
`.trim();

    let generatedImageUrl: string | null = null;
    let isAiGenerated = false;
    let aiDesignNotes = '';

    // Check if we have an image base64
    const parsedOriginal = parseDataUrl(originalImage);

    // Attempt generation with Gemini image preview model
    // As requested: gemini-3.1-flash-image-preview
    if (process.env.GEMINI_API_KEY) {
      try {
        console.log(`Calling Gemini image preview model for style: ${selectedStyle.name}...`);
        
        const contentsPayload: any = {
          parts: []
        };

        if (parsedOriginal) {
          contentsPayload.parts.push({
            inlineData: {
              data: parsedOriginal.base64Data,
              mimeType: parsedOriginal.mimeType || 'image/jpeg',
            },
          });
        }

        contentsPayload.parts.push({
          text: promptText,
        });

        // Call gemini-3.1-flash-image-preview (with fallback to gemini-3.1-flash-image)
        let response;
        try {
          response = await ai.models.generateContent({
            model: 'gemini-3.1-flash-image-preview',
            contents: contentsPayload,
          });
        } catch (previewErr: any) {
          console.warn('gemini-3.1-flash-image-preview fallback:', previewErr?.message);
          response = await ai.models.generateContent({
            model: 'gemini-3.1-flash-image',
            contents: contentsPayload,
          });
        }

        // Iterate through all candidates and parts to find generated inlineData image
        const parts = response.candidates?.[0]?.content?.parts || [];
        for (const part of parts) {
          if (part.inlineData && part.inlineData.data) {
            const mime = part.inlineData.mimeType || 'image/png';
            generatedImageUrl = `data:${mime};base64,${part.inlineData.data}`;
            isAiGenerated = true;
            console.log('Successfully generated AI room makeover image.');
            break;
          } else if (part.text) {
            aiDesignNotes += part.text + ' ';
          }
        }
      } catch (geminiError: any) {
        console.warn('Image generation model API call notice:', geminiError?.message);
      }
    }

    // Fallback if model did not return inline image bytes:
    // We select the high-definition makeover curated image for this room & style
    if (!generatedImageUrl) {
      // Find matching sample room default makeover if available
      const sampleMatch = SAMPLE_ROOMS.find((r) => r.originalImage === originalImage);
      if (sampleMatch && sampleMatch.defaultMakeovers[styleId]) {
        generatedImageUrl = sampleMatch.defaultMakeovers[styleId];
      } else {
        // Fall back to style showcase image
        generatedImageUrl = selectedStyle.sampleImage;
      }
    }

    // Curate shoppable items
    const shoppableItems = getCuratedItemsForStyle(selectedStyle.id, customPrompt);

    res.json({
      imageUrl: generatedImageUrl,
      styleId: selectedStyle.id,
      styleName: selectedStyle.name,
      promptUsed: promptText,
      designNotes: aiDesignNotes.trim() || `Reimagined in ${selectedStyle.name} style featuring ${selectedStyle.keyMaterials.join(', ')} and warm architectural layering.`,
      shoppableItems,
      isAiGenerated,
    });
  } catch (err: any) {
    console.error('Error in /api/generate-design:', err);
    res.status(500).json({ error: err?.message || 'Failed to generate design makeover' });
  }
});

// 3. API: Context-Aware Design Consultant Chat
app.post('/api/chat', async (req, res) => {
  try {
    const {
      messages,
      currentStyleId,
      roomType = 'Living Room',
      hasImage = false,
    } = req.body;

    const style = INTERIOR_STYLES.find((s) => s.id === currentStyleId) || INTERIOR_STYLES[0];

    // Build system instruction giving Aura her specific consultant role
    const systemInstruction = `
You are Aura, an award-winning senior interior architect and design consultant at AuraSpace.
You specialize in transforming spaces with sophisticated spatial layouts, high-end material palettes, lighting design, and cohesive furniture selections.

CURRENT ACTIVE CONSULTATION CONTEXT:
- Active Room Type: ${roomType}
- Selected Design Style: ${style.name} (${style.tagline})
- Key Materials: ${style.keyMaterials.join(', ')}
- Core Signature Elements: ${style.signatureElements.join(', ')}
- Primary Palette: ${style.palette.map((c) => `${c.name} (${c.hex})`).join(', ')}
- Has Uploaded Photo: ${hasImage ? 'Yes, user is actively viewing their room visualization' : 'Using sample space'}

YOUR CONSULTING DIRECTIVES:
1. Provide articulate, warm, and highly professional advice. Focus on textures, spatial flow, lighting layers (ambient, task, accent), and scale.
2. If the user asks for a refinement (e.g., "Make the rug blue", "Change the coffee table to marble", "Add more plants", "Make it cozier"):
   - Validate and enthusiastically recommend the exact design treatment.
   - Provide a clear 'suggestedVisualPrompt' string summarizing how the 3D visualization prompt should be updated so the user can click to apply it.
3. Recommend 2 to 4 shoppable items relevant to the user's questions or current style with real retail brands (e.g. West Elm, CB2, Article, HAY, IKEA, Muuto, Anthropologie, Crate & Barrel).
4. Provide 3 thoughtful quick-reply prompt options that the user can ask next to explore deeper styling options.
5. You MUST return your response formatted strictly as a JSON object adhering to this schema.
`.trim();

    // Prepare conversation history for Gemini
    const contents: any[] = [];

    // Add recent turns (up to 10 for rich context)
    const recentMessages = Array.isArray(messages) ? messages.slice(-10) : [];
    for (const msg of recentMessages) {
      contents.push({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      });
    }

    // Call gemini-3.8-flash (or gemini-3.5-flash) with structured JSON response
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: contents.length > 0 ? contents : [{ role: 'user', parts: [{ text: 'Hello! How can we refine this space?' }] }],
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reply: {
              type: Type.STRING,
              description: 'The conversational, insightful response from the interior designer.',
            },
            suggestedVisualPrompt: {
              type: Type.STRING,
              description: 'Optional prompt to update the 3D image makeover if the user asked for a visual alteration (e.g. change rug color, add plants). Null if purely informational.',
            },
            suggestedActionLabel: {
              type: Type.STRING,
              description: 'Short button label for the visual update action, e.g., "Apply Navy Rug Makeover".',
            },
            shoppableItems: {
              type: Type.ARRAY,
              description: 'List of recommended furniture, lighting, or decor products.',
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  category: {
                    type: Type.STRING,
                    description: 'One of Furniture, Lighting, Textiles, Decor, Art, Plants',
                  },
                  retailer: { type: Type.STRING },
                  priceRange: { type: Type.STRING },
                  matchScore: { type: Type.INTEGER },
                  description: { type: Type.STRING },
                  searchQuery: { type: Type.STRING },
                  colorway: { type: Type.STRING },
                  material: { type: Type.STRING },
                },
                required: ['id', 'name', 'category', 'retailer', 'priceRange', 'description', 'searchQuery'],
              },
            },
            quickSuggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '3 quick follow-up prompt options for the user.',
            },
          },
          required: ['reply'],
        },
      },
    });

    const rawJson = response.text?.trim() || '{}';
    let parsedData: any = {};
    try {
      parsedData = JSON.parse(rawJson);
    } catch (parseErr) {
      parsedData = {
        reply: rawJson || 'I would love to help you refine this room! How would you like to balance the materials and lighting?',
        shoppableItems: getCuratedItemsForStyle(style.id),
        quickSuggestions: ['Make the rug blue', 'Add warm brass lighting', 'Introduce more greenery'],
      };
    }

    res.json(parsedData);
  } catch (err: any) {
    console.error('Error in /api/chat:', err);
    // Provide a graceful fallback response
    res.json({
      reply: "I love the bones of this space. To elevate this style even further, consider introducing textured natural materials like washed linen or warm oak, and layering warm dimmable accent lighting to balance shadows.",
      shoppableItems: getCuratedItemsForStyle(req.body.currentStyleId || 'mid-century-modern'),
      quickSuggestions: [
        'How should I position the lighting?',
        'Keep this layout but make the rug navy blue',
        'Recommend budget-friendly alternatives'
      ]
    });
  }
});

// Setup Vite middleware in dev or static serving in prod
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AuraSpace server running at http://0.0.0.0:${PORT}`);
  });
}

if (!process.env.VERCEL) {
  start();
}

export default app;
