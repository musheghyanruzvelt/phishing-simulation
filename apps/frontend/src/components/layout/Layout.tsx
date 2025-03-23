import { Outlet } from "react-router-dom";
import { Header } from "../header";
import { FC, PropsWithChildren } from "react";

export const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="container mx-auto px-4 max-w-7xl">
        <main className="flex-grow">{children || <Outlet />}</main>
      </div>
    </div>
  );
};
