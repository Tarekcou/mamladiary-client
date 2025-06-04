import Lottie from "lottie-react";
import loginAnim from "../../assets/lottie/result.json";

const ResultLottie = () => (
  <div className="w-full  mx-auto flex items-center justify-center">
      <Lottie className="w-10 h-10  " animationData={loginAnim} loop={false}  speed={2}  />

  </div>
);
export default ResultLottie;
