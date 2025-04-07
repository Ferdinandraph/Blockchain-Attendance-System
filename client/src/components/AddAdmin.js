import React, { useState } from "react";
import { getContract } from "../utils/contract";

const AddAdmin = () => {
  const [newAdmin, setNewAdmin] = useState("");

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    try {
      const contract = await getContract();
      const tx = await contract.addAdmin(newAdmin);
      await tx.wait();
      alert("New admin added successfully!");
      setNewAdmin("");
    } catch (error) {
      console.error("Failed to add admin:", error);
      alert("Failed to add admin. Are you an admin?");
    }
  };

  return (
    <div className="card mb-5">
      <div className="card-body">
        <h2 className="card-title">Add New Admin</h2>
        <form onSubmit={handleAddAdmin}>
          <div className="row g-3">
            <div className="col-md-12">
              <input
                type="text"
                className="form-control"
                placeholder="New Admin's Ethereum Address"
                value={newAdmin}
                onChange={(e) => setNewAdmin(e.target.value)}
              />
            </div>
          </div>
          <button type="submit" className="btn btn-warning mt-3">
            Add Admin
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddAdmin;