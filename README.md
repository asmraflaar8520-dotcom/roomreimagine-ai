<div align="center">

# 🏡 AuraSpace | AI Interior Design Studio & Room Makeover

**Transform any space with multimodal Generative AI — featuring interactive Before/After comparison, architectural style presets, and context-aware styling consultations.**

[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Google Gemini API](https://img.shields.io/badge/Google_Gemini-3.8_Flash-8E75B2?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

</div>

---

## 🌟 Overview

**AuraSpace** (RoomReimagine AI) is an architectural-grade interior design web application powered by **Google Gemini Multimodal AI**. It allows homeowners, interior designers, and real estate professionals to visualize photo-realistic room transformations in seconds while preserving room geometry, spatial perspective, and architectural constraints.

---

## ✨ Key Features

- 🔄 **Interactive Before / After Slider**: Seamless split-screen comparison to inspect finishes, textures, and lighting transformations in real-time.
- 🎨 **Curated Aesthetic Styles**: Instant styling presets including *Mid-Century Modern*, *Japandi*, *Warm Scandinavian*, *Industrial Loft*, *Minimalist*, and *Organic Modern*.
- 💬 **Context-Aware AI Design Consultant (Aura)**: Multi-turn chat assistant that understands your uploaded space and suggests color swaps, layout balances, and design refinements.
- 🛋️ **Shoppable Decor & Furniture Catalog**: Intelligent item breakdown identifying statement pieces (sofas, chandeliers, area rugs) with retail references, pricing, and materials.
- ⚡ **Ultra-Responsive & Modern UX**: Built with React 19, Motion micro-interactions, and Tailwind CSS for 60fps fluid performance across mobile and desktop.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons, Motion |
| **Backend** | Node.js, Express, tsx |
| **AI Engine** | Google GenAI SDK (`@google/genai`), Gemini 3.8 Flash & Gemini Vision Models |
| **Deployment** | Vercel / Cloud Ready |

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js (v18.0.0 or later)
- npm or pnpm
- Google Gemini API Key ([Get one at Google AI Studio](https://aistudio.google.com/))

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/asmraflaar8520-dotcom/roomreimagine-ai.git
   cd roomreimagine-ai
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   PORT=3000
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Project Structure

```text
roomreimagine-ai/
├── src/
│   ├── components/         # Modular React components (CompareSlider, Chat, Carousel)
│   ├── data/               # Curated styles, sample rooms, and shoppable decor catalogs
│   ├── types.ts            # Full TypeScript interfaces and schema definitions
│   ├── App.tsx             # Main application orchestrator
│   └── main.tsx            # React DOM root entry
├── server.ts               # Express backend & Gemini API integration
├── api/                    # Vercel Serverless Function entry point
├── vercel.json             # Vercel deployment configuration
├── vite.config.ts          # Vite build configuration
└── package.json            # Dependencies and scripts
```

---

## 🌐 Deploying to Vercel

1. Push your repository to GitHub.
2. Import the project into **[Vercel](https://vercel.com/)**.
3. Add the Environment Variable `GEMINI_API_KEY` under Project Settings > Environment Variables.
4. Click **Deploy**!

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
