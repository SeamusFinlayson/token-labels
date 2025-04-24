import { useRef } from "react";
import { cn } from "../utils";
import { IconFadeWrapper } from "./IconFadeWrapper";
import PartiallyControlledInput from "./PartiallyControlledInput";

interface InputProps
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  label: string;
  Icon?: React.ReactNode;
  onUpdate: (target: HTMLInputElement) => void;
}

export function Input({ label, Icon, value, onUpdate, ...props }: InputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      className="dark:bg-mirage-700 dark:hover:bg-mirage-600 bg-mirage-200/60 focus-within:hover:bg-mirage-200/60 hover:bg-mirage-200 dark:focus-within:hover:bg-mirage-700 cursor-text rounded-lg shadow-sm transition-colors"
      onClick={() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }}
    >
      <div
        className={cn(
          "flex h-full items-center [&_svg]:pointer-events-none [&_svg]:size-6 [&_svg]:shrink-0",
          { "px-3": Icon === undefined },
        )}
      >
        {Icon && (
          <div className="p-3">
            <IconFadeWrapper>{Icon}</IconFadeWrapper>
          </div>
        )}
        <div className="h-full p-2 pl-0">
          <div className="text-xs text-black/[0.54] dark:text-white/[.67]">
            {label}
          </div>
          <div className="flex">
            <PartiallyControlledInput
              parentValue={value}
              onUserConfirm={(target) => onUpdate(target)}
              ref={inputRef}
              className="h-6 w-full text-base leading-0 outline-hidden"
              {...props}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
