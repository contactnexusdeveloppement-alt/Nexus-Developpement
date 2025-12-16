import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Send, Sparkles, RefreshCw, Loader2, AlertTriangle, TrendingUp, Lightbulb, BarChart3 } from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import { supabase } from "@/integrations/supabase/client";

// Custom markdown components for better styling
const MarkdownContent = ({ content }: { content: string }) => (
  <ReactMarkdown
    components={{
      h1: ({ children }) => (
        <h1 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          {children}
        </h1>
      ),
      h2: ({ children }) => (
        <h2 className="text-lg font-semibold text-blue-300 mb-3 mt-4 flex items-center gap-2">
          {children}
        </h2>
      ),
      h3: ({ children }) => (
        <h3 className="text-base font-semibold text-cyan-300 mb-2 mt-3 flex items-center gap-2">
          {children}
        </h3>
      ),
      p: ({ children }) => (
        <p className="text-gray-200 mb-2 leading-relaxed">{children}</p>
      ),
      ul: ({ children }) => (
        <ul className="space-y-2 mb-4 ml-2">{children}</ul>
      ),
      ol: ({ children }) => (
        <ol className="space-y-2 mb-4 ml-4 list-decimal">{children}</ol>
      ),
      li: ({ children }) => (
        <li className="text-gray-200 flex items-start gap-2">
          <span className="text-blue-400 mt-1">•</span>
          <span className="flex-1">{children}</span>
        </li>
      ),
      strong: ({ children }) => (
        <strong className="font-semibold text-white">{children}</strong>
      ),
      em: ({ children }) => (
        <em className="text-cyan-300 not-italic font-medium">{children}</em>
      ),
      hr: () => (
        <hr className="border-blue-500/30 my-4" />
      ),
      code: ({ children }) => (
        <code className="bg-slate-800 px-1.5 py-0.5 rounded text-cyan-300 text-sm">{children}</code>
      ),
      blockquote: ({ children }) => (
        <blockquote className="border-l-4 border-blue-500 pl-4 py-2 my-3 bg-slate-800/50 rounded-r-lg">
          {children}
        </blockquote>
      ),
    }}
  >
    {content}
  </ReactMarkdown>
);

interface QuoteRequest {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  business_type: string | null;
  services: string[];
  project_details: string | null;
  budget: string | null;
  timeline: string | null;
  status: string;
  created_at: string;
}

interface CallBooking {
  id: string;
  name: string;
  email: string;
  phone: string;
  booking_date: string;
  time_slot: string;
  duration: number;
  notes: string | null;
  status: string;
  created_at: string;
}

interface ClientStatus {
  client_email: string;
  status: string;
  notes: string | null;
  updated_at: string | null;
}

interface AIAssistantPanelProps {
  quotes: QuoteRequest[];
  callBookings: CallBooking[];
  clientStatuses: ClientStatus[];
}

const suggestedQuestions = [
  "Quels clients devrais-je relancer en priorité ?",
  "Quel est le budget moyen des demandes de site web ?",
  "Quels sont les services les plus demandés ?",
  "Combien de devis sont en attente depuis plus d'une semaine ?",
  "Quel est mon taux de conversion prospect → client ?",
  "Quelles sont les tendances ce mois-ci ?",
];

