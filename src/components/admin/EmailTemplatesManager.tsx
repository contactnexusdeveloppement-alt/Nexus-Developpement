import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Mail, Plus, Pencil, Trash2, Eye, X } from 'lucide-react';
import { toast } from 'sonner';
import {
    EmailTemplate,
    CATEGORY_LABELS,
    CATEGORY_COLORS,
    ALLOWED_VARIABLES,
    VARIABLE_DESCRIPTIONS,
    extractVariables,
    validateTemplate,
    replaceVariables,
} from '@/lib/emailTemplateUtils';
import EmptyState from './widgets/EmptyState';

const EmailTemplatesManager = () => {
    const [templates, setTemplates] = useState<EmailTemplate[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState<Partial<EmailTemplate> | null>(null);
    const [previewMode, setPreviewMode] = useState(false);

    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        try {
            const { data, error } = await supabase
                .from('email_response_templates')
                .select('*')
                .eq('is_active', true)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setTemplates(data || []);
        } catch (error: any) {
            toast.error(`Erreur: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!editingTemplate) return;

        // Validation
        if (!editingTemplate.name || !editingTemplate.subject || !editingTemplate.body) {
            toast.error('Veuillez remplir tous les champs obligatoires');
            return;
        }

        // Validate variables
        const subjectValidation = validateTemplate(editingTemplate.subject, ALLOWED_VARIABLES as any);
        const bodyValidation = validateTemplate(editingTemplate.body, ALLOWED_VARIABLES as any);

        if (!subjectValidation.valid || !bodyValidation.valid) {
            toast.error('Variables invalides détectées');
            return;
        }

        try {
            const variables = [
                ...extractVariables(editingTemplate.subject || ''),
                ...extractVariables(editingTemplate.body || '')
            ];
            const uniqueVars = [...new Set(variables)];

            const templateData = {
                ...editingTemplate,
                variables: uniqueVars,
                updated_at: new Date().toISOString(),
            };

            if (editingTemplate.id) {
                // Update
                const { error } = await supabase
                    .from('email_response_templates')
                    .update(templateData)
                    .eq('id', editingTemplate.id);

                if (error) throw error;
                toast.success('Template mis à jour');
            } else {
                // Create
                const { data: userData } = await supabase.auth.getUser();
                const { error } = await supabase
                    .from('email_response_templates')
                    .insert({
                        ...templateData,
                        created_by: userData.user?.id,
                    });

                if (error) throw error;
                toast.success('Template créé');
            }

            setIsEditing(false);
            setEditingTemplate(null);
            fetchTemplates();
        } catch (error: any) {
            toast.error(`Erreur: ${error.message}`);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce template ?')) return;

        try {
            const { error } = await supabase
                .from('email_response_templates')
                .update({ is_active: false })
                .eq('id', id);

            if (error) throw error;
            toast.success('Template supprimé');
            fetchTemplates();
        } catch (error: any) {
            toast.error(`Erreur: ${error.message}`);
        }
    };

    const sampleData = {
        client_name: 'Jean Dupont',
        client_email: 'jean.dupont@example.com',
        project_details: 'Site e-commerce avec paiement en ligne',
        services: 'Site Web, E-commerce',
        budget: '10000€ - 20000€',
        company_name: 'Nexus Développement',
        admin_name: 'Équipe Nexus',
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Mail className="h-6 w-6" />
                        Templates d'Emails
                    </h2>
                    <p className="text-slate-400 text-sm mt-1">
                        Gérez vos templates de réponse pour gagner du temps
                    </p>
                </div>
                <Button
                    onClick={() => {
                        setEditingTemplate({
                            name: '',
                            category: 'quote_response',
                            subject: '',
                            body: '',
                        });
                        setIsEditing(true);
                    }}
                    className="bg-blue-600 hover:bg-blue-700"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Nouveau Template
                </Button>
            </div>

            {/* Templates List */}
            {loading ? (
                <div className="text-center py-12 text-slate-400">Chargement...</div>
            ) : templates.length === 0 ? (
                <Card className="bg-slate-950/40 border-white/10">
                    <CardContent className="py-8">
                        <EmptyState
                            icon="📧"
                            message="Aucun template disponible"
                            description="Créez votre premier template pour gagner du temps"
                        />
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {templates.map((template) => (
                        <Card key={template.id} className="bg-slate-950/40 border-white/10 hover:border-white/20 transition-colors">
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <CardTitle className="text-lg text-white flex items-center gap-2">
                                            {template.name}
                                            <Badge className={CATEGORY_COLORS[template.category]}>
                                                {CATEGORY_LABELS[template.category]}
                                            </Badge>
                                        </CardTitle>
                                        <p className="text-sm text-slate-400 mt-1">
                                            Objet: {template.subject}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                setEditingTemplate(template);
                                                setPreviewMode(true);
                                            }}
                                            className="text-blue-400 hover:text-blue-300"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                setEditingTemplate(template);
                                                setIsEditing(true);
                                            }}
                                            className="text-yellow-400 hover:text-yellow-300"
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDelete(template.id)}
                                            className="text-red-400 hover:text-red-300"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-slate-500">
                                    Variables: {template.variables?.join(', ') || 'Aucune'}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Edit/Create Modal */}
            {isEditing && editingTemplate && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-950 border border-white/10 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-auto">
                        <div className="p-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-slate-950 z-10">
                            <h3 className="text-xl font-bold text-white">
                                {editingTemplate.id ? 'Modifier' : 'Créer'} le Template
                            </h3>
                            <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="text-sm text-slate-400 block mb-2">Nom du template *</label>
                                <Input
                                    value={editingTemplate.name || ''}
                                    onChange={(e) => setEditingTemplate({ ...editingTemplate, name: e.target.value })}
                                    className="bg-slate-900 border-slate-700"
                                    placeholder="Ex: Réponse Positive"
                                />
                            </div>

                            <div>
                                <label className="text-sm text-slate-400 block mb-2">Catégorie *</label>
                                <select
                                    value={editingTemplate.category || 'quote_response'}
                                    onChange={(e) => setEditingTemplate({ ...editingTemplate, category: e.target.value as any })}
                                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-white"
                                >
                                    {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                                        <option key={key} value={key}>{label}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="text-sm text-slate-400 block mb-2">Objet de l'email *</label>
                                <Input
                                    value={editingTemplate.subject || ''}
                                    onChange={(e) => setEditingTemplate({ ...editingTemplate, subject: e.target.value })}
                                    className="bg-slate-900 border-slate-700"
                                    placeholder="Ex: Re: Demande de devis - {{client_name}}"
                                />
                            </div>

                            <div>
                                <label className="text-sm text-slate-400 block mb-2">Corps du message *</label>
                                <Textarea
                                    value={editingTemplate.body || ''}
                                    onChange={(e) => setEditingTemplate({ ...editingTemplate, body: e.target.value })}
                                    className="bg-slate-900 border-slate-700 min-h-[300px] font-mono text-sm"
                                    placeholder="Bonjour {{client_name}},&#10;&#10;Merci pour votre demande..."
                                />
                            </div>

                            <div className="bg-slate-900/50 border border-slate-700 p-4 rounded">
                                <p className="text-sm text-slate-400 mb-2">💡 Variables disponibles:</p>
                                <div className="grid grid-cols-2 gap-2">
                                    {ALLOWED_VARIABLES.map((varName) => (
                                        <button
                                            key={varName}
                                            onClick={() => {
                                                const cursorPos = document.activeElement as HTMLTextAreaElement;
                                                const text = `{{${varName}}}`;
                                                setEditingTemplate({
                                                    ...editingTemplate,
                                                    body: (editingTemplate.body || '') + text
                                                });
                                            }}
                                            className="text-left text-xs bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded border border-slate-600 text-blue-300"
                                        >
                                            {`{{${varName}}}`} - {VARIABLE_DESCRIPTIONS[varName]}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-2 justify-end pt-4">
                                <Button variant="outline" onClick={() => setIsEditing(false)}>
                                    Annuler
                                </Button>
                                <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                                    {editingTemplate.id ? 'Mettre à jour' : 'Créer'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Preview Modal */}
            {previewMode && editingTemplate && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-950 border border-white/10 rounded-lg w-full max-w-3xl max-h-[90vh] overflow-auto">
                        <div className="p-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-slate-950 z-10">
                            <h3 className="text-xl font-bold text-white">Prévisualisation</h3>
                            <Button variant="ghost" size="sm" onClick={() => setPreviewMode(false)}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="p-6">
                            {(() => {
                                const filled = replaceVariables(
                                    { subject: editingTemplate.subject || '', body: editingTemplate.body || '' },
                                    sampleData
                                );
                                return (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-sm text-slate-500">De:</label>
                                            <p className="text-white">{sampleData.company_name}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm text-slate-500">À:</label>
                                            <p className="text-white">{sampleData.client_email}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm text-slate-500">Objet:</label>
                                            <p className="text-white font-semibold">{filled.subject}</p>
                                        </div>
                                        <div className="border-t border-white/10 pt-4">
                                            <pre className="text-white whitespace-pre-wrap font-sans">{filled.body}</pre>
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmailTemplatesManager;

