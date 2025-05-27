import React, { useEffect, useState } from "react";
import axios from "axios";
import axiosPublic from "../../axios/axiosPublic";
import Swal from "sweetalert2";
import { useQuery } from "@tanstack/react-query";
import { MdDelete } from "react-icons/md";

const FeedbackDetails = () => {
  const [expanded, setExpanded] = useState({});
  const {
    data: feedbacks = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["feedbacks"], // good for caching different search results
    queryFn: async () => {
      try {
        const response = await axiosPublic.get(`/feedbacks`);
        console.log("Response data:", response.data);

        return response.data;
      } catch (error) {
        console.error("Error fetching feedbacks data:", error);
      }
    },
  });

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosPublic.delete(`/feedbacks/${id}`).then((res) => {
          // console.log(res);
          if (res.data.deletedCount > 0) {
            Swal.fire({
              title: "Deleted!",
              text: "Your file has been deleted.",
              icon: "success",
            });
            refetch();
          }
        });
      }
    });
  };

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };
  if (isLoading) return <p className="mt-10 text-center">Loading...</p>;

  return (
    <div className="p-4">
      <h2 className="mb-4 font-bold text-xl">সকল মতামত </h2>
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>ক্রমিক </th>
              <th>নাম </th>
              <th>ফোন </th>
              <th>ঠিকানা </th>

              <th>বিস্তারিত </th>
            </tr>
          </thead>
          <tbody>
            {feedbacks.map((c, i) => (
              <tr key={c._id}>
                <th>{i + 1}</th>
                <td>{c.name}</td>
                <td>{c.phone}</td>
                <td>{c.location}</td>

                <td>
                  <div>
                    {expanded[c._id]
                      ? c.description
                      : c.description.slice(0, 60) +
                        (c.description.length > 60 ? "..." : "")}
                    {c.description.length > 60 && (
                      <button
                        onClick={() => toggleExpand(c._id)}
                        className="ml-2 btn btn-link btn-xs"
                      >
                        {expanded[c._id] ? "Show Less" : "Read More"}
                      </button>
                    )}
                  </div>
                </td>
                <td onClick={() => handleDelete(c._id)}>
                  <MdDelete className="text-red-500 text-2xl cursor-pointer" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FeedbackDetails;
