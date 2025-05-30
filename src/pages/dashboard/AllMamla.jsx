import React, { useState, useMemo, useEffect } from "react";
import axiosPublic from "../../axios/axiosPublic";
import { useQuery } from "@tanstack/react-query";
import MamlaEditForm from "./MamlaEditForm";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import Swal from "sweetalert2";

const AllMamla = () => {
  // const [mamlaList, setMamlaList] = useState([]);

  const {
    data: mamlaList,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["allMamla"], // good for caching different search results
    queryFn: async () => {
      try {
        const response = await axiosPublic.get(`/allMamla`);
        // console.log("Response data:", response.data);
        if (response.status === 200) {
          return response.data;
        }
      } catch (error) {
        console.error("Error fetching mamla data:", error);
      }
    },
  });

  const [search, setSearch] = useState({
    mamlaName: "",
    mamlaNo: "",
    district: "",
    year: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filtered Data
  const filteredData = useMemo(() => {
    return (mamlaList ?? []).filter(
      (item) =>
        item?.mamlaName
          .toLowerCase()
          .includes(search.mamlaName.toLowerCase()) &&
        item?.mamlaNo.toLowerCase().includes(search.mamlaNo.toLowerCase()) &&
        item?.district.toLowerCase().includes(search.district.toLowerCase()) &&
        item?.year.toLowerCase().includes(search.year.toLowerCase())
    );
  }, [mamlaList, search]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSearchChange = (e) => {
    setCurrentPage(1); // reset to first page
    setSearch({ ...search, [e.target.name]: e.target.value });
  };

  const [editedMamla, setEditedMamla] = useState(null);

  const handleEdit = (mamla) => {
    console.log(mamla);
    setEditedMamla(mamla);
  };
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
        axiosPublic.delete(`/mamla/${id}`).then((res) => {
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

  if (isLoading) return <p className="mt-10 text-center">Loading...</p>;

  return (
    <div className="p-4 overflow-x-auto">
      <h2 className="mb-4 font-semibold text-xl">সকল মামলা </h2>

      {/* Search Fields */}
      <div className="gap-2 grid grid-cols-1 md:grid-cols-4 mb-4">
        <input
          type="text"
          name="mamlaName"
          placeholder="মামলার নাম অনুসন্ধান করুন"
          value={search.mamlaName}
          onChange={handleSearchChange}
          className="p-2 border rounded"
        />
        <input
          type="text"
          name="mamlaNo"
          placeholder="মামলার নং অনুসন্ধান করুন"
          value={search.mamlaNo}
          onChange={handleSearchChange}
          className="p-2 border rounded"
        />
        <input
          type="text"
          name="district"
          placeholder="জেলা অনুসন্ধান করুন"
          value={search.district}
          onChange={handleSearchChange}
          className="p-2 border rounded"
        />
        <input
          type="text"
          name="year"
          placeholder="বছর অনুসন্ধান করুন"
          value={search.year}
          onChange={handleSearchChange}
          className="p-2 border rounded"
        />
      </div>

      {/* Table */}
      <div className="max-w-screen overflow-x-auto">
        <table className="table table-pin-cols table-pin-rows">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">ক্রমিক </th>
              <th className="px-4 py-2 border">মামলার নাম</th>
              <th className="px-4 py-2 border">মামলার নং </th>
              <th className="px-4 py-2 border">বছর </th>
              <th className="px-4 py-2 border">জেলা </th>
              <th className="px-4 py-2 border">পূর্ববর্তী তারিখ </th>
              <th className="px-4 py-2 border">পরবর্তী তারিখ </th>
              <th className="px-4 py-2 border">সর্বশেষ অবস্থা </th>
              <th className="px-4 py-2 border">নিষ্পত্তির তারিখ </th>
              <th className="px-4 py-2 border">কার্যক্রম</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((item, idx) => (
                <tr key={idx} className="text-center">
                  <td className="px-4 py-2 border">
                    {(currentPage - 1) * itemsPerPage + idx + 1}
                  </td>
                  <td className="px-4 py-2 border">{item?.mamlaName}</td>
                  <td className="px-4 py-2 border">
                    {item?.mamlaNo.replace(/\D/g, "")}
                  </td>
                  <td className="px-4 py-2 border">
                    {item?.year.replace(/\D/g, "")}
                  </td>
                  <td className="px-4 py-2 border">{item?.district}</td>
                  <td className="px-4 py-2 border">
                    {item?.previousDate || "-"}
                  </td>
                  <td className="px-4 py-2 border">{item?.nextDate || "-"}</td>
                  <td className="px-4 py-2 border">
                    {item?.completedMamla || "-"}
                  </td>
                  <td className="px-4 py-2 border">
                    {item.completionDate || "-"}
                  </td>
                  <td className="px-4 py-2 border">
                    <label
                      htmlFor="my_modal_3"
                      className="btn btn-sm"
                      onClick={() => {
                        handleEdit(item);
                        document.getElementById("my_modal_3").showModal();
                      }}
                    >
                      <FaEdit />
                    </label>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="btn btn-sm"
                    >
                      <MdDeleteForever className="text-xl" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-4 py-4 border text-center" colSpan="10">
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <p>
          Showing {paginatedData.length} of {filteredData.length} records
        </p>
        <div className="flex gap-2">
          <button
            className="bg-gray-200 disabled:opacity-50 px-3 py-1 rounded btn"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          <span className="px-3 py-1">
            {currentPage} / {totalPages}
          </span>
          <button
            className="bg-gray-200 disabled:opacity-50 px-3 py-1 rounded btn"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>

      {/* Dialog */}

      <dialog id="my_modal_3" className="modal">
        <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="top-2 right-2 absolute btn btn-sm btn-circle btn-ghost">
              ✕
            </button>
          </form>
          <MamlaEditForm editedMamla={editedMamla} />
        </div>
      </dialog>
    </div>
  );
};

export default AllMamla;
