import { ButtonHTMLAttributes } from "react";
import { cn } from "../utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  fade?: boolean;
}

export function MenuBarButton({
  fade = false,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "flex size-10 items-center justify-center rounded-full text-black transition-all duration-150 hover:bg-black/5 dark:text-white dark:hover:bg-white/5",
        className,
      )}
      {...props}
    >
      <div className={cn({ "opacity-[0.54] dark:opacity-[1]": fade })}>
        {children}
      </div>
    </button>
  );
}
