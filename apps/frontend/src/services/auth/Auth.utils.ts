import { tokenService } from "@/common/tokenService";
import { LoginResponse } from "./Auth.types";

export const setAuthData = (data: LoginResponse) => {
  if (data?.access_token) {
    tokenService.saveToken(data.access_token);
  }

  if (data?.user) {
    tokenService.saveUserData(data.user);
  }
};
