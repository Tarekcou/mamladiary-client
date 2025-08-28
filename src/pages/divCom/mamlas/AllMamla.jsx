import React, { useState, useMemo, useEffect, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import MamlaEditForm from "./MamlaEditForm";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever, MdMessage } from "react-icons/md";
import Swal from "sweetalert2";
import axiosPublic from "../../../axios/axiosPublic";
import { useLocation } from "react-router";
import ListLottie from "../../../components/lottie/ListLottie";
import { AuthContext } from "../../../provider/AuthProvider";

const AllMamla = () => {
  const state = useLocation();
  const { user } = useContext(AuthContext);
  const causeListPath = state.pathname?.includes("causeList");
  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Dhaka",
  });

  const {
    data: caseList = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["allMamla", "causeList"],
    queryFn: async () => {
      try {
        const response = causeListPath
          ? await axiosPublic.get(`/allMamla/${today}`)
          : await axiosPublic.get(`/allMamla`);
        return response.status === 200 ? response.data : [];
      } catch (err) {
        console.error("Error fetching mamla data:", err);
        return [];
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

  const handleSearchChange = (e) => {
    setCurrentPage(1);
    setSearch({ ...search, [e.target.name]: e.target.value });
  };

  const filteredData = useMemo(() => {
    return caseList.filter((item) => {
      const districtBn = item?.district?.bn?.toLowerCase() || "";
      return (
        (item?.mamlaName?.toLowerCase() || "").includes(
          search.mamlaName.toLowerCase()
        ) &&
        (item?.mamlaNo?.toLowerCase() || "").includes(
          search.mamlaNo.toLowerCase()
        ) &&
        districtBn.includes(search.district.toLowerCase()) &&
        (item?.year?.toLowerCase() || "").includes(search.year.toLowerCase())
      );
    });
  }, [caseList, search]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const [editedMamla, setEditedMamla] = useState(null);

  const handleEdit = (mamla) => setEditedMamla(mamla);

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosPublic.delete(`/mamla/${id}`).then((res) => {
          if (res.data.deletedCount > 0) {
            Swal.fire("Deleted!", "Your file has been deleted.", "success");
            refetch();
          }
        });
      }
    });
  };

  const handleMessage = (mamla) => {
    const message = `অতিরিক্ত বিভাগীয় কমিশনার (রাজস্ব), চট্টগ্রাম আদালতে চলমান ${
      mamla.mamlaName
    } (${mamla.mamlaNo} নং) মামলার পরবর্তী কার্যক্রম ${
      mamla.nextDate || "N/A"
    } তারিখে অনুষ্ঠিত হবে।`;

    Swal.fire({
      title: "আপনি মেসেজ প্রেরণ করতে চান?",
      html: `
        <div style="text-align: left;">
          <b>প্রেরিত মেসেজঃ</b>
          <textarea id="editable-message" style="display:block; margin-top:8px; padding:8px; width:100%; font-size:14px; min-height:120px;">${message}</textarea>
        </div>
      `,
      showCloseButton: true,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "হ্যাঁ, প্রেরণ করুন!",
      preConfirm: () => {
        const editedMessage = document.getElementById("editable-message").value;
        if (!editedMessage)
          Swal.showValidationMessage("মেসেজ ফাঁকা রাখা যাবে না!");
        return editedMessage;
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const editedMessage = result.value;
        const phoneNumbers = [
          ...(mamla?.badi?.map((b) => b.phone) || []),
          ...(mamla?.bibadi?.map((b) => b.phone) || []),
        ]
          .filter(Boolean)
          .map((num) => "88" + num)
          .join(",");

        axiosPublic
          .post("/message", { to: phoneNumbers, message: editedMessage })
          .then((res) => {
            if (res.data.result?.response_code === 202) {
              Swal.fire("সফলতা!", "মেসেজ সফলভাবে প্রেরণ করা হয়েছে।", "success");
              refetch();
            } else if (res.data.response_code === 107) {
              Swal.fire("সতর্কতা!", "আপনার পর্যাপ্ত ব্যালেন্স নেই।", "warning");
            } else {
              Swal.fire("ত্রুটি!", "মেসেজ প্রেরণে সমস্যা হয়েছে।", "error");
            }
          });
      }
    });
  };

  const formatDate = (dateStr) => dateStr || "-";

  if (isLoading) return <p className="mt-10 text-center">লোড হচ্ছে...</p>;

  return (
    <div className="p-4 overflow-x-auto">
      <div className="mb-4 font-semibold text-xl">
        {causeListPath ? (
          <h1 className="flex items-center text-center">
            {`আজকের মামলার কার্যতালিকা- ${today}`} <ListLottie />
          </h1>
        ) : (
          "সকল মামলা"
        )}
      </div>

      {/* Search Inputs */}
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
      <div className="shadow-md border border-gray-200 rounded-lg overflow-x-auto">
        <table className="min-w-full text-sm text-center border-collapse">
          <thead className="top-0 sticky bg-gray-100 shadow-sm text-gray-700">
            <tr>
              <th className="px-4 py-3">ক্রমিক</th>
              <th className="px-4 py-3">মামলার নাম</th>
              <th className="px-4 py-3">মামলার নং</th>
              <th className="px-4 py-3">বছর</th>
              <th className="px-4 py-3">জেলা</th>
              <th className="px-4 py-3">পূর্ববর্তী তারিখ</th>
              <th className="px-4 py-3">পরবর্তী তারিখ</th>
              <th className="px-4 py-3">সর্বশেষ অবস্থা</th>
              <th className="px-4 py-3">নিষ্পত্তির তারিখ</th>
              <th className="px-4 py-3">বাদী</th>
              <th className="px-4 py-3">বিবাদী</th>
              {user?.role === "divCom" &&
                state.pathname.includes("dashboard") && (
                  <th className="px-4 py-3">কার্যক্রম</th>
                )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedData.length > 0 ? (
              paginatedData.map((item, idx) => (
                <tr
                  key={item._id || `${item.mamlaNo}-${item.year}-${idx}`}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-gray-700">
                    {(currentPage - 1) * itemsPerPage + idx + 1}
                  </td>
                  <td className="px-4 py-3">{item.mamlaName || "-"}</td>
                  <td className="px-4 py-3">{item.mamlaNo || "-"}</td>
                  <td className="px-4 py-3">{item.year || "-"}</td>
                  <td className="px-4 py-3">{item?.district?.bn || "-"}</td>
                  <td className="px-4 py-3">{formatDate(item.previousDate)}</td>
                  <td className="px-4 py-3">{formatDate(item.nextDate)}</td>
                  <td className="px-4 py-3">{item.lastCondition || "-"}</td>
                  <td className="px-4 py-3">
                    {formatDate(item.completionDate)}
                  </td>

                  <td className="px-4 py-3">
                    {item.badi?.length > 0
                      ? item.badi.map((b) => (
                          <p key={`${b.name}-${b.phone || ""}`}>
                            {b.name} - {b.phone || "-"}
                          </p>
                        ))
                      : "-"}
                  </td>

                  <td className="px-4 py-3">
                    {item.bibadi?.length > 0
                      ? item.bibadi.map((b) => (
                          <p key={`${b.name}-${b.phone || ""}`}>
                            {b.name} - {b.phone || "-"}
                          </p>
                        ))
                      : "-"}
                  </td>
                  {user?.role === "divCom" &&
                    state.pathname.includes("dashboard") && (
                      <td className="flex flex-col flex-wrap gap-1">
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
                        <button
                          onClick={() => handleMessage(item)}
                          className="btn btn-sm"
                        >
                          <MdMessage className="text-xl" />
                        </button>
                      </td>
                    )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="12" className="px-4 py-4 text-center">
                  কোনো মামলা পাওয়া যায়নি
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

      {/* Edit Modal */}
      <dialog id="my_modal_3" className="modal">
        <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto modal-box">
          <form method="dialog">
            <button className="top-2 right-2 absolute btn btn-sm btn-circle btn-ghost">
              ✕
            </button>
          </form>
          <MamlaEditForm
            editedMamla={editedMamla}
            closeModal={() => document.getElementById("my_modal_3")?.close()}
          />
        </div>
      </dialog>
    </div>
  );
};

export default AllMamla;
