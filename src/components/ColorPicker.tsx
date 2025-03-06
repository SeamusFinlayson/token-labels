import { colors } from "../colors";
import { cn } from "../utils";

export function ColorPicker({
  currentColor,
  setColor,
}: {
  currentColor: string;
  setColor: (color: string) => void;
}): JSX.Element {
  const colorButtons: JSX.Element[] = [];
  for (const color of colors) {
    colorButtons.push(
      <button
        key={color}
        onClick={() => setColor(color)}
        className="group flex h-[34px] w-[34px] items-center justify-center outline-none"
      >
        <div
          className={cn(
            "h-[24px] w-[24px] rounded-full shadow-md duration-100 group-hover:h-[32px] group-hover:w-[32px] group-focus-visible:h-[32px] group-focus-visible:w-[32px]",
            { "h-[32px] w-[32px]": color === currentColor },
          )}
          style={{ background: color }}
        ></div>
      </button>,
    );
  }

  return (
    <div className="grid grid-cols-4 place-items-center">{colorButtons}</div>
  );
}
