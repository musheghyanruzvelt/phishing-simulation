import { tokenService } from "@/common/tokenService";
import AccessDenied from "@/components/accessDenied/AccessDenied";
import { UserRole } from "@phishing-simulation/types";
import { FC, PropsWithChildren } from "react";

export const AdminGuard: FC<PropsWithChildren> = ({ children }) => {
  const user = tokenService.getUserData();
  const isAdmin = user && user.role === UserRole.ADMIN;

  if (isAdmin) {
    return children;
  }

  return <AccessDenied />;
};
