import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import Image from "next/image";

interface EmptyOrg {
  imageUrl: string;
  title: string;
  description: string;
  buttonText?: string;
  buttonContent?: React.ReactNode;
}

export const EmptyNotif = ({
  imageUrl,
  title,
  description,
  buttonText,
  buttonContent,
}: EmptyOrg) => {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center whitespace-nowrap space-y-4">
      <Image alt="Empty Board" src={imageUrl} width={200} height={200} />
      <h2 className="text-2xl font-semibold mt-6">{title}</h2>
      <p className="text-muted-foreground text-sm ">{description}</p>
      {buttonText && buttonContent && (
        <>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="lg">
                {" "}
                <Plus className="h-4 w-4 mr-2" /> {buttonText}
              </Button>
            </DialogTrigger>
            <DialogContent className="p-0 bg-transparent border-none max-w-[480px]">
              {buttonContent}
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
};
