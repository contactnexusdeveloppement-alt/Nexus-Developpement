import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Bell, X, Check, ExternalLink, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Notification } from "@/types/notifications";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import EmptyState from "./widgets/EmptyState";

const NotificationCenter = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchNotifications();

        // Subscribe to realtime notifications
        const channel = supabase
            .channel("notifications")
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "notifications",
                },
                (payload) => {
                    console.log("Notification update:", payload);
                    fetchNotifications();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const fetchNotifications = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
            .from("notifications")
            .select("*")
            .or(`user_id.eq.${user.id},user_id.is.null`)
            .order("created_at", { ascending: false })
            .limit(20);

        if (error) {
            console.error("Error fetching notifications:", error);
            return;
        }

        if (data) {
            setNotifications(data);
            setUnreadCount(data.filter((n) => !n.read).length);
        }
    };

    const markAsRead = async (id: string) => {
        const { error } = await supabase
            .from("notifications")
            .update({ read: true })
            .eq("id", id);

        if (!error) {
            setNotifications((prev) =>
                prev.map((n) => (n.id === id ? { ...n, read: true } : n))
            );
            setUnreadCount((prev) => Math.max(0, prev - 1));
        }
    };

    const markAllAsRead = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { error } = await supabase
            .from("notifications")
            .update({ read: true })
            .or(`user_id.eq.${user.id},user_id.is.null`)
            .eq("read", false);

        if (!error) {
            setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
            setUnreadCount(0);
        }
    };

    const deleteNotification = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent notification click handler

        const { error } = await supabase
            .from("notifications")
            .delete()
            .eq("id", id);

        if (!error) {
            setNotifications((prev) => prev.filter((n) => n.id !== id));
            setUnreadCount((prev) => {
                const notification = notifications.find((n) => n.id === id);
                return notification && !notification.read ? Math.max(0, prev - 1) : prev;
            });
        }
    };

    const clearAllNotifications = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { error } = await supabase
            .from("notifications")
            .delete()
            .or(`user_id.eq.${user.id},user_id.is.null`);

        if (!error) {
            setNotifications([]);
            setUnreadCount(0);
        }
    };

    const handleNotificationClick = (notification: Notification) => {
        markAsRead(notification.id);
        if (notification.link) {
            setOpen(false);
            // Use React Router navigation instead of window.location to avoid 404 errors
            navigate(notification.link);
        }
    };

    const getNotificationIcon = (type: string) => {
        const iconMap: any = {
            new_lead: "🎯",
            new_call: "📞",
            quote_pending: "📝",
            quote_accepted: "✅",
            payment_received: "💰",
            project_overdue: "⚠️",
            invoice_overdue: "🔴",
            milestone_completed: "🎉",
            deliverable_submitted: "📦",
            system: "ℹ️",
        };
        return iconMap[type] || "🔔";
    };

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className="relative text-slate-300 hover:bg-white/5 rounded-full"
                >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold animate-pulse">
                            {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="w-96 bg-slate-900 border-white/10 p-0"
            >
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                    <h3 className="font-semibold text-white">Notifications</h3>
                    <div className="flex gap-2">
                        {unreadCount > 0 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={markAllAsRead}
                                className="text-xs text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                            >
                                <Check className="w-3 h-3 mr-1" />
                                Marquer tout lu
                            </Button>
                        )}
                        {notifications.length > 0 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearAllNotifications}
                                className="text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            >
                                <Trash2 className="w-3 h-3 mr-1" />
                                Tout effacer
                            </Button>
                        )}
                    </div>
                </div>

                <ScrollArea className="h-[400px]">
                    {notifications.length === 0 ? (
                        <div className="p-6">
                            <EmptyState
                                icon="🔔"
                                message="Aucune notification"
                                description="Les nouvelles notifications apparaîtront ici"
                            />
                        </div>
                    ) : (
                        <div className="divide-y divide-white/5">
                            {notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`group relative p-4 hover:bg-white/5 transition-colors cursor-pointer ${!notification.read ? "bg-blue-500/5" : ""
                                        }`}
                                    onClick={() => handleNotificationClick(notification)}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="text-2xl flex-shrink-0">
                                            {getNotificationIcon(notification.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <p
                                                    className={`text-sm font-medium ${!notification.read ? "text-white" : "text-slate-300"
                                                        }`}
                                                >
                                                    {notification.title}
                                                </p>
                                                {!notification.read && (
                                                    <div className="h-2 w-2 rounded-full bg-blue-500 flex-shrink-0 mt-1" />
                                                )}
                                            </div>
                                            <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                                                {notification.message}
                                            </p>
                                            <div className="flex items-center justify-between mt-2">
                                                <p className="text-xs text-slate-500">
                                                    {format(new Date(notification.created_at), "PPp", {
                                                        locale: fr,
                                                    })}
                                                </p>
                                                {notification.link && (
                                                    <ExternalLink className="w-3 h-3 text-slate-500" />
                                                )}
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={(e) => deleteNotification(notification.id, e)}
                                            className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default NotificationCenter;
