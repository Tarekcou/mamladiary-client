import Lottie from "lottie-react";
import loginAnim from "../../assets/lottie/login.json";

const LoginLottie = () => (
  <Lottie className="w-64 md:w-80" animationData={loginAnim} loop autoplay />
);
export default LoginLottie;
