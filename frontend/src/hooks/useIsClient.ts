import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/**
 * React 18/19 safe hydration hook.
 * Replaces `const [isMounted, setIsMounted] = useState(false); useEffect(() => setIsMounted(true), []);`
 * 
 * Returns `false` on the server and during the initial hydration render, 
 * then synchronously becomes `true` immediately after hydration.
 */
export function useIsClient() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}
