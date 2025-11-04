import api from "./api";

const ngoService = {
  getAll: async (includePrograms = false) => {
    const res = await api.get(`/ngo?includePrograms=${includePrograms}`);
    return res.data;
  },

  getById: async (id, includePrograms = false) => {
    const res = await api.get(`/ngo/${id}?includePrograms=${includePrograms}`);
    return res.data;
  },
};

export default ngoService;

