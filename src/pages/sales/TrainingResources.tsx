import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Book, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TrainingResource {
    id: string;
    title: string;
    category: string;
    content: string;
    excerpt: string | null;
    display_order: number;
}

const TrainingResources = () => {
    const [resources, setResources] = useState<TrainingResource[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [selectedResource, setSelectedResource] = useState<TrainingResource | null>(null);

    useEffect(() => {
        const fetchResources = async () => {
            try {
                setLoading(true);

                const { data, error } = await supabase
                    .from('training_resources')
                    .select('*')
                    .eq('is_published', true)
                    .order('display_order');

                if (error) throw error;

                setResources(data || []);
            } catch (error) {
                console.error('Error fetching training resources:', error);
                toast.error('Erreur lors du chargement des ressources');
            } finally {
                setLoading(false);
            }
        };

        fetchResources();
    }, []);

    const categories = [
        { value: 'all', label: 'Toutes' },
        { value: 'sales_arguments', label: 'Arguments de Vente' },
        { value: 'product_info', label: 'Infos Produits' },
        { value: 'best_practices', label: 'Bonnes Pratiques' },
        { value: 'process', label: 'Processus' },
        { value: 'tools', label: 'Outils' },
    ];

    const filteredResources = resources.filter((resource) => {
        const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
        const matchesSearch = searchQuery === '' ||
            resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            resource.content.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesCategory && matchesSearch;
    });

    const getCategoryBadge = (category: string) => {
        const categoryConfig: Record<string, { label: string; className: string }> = {
            sales_arguments: { label: 'Arguments', className: 'bg-blue-500' },
            product_info: { label: 'Produits', className: 'bg-purple-500' },
            best_practices: { label: 'Pratiques', className: 'bg-green-500' },
            process: { label: 'Processus', className: 'bg-orange-500' },
            tools: { label: 'Outils', className: 'bg-pink-500' },
        };

        const config = categoryConfig[category] || { label: category, className: 'bg-gray-500' };
        return <Badge className={`${config.className} text-xs`}>{config.label}</Badge>;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-950">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                        <Book className="h-8 w-8 text-blue-500" />
                        Formation & Ressources
                    </h1>
                    <p className="text-slate-400 mt-1">
                        Guides, bonnes pratiques et outils pour maximiser vos ventes
                    </p>
                </div>

                {/* Search and Filters */}
                <div className="flex gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Rechercher dans les ressources..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 bg-slate-900 border-slate-700 text-white"
                        />
                    </div>
                </div>

                <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
                    <TabsList className="bg-slate-900 border-slate-700">
                        {categories.map((cat) => (
                            <TabsTrigger
                                key={cat.value}
                                value={cat.value}
                                className="data-[state=active]:bg-blue-600 text-slate-300 data-[state=active]:text-white"
                            >
                                {cat.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    {categories.map((cat) => (
                        <TabsContent key={cat.value} value={cat.value} className="mt-6">
                            {selectedResource ? (
                                /* Full Resource View */
                                <Card className="bg-slate-900 border-slate-700">
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <CardTitle className="text-white text-2xl">{selectedResource.title}</CardTitle>
                                                    {getCategoryBadge(selectedResource.category)}
                                                </div>
                                                {selectedResource.excerpt && (
                                                    <CardDescription className="text-slate-400">
                                                        {selectedResource.excerpt}
                                                    </CardDescription>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => setSelectedResource(null)}
                                                className="text-slate-400 hover:text-white text-sm underline"
                                            >
                                                ← Retour à la liste
                                            </button>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="prose prose-invert max-w-none">
                                            <ReactMarkdown
                                                components={{
                                                    h1: ({ ...props }) => <h1 className="text-3xl font-bold text-white mt-6 mb-4" {...props} />,
                                                    h2: ({ ...props }) => <h2 className="text-2xl font-bold text-white mt-5 mb-3" {...props} />,
                                                    h3: ({ ...props }) => <h3 className="text-xl font-bold text-white mt-4 mb-2" {...props} />,
                                                    p: ({ ...props }) => <p className="text-slate-300 mb-4 leading-relaxed" {...props} />,
                                                    ul: ({ ...props }) => <ul className="list-disc list-inside text-slate-300 mb-4 space-y-1" {...props} />,
                                                    ol: ({ ...props }) => <ol className="list-decimal list-inside text-slate-300 mb-4 space-y-1" {...props} />,
                                                    strong: ({ ...props }) => <strong className="text-white font-semibold" {...props} />,
                                                    blockquote: ({ ...props }) => (
                                                        <blockquote className="border-l-4 border-blue-500 pl-4 italic text-slate-400 my-4" {...props} />
                                                    ),
                                                    hr: () => <hr className="border-slate-700 my-6" />,
                                                }}
                                            >
                                                {selectedResource.content}
                                            </ReactMarkdown>
                                        </div>
                                    </CardContent>
                                </Card>
                            ) : (
                                /* Resources List */
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredResources.length > 0 ? (
                                        filteredResources.map((resource) => (
                                            <Card
                                                key={resource.id}
                                                className="bg-slate-900 border-slate-700 hover:border-blue-500 transition-colors cursor-pointer"
                                                onClick={() => setSelectedResource(resource)}
                                            >
                                                <CardHeader>
                                                    <div className="flex items-start justify-between gap-2">
                                                        <CardTitle className="text-white text-lg">{resource.title}</CardTitle>
                                                        {getCategoryBadge(resource.category)}
                                                    </div>
                                                    {resource.excerpt && (
                                                        <CardDescription className="text-slate-400 line-clamp-3">
                                                            {resource.excerpt}
                                                        </CardDescription>
                                                    )}
                                                </CardHeader>
                                                <CardContent>
                                                    <p className="text-sm text-blue-400 hover:text-blue-300">
                                                        Lire la suite →
                                                    </p>
                                                </CardContent>
                                            </Card>
                                        ))
                                    ) : (
                                        <div className="col-span-full text-center py-12 text-slate-400">
                                            Aucune ressource trouvée pour cette catégorie.
                                        </div>
                                    )}
                                </div>
                            )}
                        </TabsContent>
                    ))}
                </Tabs>
            </div>
        </div>
    );
};

export default TrainingResources;
