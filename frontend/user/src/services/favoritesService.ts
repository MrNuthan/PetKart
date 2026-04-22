import api from '../lib/api';

export const favoritesService = {
  getFavorites: async () => {
    const response = await api.get('/favorites/');
    return response.data;
  },

  addFavorite: async (productId: string) => {
    const response = await api.post('/favorites/', { product_id: productId });
    return response.data;
  },

  removeFavorite: async (productId: string) => {
    await api.delete(`/favorites/${productId}/`);
  },
};
