import { create } from "zustand";

import { type Mails } from "@/types/mails";

type MailState = {
  mails: Mails;
  setMails: (mails: Mails) => void;
  clearMails: () => void;
};

export const useMails = create<MailState>((set) => ({
  mails: [],
  setMails: (mails) => set({ mails }),
  clearMails: () => set({ mails: [] }),
}));