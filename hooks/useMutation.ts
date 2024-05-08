import { useState } from "react";
import { useMutation } from "convex/react";

interface IMutation {
  mutateFunc: any;
}

export const useAPIMutation = (mutateFunc: any) => {
  const [isLoading, setIsLoading] = useState(false);
  const mutateProcess = useMutation(mutateFunc);

  const mutating = (payload: any) => {
    setIsLoading(true);
    return mutateProcess(payload)
      .then((result) => {
        return result;
      })
      .catch((err) => {
        throw err;
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  return {
    mutating,
    isLoading,
  };
};
