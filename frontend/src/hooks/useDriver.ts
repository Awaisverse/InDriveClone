import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { Driver, DriverStats, RideRequest, ActiveRide } from '../types/driver';

export const useDriver = () => {
  const queryClient = useQueryClient();

  // Get driver profile
  const { data: driver, isLoading: isLoadingDriver } = useQuery<Driver>({
    queryKey: ['driver'],
    queryFn: async () => {
      const response = await api.get('/driver/profile');
      return response.data;
    },
  });

  // Get driver stats
  const { data: stats, isLoading: isLoadingStats } = useQuery<DriverStats>({
    queryKey: ['driver', 'stats'],
    queryFn: async () => {
      const response = await api.get('/driver/stats');
      return response.data;
    },
  });

  // Get ride requests
  const { data: rideRequests, refetch: refetchRequests } = useQuery<RideRequest[]>({
    queryKey: ['driver', 'requests'],
    queryFn: async () => {
      const response = await api.get('/driver/requests');
      return response.data;
    },
    refetchInterval: 5000, // Poll every 5 seconds
  });

  // Get active ride
  const { data: activeRide, refetch: refetchActiveRide } = useQuery<ActiveRide | null>({
    queryKey: ['driver', 'active-ride'],
    queryFn: async () => {
      const response = await api.get('/driver/active-ride');
      return response.data;
    },
    refetchInterval: 3000, // Poll every 3 seconds
  });

  // Toggle online status
  const toggleOnlineMutation = useMutation({
    mutationFn: async (isOnline: boolean) => {
      const response = await api.post('/driver/toggle-online', { isOnline });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['driver'] });
    },
  });

  // Accept ride request
  const acceptRideMutation = useMutation({
    mutationFn: async (requestId: string) => {
      const response = await api.post(`/driver/requests/${requestId}/accept`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['driver', 'requests'] });
      queryClient.invalidateQueries({ queryKey: ['driver', 'active-ride'] });
    },
  });

  // Decline ride request
  const declineRideMutation = useMutation({
    mutationFn: async (requestId: string) => {
      const response = await api.post(`/driver/requests/${requestId}/decline`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['driver', 'requests'] });
    },
  });

  // Update ride status
  const updateRideStatusMutation = useMutation({
    mutationFn: async ({ rideId, status }: { rideId: string; status: string }) => {
      const response = await api.post(`/driver/rides/${rideId}/status`, { status });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['driver', 'active-ride'] });
      queryClient.invalidateQueries({ queryKey: ['driver', 'stats'] });
    },
  });

  return {
    driver,
    stats,
    rideRequests,
    activeRide,
    isLoadingDriver,
    isLoadingStats,
    toggleOnline: toggleOnlineMutation.mutate,
    acceptRide: acceptRideMutation.mutate,
    declineRide: declineRideMutation.mutate,
    updateRideStatus: updateRideStatusMutation.mutate,
    refetchRequests,
    refetchActiveRide,
  };
};




