import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface HintProps {
  label: string;
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  sideOffset?: number;
};

export const Hint = ({
  label,
  children,
  side,
  sideOffset,
}: HintProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {children}
      </TooltipTrigger>
      <TooltipContent side={side} sideOffset={sideOffset}>
        <p>
          {label}
        </p>
      </TooltipContent>
    </Tooltip>
  )
};
