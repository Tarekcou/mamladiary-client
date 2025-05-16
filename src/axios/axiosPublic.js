import axios from "axios";

const axiosPublic = axios.create({
  baseURL: "http://localhost:5500", // Your backend URL
});

export default axiosPublic;
