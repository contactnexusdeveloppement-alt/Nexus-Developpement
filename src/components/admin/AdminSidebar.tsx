import { cn } from "@/lib/utils";
import {
    Users,
    Briefcase,
    FileText,
    Target,
    ClipboardList,
    Bot,
    TrendingUp,
    Mail,
    LogOut,
    LayoutDashboard
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminSidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    userId?: string;
    onLogout: () => void;
    className?: string;
}

const AdminSidebar = ({ activeTab, setActiveTab, userId, onLogout, className }: AdminSidebarProps) => {
    const menuItems = [
        { id: 'clients', label: 'Clients', icon: Users },
        { id: 'projects', label: 'Projets', icon: Briefcase },
        { id: 'invoices', label: 'Factures', icon: FileText },
        { id: 'opportunities', label: 'Opportunités', icon: Target },
        { id: 'tasks', label: 'Tâches', icon: ClipboardList },
        { id: 'ai', label: 'Assistant IA', icon: Bot },
        { id: 'analytics', label: 'Analytics', icon: TrendingUp },
        { id: 'templates', label: 'Templates', icon: Mail },
        { id: 'team', label: 'Équipe', icon: Users },
    ];

    return (
        <div className={cn(
            "h-full w-full flex flex-col bg-slate-950/80 backdrop-blur-xl border-r border-white/10",
            className
        )}>
            {/* Brand */}
            <div className="p-6 flex items-center gap-4 mb-2">
                <div className="relative w-12 h-12 flex items-center justify-center">
                    <img
                        src="/nexus-logo.webp"
                        alt="Nexus Logo"
                        className="w-full h-full object-contain drop-shadow-[0_0_8px_rgba(59,130,246,0.3)]"
                    />
                </div>
                <div>
                    <h1 className="font-bold text-white tracking-tight text-2xl leading-none">Nexus</h1>
                    <p className="text-xs text-blue-400 uppercase tracking-widest font-bold mt-1">Admin</p>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                {menuItems.map((item) => {
                    const isActive = activeTab === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={cn(
                                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden",
                                isActive
                                    ? "bg-blue-600/10 text-blue-400"
                                    : "text-slate-400 hover:text-white hover:bg-white/5"
                            )}
                        >
                            {isActive && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-r-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                            )}
                            <item.icon className={cn(
                                "w-5 h-5 transition-transform group-hover:scale-110",
                                isActive ? "text-blue-400" : "text-slate-500 group-hover:text-white"
                            )} />
                            <span className="font-medium text-sm">{item.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* User Profile */}
            <div className="p-4 border-t border-white/5">
                <div className="p-4 rounded-2xl bg-slate-900/50 border border-white/5 flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-slate-700 to-slate-600 flex items-center justify-center text-white font-semibold text-sm border border-white/10">
                            A
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium text-white truncate max-w-[100px]">Admin</p>
                            <p className="text-xs text-green-400 truncate flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                En ligne
                            </p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onLogout}
                        className="text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default AdminSidebar;
