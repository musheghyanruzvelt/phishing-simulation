import { ROUTES } from "@/router/routes";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { tokenService } from "@/common/tokenService";

export const Header = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!tokenService.getToken();

  const user = tokenService.getUserData();

  const handleLogout = () => {
    tokenService.logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <header className="bg-white py-4 border-b shadow-xs sticky top-0 z-10 backdrop-blur-lg">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between">
          <Link to={ROUTES.ROOT}>
            <div className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <h2 className="text-xl md:text-2xl font-bold text-DEEP_BLUE whitespace-nowrap">
                Phishing Simulation
              </h2>
            </div>
          </Link>

          {!isLoggedIn ? (
            <div className="flex gap-3">
              <Link to={ROUTES.LOGIN}>
                <Button
                  variant="outline"
                  className="hover:bg-gray-50 cursor-pointer"
                >
                  Login
                </Button>
              </Link>
              <Link to={ROUTES.REGISTER}>
                <Button className="shadow-sm cursor-pointer">Sign up</Button>
              </Link>
            </div>
          ) : (
            <div className="flex gap-3 items-center">
              <span className="hidden md:inline text-sm text-gray-600">
                Welcome back! {user?.email}
              </span>
              <Button
                onClick={handleLogout}
                variant="ghost"
                className="hover:bg-red-50 hover:text-red-600 cursor-pointer"
              >
                Logout
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
