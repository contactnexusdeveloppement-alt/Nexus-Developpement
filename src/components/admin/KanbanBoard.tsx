import { useState, useEffect } from "react";
import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragOverEvent,
    DragEndEvent
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CircleDot, TrendingUp, Briefcase, Archive, GripVertical, Phone, Mail, Clock } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import ClientDetailModal from "./ClientDetailModal";

// --- TYPES ---
interface Client {
    email: string;
    name: string;
    phone: string | null;
    status: string; // 'lead' | 'prospect' | 'client' | 'lost'
    quotesCount: number;
    callsCount: number;
    lastContact: Date;
    rawData: any; // Original client object for the sheet
}

interface Column {
    id: string;
    title: string;
    icon: any;
    color: string;
}

const COLUMNS: Column[] = [
    { id: 'lead', title: "Leads", icon: CircleDot, color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
    { id: 'prospect', title: "Prospects", icon: TrendingUp, color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20" },
    { id: 'client', title: "Clients Gagnés", icon: Briefcase, color: "text-green-400 bg-green-500/10 border-green-500/20" },
    { id: 'lost', title: "Perdus", icon: Archive, color: "text-red-400 bg-red-500/10 border-red-500/20" },
];

// --- SORTABLE CARD COMPONENT ---
const SortableClientCard = ({ client, onClick, onQuoteClick }: { client: Client; onClick: () => void; onQuoteClick: () => void }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: client.email, data: { status: client.status } });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
    };

    const hasPendingQuote = client.quotesCount > 0;

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`
        group relative bg-slate-900/50 hover:bg-slate-800/80 
        border border-white/5 hover:border-blue-500/30 
        rounded-lg p-3 transition-all cursor-pointer mb-3
        shadow-sm hover:shadow-md
      `}
            onClick={onClick}
        >
            {/* Drag Handle */}
            <div {...attributes} {...listeners} className="absolute top-3 right-3 opacity-0 group-hover:opacity-50 hover:!opacity-100 cursor-grab active:cursor-grabbing">
                <GripVertical className="h-4 w-4 text-slate-400" />
            </div>

            <div className="pr-4">
                <div className="flex justify-between items-center mb-1">
                    <h4 className="font-semibold text-sm text-slate-200 truncate">{client.name}</h4>
                    {hasPendingQuote && <Badge variant="outline" className="text-[10px] px-1 py-0 h-4 border-yellow-500/30 text-yellow-500 bg-yellow-500/10">Devis</Badge>}
                </div>
                <p className="text-xs text-slate-500 truncate mb-2">{client.email}</p>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {(client.quotesCount > 0 || client.callsCount > 0) && (
                            <Badge variant="outline" className="text-[10px] px-1 py-0 h-5 border-white/10 text-slate-400 bg-slate-950/50 gap-1">
                                {client.quotesCount > 0 && <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {client.quotesCount}</span>}
                                {client.callsCount > 0 && <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {client.callsCount}</span>}
                            </Badge>
                        )}
                    </div>
                    {/* Quick Action: Open Quote Mode if pending quote, else DB view */}
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 rounded-full hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                            e.stopPropagation();
                            if (hasPendingQuote) onQuoteClick();
                            else onClick();
                        }}
                    >
                        <CircleDot className="w-3 h-3 text-slate-500 hover:text-blue-400" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

// --- MAIN KANBAN BOARD ---

interface KanbanBoardProps {
    clients: any[]; // The raw client array from ClientsTab
    quotes: any[];
    callBookings: any[];
    callNotes: any;
    onQuoteClick: any;
    onCallClick: any;
    onStatusUpdate: () => void;
}

