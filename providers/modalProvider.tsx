"use client";

import { RenameModals } from "@/app/(dashboard)/_components/board/RenameModals";
import { useEffect, useState } from "react";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <RenameModals />
    </>
  );
};
