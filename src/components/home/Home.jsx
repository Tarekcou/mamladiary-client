import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import "../../i18n";
import axiosPublic from "../../axios/axiosPublic";
import { toast } from "sonner";
import bgimage from "../../assets/bg-image.jpg";
import CaseSearchForm from "./CaseSearchForm";
import Questions from "./Questions";
import QuestionLottie from "../lottie/QuestionLotties";
import CasesList from "./CaseList";
import MamlaStats from "./MamlaStats";
import ListLottie from "../lottie/ListLottie";
import Opinion from "./Opinion";
import Contact from "./Contact";
import ContactLottie from "../lottie/ContactLottie";
import ComplainOrOpinion from "./ComplainOrOpinion";
import ScaleLottie from "../lottie/ScaleLottie";
import Calendar from "./Calendar";
import Rules from "./Rules";

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

      {/* Mamla Stats */}

      <div>
        <MamlaStats />
      </div>


      {/* Calendar */}

      <div>
        <Calendar />
      </div>
      {/* RUles */}
      <div>
        <Rules />
      </div>
      {/* As usual quesiotn */}

      <div className="flex md:flex-row flex-col justify-between items-center mt-10 p-4">
        <div className="px-16">
          <QuestionLottie />
        </div>
        <div className="flex-1">
          <h2 className="mb-4 font-bold text-blue-900 text-xl md:text-3xl">
            সচরাচর জিজ্ঞাসা (FAQ)
          </h2>
          <Questions />
        </div>
      </div>

      {/* Opinion */}
      <div>
        <ComplainOrOpinion />
      </div>
      {/* contact */}
      <div>
        <div className="flex justify-center items-center">
          <ContactLottie />
          <h2 className="my-8 font-bold text-blue-900 text-xl md:text-3xl text-center">
            আমাদের সাথে যোগাযোগ করুন
          </h2>
        </div>

        <div className="flex flex-col justify-center items-center">
          <Contact />
        </div>
      </div>
      {/* bottom logo */}
      <div className="flex justify-center items-center pt-16">
        <ScaleLottie />
        {/* <div
          className="bg-cover bg-no-repeat bg-center opacity-20 w-16 md:w-24 h-16 md:h-24"
          style={{ backgroundImage: `url(${bgimage})` }}
        ></div> */}
      </div>
    </div>
  );
}
