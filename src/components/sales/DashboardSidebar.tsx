import { cn } from "@/lib/utils";
import {
    Users,
    FileText,
    LayoutDashboard,
    BookOpen,
    LogOut,
    Sparkles,
    Euro
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardSidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    userName?: string;
    onLogout: () => void;
    className?: string; // Allow passing external classes
}

const DashboardSidebar = ({ activeTab, setActiveTab, userName, onLogout, className }: DashboardSidebarProps) => {
    const menuItems = [
        { id: 'overview', label: 'Vue d\'ensemble', icon: LayoutDashboard },
        { id: 'quotes', label: 'Mes Devis', icon: FileText },
        { id: 'commissions', label: 'Commissions', icon: Euro },
        { id: 'prospects', label: 'Prospects', icon: Users },
        { id: 'formation', label: 'Formation', icon: BookOpen },
    ];

    return (
        <div className={cn(
            "h-full w-full flex flex-col bg-slate-950/80 backdrop-blur-xl border-r border-white/10",
            className
        )}>
            {/* Brand */}
            <div className="p-6 flex items-center gap-3 mb-2">
                <div className="relative w-8 h-8 flex items-center justify-center">
                    <img
                        src="/nexus-logo.webp"
                        alt="Nexus Logo"
                        className="w-full h-full object-contain drop-shadow-[0_0_8px_rgba(59,130,246,0.3)]"
                    />
                </div>
                <div>
                    <h1 className="font-bold text-white tracking-tight text-lg leading-none">Nexus</h1>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-medium mt-0.5">Partner</p>
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
                            {userName?.charAt(0) || 'U'}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium text-white truncate max-w-[100px]">{userName || 'Utilisateur'}</p>
                            <p className="text-xs text-slate-500 truncate">Connecté</p>
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

export default DashboardSidebar;
