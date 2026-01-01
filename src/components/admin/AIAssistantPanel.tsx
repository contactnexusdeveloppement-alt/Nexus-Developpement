import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Send, BrainCircuit, Activity, Loader2, AlertTriangle, TrendingUp, Lightbulb, BarChart3, Microscope, ArrowUp, Terminal } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Custom markdown components not used currently to avoid 504 errors
const MarkdownContent = ({ content }: { content: string }) => (
  <div className="whitespace-pre-wrap text-gray-200 leading-relaxed">
    {content}
  </div>
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
      <Card className="bg-slate-950/40 border-blue-500/20 backdrop-blur-md shadow-2xl">
        <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 pb-4">
          <CardTitle className="text-white flex items-center gap-2 font-mono text-sm uppercase tracking-wider">
            <BrainCircuit className="h-5 w-5 text-blue-400" />
            Intelligence Stratégique
          </CardTitle>
          <Button
            onClick={() => streamResponse('insights')}
            disabled={isLoading}
            size="sm"
            className="bg-blue-600/80 hover:bg-blue-600 text-white shadow-lg shadow-blue-900/20 font-mono text-xs uppercase tracking-wide"
          >
            {isLoading ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Activity className="h-3 w-3" />
            )}
            <span className="ml-2">Diagnostiquer</span>
          </Button>
        </CardHeader>
        <CardContent className="pt-6">
          {insights ? (
            <ScrollArea className="h-[400px]">
              <div className="pr-4">
                <div className="bg-slate-950/50 rounded-sm p-6 border border-white/5 shadow-inner">
                  <MarkdownContent content={insights} />
                </div>
              </div>
            </ScrollArea>
          ) : (
            <div className="text-center py-12 text-gray-500 flex flex-col items-center">
              <div className="h-16 w-16 bg-slate-900/50 rounded-full flex items-center justify-center mb-4 border border-white/5">
                <BrainCircuit className="h-8 w-8 text-blue-500/30" />
              </div>
              <p className="font-mono text-xs uppercase tracking-widest opacity-60">En attente d'analyse</p>
            </div>
          )}
        </CardContent>
      </Card>


      {/* Questions personnalisées */}
      <Card className="bg-slate-950/40 border-blue-500/20 backdrop-blur-md shadow-2xl">
        <CardHeader className="border-b border-white/5 pb-4">
          <CardTitle className="text-white flex items-center gap-2 font-mono text-sm uppercase tracking-wider">
            <Terminal className="h-5 w-5 text-blue-400" />
            Console d'Analyse
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* Questions suggérées */}
          <div>
            <p className="text-xs text-gray-500 mb-3 font-mono uppercase tracking-widest">Commandes Suggérées</p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((q, i) => (
                <Button
                  key={i}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSuggestedQuestion(q)}
                  disabled={isLoading}
                  className="text-xs bg-slate-900/40 border-blue-500/10 text-slate-400 hover:bg-blue-900/20 hover:text-blue-200 hover:border-blue-500/30 transition-all duration-300 font-mono"
                >
                  <span className="mr-2 text-blue-500/50">$</span>{q}
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
              className="bg-slate-950/50 border-white/10 text-white placeholder:text-gray-600 resize-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50"
              rows={2}
            />
            <Button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="bg-blue-600 hover:bg-blue-700 px-4 shadow-lg shadow-blue-900/20 h-auto"
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
            <div className="mt-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <p className="text-sm text-gray-400 mb-2 font-medium">Réponse :</p>
              <ScrollArea className="h-[250px]">
                <div className="bg-slate-950/50 rounded-xl p-6 border border-blue-500/20 shadow-inner">
                  <MarkdownContent content={response} />
                </div>
              </ScrollArea>
            </div>
          )}
        </CardContent>
      </Card>


      {/* Stats rapides */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-slate-950/40 border-blue-500/20 backdrop-blur-md hover:bg-slate-900/40 transition-colors shadow-lg">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-white mb-1">{quotes.length}</div>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Total devis</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-950/40 border-blue-500/20 backdrop-blur-md hover:bg-slate-900/40 transition-colors shadow-lg">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-yellow-400 mb-1">{quotes.filter(q => q.status === 'pending').length}</div>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">En attente</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-950/40 border-blue-500/20 backdrop-blur-md hover:bg-slate-900/40 transition-colors shadow-lg">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-blue-400 mb-1">{callBookings.length}</div>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Appels réservés</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-950/40 border-blue-500/20 backdrop-blur-md hover:bg-slate-900/40 transition-colors shadow-lg">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-green-400 mb-1">
              {clientStatuses.filter(c => c.status === 'client').length}
            </div>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Clients convertis</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AIAssistantPanel;
