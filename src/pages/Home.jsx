import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "../components/Header";
import SidebarLeft from "../components/SidebarLeft";
import SidebarRight from "../components/SidebarRight";
import CaseSearchForm from "../components/CaseSearchForm";
import Footer from "../components/Footer";
import "../app.css";
import "../i18n";
import CasesList from "../components/CaseList";
import axiosPublic from "../axios/axiosPublic";

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
      return response.data;
    },
    enabled: false, // only run when refetch is called
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    console.log("Form data:", data);
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
      {isShowCaseList && (
        <CasesList
          isLoading={isLoading}
          isError={isError}
          mamla={mamla}
          error={error}
        />
      )}
    </div>
  );
}