const KanbanBoard = ({ clients, quotes, callBookings, callNotes, onQuoteClick, onCallClick, onStatusUpdate }: KanbanBoardProps) => {
    const [boardData, setBoardData] = useState<Record<string, Client[]>>({
        lead: [], prospect: [], client: [], lost: []
    });
    const [activeDragId, setActiveDragId] = useState<string | null>(null);

    // Sheet state
    const [selectedClient, setSelectedClient] = useState<any | null>(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [initialViewMode, setInitialViewMode] = useState<'quote' | 'call' | 'db'>('db');

    // Initialize board columns from clients prop
    useEffect(() => {
        const newBoard: Record<string, Client[]> = { lead: [], prospect: [], client: [], lost: [] };

        clients.forEach(c => {
            const mappedClient: Client = {
                email: c.email,
                name: c.name,
                phone: c.phone,
                status: c.status || 'lead',
                quotesCount: c.quotes.length,
                callsCount: c.calls.length,
                lastContact: c.lastContact,
                rawData: c
            };
            const status = mappedClient.status as string;
            if (newBoard[status]) {
                newBoard[status].push(mappedClient);
            } else {
                // Fallback for unknown status
                newBoard['lead'].push(mappedClient);
            }
        });

        setBoardData(newBoard);
    }, [clients]);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragStart = (event: DragStartEvent) => {
        setActiveDragId(event.active.id as string);
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over) {
            setActiveDragId(null);
            return;
        }

        const activeId = active.id as string;
        const overId = over.id as string;

        // Find source and destination containers
        // Note: overId can be a container ID or an item ID within a container
        let sourceContainer: string | undefined;
        let destContainer: string | undefined;

        // Find source container
        for (const [key, items] of Object.entries(boardData)) {
            if (items.find(i => i.email === activeId)) {
                sourceContainer = key;
                break;
            }
        }

        // Find destination container
        // If overId is one of our column keys (lead, prospect, etc.)
        if (Object.keys(boardData).includes(overId)) {
            destContainer = overId;
        } else {
            // Otherwise it's an item, find which container it belongs to
            for (const [key, items] of Object.entries(boardData)) {
                if (items.find(i => i.email === overId)) {
                    destContainer = key;
                    break;
                }
            }
        }

        if (!sourceContainer || !destContainer || sourceContainer === destContainer) {
            setActiveDragId(null);
            return;
        }

        // Move item in UI immediately for optimism
        const itemToMove = boardData[sourceContainer].find(i => i.email === activeId);
        if (!itemToMove) return;

        // Update status locally
        const newItem = { ...itemToMove, status: destContainer };

        setBoardData(prev => ({
            ...prev,
            [sourceContainer!]: prev[sourceContainer!].filter(i => i.email !== activeId),
            [destContainer!]: [newItem, ...prev[destContainer!]] // Add to top
        }));

        setActiveDragId(null);

        // Update Supabase
        try {
            const { error } = await supabase
                .from('client_statuses')
                .upsert({
                    client_email: activeId,
                    status: destContainer,
                    updated_at: new Date().toISOString()
                }, { onConflict: 'client_email' });

            if (error) throw error;
            toast.success(`Client déplacé vers ${COLUMNS.find(c => c.id === destContainer)?.title}`);
            onStatusUpdate(); // Refresh parent data
        } catch (e: any) {
            toast.error("Erreur mise à jour: " + e.message);
            // Revert UI if needed (omitted for brevity, but recommended in prod)
        }
    };

    const openClientDetailModal = (client: any, mode: 'quote' | 'call' | 'db') => {
        setSelectedClient(client.rawData);
        setInitialViewMode(mode);
        setIsSheetOpen(true);
    };

    const handleClientClick = (client: Client) => {
        openClientDetailModal(client, 'db');
    };

    const handleQuoteClick = (quote: any) => {
        // Assuming quote object has client information or can be used to fetch it
        // For now, we'll just pass the client from the modal's perspective
        // This function is called from the modal, so it already has the client context
        // We need to adjust the ClientDetailModal's onQuoteClick prop to pass the client
        // For now, we'll just close the modal and let the parent handle the quote click
        setIsSheetOpen(false);
        onQuoteClick(quote);
    };

    const handleCallClick = (call: any) => {
        // Similar to handleQuoteClick
        setIsSheetOpen(false);
        onCallClick(call);
    };

    return (
        <div className="h-full w-full overflow-x-auto pb-4">
            {selectedClient && (
                <ClientDetailModal
                    isOpen={isSheetOpen}
                    onClose={() => setIsSheetOpen(false)}
                    client={selectedClient}
                    quotes={quotes}
                    bookings={callBookings}
                    callNotes={callNotes}
                    onQuoteClick={handleQuoteClick}
                    onCallClick={handleCallClick}
                    onStatusUpdate={onStatusUpdate}
                    initialViewMode={initialViewMode}
                />
            )}

            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <div className="flex gap-4 h-[600px] min-w-[1000px]">
                    {COLUMNS.map((column) => (
                        <div key={column.id} className="flex-1 min-w-[250px] flex flex-col bg-slate-950/30 border border-white/5 rounded-xl overflow-hidden backdrop-blur-sm">
                            {/* Column Header */}
                            <div className={`p-3 border-b border-white/5 flex justify-between items-center ${column.color.replace('text-', 'bg-').replace('10', '5')}`}>
                                <div className="flex items-center gap-2 font-semibold text-sm">
                                    <column.icon className={`w-4 h-4 ${column.color.split(' ')[0]}`} />
                                    <span className="text-slate-200">{column.title}</span>
                                </div>
                                <Badge variant="secondary" className="bg-slate-900/50 text-slate-400 text-xs border-0">
                                    {boardData[column.id]?.length || 0}
                                </Badge>
                            </div>

                            {/* Column Content */}
                            <div className="flex-1 p-2 bg-slate-950/20">
                                <SortableContext
                                    id={column.id}
                                    items={boardData[column.id]?.map(c => c.email) || []}
                                    strategy={verticalListSortingStrategy}
                                >
                                    <ScrollArea className="h-full pr-3">
                                        {boardData[column.id]?.map((client) => (
                                            <SortableClientCard
                                                key={client.email}
                                                client={client}
                                                onClick={() => handleClientClick(client)}
                                                onQuoteClick={() => openClientDetailModal(client, 'quote')}
                                            />
                                        ))}
                                    </ScrollArea>
                                </SortableContext>
                            </div>
                        </div>
                    ))}
                </div>
            </DndContext>
        </div>
    );
};

export default KanbanBoard;
