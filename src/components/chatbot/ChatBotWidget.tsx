import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { useChatBot } from '@/hooks/useChatBot';
import { ChatBotDialog } from './ChatBotDialog';
import { cn } from '@/lib/utils';

export function ChatBotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, isLoading, sendMessage, resetChat } = useChatBot();

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg",
          isOpen
            ? "bg-slate-800 hover:bg-slate-700 rotate-0"
            : "bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)]"
        )}
        aria-label={isOpen ? "Fermer le chat" : "Ouvrir l'assistant Nexus - Posez vos questions"}
      >
        {isOpen ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <>
            <MessageCircle className="h-6 w-6 text-white" />
            {/* Pulse animation when closed */}
            <span className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-20" />
          </>
        )}
      </button>

      {/* Chat Dialog */}
      <ChatBotDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        messages={messages}
        isLoading={isLoading}
        onSendMessage={sendMessage}
        onReset={resetChat}
      />
    </>
  );
}
