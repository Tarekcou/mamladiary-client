import React from "react";
import logo from "../../assets/bg-image.jpg";
import govt from "../../assets/govt.png";
import { useTranslation } from "react-i18next";
import { MdEmail } from "react-icons/md";
import { WeightIcon } from "lucide-react";
import supreme from "../../assets/sup.jpg"; // Assuming you have a supreme.png in assets
const Footer = () => {
  const { t, i18n } = useTranslation();

  return (
    <footer className="flex justify-around items-center place-items-center bg-gray-200 shadow-xl mx-auto p-4 w-full text-neutral-content">
      <div className="flex flex-col gap-1">
        <h1 className="font-bold text-blue-900 text-md">গুরুত্বপূর্ণ লিংক </h1>
        <a
          href="https://www.chittagongdiv.gov.bd/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex justify-center items-center gap-2"
        >
          <img
            className="fill-current w-5 h-5 cursor-pointer"
            src={govt}
            alt="govt logo"
          />
          <h1 className="text-blue-900 text-xs md:text-sm hover:underline transition cursor-pointer">
            বিভাগীয় কমিশনারের কার্যালয়, চট্টগ্রাম{" "}
          </h1>
        </a>
        <a
          href="https://mopa.gov.bd/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex justify-start items-center gap-2 cursor-pointer"
        >
          <img
            className="fill-current w-5 h-5 cursor-pointer"
            src={govt}
            alt="govt logo"
          />{" "}
          <h1 className="text-blue-900 text-xs md:text-sm hover:underline transition cursor-pointer">
            জনপ্রশাসন মন্ত্রণালয়{" "}
          </h1>
        </a>
        <a
          href="https://www.supremecourt.gov.bd/web/indexn.php"
          target="_blank"
          rel="noopener noreferrer"
          className="flex justify-start items-center gap-2"
        >
          <img src={supreme} alt="supreme" className="rounded-full w-5 h-5" />
          <h1 className="text-blue-900 text-xs md:text-sm hover:underline transition cursor-pointer">
            সুপ্রিম কোর্ট{" "}
          </h1>
        </a>
      </div>

      <nav className="flex flex-col gap-1">
        <h1 className="font-bold  text-blue-900 text-md">
          সামাজিক যোগাযোগ{" "}
        </h1>

        <a
          href="https://www.youtube.com/channel/UCCUTHosMCb0Z2lsQMcsjMsQ"
          target="_blank"
          rel="noopener noreferrer"
          className="flex justify-start items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            className="fill-current w-5 h-5 text-red-600 cursor-pointer"
          >
            <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
          </svg>
          <h1 className="text-blue-900 text-xs md:text-sm hover:underline transition cursor-pointer">
            ইউটিউব{" "}
          </h1>
        </a>
        <a
          href="https://www.facebook.com/pages/Divisional%20commissioner%20office%20Chittagong/193268770882286/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex justify-start items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="fill-current w-5 h-5 text-blue-700 cursor-pointer"
          >
            <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
          </svg>
          <h1 className="text-blue-900 text-xs md:text-sm hover:underline transition cursor-pointer">
            ফেসবুক{" "}
          </h1>
        </a>

        <a
          href="mailto:divcomchittagong@mopa.gov.bd"
          target="_blank"
          rel="noopener noreferrer"
          className="flex justify-start items-center gap-2"
        >
          <MdEmail className="text-blue-400 text-xl" />
          <h1 className="text-blue-900 text-xs md:text-sm hover:underline transition cursor-pointer">
            ইমেইল
          </h1>
        </a>
      </nav>

      <aside className="flex items-center text-blue-900">
        <div className="flex flex-col justify-center items-center gap-3">
          <img
            className="rounded-full w-6 md:w-10 h-6 md:h-10"
            src={logo}
            alt="logo"
          />
          <div className="text-center">
            <h1 className="font-bold text-md">{t("planning")}</h1>
            <h1 className="text-xs md:text-sm">{t("post")}</h1>
            <h1 className="text-xs md:text-sm">{t("office")}</h1>
          </div>
        </div>
      </aside>
    </footer>
  );
};

export default Footer;
