import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axiosPublic from "../axios/axiosPublic"; // Adjust path as needed
import Swal from "sweetalert2";

const useCrud = (endpoint, queryKey,role) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
    console.log(role)
  const {
    data: items = [],
    refetch,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
const res = await axiosPublic.get(endpoint, {
  params: { role }
});
      console.log(res.data)
      return res.data;
    },
  });

  const createItem = async (payload) => {
    try {
      const res = await axiosPublic.post(endpoint, payload);
      if (res.data.insertedId || res.data._id) {
        Swal.fire("Success", "Item added successfully", "success");
        refetch();
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Failed to create item", "error");
    }
  };

  const updateItem = async (id, payload) => {
    try {
      await axiosPublic.patch(`${endpoint}/${id}`, payload);
      Swal.fire("Updated", "Item updated successfully", "success");
      refetch();
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Failed to update item", "error");
    }
  };

  const deleteItem = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await axiosPublic.delete(`${endpoint}/${id}`);
        if (res.data.deletedCount > 0) {
          Swal.fire("Deleted!", "Item deleted successfully.", "success");
          refetch();
        }
      } catch (error) {
        console.error(error);
        Swal.fire("Error", "Failed to delete item", "error");
      }
    }
  };

  const publishItem = async (id, isPublished) => {
    const confirm = await Swal.fire({
      title: `Are you sure to ${isPublished ? "Unpublish" : "Publish"}?`,
      showCancelButton: true,
      confirmButtonText: "Yes",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await axiosPublic.patch(`/publishUsers/${id}`, {
          isPublished: !isPublished,
        });
        if (res.data.modifiedCount > 0) {
          Swal.fire("Done!", "Item status updated.", "success");
          refetch();
        }
      } catch (error) {
        console.error(error);
        Swal.fire("Error", "Failed to update publish status", "error");
      }
    }
  };

  const resetEdit = () => {
    setIsEditMode(false);
    setEditingItem(null);
  };

  const handleEdit = (item) => {
    setIsEditMode(true);
    setEditingItem(item);
  };

  return {
    items,
    isLoading,
    isError,
    createItem,
    updateItem,
    deleteItem,
    publishItem,
    isEditMode,
    editingItem,
    handleEdit,
    resetEdit,
    refetch,
  };
};

export default useCrud;
