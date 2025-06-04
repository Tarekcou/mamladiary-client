
import Lottie from "lottie-react";
import loginAnim from "../../assets/lottie/calendar.json";

const CalendarLottie = () => (
  <Lottie
    className="-mx-12"
    animationData={loginAnim}
    style={{ height: 100 }}
    loop={false} // 👉 disables looping
  />
);

export default CalendarLottie;
