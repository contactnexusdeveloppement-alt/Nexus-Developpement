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
    DragEndEvent,
    useDroppable
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ClipboardList, Loader2, Plus, GripVertical, Trash2, CheckCircle2, Circle } from "lucide-react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

// --- TYPES ---
interface Task {
    id: string;
    content: string;
    columnId: 'todo' | 'in_progress' | 'done';
}

interface Column {
    id: 'todo' | 'in_progress' | 'done';
    title: string;
    icon: any;
    color: string;
}

const COLUMNS: Column[] = [
    { id: 'todo', title: "À Faire", icon: Circle, color: "text-slate-400 bg-slate-500/10 border-slate-500/20" },
    { id: 'in_progress', title: "En Cours", icon: Loader2, color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
    { id: 'done', title: "Terminé", icon: CheckCircle2, color: "text-green-400 bg-green-500/10 border-green-500/20" },
];

// --- DROPPABLE COLUMN ---
const DroppableColumn = ({
    column,
    tasks,
    onDelete
}: {
    column: Column;
    tasks: Task[];
    onDelete: (id: string) => void;
}) => {
    const { setNodeRef, isOver } = useDroppable({
        id: column.id,
    });

    return (
        <div
            ref={setNodeRef}
            className={`flex-1 min-w-[300px] flex flex-col bg-slate-950/30 border rounded-xl overflow-hidden backdrop-blur-sm transition-all ${isOver ? "border-blue-500/50 bg-blue-500/5" : "border-white/5"
                }`}
        >
            {/* Column Header */}
            <div className={`p-3 border-b border-white/5 flex justify-between items-center ${column.color.replace('text-', 'bg-').replace('10', '5')}`}>
                <div className="flex items-center gap-2 font-semibold text-sm">
                    <column.icon className={`w-4 h-4 ${column.color.split(' ')[0]}`} />
                    <span className="text-slate-200">{column.title}</span>
                </div>
                <Badge variant="secondary" className="bg-slate-900/50 text-slate-400 text-xs border-0">
                    {tasks.length}
                </Badge>
            </div>

            {/* Column Content */}
            <div className="flex-1 p-2 bg-slate-950/20">
                <SortableContext
                    id={column.id}
                    items={tasks.map(t => t.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <ScrollArea className="h-[500px] pr-3">
                        {tasks.map((task) => (
                            <SortableTaskCard
                                key={task.id}
                                task={task}
                                onDelete={onDelete}
                            />
                        ))}
                        {tasks.length === 0 && (
                            <div className="h-24 border-2 border-dashed border-white/5 rounded-lg flex items-center justify-center text-xs text-slate-600">
                                {isOver ? "Déposer ici" : "Vide"}
                            </div>
                        )}
                    </ScrollArea>
                </SortableContext>
            </div>
        </div>
    );
};

// --- SORTABLE TASK CARD ---
const SortableTaskCard = ({ task, onDelete }: { task: Task; onDelete: (id: string) => void }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: task.id, data: { task } });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`
        group relative bg-slate-900/50 hover:bg-slate-800/80 
        border border-white/5 hover:border-blue-500/30 
        rounded-lg p-3 transition-all mb-3
        shadow-sm hover:shadow-md flex items-start gap-3
      `}
        >
            {/* Drag Handle */}
            <div {...attributes} {...listeners} className="mt-1 cursor-grab active:cursor-grabbing text-slate-500 hover:text-white">
                <GripVertical className="h-4 w-4" />
            </div>

            <div className="flex-1 text-sm text-slate-200 break-words">
                {task.content}
            </div>

            <button
                onClick={() => onDelete(task.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-500 hover:text-red-400"
            >
                <Trash2 className="h-4 w-4" />
            </button>
        </div>
    );
};

// --- MAIN BOARD ---
const TasksBoard = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [activeDragId, setActiveDragId] = useState<string | null>(null);
    const [newTaskContent, setNewTaskContent] = useState("");

    // Load from local storage on mount
    useEffect(() => {
        const savedTasks = localStorage.getItem('admin_tasks');
        if (savedTasks) {
            try {
                setTasks(JSON.parse(savedTasks));
            } catch (e) {
                console.error("Failed to parse tasks", e);
            }
        } else {
            // Default seed data
            setTasks([
                { id: uuidv4(), content: "Configurer le dashboard", columnId: 'done' },
                { id: uuidv4(), content: "Relancer les leads froids", columnId: 'todo' },
                { id: uuidv4(), content: "Préparer script d'appel", columnId: 'in_progress' },
            ]);
        }
    }, []);

    // Save to local storage on change
    useEffect(() => {
        if (tasks.length > 0) {
            localStorage.setItem('admin_tasks', JSON.stringify(tasks));
        }
    }, [tasks]);

    const addTask = () => {
        if (!newTaskContent.trim()) return;

        const newTask: Task = {
            id: uuidv4(),
            content: newTaskContent,
            columnId: 'todo'
        };

        setTasks(prev => [...prev, newTask]);
        setNewTaskContent("");
        toast.success("Tâche ajoutée");
    };

    const deleteTask = (id: string) => {
        setTasks(prev => prev.filter(t => t.id !== id));
        toast.success("Tâche supprimée");
    };

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragStart = (event: DragStartEvent) => {
        setActiveDragId(event.active.id as string);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over) {
            setActiveDragId(null);
            return;
        }

        const activeId = active.id as string;
        const overId = over.id as string;

        // Determine destination column
        let destColumnId: string | undefined;

        if (COLUMNS.find(c => c.id === overId)) {
            destColumnId = overId as Task['columnId'];
        } else {
            const overTask = tasks.find(t => t.id === overId);
            if (overTask) destColumnId = overTask.columnId;
        }

        if (!destColumnId) {
            setActiveDragId(null);
            return;
        }

        // Update task column locally
        setTasks(prev => {
            const activeTask = prev.find(t => t.id === activeId);
            if (!activeTask) return prev;

            if (activeTask.columnId !== destColumnId) {
                // Moved to different column
                return prev.map(t => t.id === activeId ? { ...t, columnId: destColumnId as any } : t);
            } else {
                // Reordered in same column (if we implemented full reorder logic, but here simple swap is enough or just append)
                // For simplicity in this version, we just update the column. full reorder requires managing index.
                // dnd-kit provides arrayMove used in SortableContext but we manage generic arrays.
                // Let's implement simple reordering.
                const oldIndex = prev.findIndex(t => t.id === activeId);
                const newIndex = prev.findIndex(t => t.id === overId);

                if (oldIndex !== -1 && newIndex !== -1) {
                    return arrayMove(prev, oldIndex, newIndex);
                }
                return prev;
            }
        });

        setActiveDragId(null);
    };

    return (
        <div className="h-full flex flex-col space-y-4">
            {/* Add Task Bar */}
            <div className="flex gap-2 p-4 bg-slate-900/40 border border-white/5 rounded-xl">
                <Input
                    placeholder="Nouvelle tâche..."
                    value={newTaskContent}
                    onChange={(e) => setNewTaskContent(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addTask()}
                    className="bg-slate-950/50 border-white/10"
                />
                <Button onClick={addTask} size="icon" className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4" />
                </Button>
            </div>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <div className="flex-1 flex gap-4 overflow-x-auto pb-4">
                    {COLUMNS.map((column) => (
                        <DroppableColumn
                            key={column.id}
                            column={column}
                            tasks={tasks.filter(t => t.columnId === column.id)}
                            onDelete={deleteTask}
                        />
                    ))}
                </div>

                <DragOverlay>
                    {activeDragId ? (
                        <div className="bg-slate-800 border border-blue-500/50 rounded-lg p-3 shadow-2xl rotate-3 scale-105 cursor-grabbing w-[300px]">
                            <div className="flex items-start gap-3">
                                <GripVertical className="h-4 w-4 text-slate-500" />
                                <div className="text-sm text-slate-200 font-medium">
                                    {tasks.find(t => t.id === activeDragId)?.content}
                                </div>
                            </div>
                        </div>
                    ) : null}
                </DragOverlay>

            </DndContext>
        </div>
    );
};

export default TasksBoard;
