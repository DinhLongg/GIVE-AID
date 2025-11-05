import api from "./api";

const donationService = {
  create: async (data) => {
    const res = await api.post("/donation", data);
    return res.data;
  },
  getAll: async () => {
    const res = await api.get("/donation");
    return res.data;
  },
  getMyDonations: async () => {
    const res = await api.get("/donation/my-donations");
    return res.data;
  },
};

export default donationService;
