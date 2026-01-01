import { AlertCircle, X } from "lucide-react";
import { Button } from "./button";

interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    variant?: "danger" | "warning" | "info";
}

export const ConfirmDialog = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = "Confirmer",
    cancelText = "Annuler",
    variant = "danger",
}: ConfirmDialogProps) => {
    if (!isOpen) return null;

    const variantStyles = {
        danger: {
            icon: "bg-red-500/10 text-red-400 border-red-500/20",
            confirmBtn: "bg-red-600 hover:bg-red-500 text-white",
            border: "border-red-500/20",
        },
        warning: {
            icon: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
            confirmBtn: "bg-yellow-600 hover:bg-yellow-500 text-white",
            border: "border-yellow-500/20",
        },
        info: {
            icon: "bg-blue-500/10 text-blue-400 border-blue-500/20",
            confirmBtn: "bg-blue-600 hover:bg-blue-500 text-white",
            border: "border-blue-500/20",
        },
    };

    const styles = variantStyles[variant];

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                className={`bg-slate-950 border ${styles.border} rounded-lg w-full max-w-md mx-4 shadow-2xl animate-in zoom-in-95 duration-200`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-start justify-between p-6 border-b border-white/10">
                    <div className="flex items-start gap-4">
                        <div className={`p-2 rounded-lg border ${styles.icon}`}>
                            <AlertCircle className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-white">{title}</h2>
                            <p className="text-sm text-slate-400 mt-1">{description}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-6">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="border-white/10 text-slate-300 hover:bg-white/5"
                    >
                        {cancelText}
                    </Button>
                    <Button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className={styles.confirmBtn}
                    >
                        {confirmText}
                    </Button>
                </div>
            </div>
        </div>
    );
};
