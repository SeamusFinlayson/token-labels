import React from "react";
import { cn } from "../utils";

// Fades icons in light mode without color bumps at svg path intersections
export function IconFadeWrapper({
  fade = true,
  children,
}: {
  fade?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={cn({ "opacity-[0.54] dark:opacity-[1]": fade })}>
      {children}
    </div>
  );
}
