import React, { useState } from "react";
import { MdAdd, MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import Swal from "sweetalert2";
import { aclandOptions } from "../../../data/aclandOptions";
import useCrud from "../../../hooks/userCrud";

const ManageDivComUser = () => {
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
  } = useCrud("/users", "users", "divCom");

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
      officeName: role === "acLand" ? selectedOffice : undefined,
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
        <button
          className="btn-outline btn"
          onClick={() => document.getElementById("my_modal_5").showModal()}
        >
          <MdAdd /> নতুন যুক্ত করুন
        </button>
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
              <th>অফিস</th>
              <th>একশন</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {users?.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.designation}</td>
                <td>{user.phone}</td>
                <td>{user.password}</td>
                <td>{user.role}</td>
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
      <dialog id="my_modal_5" className="modal-bottom modal sm:modal-middle">
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

            {/* You can add district and office dropdowns here if needed */}

            <div className="justify-between modal-action">
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

export default ManageDivComUser;
