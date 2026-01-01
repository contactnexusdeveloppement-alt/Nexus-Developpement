import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Mail, ChevronDown } from 'lucide-react';
import { EmailTemplate, CATEGORY_LABELS, replaceVariables, TemplateData } from '@/lib/emailTemplateUtils';

interface TemplateSelectorProps {
    category?: EmailTemplate['category'];
    onSelectTemplate: (filled: { subject: string; body: string }) => void;
    templateData: TemplateData;
}

const TemplateSelector = ({ category, onSelectTemplate, templateData }: TemplateSelectorProps) => {
    const [templates, setTemplates] = useState<EmailTemplate[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTemplates();
    }, [category]);

    const fetchTemplates = async () => {
        try {
            let query = supabase
                .from('email_response_templates')
                .select('*')
                .eq('is_active', true)
                .order('name');

            if (category) {
                query = query.eq('category', category);
            }

            const { data, error } = await query;

            if (error) throw error;
            setTemplates(data || []);
        } catch (error) {
            console.error('Error fetching templates:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectTemplate = (template: EmailTemplate) => {
        const filled = replaceVariables(
            { subject: template.subject, body: template.body },
            templateData
        );
        onSelectTemplate(filled);
        setIsOpen(false);
    };

    // Group templates by category
    const groupedTemplates = templates.reduce((acc, template) => {
        if (!acc[template.category]) {
            acc[template.category] = [];
        }
        acc[template.category].push(template);
        return acc;
    }, {} as Record<string, EmailTemplate[]>);

    return (
        <div className="relative">
            <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full justify-between bg-slate-900 border-slate-700 hover:bg-slate-800"
            >
                <span className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {templates.length > 0 ? 'Utiliser un template' : 'Aucun template disponible'}
                </span>
                <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </Button>

            {isOpen && (
                <>
                    {/* Overlay to close dropdown */}
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Dropdown menu */}
                    <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-700 rounded-lg shadow-xl z-20 max-h-96 overflow-auto">
                        {loading ? (
                            <div className="p-4 text-center text-slate-400 text-sm">
                                Chargement des templates...
                            </div>
                        ) : templates.length === 0 ? (
                            <div className="p-4 text-center text-slate-400 text-sm">
                                Aucun template disponible
                            </div>
                        ) : (
                            <div className="py-2">
                                {Object.entries(groupedTemplates).map(([cat, temps]) => (
                                    <div key={cat}>
                                        <div className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                            {CATEGORY_LABELS[cat as EmailTemplate['category']]}
                                        </div>
                                        {temps.map((template) => (
                                            <button
                                                key={template.id}
                                                type="button"
                                                onClick={() => handleSelectTemplate(template)}
                                                className="w-full text-left px-4 py-3 hover:bg-slate-800 transition-colors border-b border-slate-800 last:border-0"
                                            >
                                                <div className="font-medium text-white text-sm">{template.name}</div>
                                                <div className="text-xs text-slate-400 mt-1 truncate">
                                                    {template.subject}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default TemplateSelector;

