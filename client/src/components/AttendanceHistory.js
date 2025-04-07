import React from "react";

const AttendanceHistory = ({ attendance, studentName, onClose }) => {
  if (!attendance || attendance.length === 0) {
    return (
      <div className="card mt-5">
        <div className="card-body">
          <h2 className="card-title">Attendance History for {studentName}</h2>
          <p className="text-muted">No attendance records found.</p>
          <button className="btn btn-secondary mt-3" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card mt-5">
      <div className="card-body">
        <h2 className="card-title">Attendance History for {studentName}</h2>
        <ul className="list-group mb-3">
          {attendance.map((date, index) => (
            <li key={index} className="list-group-item">
              {new Date(date * 86400000).toLocaleDateString()} (Day {date})
            </li>
          ))}
        </ul>
        <button className="btn btn-secondary" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default AttendanceHistory;