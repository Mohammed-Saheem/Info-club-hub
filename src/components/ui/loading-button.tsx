import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Check, X } from "lucide-react";
import { Button, ButtonProps, buttonVariants } from "./button";
import { cn } from "@/lib/utils";

type LoadingState = "idle" | "loading" | "success" | "error";

interface LoadingButtonProps extends Omit<ButtonProps, "children"> {
  isLoading?: boolean;
  loadingText?: string;
  successText?: string;
  errorText?: string;
  children: React.ReactNode;
  onLoadingComplete?: () => void;
}

export function LoadingButton({
  isLoading = false,
  loadingText = "Loading...",
  successText = "Success!",
  errorText = "Error",
  children,
  onLoadingComplete,
  className,
  disabled,
  ...props
}: LoadingButtonProps) {
  const [state, setState] = React.useState<LoadingState>("idle");

  React.useEffect(() => {
    if (isLoading) {
      setState("loading");
    }
  }, [isLoading]);

  const handleSuccess = () => {
    setState("success");
    setTimeout(() => {
      setState("idle");
      onLoadingComplete?.();
    }, 2000);
  };

  const handleError = () => {
    setState("error");
    setTimeout(() => {
      setState("idle");
    }, 2000);
  };

  return (
    <Button
      disabled={disabled || state === "loading"}
      className={cn(
        "relative overflow-hidden",
        state === "success" && "bg-green-600 hover:bg-green-600",
        state === "error" && "bg-destructive hover:bg-destructive",
        className
      )}
      {...props}
    >
      <AnimatePresence mode="wait">
        {state === "idle" && (
          <motion.span
            key="idle"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2"
          >
            {children}
          </motion.span>
        )}
        
        {state === "loading" && (
          <motion.span
            key="loading"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2"
          >
            <Loader2 className="w-4 h-4 animate-spin" />
            {loadingText}
          </motion.span>
        )}
        
        {state === "success" && (
          <motion.span
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <Check className="w-4 h-4" />
            </motion.div>
            {successText}
          </motion.span>
        )}
        
        {state === "error" && (
          <motion.span
            key="error"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <X className="w-4 h-4" />
            </motion.div>
            {errorText}
          </motion.span>
        )}
      </AnimatePresence>
    </Button>
  );
}

// Ripple effect button
export function RippleButton({ children, className, onClick, ...props }: ButtonProps) {
  const [ripples, setRipples] = React.useState<{ x: number; y: number; id: number }[]>([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();

    setRipples((prev) => [...prev, { x, y, id }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 600);

    onClick?.(e);
  };

  return (
    <Button
      className={cn("relative overflow-hidden", className)}
      onClick={handleClick}
      {...props}
    >
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="absolute rounded-full bg-white/30 pointer-events-none"
          style={{
            left: ripple.x - 10,
            top: ripple.y - 10,
            width: 20,
            height: 20,
          }}
        />
      ))}
      {children}
    </Button>
  );
}
