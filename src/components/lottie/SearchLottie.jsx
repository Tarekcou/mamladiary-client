import Lottie from "lottie-react";
import loginAnim from "../../assets/lottie/search.json";

const SearchLottie = () => (
  <div className="w-full h-36 md:h-40 p-0 m-0"> 
<Lottie
    className="text-white     -my-5 h-36  md:h-44"
    animationData={loginAnim}
    loop={5}
    autoplay
  />
  </div>
  
);
export default SearchLottie;