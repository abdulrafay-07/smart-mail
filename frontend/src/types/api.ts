import type { Mails } from "./mails";
import type { PublicUser } from "./user";

export interface ApiResponse {
  success: boolean;
  message: string;
  data: {
    user?: PublicUser;
    mails?: Mails;
  };
}
