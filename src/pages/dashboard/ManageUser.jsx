import React, { useContext, useState } from "react";

import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import axiosPublic from "../../axios/axiosPublic";
import Swal from "sweetalert2";
import { MdDelete } from "react-icons/md";
import { AuthContext } from "../../provider/AuthProvider";
const ManageUser = () => {
  const { signOut } = useContext(AuthContext);
  const {
    refetch,
    isPending,
    error,
    data: users = [],
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axiosPublic.get("/users");
      return res.data;
    },
  });

  // console.log(users);
  const handleUserDelete = (id) => {
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
        axiosPublic.delete(`/users/${id}`).then((res) => {
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
  const handleMakeAdmin = (user, role) => {
    console.log(role);
    Swal.fire({
      title: `Are you want to make him ${role}?`,
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes, Make ${role}!`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await axiosPublic.patch(`/users/role/${user._id}`, {
          isAdmin: role === "Admin",
        });
        // console.log(res.data);
        if (res.data.modifiedCount > 0) {
          Swal.fire({
            title: `Want to make him ${role}!`,
            text: `${user.name}  is now ${role}`,
            icon: "success",
          });
          if (role !== "Admin") {
            signOut(); // Sign out if the user is demoted to User
          }
          refetch();
        }
      }
    });
  };
  const handlePublishUser = (user) => {
    Swal.fire({
      title: `Are you sure you want to ${
        user.isPublished ? "UnPublish" : "publish"
      }  ${user.name} profile?`,
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes, ${
        user.isPublished ? "UnPublish" : "publish"
      } it!`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await axiosPublic.patch(`/publishUsers/${user._id}`, {
          isPublished: !user.isPublished,
        });
        // console.log(res.data);
        if (res.data.modifiedCount > 0) {
          Swal.fire({
            title: `${user.isPublished ? "UnPublish" : "publish"}`,
            text: `${user.name} has been ${
              user.isPublished ? "UnPublished" : "publish"
            }`,
            icon: "success",
          });
          refetch();
        }
      }
    });
  };

  return (
    <div className="p-6 w-full">
      <h1 className="font-bold text-2xl">সকল ব্যবহারকারী </h1>

      <div className="w-full overflow-x-auto">
        <h1 className="font-semibold">মোট ব্যবহারকারী: {users.length}</h1>
        <div className="max-w-screen overflow-x-auto">
          <table className="table table-pin-cols table-pin-rows">
            {/* head */}
            <thead>
              <tr className="text-xl text-center">
                {/* <th className="w-1/7">Serial</th> */}
                <th className="w-1/7">নাম </th>
                <th className="w-1/7">ইমেইল </th>
                <th className="w-1/7">সেকশন </th>
                <th className="w-1/7">পদবী </th>
                <th className="w-1/7">রোল </th>
                <th className="w-1/7">কার্যক্রম </th>
              </tr>
            </thead>
            <tbody className="text-base text-center">
              {users.map((user, index) => (
                <tr
                  key={user._id}
                  className="hover:bg-gray-50 border-gray-200 border-t"
                >
                  {/* <td className="w-1/7">{index + 1}</td> */}
                  <td className="w-1/7 break-words whitespace-normal">
                    {user?.name || "-"}
                  </td>
                  <td className="flex-1 w-1/7 break-words whitespace-normal">
                    {user?.email || "-"}
                  </td>
                  <td className="w-1/7 break-words whitespace-normal">
                    {user?.section || "-"}
                  </td>
                  <td className="w-1/7 break-words whitespace-normal">
                    {user?.designation || "-"}
                  </td>
                  <td className="w-1/7 break-words whitespace-normal">
                    <div className="font-bold text-green-600">
                      <select
                        id="role"
                        value={user?.isAdmin ? "Admin" : "User"}
                        onChange={(e) => handleMakeAdmin(user, e.target.value)}
                        className="w-full select-bordered select"
                      >
                        <option disabled selected>
                          Choose a role
                        </option>
                        <option>User</option>
                        <option>Admin</option>
                      </select>
                    </div>
                  </td>
                  <td className="w-1/7">
                    <button onClick={() => handleUserDelete(user._id)}>
                      <MdDelete className="text-red-500 text-2xl cursor-pointer" />
                    </button>
                    <button
                      className="bg-green-600 ml-2 text-white btn btn-sm"
                      onClick={() => handlePublishUser(user)}
                    >
                      {user?.isPublished ? "UnPublish" : "Publish"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageUser;
