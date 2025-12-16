import { useRef, useEffect, useState } from 'react';
import { X, Send, RotateCcw, Copy, Check, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChatMessage } from '@/hooks/useChatBot';
import { cn } from '@/lib/utils';

interface ChatBotDialogProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
  onReset: () => void;
}

const quickSuggestions = [
  "Quels sont vos services ?",
  "Quels sont vos tarifs ?",
  "Comment vous contacter ?",
  "Demander un devis",
];

// Format timestamp to HH:MM
function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Parse and format message content with markdown-like styling
function FormattedMessage({ content }: { content: string }) {
  const lines = content.split('\n');
  
  return (
    <div className="space-y-1">
      {lines.map((line, i) => {
        // Section title with emoji (📌 **Title**)
        if (line.match(/^📌\s*\*\*.*\*\*/)) {
          const title = line.replace(/📌\s*\*\*|\*\*/g, '').trim();
          return (
            <p key={i} className="text-cyan-400 font-semibold mt-2 first:mt-0">
              📌 {title}
            </p>
          );
        }
        
        // List item (- item or • item)
        if (line.match(/^[-•]\s/)) {
          const itemContent = line.slice(2);
          return (
            <div key={i} className="flex gap-2 ml-2">
              <span className="text-cyan-400">•</span>
              <span>{formatInlineContent(itemContent)}</span>
            </div>
          );
        }
        
        // Numbered list (1. item)
        if (line.match(/^\d+\.\s/)) {
          const match = line.match(/^(\d+)\.\s(.*)/);
          if (match) {
            return (
              <div key={i} className="flex gap-2 ml-2">
                <span className="text-cyan-400 font-medium">{match[1]}.</span>
                <span>{formatInlineContent(match[2])}</span>
              </div>
            );
          }
        }
        
        // Empty line
        if (line.trim() === '') {
          return <div key={i} className="h-1" />;
        }
        
        // Regular paragraph
        return (
          <p key={i}>{formatInlineContent(line)}</p>
        );
      })}
    </div>
  );
}

// Format inline content (bold, prices, links)
function formatInlineContent(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;
  
  while (remaining.length > 0) {
    // Check for bold text **text**
    const boldMatch = remaining.match(/\*\*([^*]+)\*\*/);
    if (boldMatch && boldMatch.index !== undefined) {
      if (boldMatch.index > 0) {
        parts.push(formatPricesAndLinks(remaining.slice(0, boldMatch.index), key++));
      }
      parts.push(
        <strong key={key++} className="font-semibold text-white">
          {boldMatch[1]}
        </strong>
      );
      remaining = remaining.slice(boldMatch.index + boldMatch[0].length);
      continue;
    }
    
    // No more bold, process rest
    parts.push(formatPricesAndLinks(remaining, key++));
    break;
  }
  
  return <>{parts}</>;
}

// Format prices and links
function formatPricesAndLinks(text: string, keyBase: number): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = keyBase * 1000;
  
  while (remaining.length > 0) {
    // Check for price (e.g., 890€, 1 290€)
    const priceMatch = remaining.match(/(\d[\d\s]*€)/);
    // Check for URL
    const urlMatch = remaining.match(/(https?:\/\/[^\s]+)/);
    // Check for email
    const emailMatch = remaining.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
    
    // Find earliest match
    const matches = [
      priceMatch && priceMatch.index !== undefined ? { type: 'price', match: priceMatch, index: priceMatch.index } : null,
      urlMatch && urlMatch.index !== undefined ? { type: 'url', match: urlMatch, index: urlMatch.index } : null,
      emailMatch && emailMatch.index !== undefined ? { type: 'email', match: emailMatch, index: emailMatch.index } : null,
    ].filter(Boolean).sort((a, b) => a!.index - b!.index);
    
    if (matches.length > 0 && matches[0]) {
      const earliest = matches[0];
      
      if (earliest.index > 0) {
        parts.push(<span key={key++}>{remaining.slice(0, earliest.index)}</span>);
      }
      
      if (earliest.type === 'price') {
        parts.push(
          <span key={key++} className="inline-block bg-blue-500/30 px-1.5 py-0.5 rounded text-blue-200 font-medium">
            {earliest.match[1]}
          </span>
        );
      } else if (earliest.type === 'url') {
        parts.push(
          <a
            key={key++}
            href={earliest.match[1]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 underline hover:text-cyan-300"
          >
            {earliest.match[1]}
          </a>
        );
      } else if (earliest.type === 'email') {
        parts.push(
          <a
            key={key++}
            href={`mailto:${earliest.match[1]}`}
            className="text-cyan-400 underline hover:text-cyan-300"
          >
            {earliest.match[1]}
          </a>
        );
      }
      
      remaining = remaining.slice(earliest.index + earliest.match[0].length);
      continue;
    }
    
    // No more special content
    parts.push(<span key={key++}>{remaining}</span>);
    break;
  }
  
  return <>{parts}</>;
}

