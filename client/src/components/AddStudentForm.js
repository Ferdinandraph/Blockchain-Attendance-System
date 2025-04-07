import React, { useState } from "react";
import axios from "axios";
import { StudentModel } from "../models/Student";

const AddStudentForm = ({ onAddStudent }) => {
  const [newStudent, setNewStudent] = useState({ ...StudentModel });
  const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Posting to:", `${backendUrl}/students`);
      const res = await axios.post(`${backendUrl}/students`, newStudent);
      onAddStudent(res.data);
      setNewStudent({ ...StudentModel });
    } catch (error) {
      console.error("Failed to add student:", error);
      alert("Failed to add student.");
    }
  };

  return (
    <div className="card mb-5">
      <div className="card-body">
        <h2 className="card-title">Add New Student</h2>
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder="Name"
                value={newStudent.name}
                onChange={(e) =>
                  setNewStudent({ ...newStudent, name: e.target.value })
                }
              />
            </div>
            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder="Registration Number (e.g., 20204351592)"
                value={newStudent.registrationNumber}
                onChange={(e) =>
                  setNewStudent({ ...newStudent, registrationNumber: e.target.value })
                }
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary mt-3">
            Add Student
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddStudentForm;