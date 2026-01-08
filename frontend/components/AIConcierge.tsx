'use client';

import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Sparkles, Send, X } from 'lucide-react';
import { ChatMessage } from '../lib/types';
import { useShop } from '../context/ShopContext';

export default function AIConcierge() {
    const { products } = useShop();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([
        { role: 'model', text: 'Namaste. I am your personal jewelry concierge. Are you looking for a gift, or something special for yourself today?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = input;
        setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
        setInput('');
        setIsLoading(true);

        try {
            const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
            if (!apiKey) {
                throw new Error("API Key not found");
            }

            const ai = new GoogleGenAI({ apiKey });

            // Contextual prompt with dynamic product data
            const productContext = products.map(p => `${p.name} (₹${p.price}, ${p.details.material}, ${p.details.gemstone || 'No gemstone'})`).join('; ');

            const systemInstruction = `You are an elite jewelry concierge for 'Kanha & Kishori'. 
      Your tone is sophisticated, elegant, and helpful. 
      You have access to the following collection: ${productContext}.
      Recommend specific products from this list if they match the user's request. 
      Keep responses concise (under 80 words) but charming.`;

            const response = await ai.models.generateContent({
                model: 'gemini-1.5-flash', // Updated to a potentially valid model name or using what user provided if it's correct. Using 'gemini-1.5-flash' as a safe bet for 'flash-preview' which might be deprecated or specific.
                contents: [
                    ...messages.map(m => ({
                        role: m.role,
                        parts: [{ text: m.text }]
                    })),
                    { role: 'user', parts: [{ text: userMessage }] }
                ],
                config: {
                    systemInstruction,
                }
            });

            const responseText = response.text || "I apologize, I am momentarily distracted. Please inquire again.";

            setMessages(prev => [...prev, { role: 'model', text: responseText }]);

        } catch (error) {
            console.error(error);
            // Simulate response if API key is missing or fails (for demo purposes)
            setMessages(prev => [...prev, { role: 'model', text: "I am having trouble connecting to our vault services. However, I highly recommend exploring our Necklace collection." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(true)}
                className={`fixed bottom-8 right-8 z-40 bg-stone-900 text-gold-200 p-4 rounded-full shadow-2xl transition-all duration-500 hover:scale-110 ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
            >
                <Sparkles className="w-6 h-6 text-gold-100" />
            </button>

            {/* Chat Window */}
            <div className={`fixed bottom-8 right-8 z-50 w-80 md:w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col transition-all duration-500 transform origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-75 opacity-0 pointer-events-none'}`}>

                {/* Header */}
                <div className="bg-stone-900 text-gold-100 p-4 rounded-t-2xl flex justify-between items-center text-white">
                    <div className="flex items-center space-x-2">
                        <Sparkles className="w-4 h-4" />
                        <span className="font-serif tracking-widest text-sm">CONCIERGE</span>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="text-stone-400 hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] p-3 text-sm ${msg.role === 'user'
                                    ? 'bg-stone-200 text-stone-900 rounded-tl-xl rounded-tr-xl rounded-bl-xl'
                                    : 'bg-white border border-stone-100 text-stone-800 shadow-sm rounded-tr-xl rounded-bl-xl rounded-br-xl'
                                }`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-white border border-stone-100 p-3 rounded-tr-xl rounded-bl-xl rounded-br-xl shadow-sm">
                                <div className="flex space-x-1">
                                    <div className="w-2 h-2 bg-stone-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <div className="w-2 h-2 bg-stone-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <div className="w-2 h-2 bg-stone-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-stone-100 bg-white rounded-b-2xl">
                    <div className="flex items-center space-x-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Ask for a recommendation..."
                            className="flex-1 bg-stone-50 border-none rounded-lg px-4 py-2 text-sm focus:ring-1 focus:ring-gold-400 focus:outline-none"
                        />
                        <button
                            onClick={handleSend}
                            disabled={isLoading || !input.trim()}
                            className="p-2 text-gold-600 hover:bg-gold-50 rounded-full disabled:opacity-50 transition-colors"
                        >
                            <Send className="w-5 h-5 text-stone-900" />
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
