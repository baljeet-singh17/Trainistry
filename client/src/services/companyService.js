import axios from 'axios';

const API_URL = 'http://localhost:5000/api/company';

const postProject = async (companyId, projectData) => {
    try {
        const response = await axios.post(`${API_URL}/${companyId}/projects`, projectData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error("Network Error");
    }
};

const getMyProjects = async (companyId) => {
    const response = await axios.get(`${API_URL}/${companyId}/projects`);
    return response.data;
};

export default {
    postProject,
    getMyProjects
};