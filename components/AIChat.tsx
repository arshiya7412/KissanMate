import React, { useState, useRef, useEffect } from 'react';
import { Send, Image as ImageIcon, X, Loader2, Sprout } from 'lucide-react';
import { UserProfile, ChatMessage } from '../types';
import { sendMessageToGemini } from '../services/geminiService';
import { translations } from '../translations';
import Button from './Button';

interface AIChatProps {
  userProfile: UserProfile;
}

const AIChat: React.FC<AIChatProps> = ({ userProfile }) => {
  const t = translations[userProfile.language] || translations['English'];
  
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: `${t.namaste} ${userProfile.name}! ${t.chatWelcome}`
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = async () => {
    if ((!input.trim() && !selectedImage) || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      image: selectedImage || undefined
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setSelectedImage(null);
    setIsLoading(true);

    const responseText = await sendMessageToGemini(
      userMsg.text, 
      messages, 
      userProfile, 
      userMsg.image
    );

    const modelMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText
    };

    setMessages(prev => [...prev, modelMsg]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-gray-50">
      {/* Header */}
      <div className="bg-white p-4 border-b border-gray-200 flex items-center gap-3 sticky top-0 z-10">
        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
          <Sprout className="text-green-600 w-6 h-6" />
        </div>
        <div>
          <h2 className="font-semibold text-gray-800">KisaanMate Assistant</h2>
          <p className="text-xs text-gray-500">Always Organic • Beginner Friendly</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[85%] rounded-2xl p-4 shadow-sm ${
                msg.role === 'user' 
                ? 'bg-green-600 text-white rounded-br-none' 
                : 'bg-white text-gray-900 border border-gray-100 rounded-bl-none'
              }`}
            >
              {msg.image && (
                <img 
                  src={msg.image} 
                  alt="User upload" 
                  className="w-full h-48 object-cover rounded-lg mb-3 border border-white/20" 
                />
              )}
              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white p-4 rounded-2xl rounded-bl-none border border-gray-100 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-green-600" />
              <span className="text-sm text-gray-500">{t.thinking}</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-3">
        {selectedImage && (
          <div className="mb-2 relative inline-block">
            <img src={selectedImage} alt="Preview" className="h-20 w-20 object-cover rounded-lg border border-gray-200" />
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}
        <div className="flex items-center gap-2">
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            ref={fileInputRef}
            onChange={handleImageSelect}
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="p-3 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
            title="Upload photo of soil or plant"
          >
            <ImageIcon className="w-6 h-6" />
          </button>
          <div className="flex-1 relative">
            <textarea
              className="w-full bg-white border border-gray-300 rounded-2xl py-3 px-4 pr-10 focus:ring-2 focus:ring-green-500 outline-none resize-none scrollbar-hide text-gray-900 placeholder-gray-400 transition-colors"
              rows={1}
              placeholder={t.typeMessage}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
          </div>
          <Button 
            onClick={handleSend} 
            disabled={(!input && !selectedImage) || isLoading}
            className="!rounded-full !px-3 !py-3"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
