import { create } from "zustand";

const defaultValues = { id: "", title: "" };

interface IRenameModal {
  isOpen: boolean;
  isLoading: boolean;
  initialValues: typeof defaultValues;
  onOpen: (id: string, title: string) => void;
  onClose: () => void;
  setLoading: (loading: boolean) => void;
}

export const useRename = create<IRenameModal>((set) => ({
  isOpen: false,
  isLoading: false,
  onOpen: (id, title) => set({ isOpen: true, initialValues: { id, title } }),
  setLoading: (loading) => set({ isLoading: loading }),
  onClose: () => set({ isOpen: false, initialValues: defaultValues }),
  initialValues: defaultValues,
}));
