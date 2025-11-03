import api from "./api";

const galleryService = {
  // Lấy danh sách tất cả gallery
  getAll: async () => {
    const res = await api.get("/Gallery");
    return res.data;
  },

  // Lấy chi tiết một gallery theo ID
  getById: async (id) => {
    const res = await api.get(`/Gallery/${id}`);
    return res.data;
  },

  // Thêm mới một gallery (nếu có form upload hoặc thêm ảnh)
  create: async (data) => {
    const res = await api.post("/Gallery", data);
    return res.data;
  },

  // Cập nhật gallery
  update: async (id, data) => {
    const res = await api.put(`/Gallery/${id}`, data);
    return res.data;
  },

  // 🔹 Xóa một gallery
  delete: async (id) => {
    const res = await api.delete(`/Gallery/${id}`);
    return res.data;
  },
};

export default galleryService;
