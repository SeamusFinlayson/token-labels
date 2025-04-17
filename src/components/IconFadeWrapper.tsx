import React from "react";
import { cn } from "../utils";

// Fades icons in light mode without color bumps at svg path intersections
export function IconFadeWrapper({
  lightModeFade = true,
  fade = false,
  children,
}: {
  lightModeFade?: boolean;
  fade?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        { "opacity-[0.54] dark:opacity-[1]": lightModeFade },
        { "opacity-[0.54] dark:opacity-[0.7]": fade },
      )}
    >
      {children}
    </div>
  );
}
