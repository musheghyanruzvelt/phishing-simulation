import { FC, PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";
import { ROUTES } from "./routes";
import { tokenService } from "@/common/tokenService";

export const PrivateRoute: FC<PropsWithChildren> = ({ children }) => {
  const isLoggedIn = !!tokenService.getToken();

  if (!isLoggedIn) {
    return <Navigate to={ROUTES.LOGIN} />;
  }

  if (isLoggedIn) {
    return children;
  }

  return null;
};
