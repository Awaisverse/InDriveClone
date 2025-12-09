import { useCallback } from 'react';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';
import { LoginCredentials, RegisterData, AuthResponse } from '../types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useAuth = () => {
  const { login: loginStore, logout: logoutStore, user, isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials): Promise<AuthResponse> => {
      const response = await api.post<AuthResponse>('/auth/login', credentials);
      return response.data;
    },
    onSuccess: (data) => {
      loginStore(data.user, data.token);
      queryClient.setQueryData(['user'], data.user);
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterData): Promise<AuthResponse> => {
      const response = await api.post<AuthResponse>('/auth/register', data);
      return response.data;
    },
    onSuccess: (data) => {
      loginStore(data.user, data.token);
      queryClient.setQueryData(['user'], data.user);
    },
  });

  const login = useCallback(
    (credentials: LoginCredentials) => {
      return loginMutation.mutateAsync(credentials);
    },
    [loginMutation]
  );

  const register = useCallback(
    (data: RegisterData) => {
      return registerMutation.mutateAsync(data);
    },
    [registerMutation]
  );

  const logout = useCallback(() => {
    logoutStore();
    queryClient.clear();
  }, [logoutStore, queryClient]);

  return {
    login,
    register,
    logout,
    user,
    isAuthenticated,
    isLoading: loginMutation.isPending || registerMutation.isPending,
    error: loginMutation.error || registerMutation.error,
  };
};




