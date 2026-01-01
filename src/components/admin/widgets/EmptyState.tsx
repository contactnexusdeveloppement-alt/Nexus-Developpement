interface EmptyStateProps {
    icon?: string;
    message: string;
    description?: string;
}

const EmptyState = ({ icon = "📊", message, description }: EmptyStateProps) => {
    return (
        <div className="flex flex-col items-center justify-center h-full py-12 px-4">
            <div className="text-6xl mb-4 opacity-50">{icon}</div>
            <h4 className="text-lg font-semibold text-slate-300 mb-2">{message}</h4>
            {description && (
                <p className="text-sm text-slate-400 text-center max-w-md">{description}</p>
            )}
        </div>
    );
};

export default EmptyState;
