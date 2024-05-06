"use client";
import Image from "next/image";
import { Hint } from "./Hint";
import { cn } from "@/lib/utils";
import { useOrganization, useOrganizationList } from "@clerk/nextjs";

interface ListProps {
  src: string;
  name: string;
  id: string;
}

export const Item = ({ src, name, id }: ListProps) => {
  const { organization } = useOrganization();
  const { setActive } = useOrganizationList();

  const isActive = organization?.id === id;

  const onClick = () => {
    if (!setActive) return;
    setActive({ organization: id });
  };

  return (
    <div className="aspect-square relative ">
      <Hint label={name} align="end" side="right">
        <Image
          alt={name}
          src={src}
          width={36}
          height={36}
          className={cn(
            "rounded-md cursor-pointer opacity-75 hover:opacity-100 transition",
            isActive && "opacity-100"
          )}
          onClick={onClick}
        />
      </Hint>
    </div>
  );
};
