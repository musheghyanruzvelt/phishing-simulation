import { User } from "@/services/auth/Auth.types";

export const TOKEN_STORAGE_KEY = "token";
export const USER_STORAGE_KEY = "user_data";

interface ITokenService {
  getToken: () => string | null;
  saveToken: (token: string) => void;
  removeToken: () => void;
  saveUserData: (userData: User) => void;
  getUserData: () => User | null;
  removeUserData: () => void;
}

class TokenService implements ITokenService {
  getToken() {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  }

  saveToken(token: string) {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  }

  removeToken() {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  }

  saveUserData(userData: User) {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
  }

  getUserData(): User | null {
    const userData = localStorage.getItem(USER_STORAGE_KEY);

    if (!userData) {
      return null;
    }

    try {
      return JSON.parse(userData);
    } catch (error) {
      console.error("Error parsing user data:", error);
      return null;
    }
  }

  removeUserData() {
    localStorage.removeItem(USER_STORAGE_KEY);
  }

  logout() {
    this.removeToken();
    this.removeUserData();
  }
}

export const tokenService = new TokenService();
