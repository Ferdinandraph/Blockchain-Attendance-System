import React, { useState, useEffect } from "react";
import { getContract } from "../utils/contract";

const StudentList = ({ students, onDeleteStudent, setSelectedStudentHistory, setSelectedStudentName }) => {
  const [attendanceStatus, setAttendanceStatus] = useState({});

  useEffect(() => {
    const checkAttendance = async () => {
      const contract = await getContract();
      const status = {};
      for (const student of students) {
        const isMarked = await contract.isMarkedToday(student.registrationNumber);
        status[student._id] = isMarked;
      }
      setAttendanceStatus(status);
    };
    checkAttendance();
  }, [students]);

  const markAttendance = async (registrationNumber, studentId) => {
    const contract = await getContract();
    try {
      const tx = await contract.markAttendance(registrationNumber);
      await tx.wait();
      setAttendanceStatus((prev) => ({ ...prev, [studentId]: true }));
      alert("Student marked present!");
    } catch (error) {
      alert("Failed to mark attendance. Are you an admin?");
    }
  };

  const unmarkAttendance = async (registrationNumber, studentId) => {
    const contract = await getContract();
    try {
      const tx = await contract.unmarkAttendance(registrationNumber);
      await tx.wait();
      setAttendanceStatus((prev) => ({ ...prev, [studentId]: false }));
      alert("Student unmarked!");
    } catch (error) {
      alert("Failed to unmark attendance. Are you an admin?");
    }
  };

  const viewAttendanceHistory = async (registrationNumber, studentName) => {
    const contract = await getContract();
    try {
      const dates = await contract.getAttendance(registrationNumber);
      setSelectedStudentHistory(dates.map((date) => Number(date)));
      setSelectedStudentName(studentName);
    } catch (error) {
      console.error("Failed to fetch attendance history:", error);
      alert("Failed to load attendance history.");
    }
  };

  return (
    <div className="card mb-5">
      <div className="card-body">
        <h2 className="card-title">Attendance List</h2>
        <div className="d-flex flex-column gap-3">
          {students.length === 0 ? (
            <p className="text-muted">No students added yet.</p>
          ) : (
            students.map((student) => (
              <div
                key={student._id}
                className="d-flex justify-content-between align-items-center p-3 border rounded"
              >
                <div className="d-flex align-items-center gap-3">
                  <span
                    className={`badge ${
                      attendanceStatus[student._id] ? "bg-success" : "bg-secondary"
                    }`}
                  >
                    {attendanceStatus[student._id] ? "Marked" : "Not Marked"}
                  </span>
                  <div>
                    <h5 className="mb-0">{student.name}</h5>
                    <p className="mb-0 text-muted">{student.registrationNumber}</p>
                  </div>
                </div>
                <div className="d-flex gap-2">
                  <button
                    onClick={() => markAttendance(student.registrationNumber, student._id)}
                    className="btn btn-success btn-sm"
                    disabled={attendanceStatus[student._id]}
                  >
                    Mark
                  </button>
                  <button
                    onClick={() => unmarkAttendance(student.registrationNumber, student._id)}
                    className="btn btn-warning btn-sm"
                    disabled={!attendanceStatus[student._id]}
                  >
                    Unmark
                  </button>
                  <button
                    onClick={() => viewAttendanceHistory(student.registrationNumber, student.name)}
                    className="btn btn-info btn-sm"
                  >
                    History
                  </button>
                  <button
                    onClick={() => onDeleteStudent(student._id)}
                    className="btn btn-danger btn-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentList;