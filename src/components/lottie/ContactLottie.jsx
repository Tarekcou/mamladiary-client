import Lottie from "lottie-react";
import loginAnim from "../../assets/lottie/contact.json";

const ContactLottie = () => (
  <Lottie className="w-20 h-20 md:w-36 md:h-36 " animationData={loginAnim} loop autoplay style={{ height: 120 }} />
);
export default ContactLottie;
