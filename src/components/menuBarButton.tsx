import { ButtonHTMLAttributes } from "react";
import { cn } from "../utils";
import { IconFadeWrapper } from "./IconFadeWrapper";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  fade?: boolean;
  lightModeFade?: boolean;
}

export function MenuBarButton({
  fade = false,
  lightModeFade = false,
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
      <IconFadeWrapper lightModeFade={lightModeFade} fade={fade}>
        {children}
      </IconFadeWrapper>
    </button>
  );
}
