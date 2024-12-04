import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      const refreshToken = localStorage.getItem("refresh_token");
      if (refreshToken) {
        try {
          const { data } = await axios.post("http://127.0.0.1:8000/api/token/refresh/", {
            refresh: refreshToken,
          });

          localStorage.setItem("access_token", data.access);

          error.config.headers.Authorization = `Bearer ${data.access}`;
          return apiClient(error.config);
        } catch (refreshError) {
          console.error("Failed to refresh token:", refreshError);

          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          window.location.href = "/login";
        }
      } else {
        console.error("No refresh token available.");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export const fetchTasks = () => apiClient.get("tasks/").then((res) => res.data);
export const createTask = (task) => apiClient.post("tasks/", task);
export const updateTask = (id, fieldsToUpdate) => apiClient.patch(`tasks/${id}/`, fieldsToUpdate);
export const deleteTask = (id) => apiClient.delete(`tasks/${id}/`);
