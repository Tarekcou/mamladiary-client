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

      console.log(response.data);

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
    <div className="mx-auto">
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
      <div className="flex justify-center items-center pt-16">
        <div
          className="bg-cover bg-no-repeat bg-center opacity-20 w-16 h-16 md:w-24 md:h-24"
          style={{ backgroundImage: `url(${bgimage})` }}
        ></div>
      </div>
    </div>
  );
}