// Copy button component
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <button
      onClick={handleCopy}
      className="opacity-0 group-hover:opacity-100 absolute -top-2 -right-2 p-1 rounded bg-slate-700/80 hover:bg-slate-600 transition-all"
      aria-label={copied ? "Copié !" : "Copier le message"}
    >
      {copied ? (
        <Check className="h-3 w-3 text-green-400" aria-hidden="true" />
      ) : (
        <Copy className="h-3 w-3 text-slate-300" aria-hidden="true" />
      )}
    </button>
  );
}

export function ChatBotDialog({
  isOpen,
  onClose,
  messages,
  isLoading,
  onSendMessage,
  onReset,
}: ChatBotDialogProps) {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Handle Escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput('');
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (!isLoading) {
      onSendMessage(suggestion);
    }
  };

  const handleQuoteClick = () => {
    onClose();
    setTimeout(() => {
      document.getElementById('devis')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  if (!isOpen) return null;

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-labelledby="chatbot-title"
      className="fixed bottom-24 right-4 md:right-6 z-50 w-[calc(100vw-2rem)] md:w-[380px] h-[500px] flex flex-col rounded-2xl border border-blue-500/30 bg-gradient-to-br from-slate-900/95 to-blue-950/95 shadow-[0_0_40px_rgba(59,130,246,0.3)] animate-in fade-in slide-in-from-bottom-4 duration-300"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-blue-500/20">
        <div className="flex items-center gap-3">
          <div 
            className={cn(
              "w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold text-sm",
              isLoading && "animate-pulse"
            )}
            aria-hidden="true"
          >
            N
          </div>
          <div>
            <h3 id="chatbot-title" className="font-semibold text-white">Assistant Nexus</h3>
            <p className="text-xs text-blue-300/70" aria-live="polite">
              {isLoading ? "En train d'écrire..." : "En ligne"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={onReset}
            className="h-8 w-8 text-blue-300 hover:text-white hover:bg-blue-500/20"
            aria-label="Nouvelle conversation"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 text-blue-300 hover:text-white hover:bg-blue-500/20"
            aria-label="Fermer le chat"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4" ref={scrollRef} aria-live="polite" aria-atomic="false">
        <div className="space-y-4" aria-busy={isLoading}>
          {messages.map((msg, i) => (
            <div
              key={i}
              className={cn(
                "flex flex-col",
                msg.role === 'user' ? "items-end" : "items-start"
              )}
            >
              <div
                className={cn(
                  "relative group max-w-[85%] rounded-2xl px-4 py-2.5 text-sm",
                  msg.role === 'user'
                    ? "bg-blue-500 text-white rounded-br-sm"
                    : "bg-slate-800/80 text-slate-100 rounded-bl-sm border border-blue-500/20"
                )}
              >
                {msg.role === 'assistant' && <CopyButton text={msg.content} />}
                {msg.role === 'assistant' ? (
                  <FormattedMessage content={msg.content} />
                ) : (
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                )}
              </div>
              <span className="text-[10px] text-blue-300/50 mt-1 px-1">
                {formatTime(msg.timestamp)}
              </span>
            </div>
          ))}
          {isLoading && messages[messages.length - 1]?.role === 'user' && (
            <div className="flex flex-col items-start">
              <div className="bg-slate-800/80 text-slate-100 rounded-2xl rounded-bl-sm px-4 py-2.5 text-sm border border-blue-500/20">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick suggestions */}
      {messages.length <= 2 && (
        <div className="px-4 pb-2">
          <div className="flex flex-wrap gap-2">
            {quickSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => handleSuggestionClick(suggestion)}
                disabled={isLoading}
                className="text-xs px-3 py-1.5 rounded-full bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 hover:text-white transition-colors border border-blue-500/30 disabled:opacity-50"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quote button */}
      <div className="px-4 pb-2">
        <button
          onClick={handleQuoteClick}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 text-cyan-300 hover:text-white text-sm font-medium transition-all border border-cyan-500/30"
        >
          <FileText className="h-4 w-4" />
          Demander un devis gratuit
        </button>
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-blue-500/20">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Écrivez votre message..."
            disabled={isLoading}
            className="flex-1 bg-slate-800/50 border border-blue-500/30 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-blue-200/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50"
          />
          <Button
            type="submit"
            disabled={!input.trim() || isLoading}
            size="icon"
            className="h-10 w-10 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}
