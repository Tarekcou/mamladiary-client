import React, { useState, useMemo, useEffect } from "react";
import axiosPublic from "../../axios/axiosPublic";
import { useQuery } from "@tanstack/react-query";
import AdcMamlaEditForm from "./AdcMamlaEditForm";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import Swal from "sweetalert2";

const AdcMamla = () => {
  // const [adcMamlaList, setAdcMamlaList] = useState([]);

  const {
    data: adcMamlaList,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["adcMamla"], // good for caching different search results
    queryFn: async () => {
      try {
        const response = await axiosPublic.get(`/adcMamla`);
        // console.log("Response data:", response.data);

        return response.data;
      } catch (error) {
        console.error("Error fetching mamla data:", error);
      }
    },
  });

  const [search, setSearch] = useState({
    adcMamlaName: "",
    mamlaNo: "",
    district: "",
    year: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filtered Data
  const filteredData = useMemo(() => {
    return (adcMamlaList ?? []).filter(
      (item) =>
        item?.adcMamlaName
          ?.toLowerCase()
          .includes(search?.adcMamlaName.toLowerCase()) &&
        item?.mamlaNo.toLowerCase().includes(search?.mamlaNo.toLowerCase()) &&
        item?.district.toLowerCase().includes(search?.district.toLowerCase()) &&
        item?.year.toLowerCase().includes(search?.year.toLowerCase())
    );
  }, [adcMamlaList, search]);

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
    // console.log(mamla);
    refetch();
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
        axiosPublic.delete(`/adcMamla/${id}`).then((res) => {
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
    <div className="p-4">
      <h2 className="mb-4 font-semibold text-xl text-center">
        এডিসি মামলার রেকর্ড
      </h2>

      {/* Search Fields */}
      <div className="gap-2 grid grid-cols-1 md:grid-cols-4 mb-4">
        <input
          type="text"
          name="adcMamlaName"
          placeholder="Search Mamla Name"
          value={search.adcMamlaName}
          onChange={handleSearchChange}
          className="p-2 border rounded"
        />
        <input
          type="text"
          name="mamlaNo"
          placeholder="Search Mamla No"
          value={search.mamlaNo}
          onChange={handleSearchChange}
          className="p-2 border rounded"
        />
        <input
          type="text"
          name="district"
          placeholder="Search District"
          value={search.district}
          onChange={handleSearchChange}
          className="p-2 border rounded"
        />
        <input
          type="text"
          name="year"
          placeholder="Search Year"
          value={search.year}
          onChange={handleSearchChange}
          className="p-2 border rounded"
        />
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto">
        <table className="bg-white border min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">#</th>
              <th className="px-4 py-2 border">Mamla Name</th>
              <th className="px-4 py-2 border">Mamla No</th>
              <th className="px-4 py-2 border">Year</th>
              <th className="px-4 py-2 border">District</th>

              <th className="px-4 py-2 border">#</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((item, idx) => (
                <tr key={idx} className="text-center">
                  <td className="px-4 py-2 border">
                    {(currentPage - 1) * itemsPerPage + idx + 1}
                  </td>
                  <td className="px-4 py-2 border">{item.adcMamlaName}</td>
                  <td className="px-4 py-2 border">
                    {item.mamlaNo.replace(/\D/g, "")}
                  </td>
                  <td className="px-4 py-2 border">
                    {item.year.replace(/\D/g, "")}
                  </td>
                  <td className="px-4 py-2 border">{item.district}</td>

                  <td className="px-4 py-2 border">
                    <label
                      htmlFor="my_modal_3"
                      className="btn"
                      onClick={() => {
                        handleEdit(item);
                        document.getElementById("my_modal_3").showModal();
                      }}
                    >
                      <FaEdit />
                    </label>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="btn"
                    >
                      <MdDeleteForever />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-4 py-4 border text-center" colSpan="8">
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

      <dialog id="my_modal_3" className="modal">
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="top-2 right-2 absolute btn btn-sm btn-circle btn-ghost">
              ✕
            </button>
          </form>
          <AdcMamlaEditForm editedMamla={editedMamla} />
        </div>
      </dialog>
    </div>
  );
};

export default AdcMamla;
