import { useMutation } from "convex/react";
import { useState } from "react";
import type { FunctionReference } from "convex/server";

export const useMutationState = <
  M extends FunctionReference<"mutation"> // restricts to convex mutation references
>(
  mutationToRun: M
) => {
  const [pending, setPending] = useState(false);
  const mutationFn = useMutation(mutationToRun);

  // Infer argument & return types from the Convex mutation
  const mutate = async (
    payload: Parameters<typeof mutationFn>[0]
  ): Promise<ReturnType<typeof mutationFn>> => {
    setPending(true);
    try {
      const res = await mutationFn(payload);
      return res;
    } catch (err) {
      throw err;
    } finally {
      setPending(false);
    }
  };

  return { mutate, pending };
};
