import Lottie from "lottie-react";
import loginAnim from "../../assets/lottie/result.json";

const ResultLottie = () => (
  <div className="w-full  mx-auto flex items-center justify-center">
      <Lottie className="w-16 h-16 md:w-24 md:h-24 " animationData={loginAnim} loop autoplay  />

  </div>
);
export default ResultLottie;
