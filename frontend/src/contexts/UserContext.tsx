import type { User } from "@/types/User";
import { createContext, useContext } from "react";

export const UserContext = createContext<{
  user: User | null;
  refetchUser: () => void;
}>({
  user: null,
  refetchUser: () => {},
});

export const useUser = () => useContext(UserContext);
