import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5513",
  headers: {
    "Content-Type": "application/json",
  },
});

const login = async (data: { email: string; password: string }) => {
  try {
    const response = await api.post("/api/users/login", data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const customMessage = error.response.data.message || "An error occurred";
      throw new Error(customMessage);
    }
    throw new Error("An unknown error occurred");
  }
};

export { login };
