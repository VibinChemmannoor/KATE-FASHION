"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";

/**
 * Custom hook for authentication state
 * @returns {Object} Auth state and actions
 */
export function useAuth() {
  const { user, isLoading, isAuthenticated, fetchUser, logout, setUser } =
    useAuthStore();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return {
    user,
    isLoading,
    isAuthenticated,
    logout,
    setUser,
    refreshUser: fetchUser,
  };
}
