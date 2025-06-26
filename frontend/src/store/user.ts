import { create } from "zustand";

import { type PublicUser } from "@/types/user";

type UserState = PublicUser & {
  setUser: (user: PublicUser) => void;
  clearUser: () => void;
};

export const useUser = create<UserState>((set) => ({
  id: "",
  name: "",
  email: "",
  avatar_url: "",
  setUser: (user) => set(() => ({ ...user })),
  clearUser: () =>
    set(() => ({
      id: "",
      name: "",
      email: "",
      avatarUrl: "",
    })),
}));
