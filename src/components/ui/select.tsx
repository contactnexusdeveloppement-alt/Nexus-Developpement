import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

// Simplified Select Context
const SelectContext = React.createContext<{
  value: string;
  onValueChange: (value: string) => void;
  options: { value: string; label: React.ReactNode }[];
  setOptions: React.Dispatch<React.SetStateAction<{ value: string; label: React.ReactNode }[]>>;
  open: boolean;
  setOpen: (open: boolean) => void;
} | null>(null);

const Select = ({ value, onValueChange, children }: { value?: string, onValueChange?: (value: string) => void, children: React.ReactNode }) => {
  const [options, setOptions] = React.useState<{ value: string; label: React.ReactNode }[]>([]);
  const [open, setOpen] = React.useState(false);

  return (
    <SelectContext.Provider value={{
      value: value || "",
      onValueChange: onValueChange || (() => { }),
      options,
      setOptions,
      open,
      setOpen
    }}>
      <div className="relative inline-block w-full">
        {children}
      </div>
    </SelectContext.Provider>
  )
}

const SelectTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => {
  const context = React.useContext(SelectContext);
  return (
    <button
      ref={ref}
      type="button"
      onClick={() => context?.setOpen(!context.open)}
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 opacity-50" />
    </button>
  )
});
SelectTrigger.displayName = "SelectTrigger";

const SelectValue = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement> & { placeholder?: string }
>(({ className, children, placeholder, ...props }, ref) => {
  const context = React.useContext(SelectContext);
  const selectedOption = context?.options.find(o => o.value === context.value);

  return (
    <span ref={ref} className={className} {...props}>
      {selectedOption ? selectedOption.label : (placeholder || children || "Select...")}
    </span>
  )
});
SelectValue.displayName = "SelectValue";

const SelectContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, position = "popper", ...props }, ref) => {
  const context = React.useContext(SelectContext);
  if (!context?.open) return null;

  return (
    <div
      ref={ref}
      className={cn(
        "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-80",
        position === "popper" && "translate-y-1",
        className
      )}
      {...props}
    >
      <div className="p-1">
        {children}
      </div>
    </div>
  )
});
SelectContent.displayName = "SelectContent";

const SelectItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value: string }
>(({ className, children, value, ...props }, ref) => {
  const context = React.useContext(SelectContext);

  // Register option (hacky effect)
  React.useEffect(() => {
    context?.setOptions(prev => {
      if (prev.find(p => p.value === value)) return prev;
      return [...prev, { value, label: children }];
    });
  }, [value, children]);

  return (
    <div
      ref={ref}
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-accent hover:text-accent-foreground cursor-pointer",
        className
      )}
      onClick={() => {
        context?.onValueChange(value);
        context?.setOpen(false);
      }}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        {/* Check icon if selected could go here */}
      </span>
      <span className="truncate">{children}</span>
    </div>
  )
});
SelectItem.displayName = "SelectItem";

export {
  Select,
  // SelectGroup, // Omitted for simplicity
  SelectValue,
  SelectTrigger,
  SelectContent,
  // SelectLabel,
  SelectItem,
  // SelectSeparator,
};
