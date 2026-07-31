import api from './api';
import { Service } from '../types/models';

export const getFeaturedServices = async (): Promise<Service[]> => {
  const response = await api.get('/services', {
    params: { featured: true, limit: 10 }
  });
  
  return response.data.services || response.data.data || response.data || [];
};

export const searchServices = async (params: {
  query?: string;
  category?: string;
  lga?: string;
  pricingType?: string;
  sortBy?: string;
  page?: number;
  limit?: number;
}) => {
  const response = await api.get('/services', { params });
  
  return {
    data: response.data.services || [],
    total: response.data.total || 0,
    page: response.data.page || 1,
    pages: response.data.pages || 1,
  };
};

export const getServiceById = async (id: string): Promise<Service> => {
  const response = await api.get(`/services/${id}`);
  return response.data.service || response.data;
};