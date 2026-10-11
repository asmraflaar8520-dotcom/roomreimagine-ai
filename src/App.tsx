import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.tsx';
import { RoomUpload } from './components/RoomUpload.tsx';
import { StyleCarousel } from './components/StyleCarousel.tsx';
import { CompareSlider } from './components/CompareSlider.tsx';
import { ShoppableItems } from './components/ShoppableItems.tsx';
import { ConsultantChat } from './components/ConsultantChat.tsx';
import { INTERIOR_STYLES } from './data/styles.ts';
import { SAMPLE_ROOMS } from './data/sampleRooms.ts';
import { InteriorStyle, SampleRoom, ShoppableItem, ChatMessage } from './types.ts';
import { Sparkles, SlidersHorizontal, Layers, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [styles, setStyles] = useState<InteriorStyle[]>(INTERIOR_STYLES);
  const [sampleRooms, setSampleRooms] = useState<SampleRoom[]>(SAMPLE_ROOMS);

  const [activeRoomType, setActiveRoomType] = useState<string>('Living Room');
  const [currentOriginalImage, setCurrentOriginalImage] = useState<string>(
    SAMPLE_ROOMS[0].originalImage
  );
  const [activeStyle, setActiveStyle] = useState<InteriorStyle>(INTERIOR_STYLES[0]);
  const [currentMakeoverImage, setCurrentMakeoverImage] = useState<string>(
    SAMPLE_ROOMS[0].defaultMakeovers['mid-century-modern'] || INTERIOR_STYLES[0].sampleImage
  );

  const [isGeneratingDesign, setIsGeneratingDesign] = useState<boolean>(false);
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);
  const [designNotes, setDesignNotes] = useState<string>(
    'Reimagined with low-slung American walnut cabinetry, bouclé texture, and balanced architectural daylight.'
  );

  const [shoppableItems, setShoppableItems] = useState<ShoppableItem[]>([]);
  const [selectedShoppableItem, setSelectedShoppableItem] = useState<ShoppableItem | null>(null);

  // Multi-turn chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      content: `Welcome to your personal architectural design studio! I've prepared a baseline ${INTERIOR_STYLES[0].name} makeover for your room above.\n\nYou can drag the compare slider to inspect the architectural transformation. How does the balance feel to you? You can ask me to adjust color palettes (e.g., "Make the rug navy blue"), swap furniture materials, or source specific shoppable pieces.`,
      timestamp: 'Just now',
      suggestedAction: {
        type: 'refine_image',
        prompt: 'Keep this layout but make the rug navy blue',
        label: '✨ Try: "Make the rug navy blue"',
      },
    },
  ]);

  // Initial fetch of curated styles & items
  useEffect(() => {
    fetchInitialDesign();
  }, []);

  const fetchInitialDesign = async () => {
    try {
      const res = await fetch('/api/presets');
      if (res.ok) {
        const data = await res.json();
        if (data.styles?.length) setStyles(data.styles);
        if (data.sampleRooms?.length) setSampleRooms(data.sampleRooms);
      }
    } catch (e) {
      console.warn('Using local fallback presets:', e);
    }

    // Trigger initial design makeover fetch for items
    handleGenerateMakeover(INTERIOR_STYLES[0], currentOriginalImage);
  };

  // Generate or regenerate makeover
  const handleGenerateMakeover = async (
    targetStyle: InteriorStyle,
    originalImg: string,
    customPrompt?: string
  ) => {
    setIsGeneratingDesign(true);

    try {
      const response = await fetch('/api/generate-design', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalImage: originalImg,
          styleId: targetStyle.id,
          styleName: targetStyle.name,
          roomType: activeRoomType,
          customPrompt,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate design makeover');
      }

      const result = await response.json();

      if (result.imageUrl) {
        setCurrentMakeoverImage(result.imageUrl);
      }
      if (result.shoppableItems?.length) {
        setShoppableItems(result.shoppableItems);
      }
      if (result.designNotes) {
        setDesignNotes(result.designNotes);
      }

      // If this was a custom refinement, add an acknowledgment to chat
      if (customPrompt) {
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setChatMessages((prev) => [
          ...prev,
          {
            id: `makeover-${Date.now()}`,
            role: 'assistant',
            content: `I've updated the room makeover with your customization: "${customPrompt}". Take a look at the interactive comparison slider above to see the revised spatial harmony.`,
            timestamp,
            shoppableItems: result.shoppableItems,
          },
        ]);
      }
    } catch (err: any) {
      console.error('Error generating design:', err);
      // Fallback to sample makeover
      const sampleMatch = sampleRooms.find((r) => r.originalImage === originalImg);
      if (sampleMatch && sampleMatch.defaultMakeovers[targetStyle.id]) {
        setCurrentMakeoverImage(sampleMatch.defaultMakeovers[targetStyle.id]);
      } else {
        setCurrentMakeoverImage(targetStyle.sampleImage);
      }
    } finally {
      setIsGeneratingDesign(false);
    }
  };

  // Handle style selection from carousel
  const handleSelectStyle = (newStyle: InteriorStyle) => {
    setActiveStyle(newStyle);
    handleGenerateMakeover(newStyle, currentOriginalImage);

    // Add note to chat
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChatMessages((prev) => [
      ...prev,
      {
        id: `style-change-${Date.now()}`,
        role: 'assistant',
        content: `Switched styling direction to **${newStyle.name}**.\n${newStyle.description}\n\nNotice how the lighting and materials transition to ${newStyle.keyMaterials.join(', ')}. What elements would you like to tweak?`,
        timestamp,
        suggestedAction: {
          type: 'refine_image',
          prompt: `Enhance ${newStyle.name} aesthetic with warm ambient illumination and custom accents`,
          label: `✨ Refine ${newStyle.name} details`,
        },
      },
    ]);
  };

  // Handle image upload or sample space selection
  const handleImageSelected = (newImage: string, sampleRoom?: SampleRoom) => {
    setCurrentOriginalImage(newImage);
    if (sampleRoom) {
      setActiveRoomType(sampleRoom.roomType);
      if (sampleRoom.defaultMakeovers[activeStyle.id]) {
        setCurrentMakeoverImage(sampleRoom.defaultMakeovers[activeStyle.id]);
      }
    }
    handleGenerateMakeover(activeStyle, newImage);
  };

  // Handle Chat Message
  const handleSendMessage = async (text: string) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp,
    };

    const updatedMessages = [...chatMessages, newMsg];
    setChatMessages(updatedMessages);
    setIsChatLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages,
          currentStyleId: activeStyle.id,
          roomType: activeRoomType,
          hasImage: !!currentOriginalImage,
        }),
      });

      if (!response.ok) {
        throw new Error('Chat failed');
      }

      const data = await response.json();

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.reply || "I've analyzed your thoughts. Here is how we can coordinate these elements.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        shoppableItems: data.shoppableItems,
      };

      if (data.suggestedVisualPrompt) {
        assistantMsg.suggestedAction = {
          type: 'refine_image',
          prompt: data.suggestedVisualPrompt,
          label: data.suggestedActionLabel || `✨ Apply Makeover: "${data.suggestedVisualPrompt.slice(0, 32)}..."`,
        };
      }

      setChatMessages((prev) => [...prev, assistantMsg]);

      // If model returned new shoppable recommendations, update the shoppable section
      if (data.shoppableItems?.length) {
        setShoppableItems(data.shoppableItems);
      }
    } catch (e) {
      console.error('Chat error:', e);
      setChatMessages((prev) => [
        ...prev,
        {
          id: `assistant-err-${Date.now()}`,
          role: 'assistant',
          content:
            "I love that concept! Balancing the tones with warm accent lighting and complementary textures will create an inviting sanctuary. Would you like me to apply this visual update to your 3D makeover?",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestedAction: {
            type: 'refine_image',
            prompt: text,
            label: `✨ Apply: "${text.slice(0, 36)}"`,
          },
        },
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Trigger visual makeover refinement from chat
  const handleApplyRefinement = (prompt: string) => {
    handleGenerateMakeover(activeStyle, currentOriginalImage, prompt);
  };

  // Reset to default sample
  const handleReset = () => {
    const defaultSample = SAMPLE_ROOMS[0];
    setCurrentOriginalImage(defaultSample.originalImage);
    setActiveStyle(INTERIOR_STYLES[0]);
    setCurrentMakeoverImage(defaultSample.defaultMakeovers['mid-century-modern']);
    setActiveRoomType('Living Room');
    handleGenerateMakeover(INTERIOR_STYLES[0], defaultSample.originalImage);
  };

  // Download high-resolution comparison or makeover
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = currentMakeoverImage;
    link.download = `AuraSpace-${activeStyle.name.replace(/\s+/g, '-')}-Design.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#1E1E1C] flex flex-col font-sans">
      {/* Editorial Header */}
      <Header
        roomType={activeRoomType}
        onRoomTypeChange={setActiveRoomType}
        onReset={handleReset}
        onDownload={handleDownload}
        isGenerating={isGeneratingDesign}
        activeStyleName={activeStyle.name}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 py-6">
        {/* Upload & Sample Spaces Section */}
        <RoomUpload
          currentImageUrl={currentOriginalImage}
          onImageSelected={handleImageSelected}
          sampleRooms={sampleRooms}
          isGenerating={isGeneratingDesign}
        />

        {/* Style Carousel */}
        <StyleCarousel
          styles={styles}
          activeStyleId={activeStyle.id}
          onSelectStyle={handleSelectStyle}
          isGenerating={isGeneratingDesign}
        />

        {/* Interactive Compare Slider */}
        <CompareSlider
          originalImageUrl={currentOriginalImage}
          makeoverImageUrl={currentMakeoverImage}
          styleName={activeStyle.name}
          isGenerating={isGeneratingDesign}
          shoppableItems={shoppableItems}
          onSelectShoppableItem={setSelectedShoppableItem}
          designNotes={designNotes}
        />

        {/* Shoppable Items Catalog */}
        <ShoppableItems
          items={shoppableItems}
          selectedItem={selectedShoppableItem}
          onSelectItem={setSelectedShoppableItem}
          styleName={activeStyle.name}
        />

        {/* Context-Aware Styling Consultant Chat */}
        <ConsultantChat
          messages={chatMessages}
          onSendMessage={handleSendMessage}
          onApplyRefinement={handleApplyRefinement}
          isLoading={isChatLoading}
          isGeneratingDesign={isGeneratingDesign}
          styleName={activeStyle.name}
          roomType={activeRoomType}
        />
      </main>

      {/* Editorial Footer */}
      <footer className="border-t border-[#E8E3DA] bg-white py-8 px-4 sm:px-8 mt-auto text-xs text-[#7F776B]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif text-base font-semibold text-[#1F1E1B]">
              AuraSpace Studio
            </span>
            <span>· AI Architectural Interior Design Consultant</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-[#91897C]">
            <span>Powered by Gemini 3.1 & 3.8</span>
            <span>·</span>
            <span>Spatial Layout & Furniture Geometry Retention</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
