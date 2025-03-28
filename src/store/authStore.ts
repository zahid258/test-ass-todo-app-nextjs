import { IUserResponse } from "@/models";
import { create } from "zustand";

interface AuthState {
  token: string | null;
  role: "Admin" | "User" | null;
  user?: IUserResponse | null;
  setAuth: (
    token: string,
    role: "Admin" | "User",
    user?: IUserResponse | null
  ) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  role: null,
  user:null,
  setAuth: (token, role,user) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    localStorage.setItem("user", JSON.stringify(user));
    
    set({ token, role,user });
  },
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    set({ token: null, role: null ,user:null});
  },
}));
