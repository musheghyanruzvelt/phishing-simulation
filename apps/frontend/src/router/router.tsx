import { createBrowserRouter } from "react-router-dom";
import { ROUTES } from "./routes";
import { PrivateRoute } from "./PrivateRoute";
import { LoginPage, Root, RegisterPage } from "@/pages";
import { Layout } from "@/components/layout";
import { AdminGuard } from "@/guard";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: ROUTES.ROOT,
        element: (
          <PrivateRoute>
            <AdminGuard>
              <Root />
            </AdminGuard>
          </PrivateRoute>
        ),
      },
      {
        path: ROUTES.LOGIN,
        element: <LoginPage />,
      },
      {
        path: ROUTES.REGISTER,
        element: <RegisterPage />,
      },
    ],
  },
]);
