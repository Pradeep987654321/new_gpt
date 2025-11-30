'use client';

import { useChat } from 'ai/react';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Chat() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  // Check auth on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('ollama_user_id');
    if (!storedUser) {
      router.push('/login');
    } else {
      setUserId(storedUser);
      setIsAuthChecking(false);
    }
  }, [router]);

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    body: { userId },
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleLogout = () => {
    localStorage.removeItem('ollama_user_id');
    router.push('/login');
  };

  if (isAuthChecking || !userId) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-purple-500/30"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-500 animate-spin"></div>
          </div>
          <p className="text-purple-300 text-lg font-medium">Loading Your GPT...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-gray-100">
      {/* Header */}
      <header className="relative backdrop-blur-xl bg-black/30 border-b border-purple-500/20 shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10"></div>
        <div className="relative px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/50">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Your GPT
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
              <span className="text-xs text-purple-300">{userId}</span>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-sm font-medium transition-all duration-200 hover:scale-105"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Messages Area */}
      <main className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-purple-500/50 scrollbar-track-transparent">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full space-y-6 animate-fade-in">
            <div className="relative">
              <div className="absolute inset-0 blur-3xl bg-gradient-to-r from-purple-500 to-pink-500 opacity-20 animate-pulse"></div>
              <div className="relative text-7xl">✨</div>
            </div>
            <div className="text-center space-y-2">
              <p className="text-2xl font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Welcome to Your GPT
              </p>
              <p className="text-purple-300/70">Ask me anything, I'm here to help!</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8 max-w-2xl">
              {['What can you help me with?', 'Tell me a fun fact', 'Explain quantum computing', 'Write a poem'].map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => {
                    const event = { target: { value: prompt } } as any;
                    handleInputChange(event);
                    setTimeout(() => {
                      const form = document.querySelector('form');
                      if (form) {
                        const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
                        form.dispatchEvent(submitEvent);
                      }
                    }, 100);
                  }}
                  className="px-4 py-3 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 text-purple-300 text-sm transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, index) => (
          <div
            key={m.id}
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div
              className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-5 py-3 shadow-lg ${m.role === 'user'
                ? 'bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-purple-500/30'
                : 'bg-gray-800/80 backdrop-blur-sm text-gray-100 border border-purple-500/20 shadow-purple-500/10'
                }`}
            >
              <div className="flex items-center space-x-2 mb-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${m.role === 'user' ? 'bg-white/20' : 'bg-purple-500/20'
                  }`}>
                  {m.role === 'user' ? '👤' : '🤖'}
                </div>
                <div className="text-xs opacity-70 uppercase tracking-wide font-semibold">
                  {m.role === 'user' ? 'You' : 'AI Assistant'}
                </div>
              </div>
              <div className="whitespace-pre-wrap leading-relaxed">{m.content}</div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start animate-slide-up">
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl px-5 py-3 border border-purple-500/20 shadow-lg shadow-purple-500/10">
              <div className="flex items-center space-x-3">
                <div className="flex space-x-1.5">
                  <div className="w-2.5 h-2.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2.5 h-2.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2.5 h-2.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-sm text-purple-300">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      {/* Input Area */}
      <footer className="relative backdrop-blur-xl bg-black/30 border-t border-purple-500/20 p-4 sm:p-6">
        <div className="absolute inset-0 bg-gradient-to-t from-purple-600/10 to-transparent"></div>
        <form onSubmit={handleSubmit} className="relative max-w-4xl mx-auto">
          <div className="relative group">
            <input
              className="w-full bg-gray-800/50 backdrop-blur-sm text-white rounded-2xl pl-5 pr-14 py-4 focus:outline-none focus:ring-2 focus:ring-purple-500 border border-purple-500/30 placeholder-purple-300/50 transition-all duration-200 shadow-lg shadow-purple-500/10 group-hover:shadow-purple-500/20"
              value={input}
              placeholder="Type your message..."
              onChange={handleInputChange}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all duration-200 hover:scale-105 shadow-lg shadow-purple-500/50 disabled:hover:scale-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5 text-white"
              >
                <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
              </svg>
            </button>
          </div>
        </form>
      </footer>

      <style jsx>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out forwards;
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
