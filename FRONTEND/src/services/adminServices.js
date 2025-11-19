import api from './api';

// ===== USERS =====
export const getAllUsers = async () => {
  try {
    const response = await api.get('/admin/users');
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Failed to fetch users' };
  }
};

export const getUser = async (id) => {
  try {
    const response = await api.get(`/admin/users/${id}`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Failed to fetch user' };
  }
};

export const updateUserRole = async (id, role) => {
  try {
    const response = await api.put(`/admin/users/${id}/role`, { role });
    return { success: true, message: response.data?.message || 'Role updated successfully' };
  } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Failed to update user role' };
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await api.delete(`/admin/users/${id}`);
    return { success: true, message: response.data?.message || 'User deleted successfully' };
  } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Failed to delete user' };
  }
};

// ===== QUERIES =====
export const getAllQueries = async () => {
  try {
    const response = await api.get('/admin/queries');
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Failed to fetch queries' };
  }
};

export const replyQuery = async (id, reply) => {
  try {
    const response = await api.post(`/admin/queries/${id}/reply`, { reply });
    return { success: true, message: response.data?.message || 'Reply sent successfully' };
  } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Failed to reply to query' };
  }
};

// ===== DONATIONS =====
export const getAdminDonations = async ({
  page = 1,
  pageSize = 10,
  search = '',
  status = 'all',
} = {}) => {
  try {
    const response = await api.get('/admin/donations', {
      params: { page, pageSize, search, status },
    });
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch donations',
    };
  }
};

export const getDonation = async (id) => {
  try {
    const response = await api.get(`/admin/donations/${id}`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Failed to fetch donation' };
  }
};

// ===== PROGRAMS =====
export const getAllPrograms = async () => {
  try {
    const response = await api.get('/program');
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Failed to fetch programs' };
  }
};

export const getProgram = async (id) => {
  try {
    const response = await api.get(`/program/${id}`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Failed to fetch program' };
  }
};

export const createProgram = async (programData) => {
  try {
    const response = await api.post('/program', programData);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Failed to create program' };
  }
};

export const updateProgram = async (id, programData) => {
  try {
    await api.put(`/program/${id}`, programData);
    return { success: true, message: 'Program updated successfully' };
  } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Failed to update program' };
  }
};

export const deleteProgram = async (id) => {
  try {
    await api.delete(`/program/${id}`);
    return { success: true, message: 'Program deleted successfully' };
  } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Failed to delete program' };
  }
};

// ===== NGOs =====
export const getAllNGOs = async () => {
  try {
    const response = await api.get('/ngo');
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Failed to fetch NGOs' };
  }
};

export const getAdminNGOs = async ({ page = 1, pageSize = 10, search = '' } = {}) => {
  try {
    const response = await api.get('/ngo/admin', {
      params: { page, pageSize, search },
    });
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch NGOs',
    };
  }
};

export const getNGO = async (id) => {
  try {
    const response = await api.get(`/ngo/${id}`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Failed to fetch NGO' };
  }
};

export const createNGO = async (ngoData) => {
  try {
    const response = await api.post('/ngo', ngoData);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Failed to create NGO' };
  }
};

export const updateNGO = async (id, ngoData) => {
  try {
    await api.put(`/ngo/${id}`, ngoData);
    return { success: true, message: 'NGO updated successfully' };
  } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Failed to update NGO' };
  }
};

export const deleteNGO = async (id) => {
  try {
    const response = await api.delete(`/ngo/${id}`);
    return { success: true, message: response.data?.message || 'NGO deleted successfully' };
  } catch (error) {
    return { 
      success: false, 
      message: error.response?.data?.message || 'Failed to delete NGO. This NGO may have associated programs.' 
    };
  }
};

// ===== GALLERY =====
export const getAllGallery = async () => {
  try {
    const response = await api.get('/gallery');
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Failed to fetch gallery' };
  }
};

export const getAdminGallery = async ({ page = 1, pageSize = 12, search = '' } = {}) => {
  try {
    const response = await api.get('/gallery/admin', {
      params: { page, pageSize, search },
    });
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch gallery items',
    };
  }
};

export const createGallery = async (galleryData) => {
  try {
    // If galleryData is FormData (file upload), remove Content-Type header
    // to let browser automatically set it with boundary
    // Otherwise, use default JSON (URL input)
    const config = galleryData instanceof FormData
      ? {
          headers: {
            'Content-Type': undefined, // Let browser set multipart/form-data with boundary
          },
        }
      : {};
    
    const response = await api.post('/gallery', galleryData, config);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Failed to create gallery item' };
  }
};

export const deleteGallery = async (id) => {
  try {
    await api.delete(`/gallery/${id}`);
    return { success: true, message: 'Gallery item deleted successfully' };
  } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Failed to delete gallery item' };
  }
};

// ===== PARTNERS =====
export const getAllPartners = async () => {
  try {
    const response = await api.get('/partner');
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Failed to fetch partners' };
  }
};

export const getAdminPartners = async ({ page = 1, pageSize = 12, search = '' } = {}) => {
  try {
    const response = await api.get('/partner/admin', {
      params: { page, pageSize, search },
    });
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch partners',
    };
  }
};

export const createPartner = async (partnerData) => {
  try {
    const response = await api.post('/partner', partnerData);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Failed to create partner' };
  }
};

export const updatePartner = async (id, partnerData) => {
  try {
    await api.put(`/partner/${id}`, partnerData);
    return { success: true, message: 'Partner updated successfully' };
  } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Failed to update partner' };
  }
};

export const deletePartner = async (id) => {
  try {
    await api.delete(`/partner/${id}`);
    return { success: true, message: 'Partner deleted successfully' };
  } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Failed to delete partner' };
  }
};

// ===== ABOUT SECTIONS =====
export const getAboutSection = async (key) => {
  try {
    const response = await api.get(`/about/${key}`);
    // Backend returns null if section doesn't exist (200 OK, not 404)
    return { success: true, data: response.data || null };
  } catch (error) {
    // If 404, treat as no content (section doesn't exist yet)
    if (error.response?.status === 404) {
      return { success: true, data: null };
    }
    return { success: false, message: error.response?.data?.message || 'Failed to fetch about section' };
  }
};

export const createAboutSection = async (sectionData) => {
  try {
    const response = await api.post('/about', sectionData);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Failed to create about section' };
  }
};

export const updateAboutSection = async (id, sectionData) => {
  try {
    await api.put(`/about/${id}`, sectionData);
    return { success: true, message: 'About section updated successfully' };
  } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Failed to update about section' };
  }
};

