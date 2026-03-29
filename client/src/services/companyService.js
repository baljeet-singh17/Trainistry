import axios from "axios";

const API_URL = "http://localhost:5000/api/company";

const postProject = async (companyId, projectData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(`${API_URL}/${companyId}/projects`, projectData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};

const getMyProjects = async (companyId) => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${API_URL}/${companyId}/projects`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export default {
  postProject,
  getMyProjects,
};