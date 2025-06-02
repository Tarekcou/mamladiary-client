import Lottie from "lottie-react";
import loginAnim from "../../assets/lottie/question.json";

const QuestionLottie = () => (
  <Lottie
    className=""
    animationData={loginAnim}
    loop
    autoplay
    style={{ height: 200 }}
  />
);
export default QuestionLottie;
