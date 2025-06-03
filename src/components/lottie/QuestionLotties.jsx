import Lottie from "lottie-react";
import loginAnim from "../../assets/lottie/question.json";

const QuestionLottie = () => (
  <Lottie
    className="w-24 h-24 md:w-56 md:h-56"
    animationData={loginAnim}
    loop
    autoplay
  />
);
export default QuestionLottie;
