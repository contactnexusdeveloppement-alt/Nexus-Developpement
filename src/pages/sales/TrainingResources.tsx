import { useState, useEffect, useRef } from 'react';
import { trainingGuide, Chapter } from '@/data/trainingData';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BookOpen, ChevronRight, GraduationCap, Search, Menu } from 'lucide-react';
import { Input } from '@/components/ui/input';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const TrainingResources = () => {
    const [selectedChapterId, setSelectedChapterId] = useState<string>(trainingGuide[0].id);
    const [searchQuery, setSearchQuery] = useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const contentTopRef = useRef<HTMLDivElement>(null);

    const selectedChapter = trainingGuide.find(c => c.id === selectedChapterId) || trainingGuide[0];

    useEffect(() => {
        if (contentTopRef.current) {
            contentTopRef.current.scrollIntoView({ behavior: 'instant', block: 'start' });
        }
    }, [selectedChapterId]);

    const filteredChapters = trainingGuide.filter(chapter =>
        chapter.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chapter.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-slate-950 border-r border-white/5">
            <div className="p-6 border-b border-white/5 bg-slate-900/50">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400">
                        <GraduationCap className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-white leading-tight">Nexus Academy</h2>
                        <span className="text-xs text-slate-400 uppercase tracking-wider font-medium">Guide Stratégique</span>
                    </div>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <Input
                        placeholder="Rechercher..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 h-10 bg-slate-900 border-white/10 text-white focus:ring-blue-500/20 focus:border-blue-500/50 text-sm"
                    />
                </div>
            </div>

            <ScrollArea className="flex-1 px-4 py-4">
                <div className="space-y-1">
                    {filteredChapters.map((chapter) => (
                        <button
                            key={chapter.id}
                            onClick={() => {
                                setSelectedChapterId(chapter.id);
                                setIsMobileMenuOpen(false);
                            }}
                            className={`w-full text-left p-3 rounded-lg transition-all group relative overflow-hidden ${selectedChapterId === chapter.id
                                ? 'bg-blue-600/10 border border-blue-500/30 shadow-lg shadow-blue-900/20'
                                : 'hover:bg-white/5 border border-transparent hover:border-white/5'
                                }`}
                        >
                            <div className="flex items-start gap-4 relatie z-10">
                                <span className={`text-sm font-mono font-bold mt-0.5 ${selectedChapterId === chapter.id ? 'text-blue-400' : 'text-slate-600'}`}>
                                    {chapter.number}
                                </span>
                                <div className="flex-1 min-w-0">
                                    <h3 className={`text-sm font-semibold truncate ${selectedChapterId === chapter.id ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
                                        {chapter.title}
                                    </h3>
                                    <p className={`text-xs mt-1 line-clamp-2 ${selectedChapterId === chapter.id ? 'text-blue-200/70' : 'text-slate-500'}`}>
                                        {chapter.description}
                                    </p>
                                </div>
                                {selectedChapterId === chapter.id && (
                                    <ChevronRight className="h-4 w-4 text-blue-400 mt-1" />
                                )}
                            </div>
                        </button>
                    ))}
                    {filteredChapters.length === 0 && (
                        <div className="text-center py-8 text-slate-500 text-sm px-4">
                            Aucun chapitre ne correspond à votre recherche.
                        </div>
                    )}
                </div>
            </ScrollArea>

            <div className="p-4 border-t border-white/5 bg-slate-900/30">
                <div className="text-xs text-slate-500 text-center">
                    Guide Commercial v2.0 • 2024
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex h-[calc(100vh-6rem)] md:h-[800px] bg-slate-950 rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
            {/* Desktop Sidebar */}
            <div className="hidden md:block w-80 lg:w-96 flex-shrink-0">
                <SidebarContent />
            </div>

            {/* Mobile Sidebar & Header */}
            <div className="flex-1 flex flex-col min-w-0 bg-slate-900/50">
                <div className="md:hidden flex items-center p-4 border-b border-white/5 bg-slate-950">
                    <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="mr-3 text-slate-400">
                                <Menu className="h-6 w-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="p-0 border-r border-white/10 bg-slate-950 w-80">
                            <SidebarContent />
                        </SheetContent>
                    </Sheet>
                    <span className="font-semibold text-white truncate">{selectedChapter.title}</span>
                </div>

                {/* Main Content Area */}
                <ScrollArea className="flex-1">
                    <div ref={contentTopRef} />
                    <div className="max-w-4xl mx-auto p-6 md:p-12 lg:p-16">
                        <div className="mb-10 pb-6 border-b border-white/10">
                            <div className="flex items-center gap-3 text-sm text-blue-400 font-mono mb-4">
                                <span>CHAPITRE {selectedChapter.number}</span>
                                <div className="h-px bg-blue-500/30 w-12" />
                            </div>
                            <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                                {selectedChapter.title}
                            </h1>
                            <p className="text-xl text-slate-400 font-light leading-relaxed">
                                {selectedChapter.description}
                            </p>
                        </div>

                        <div className="prose prose-invert prose-lg max-w-none 
                            prose-p:text-slate-300 prose-p:leading-8 prose-p:mb-6
                            prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-500/10 prose-blockquote:px-6 prose-blockquote:py-6 prose-blockquote:rounded-r-xl prose-blockquote:not-italic prose-blockquote:text-blue-100
                            prose-ul:list-disc prose-ul:pl-6 prose-ul:space-y-3 prose-ul:text-slate-300
                            prose-li:marker:text-blue-500
                            prose-strong:text-white prose-strong:font-bold
                            prose-a:text-blue-400 hover:prose-a:text-blue-300 prose-a:no-underline
                        ">
                            <ReactMarkdown
                                components={{
                                    h1: ({ children, ...props }) => <h1 className="text-4xl font-bold text-white mb-8 pb-4 border-b border-white/10" {...props}>{children}</h1>,
                                    h2: ({ children, ...props }) => <h2 className="text-3xl font-bold text-center text-blue-200 mt-24 mb-12 pb-6 border-b border-white/10 leading-relaxed block" {...props}>{children}</h2>,
                                    h3: ({ children, ...props }) => <h3 className="text-xl font-bold text-blue-100 mt-12 mb-6" {...props}>{children}</h3>,
                                }}
                            >
                                {selectedChapter.content}
                            </ReactMarkdown>
                        </div>

                        {/* Navigation Footer */}
                        <div className="mt-20 pt-10 border-t border-white/10 flex justify-between items-center">
                            {/* Logic to find prev/next chapter could go here */}
                            <div className="text-sm text-slate-500 italic">
                                Nexus Développement - Document Interne
                            </div>
                        </div>
                    </div>
                </ScrollArea>
            </div>
        </div>
    );
};

export default TrainingResources;
