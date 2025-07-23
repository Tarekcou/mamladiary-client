import React, { useState } from "react";
import { MdAdd, MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import Swal from "sweetalert2";
import { aclandOptions } from "../../../data/aclandOptions";
import useCrud from "../../../hooks/userCrud";

const roles = ["acland", "dc", "divcom", "nagorik"];

const ManageAdcUser = () => {
  const [section, setSection] = useState("");
  const [role, setRole] = useState("");
  const [districtIndex, setDistrictIndex] = useState("");
  const [officeName, setOfficeName] = useState("");

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
  } = useCrud ("/users", "users","Acland");

  const resetForm = () => {
    resetEdit();
    setSection("");
    setRole("");
    setDistrictIndex("");
    setOfficeName("");
  };

  const handleSubmitUser = async (e) => {
    e.preventDefault();
    const form = e.target;

    const selectedDistrict = aclandOptions[districtIndex];
    const selectedOffice = selectedDistrict?.offices.find(o => o.en === officeName) || null;

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

    form.reset();
    resetForm();
    document.getElementById("my_modal_5").close();
  };

  const handleUserEdit = (user) => {
    handleEdit(user);
    setSection(user.section || "");
    setRole(user.role || "");

    const foundDistrictIndex = aclandOptions.findIndex(
      (d) => d.district.bn === user?.district?.bn
    );
    setDistrictIndex(foundDistrictIndex !== -1 ? foundDistrictIndex : "");
    setOfficeName(user.officeName?.en || "");

    document.getElementById("my_modal_5").showModal();
  };

  return (
    <div className="p-6 w-full">
      <div className="flex justify-between mb-4">
        <h1 className="font-bold text-2xl">সকল ব্যবহারকারী ({users.length})</h1>
        {/* <button className="btn btn-outline" onClick={() => document.getElementById("my_modal_5").showModal()}>
          <MdAdd /> নতুন যুক্ত করুন
        </button> */}
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
              <th>ভূমি অফিস</th>
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
                <td>{user?.acLand?.bn}</td>
                <td>{user.officeName?.bn || "-"}</td>
                <td className="space-y-2">
                  <div className="flex justify-center gap-2">
                    <FaEdit onClick={() => handleUserEdit(user)} className="text-blue-600 text-xl cursor-pointer" />
                    <MdDelete onClick={() => deleteItem(user._id)} className="text-red-500 text-xl cursor-pointer" />
                  </div>
                  <button
                    className="btn btn-xs btn-success mt-1"
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
      <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">
            {isEditMode ? "ইউজার আপডেট করুন" : "নতুন ইউজার যুক্ত করুন"}
          </h3>
          <form onSubmit={handleSubmitUser} className="space-y-4">
            <input name="name" required defaultValue={editingItem?.name || ""} placeholder="নাম" className="input input-bordered w-full" />
            <input name="email" type="email" required defaultValue={editingItem?.email || ""} placeholder="ইমেইল" className="input input-bordered w-full" />
            <input name="phone" required defaultValue={editingItem?.phone || ""} placeholder="মোবাইল" className="input input-bordered w-full" />
            <input name="designation" required defaultValue={editingItem?.designation || ""} placeholder="পদবী" className="input input-bordered w-full" />
            <input name="password" required defaultValue={editingItem?.password || ""} placeholder="পাসওয়ার্ড" className="input input-bordered w-full" />
            <input name="role" disabled required defaultValue={role || ""} placeholder="রোল" className="input input-bordered w-full" />

            {/* You can add district and office dropdowns here if needed */}

            <div className="modal-action justify-between">
              <button type="submit" className="btn btn-primary">
                {isEditMode ? "আপডেট করুন" : "যুক্ত করুন"}
              </button>
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  document.getElementById("my_modal_5").close();
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
