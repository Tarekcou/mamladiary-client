import Lottie from "lottie-react";
import loginAnim from "../../assets/lottie/search.json";

const SearchLottie = () => (
  <div className="-m-2 p-0">
    <Lottie
      className="m-0 p-0 h-16 md:h-20 text-white"
      animationData={loginAnim}
      loop
      autoplay
    />
  </div>
);
export default SearchLottie;