const AIAssistantPanel = ({ quotes, callBookings, clientStatuses }: AIAssistantPanelProps) => {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [insights, setInsights] = useState("");
  const [sessionToken, setSessionToken] = useState<string | null>(null);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSessionToken(session?.access_token || null);
    };
    getSession();
  }, []);

  const prepareData = () => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    return {
      summary: {
        totalQuotes: quotes.length,
        pendingQuotes: quotes.filter(q => q.status === 'pending').length,
        inProgressQuotes: quotes.filter(q => q.status === 'in_progress').length,
        completedQuotes: quotes.filter(q => q.status === 'completed').length,
        totalCalls: callBookings.length,
        pendingCalls: callBookings.filter(b => b.status === 'pending').length,
        confirmedCalls: callBookings.filter(b => b.status === 'confirmed').length,
        leads: clientStatuses.filter(c => c.status === 'lead').length,
        prospects: clientStatuses.filter(c => c.status === 'prospect').length,
        clients: clientStatuses.filter(c => c.status === 'client').length,
        lost: clientStatuses.filter(c => c.status === 'lost').length,
      },
      recentQuotes: quotes.slice(0, 20).map(q => ({
        name: q.name,
        email: q.email,
        services: q.services,
        budget: q.budget,
        status: q.status,
        createdAt: q.created_at,
        daysAgo: Math.floor((now.getTime() - new Date(q.created_at).getTime()) / (1000 * 60 * 60 * 24)),
      })),
      pendingOldQuotes: quotes
        .filter(q => q.status === 'pending' && new Date(q.created_at) < oneWeekAgo)
        .map(q => ({
          name: q.name,
          email: q.email,
          services: q.services,
          budget: q.budget,
          daysAgo: Math.floor((now.getTime() - new Date(q.created_at).getTime()) / (1000 * 60 * 60 * 24)),
        })),
      upcomingCalls: callBookings
        .filter(b => new Date(b.booking_date) >= now)
        .slice(0, 10)
        .map(b => ({
          name: b.name,
          email: b.email,
          date: b.booking_date,
          time: b.time_slot,
          duration: b.duration,
          status: b.status,
        })),
      todayCalls: callBookings.filter(b => {
        const bookingDate = new Date(b.booking_date);
        return bookingDate.toDateString() === now.toDateString();
      }).map(b => ({
        name: b.name,
        time: b.time_slot,
        duration: b.duration,
        status: b.status,
      })),
      serviceStats: calculateServiceStats(quotes),
      budgetStats: calculateBudgetStats(quotes),
    };
  };

  const calculateServiceStats = (quotes: QuoteRequest[]) => {
    const stats: Record<string, number> = {};
    quotes.forEach(q => {
      q.services.forEach(s => {
        stats[s] = (stats[s] || 0) + 1;
      });
    });
    return Object.entries(stats)
      .sort((a, b) => b[1] - a[1])
      .map(([service, count]) => ({ service, count, percentage: Math.round((count / quotes.length) * 100) }));
  };

  const calculateBudgetStats = (quotes: QuoteRequest[]) => {
    const budgets: Record<string, number> = {};
    quotes.forEach(q => {
      if (q.budget) {
        budgets[q.budget] = (budgets[q.budget] || 0) + 1;
      }
    });
    return Object.entries(budgets)
      .sort((a, b) => b[1] - a[1])
      .map(([budget, count]) => ({ budget, count }));
  };

  const streamResponse = async (type: 'insights' | 'custom_query', customQuery?: string) => {
    setIsLoading(true);
    if (type === 'insights') {
      setInsights("");
    } else {
      setResponse("");
    }

    try {
      if (!sessionToken) {
        toast.error("Session expirée, veuillez vous reconnecter");
        return;
      }

      const data = prepareData();
      const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-ai-assistant`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({
          type,
          query: customQuery,
          data,
        }),
      });

      if (!resp.ok) {
        const error = await resp.json();
        throw new Error(error.error || 'Erreur du service IA');
      }

      const reader = resp.body?.getReader();
      if (!reader) throw new Error('No reader');

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        let newlineIndex;
        while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              if (type === 'insights') {
                setInsights(prev => prev + content);
              } else {
                setResponse(prev => prev + content);
              }
            }
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }
    } catch (error) {
      console.error('AI Assistant error:', error);
      toast.error(error instanceof Error ? error.message : 'Erreur lors de l\'analyse');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;
    streamResponse('custom_query', query);
  };

  const handleSuggestedQuestion = (question: string) => {
    setQuery(question);
    streamResponse('custom_query', question);
  };

  return (
    <div className="space-y-6">
      {/* Insights automatiques */}
      <Card className="bg-slate-900/80 border-blue-500/30">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-400" />
            Insights Automatiques
          </CardTitle>
          <Button
            onClick={() => streamResponse('insights')}
            disabled={isLoading}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            <span className="ml-2">Analyser</span>
          </Button>
        </CardHeader>
        <CardContent>
          {insights ? (
            <ScrollArea className="h-[400px]">
              <div className="pr-4">
                <MarkdownContent content={insights} />
              </div>
            </ScrollArea>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Cliquez sur "Analyser" pour générer des insights sur vos données clients.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Questions personnalisées */}
      <Card className="bg-slate-900/80 border-blue-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Bot className="h-5 w-5 text-blue-400" />
            Analyse Approfondie
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Questions suggérées */}
          <div>
            <p className="text-sm text-gray-400 mb-2">Questions suggérées :</p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((q, i) => (
                <Button
                  key={i}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSuggestedQuestion(q)}
                  disabled={isLoading}
                  className="text-xs bg-slate-800/50 border-blue-500/30 text-gray-300 hover:bg-blue-600/20 hover:text-white"
                >
                  {q}
                </Button>
              ))}
            </div>
          </div>

          {/* Input personnalisé */}
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Posez une question sur vos données..."
              className="bg-slate-800/50 border-blue-500/30 text-white placeholder:text-gray-500 resize-none"
              rows={2}
            />
            <Button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="bg-blue-600 hover:bg-blue-700 px-4"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>

          {/* Réponse */}
          {response && (
            <div className="mt-4">
              <p className="text-sm text-gray-400 mb-2">Réponse :</p>
              <ScrollArea className="h-[250px]">
                <div className="bg-slate-800/50 rounded-lg p-4 border border-blue-500/20">
                  <MarkdownContent content={response} />
                </div>
              </ScrollArea>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats rapides */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-slate-900/80 border-blue-500/30">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-white">{quotes.length}</div>
            <p className="text-xs text-gray-400">Total devis</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/80 border-blue-500/30">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-yellow-400">{quotes.filter(q => q.status === 'pending').length}</div>
            <p className="text-xs text-gray-400">En attente</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/80 border-blue-500/30">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-blue-400">{callBookings.length}</div>
            <p className="text-xs text-gray-400">Appels réservés</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/80 border-blue-500/30">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-green-400">
              {clientStatuses.filter(c => c.status === 'client').length}
            </div>
            <p className="text-xs text-gray-400">Clients convertis</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AIAssistantPanel;
