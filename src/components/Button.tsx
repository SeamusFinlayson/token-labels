import { ButtonHTMLAttributes } from "react";
import { cn } from "../utils";

export function Button(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={cn(
        "bg-mirage-100 hover:bg-mirage-50 focus-visible:bg-mirage-50 dark:bg-mirage-700 dark:hover:bg-mirage-600 dark:focus-visible:bg-mirage-600 flex items-center justify-center rounded-xl px-4 py-1.5 shadow-sm outline-hidden duration-100",
        props.className,
      )}
    >
      {props.children}
    </button>
  );
}
