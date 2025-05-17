import React, { useState, useMemo, useEffect } from "react";
import axiosPublic from "../../axios/axiosPublic";

const AllMamla = () => {
  const [mamlaList, setMamlaList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosPublic.get(`/allMamla`);
        if (response.status === 200) {
          setMamlaList(response.data);
        }
      } catch (error) {
        console.error("Error fetching mamla data:", error);
      }
    };

    fetchData();
  }, []);

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
    return mamlaList.filter(
      (item) =>
        item.mamlaName.toLowerCase().includes(search.mamlaName.toLowerCase()) &&
        item.mamlaNo.toLowerCase().includes(search.mamlaNo.toLowerCase()) &&
        item.district.toLowerCase().includes(search.district.toLowerCase()) &&
        item.year.toLowerCase().includes(search.year.toLowerCase())
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

  return (
    <div className="p-4">
      <h2 className="mb-4 font-semibold text-xl">Mamla Records</h2>

      {/* Search Fields */}
      <div className="gap-2 grid grid-cols-1 md:grid-cols-4 mb-4">
        <input
          type="text"
          name="mamlaName"
          placeholder="Search Mamla Name"
          value={search.mamlaName}
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
      <div className="overflow-x-auto">
        <table className="bg-white border min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">#</th>
              <th className="px-4 py-2 border">Mamla Name</th>
              <th className="px-4 py-2 border">Mamla No</th>
              <th className="px-4 py-2 border">Year</th>
              <th className="px-4 py-2 border">District</th>
              <th className="px-4 py-2 border">Next Date</th>
              <th className="px-4 py-2 border">Completed?</th>
              <th className="px-4 py-2 border">Completion Date</th>
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
                  <td className="px-4 py-2 border">{item.mamlaName}</td>
                  <td className="px-4 py-2 border">{item.mamlaNo}</td>
                  <td className="px-4 py-2 border">{item.year}</td>
                  <td className="px-4 py-2 border">{item.district}</td>
                  <td className="px-4 py-2 border">{item.nextDate || "-"}</td>
                  <td className="px-4 py-2 border">
                    {item.completedMamla || "-"}
                  </td>
                  <td className="px-4 py-2 border">
                    {item.completionDate || "-"}
                  </td>
                  <td className="px-4 py-2 border">
                    <button className="btn">edit</button>
                    <button className="btn">delete</button>
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
    </div>
  );
};

export default AllMamla;
