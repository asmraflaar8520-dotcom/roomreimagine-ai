import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, MessageSquare, Bot, User, RefreshCw, ShoppingBag, ArrowRight } from 'lucide-react';
import { ChatMessage, ShoppableItem } from '../types.ts';

interface ConsultantChatProps {
  messages: ChatMessage[];
  onSendMessage: (messageText: string) => void;
  onApplyRefinement: (prompt: string) => void;
  isLoading: boolean;
  isGeneratingDesign: boolean;
  styleName: string;
  roomType: string;
}

export const ConsultantChat: React.FC<ConsultantChatProps> = ({
  messages,
  onSendMessage,
  onApplyRefinement,
  isLoading,
  isGeneratingDesign,
  styleName,
  roomType,
}) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const quickPrompts = [
    'Keep this layout but make the rug navy blue',
    'Add warm brushed brass pendant lights',
    'Switch furniture to lighter blonde oak',
    'How should I position the lighting?',
    'Recommend budget-friendly alternatives under $400',
  ];

  return (
    <div className="bg-white rounded-2xl border border-[#E7E2D8] shadow-sm overflow-hidden flex flex-col mb-12">
      {/* Consultant Header */}
      <div className="px-4 sm:px-6 py-4 border-b border-[#EFECE5] bg-[#FAF8F4] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#242220] text-[#E8CCA6] flex items-center justify-center font-serif text-lg font-bold shadow-xs">
            A
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif text-lg font-semibold text-[#1F1E1B]">
                Aura · Design Architect
              </h3>
              <span className="text-[11px] bg-[#EAE5DC] text-[#4A453F] px-2 py-0.5 rounded-full font-medium">
                AI Interior Consultant
              </span>
            </div>
            <p className="text-xs text-[#7A7266]">
              Ask to refine colors, swap materials, adjust lighting, or source custom decor.
            </p>
          </div>
        </div>

        {/* Current Active Context Badge */}
        <div className="flex items-center gap-2 text-xs bg-white border border-[#E4DFD5] px-3 py-1.5 rounded-xl text-[#5F584C]">
          <span className="w-2 h-2 rounded-full bg-[#3B5F43]" />
          <span>Active Context:</span>
          <span className="font-semibold text-[#1F1E1B]">
            {styleName} · {roomType}
          </span>
        </div>
      </div>

      {/* Message Thread */}
      <div className="p-4 sm:p-6 space-y-4 max-h-[460px] min-h-[300px] overflow-y-auto bg-[#FCFBF9]">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';

          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {/* Avatar for assistant */}
              {!isUser && (
                <div className="w-8 h-8 rounded-full bg-[#242220] text-[#E8CCA6] shrink-0 flex items-center justify-center text-xs font-serif font-bold shadow-xs mt-1">
                  A
                </div>
              )}

              {/* Message Bubble */}
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-[#242220] text-white rounded-tr-xs'
                    : 'bg-white border border-[#E9E4DB] text-[#22211F] shadow-xs rounded-tl-xs'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5 opacity-70 text-[11px]">
                  <span>{isUser ? 'You' : 'Aura'}</span>
                  <span>{msg.timestamp}</span>
                </div>

                <div className="whitespace-pre-wrap">{msg.content}</div>

                {/* Suggested Visual Makeover Action */}
                {msg.suggestedAction && (
                  <div className="mt-3.5 pt-3 border-t border-black/10 dark:border-white/10">
                    <button
                      onClick={() => onApplyRefinement(msg.suggestedAction!.prompt)}
                      disabled={isGeneratingDesign}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-[#F3EBE1] hover:bg-[#EBE0D2] text-[#2A2722] rounded-xl text-xs font-semibold transition border border-[#DDD3C4] shadow-xs cursor-pointer disabled:opacity-50"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#A36C28]" />
                      <span>{msg.suggestedAction.label}</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </button>
                  </div>
                )}

                {/* Inline shoppable items preview if attached to message */}
                {msg.shoppableItems && msg.shoppableItems.length > 0 && (
                  <div className="mt-3.5 pt-3 border-t border-[#EFECE5] space-y-2">
                    <span className="text-[11px] uppercase tracking-wider text-[#8A8174] font-semibold block">
                      Recommended Matches
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {msg.shoppableItems.slice(0, 2).map((item) => (
                        <div
                          key={item.id}
                          className="p-2.5 rounded-lg bg-[#FAF8F5] border border-[#E8E2D8] flex flex-col justify-between"
                        >
                          <div>
                            <span className="text-[10px] text-[#8E8476] uppercase">
                              {item.category}
                            </span>
                            <h5 className="font-semibold text-xs text-[#1F1E1B] line-clamp-1">
                              {item.name}
                            </h5>
                            <span className="text-[11px] text-[#4A453C] block mt-0.5">
                              {item.retailer} · {item.priceRange}
                            </span>
                          </div>
                          <a
                            href={`https://www.google.com/search?tbm=shop&q=${encodeURIComponent(`${item.retailer} ${item.name}`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 text-[11px] text-[#935D2A] hover:underline font-medium flex items-center gap-1"
                          >
                            <span>Shop item</span>
                            <ArrowRight className="w-3 h-3" />
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Avatar for user */}
              {isUser && (
                <div className="w-8 h-8 rounded-full bg-[#E5DFC5] text-[#2E2C27] shrink-0 flex items-center justify-center text-xs font-bold shadow-xs mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-full bg-[#242220] text-[#E8CCA6] shrink-0 flex items-center justify-center text-xs font-serif font-bold shadow-xs mt-1">
              A
            </div>
            <div className="bg-white border border-[#E9E4DB] rounded-2xl rounded-tl-xs p-3.5 shadow-xs flex items-center gap-2 text-xs text-[#736B60]">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#947847]" />
              <span>Aura is evaluating spatial balance & curating items...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="px-4 py-2 bg-[#F6F4EE] border-t border-[#EFECE5] flex items-center gap-2 overflow-x-auto scrollbar-none">
        <span className="text-[11px] uppercase tracking-wider text-[#91877A] font-semibold shrink-0">
          Try Asking:
        </span>
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => onSendMessage(prompt)}
            disabled={isLoading || isGeneratingDesign}
            className="shrink-0 px-2.5 py-1 rounded-full bg-white hover:bg-[#EFECE5] text-[#4A453F] hover:text-[#1F1E1B] text-xs font-medium border border-[#DDD6C8] transition cursor-pointer disabled:opacity-50"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Message Input Box */}
      <form
        onSubmit={handleSubmit}
        className="p-3 sm:p-4 bg-white border-t border-[#EAE5DB] flex items-center gap-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`Refine this ${styleName} design (e.g. "Keep this layout but make the rug blue")...`}
          disabled={isLoading || isGeneratingDesign}
          className="flex-1 bg-[#FAF9F6] border border-[#DDD6C9] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#1F1E1B] placeholder-[#9C9385] focus:outline-none focus:ring-2 focus:ring-[#2B2926]/20 transition disabled:opacity-50"
        />

        <button
          type="submit"
          disabled={!inputText.trim() || isLoading || isGeneratingDesign}
          className="px-4 py-2.5 bg-[#22211F] hover:bg-[#3B3934] disabled:opacity-40 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition shadow-sm cursor-pointer"
        >
          <span>Send</span>
          <Send className="w-3.5 h-3.5 text-[#E5CBA3]" />
        </button>
      </form>
    </div>
  );
};
