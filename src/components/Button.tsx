import { cn } from "../utils";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-normal transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "shadow-sm bg-mirage-800 hover:bg-mirage-700 dark:bg-mirage-100 focus-visible:bg-mirage-700 dark:hover:bg-mirage-200 dark:focus-visible:bg-mirage-200 text-white dark:text-black",
        active:
          "dark:shadow-sm bg-green-200 hover:bg-green-300 focus-visible:bg-green-300 dark:bg-green-300 text-green-990 dark:text-black dark:hover:bg-green-400 dark:focus-visible:bg-green-400 ",
        destructive:
          " hover:bg-red-200 focus-visible:bg-red-200 dark:focus-visible:bg-red-800 dark:text-white dark:hover:bg-red-800 text-black",
        // outline:
        //   "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-mirage-200/60 dark:shadow-sm hover:bg-mirage-200 focus-visible:bg-mirage-200 dark:bg-mirage-700 dark:hover:bg-mirage-600 dark:focus-visible:bg-mirage-600",
        // ghost: "hover:bg-accent hover:text-accent-foreground",
        // link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-0 [&_svg]:size-5",
        sm: "h-7 text-sm [&_svg]:size-4 rounded-lg px-2 py-1",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }), className)}
      {...props}
    >
      {props.children}
    </button>
  );
}
