import Lottie from "lottie-react";
import loginAnim from "../../assets/lottie/login.json";

const LoginLottie = () => (
  <Lottie animationData={loginAnim} loop autoplay style={{ height: 200 }} />
);
export default LoginLottie;
