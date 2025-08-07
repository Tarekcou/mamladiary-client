import axios from "axios";

const axiosPublic = axios.create({
  // baseURL: "http://localhost:5500/api", // Your backend URL
  baseURL: "https://mamladiary-server.vercel.app/", // Your backend URL
});

export default axiosPublic;
