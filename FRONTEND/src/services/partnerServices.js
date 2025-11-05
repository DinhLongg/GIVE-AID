import api from "./api";

const partnerService = {
  getAll: async () => {
    const res = await api.get("/partner");
    return res.data;
  },
};

export default partnerService;

