import api from "./api";

const programService = {
  getAll: async () => {
    const res = await api.get("/Program");
    return res.data;
  },

  getById: async (id) => {
    const res = await api.get(`/Program/${id}`);
    return res.data;
  },

  register: async (data) => {
    const res = await api.post("/Program/register", data);
    return res.data;
  },

  getStats: async (id) => {
    const res = await api.get(`/Program/${id}/stats`);
    return res.data;
  },
};

export default programService;
