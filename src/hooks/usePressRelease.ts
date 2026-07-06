import { useCallback } from "react";

export function usePressRelease(onRelease: () => void) {
  return useCallback(() => {
    onRelease();
  }, [onRelease]);
}
