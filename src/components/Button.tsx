import { ButtonHTMLAttributes } from "react";
import { cn } from "../utils";

export function Button(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={cn(
        "flex items-center justify-center rounded-xl bg-mirage-100 p-2 drop-shadow-xs duration-150 hover:bg-mirage-50 dark:bg-mirage-700 dark:hover:bg-mirage-600",
        props.className,
      )}
    >
      {props.children}
    </button>
  );
}
