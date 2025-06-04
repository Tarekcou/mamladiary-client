import Lottie from "lottie-react";
import loginAnim from "../../assets/lottie/search.json";

const SearchLottie = () => (
  <Lottie
    className="text-white"
    animationData={loginAnim}
    loop="2"
    autoplay
    style={{ height: 60 }}
  />
);
export default SearchLottie;