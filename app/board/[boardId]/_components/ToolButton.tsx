import { LucideIcon } from "lucide-react";
import { Hint } from "@/app/(dashboard)/_components/sidebar/Hint";
import { Button } from "@/components/ui/button";

interface IToolButton {
  label: string;
  Icon: LucideIcon;
  onClick: () => void;
  isActive?: boolean;
  isDisabled?: boolean;
}

export const ToolButton = ({
  label,
  Icon,
  onClick,
  isActive,
  isDisabled,
}: IToolButton) => {
  return (
    <Hint label={label} side="right" sideOffset={14}>
      <Button
        disabled={isDisabled}
        onClick={onClick}
        variant={isActive ? "boardActive" : "board"}
        size="icon"
      >
        <Icon />
      </Button>
    </Hint>
  );
};
