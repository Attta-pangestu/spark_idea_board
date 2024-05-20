import { Hint } from "@/app/(dashboard)/_components/sidebar/Hint";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  src?: string;
  name?: string;
  fallback?: string;
  borderColor?: string;
  isYou?: Boolean;
}

export const UserAvatar = ({
  src,
  name,
  fallback,
  borderColor,
  isYou,
}: UserAvatarProps) => {
  return (
    <Hint label={name || "Teammate"} side="bottom" sideOffset={18}>
      <Avatar
        className={cn("h-8 w-8 border-2", isYou && "border-sky-500 h-10 w-10")}
        style={{ borderColor }}
      >
        <AvatarImage src={src} />
        <AvatarFallback className="text-xs font-semibold">
          {fallback}
        </AvatarFallback>
      </Avatar>
    </Hint>
  );
};
