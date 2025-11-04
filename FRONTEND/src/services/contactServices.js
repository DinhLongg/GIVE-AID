import api from './api';

const contactService = {
  submitQuery: async (queryData) => {
    const res = await api.post('/query', queryData);
    return res.data;
  },
};

export default contactService;

