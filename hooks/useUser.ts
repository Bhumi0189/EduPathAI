import { useContext } from "react";
import { AuthContext } from "@/lib/auth-context";

export function useUser() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return { user: null, loading: true };
  }

  if (!user) {
    return { user: null, loading: false };
  }

  return { user, loading: false };
}
