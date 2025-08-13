import React, { useState, useEffect, useRef } from "react";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { aclandOptions } from "../../../data/aclandOptions";
import useCrud from "../../../hooks/userCrud";

const ManageAdcUser = () => {
  const [section, setSection] = useState("");
  const [role, setRole] = useState("");
  const [districtIndex, setDistrictIndex] = useState("");
  const [officeName, setOfficeName] = useState("");

  const modalRef = useRef(null);

  const {
    items: users,
    createItem,
    updateItem,
    deleteItem,
    publishItem,
    isEditMode,
    editingItem,
    handleEdit,
    resetEdit,
  } = useCrud("/users", "users", "adc");

  const resetForm = () => {
    resetEdit();
    setSection("");
    setRole("");
    setDistrictIndex("");
    setOfficeName("");
  };

  // Prefill form when editing
  useEffect(() => {
    if (editingItem) {
      setSection(editingItem.section || "");
      setRole(editingItem.role || "");
      const foundDistrictIndex = aclandOptions.findIndex(
        (d) => d.district.bn === editingItem?.district?.bn
      );
      setDistrictIndex(foundDistrictIndex !== -1 ? foundDistrictIndex : "");
      setOfficeName(editingItem.officeName?.en || "");
    }
  }, [editingItem]);

  const handleSubmitUser = async (e) => {
    e.preventDefault();
    const form = e.target;
    const selectedDistrict = aclandOptions[districtIndex];
    const selectedOffice =
      selectedDistrict?.offices.find((o) => o.en === officeName) || null;

    const payload = {
      name: form.name.value,
      email: form.email.value,
      phone: form.phone.value,
      designation: form.designation.value,
      password: form.password.value,
      section,
      role,
      district: selectedDistrict?.district || null,
      officeName: role === "acland" ? selectedOffice : undefined,
    };

    if (isEditMode && editingItem) {
      await updateItem(editingItem._id, payload);
    } else {
      await createItem(payload);
    }

    resetForm();
    form.reset();
    modalRef.current.close();
  };

  const handleUserEdit = (user) => {
    handleEdit(user);
    modalRef.current.showModal();
  };

  return (
    <div className="p-6 w-full">
      <div className="flex justify-between mb-4">
        <h1 className="font-bold text-2xl">সকল ব্যবহারকারী ({users.length})</h1>
      </div>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr className="text-center">
              <th>নাম</th>
              <th>ইমেইল</th>
              <th>পদবী</th>
              <th>মোবাইল</th>
              <th>পাসওয়ার্ড</th>
              <th>রোল</th>
              <th>জেলা</th>
              <th>অফিস</th>
              <th>একশন</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.designation}</td>
                <td>{user.phone}</td>
                <td>{user.password}</td>
                <td>{user.role}</td>
                <td>{user?.district?.bn}</td>
                <td>{user.officeName?.bn || "-"}</td>
                <td className="space-y-2">
                  <div className="flex justify-center gap-2">
                    <FaEdit
                      onClick={() => handleUserEdit(user)}
                      className="text-blue-600 text-xl cursor-pointer"
                    />
                    <MdDelete
                      onClick={() => deleteItem(user._id)}
                      className="text-red-500 text-xl cursor-pointer"
                    />
                  </div>
                  <button
                    className="mt-1 btn btn-xs btn-success"
                    onClick={() => publishItem(user._id, user.isPublished)}
                  >
                    {user.isPublished ? "Unpublish" : "Publish"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      <dialog ref={modalRef} className="modal-bottom modal sm:modal-middle">
        <div className="modal-box">
          <h3 className="mb-4 font-bold text-lg">
            {isEditMode ? "ইউজার আপডেট করুন" : "নতুন ইউজার যুক্ত করুন"}
          </h3>
          <form onSubmit={handleSubmitUser} className="space-y-4">
            <input
              name="name"
              required
              defaultValue={editingItem?.name || ""}
              placeholder="নাম"
              className="input-bordered w-full input"
            />
            <input
              name="email"
              type="email"
              required
              defaultValue={editingItem?.email || ""}
              placeholder="ইমেইল"
              className="input-bordered w-full input"
            />
            <input
              name="phone"
              required
              defaultValue={editingItem?.phone || ""}
              placeholder="মোবাইল"
              className="input-bordered w-full input"
            />
            <input
              name="designation"
              required
              defaultValue={editingItem?.designation || ""}
              placeholder="পদবী"
              className="input-bordered w-full input"
            />
            <input
              name="password"
              required
              defaultValue={editingItem?.password || ""}
              placeholder="পাসওয়ার্ড"
              className="input-bordered w-full input"
            />
            <input
              name="role"
              disabled
              required
              defaultValue={role || ""}
              placeholder="রোল"
              className="input-bordered w-full input"
            />

            {/* District */}
            <select
              name="district"
              className="bg-gray-100 w-full select-bordered select"
              required
              value={districtIndex}
              onChange={(e) => {
                const index =
                  e.target.value === "" ? "" : Number(e.target.value);
                setDistrictIndex(index);
                setOfficeName(""); // reset office
              }}
            >
              <option value="">জেলা নির্বাচন করুন</option>
              {aclandOptions.map((districtObj, index) => (
                <option key={index} value={index}>
                  {districtObj.district.bn} ({districtObj.district.en})
                </option>
              ))}
            </select>

            {/* Office (only for AC Land role) */}
            {role === "acland" && (
              <select
                name="officeName"
                className="bg-gray-100 w-full select-bordered select"
                required
                value={officeName}
                onChange={(e) => setOfficeName(e.target.value)}
              >
                <option value="" disabled>
                  অফিস নির্বাচন করুন
                </option>
                {(aclandOptions[districtIndex]?.offices || []).map(
                  (office, index) => (
                    <option key={index} value={office.en}>
                      {office.bn}
                    </option>
                  )
                )}
              </select>
            )}

            <div className="justify-between modal-action">
              <button type="submit" className="btn btn-primary">
                {isEditMode ? "আপডেট করুন" : "যুক্ত করুন"}
              </button>
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  modalRef.current.close();
                }}
                className="btn"
              >
                বাতিল
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
};

export default ManageAdcUser;
