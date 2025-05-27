import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "../components/common/Header";
import SidebarLeft from "../components/sidebar/SidebarLeft";
import SidebarRight from "../components/sidebar/SidebarRight";
import CaseSearchForm from "../components/CaseSearchForm";
import Footer from "../components/common/Footer";
import "../i18n";
import CasesList from "../components/CaseList";
import axiosPublic from "../axios/axiosPublic";
import { toast } from "sonner";
import bgimage from "../assets/bg-image.jpg";
import { motion } from "framer-motion"; // For animation

export default function Home() {
  const [searchParams, setSearchParams] = useState(null);
  const [isShowCaseList, setShowCaseList] = useState(false);

  const {
    data: mamla,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["mamla", searchParams], // good for caching different search results
    queryFn: async () => {

      const response = await axiosPublic.get(`/mamlas`, {
        params: searchParams,
      });

      console.log(response.data)
     

      return response.data;
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
                toast.success("অনুসন্ধান হচ্ছে ");

    setSearchParams(data); // triggers queryKey change (optional but useful)
    setShowCaseList(true); // show the case list
    await refetch(); // trigger the fetch manually
  };
  useEffect(() => {
    if (searchParams) {
      refetch();
    }
  }, [searchParams, refetch]);

  return (
     <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className=" mx-auto relative   bg-white "
    >
    <div className=" mx-auto h-full ">
      <CaseSearchForm handleSubmit={handleSubmit} />
      {/* Background Image section (always visible) */}

      {isShowCaseList && (
        <CasesList
          isLoading={isLoading}
          isError={isError}
          mamla={mamla}
          error={error}
        />
      )}
      <div className="flex justify-center items-center  mt-24 ">
        <div
          className="bottom-0  bg-cover  bg-no-repeat bg-center opacity-20 w-[100px] h-[100px]"
          style={{ backgroundImage: `url(${bgimage})` }}
        ></div>
      </div>
    </div>
    </motion.div>
  );
}
