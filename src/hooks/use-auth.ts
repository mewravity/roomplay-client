import { useEffect } from 'react';
import { useAuthStore } from '../stores/auth-store';

export function useAuth() {
  const store = useAuthStore();

  useEffect(() => {
    if (store.token && !store.user && !store.isLoading) {
      store.loadUser();
    }
  }, [store]);

  return {
    user: store.user,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    login: store.login,
    register: store.register,
    logout: store.logout,
    updateProfile: store.updateProfile
  };
}
