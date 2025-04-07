import React, { useEffect, useState } from "react";
import axios from "axios";
import AddStudentForm from "./components/AddStudentForm";
import StudentList from "./components/StudentList";
import AddAdmin from "./components/AddAdmin";
import AttendanceHistory from "./components/AttendanceHistory";
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
  const [students, setStudents] = useState([]);
  const [account, setAccount] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [selectedStudentHistory, setSelectedStudentHistory] = useState(null);
  const [selectedStudentName, setSelectedStudentName] = useState("");

  const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

  useEffect(() => {
    if (isConnected) {
      const loadStudents = async () => {
        try {
          console.log("Fetching from:", `${backendUrl}/students`);
          const res = await axios.get(`${backendUrl}/students`);
          setStudents(res.data);
        } catch (error) {
          console.error("Failed to load students:", error);
          alert("Failed to load students. Is the backend running?");
        }
      };
      loadStudents();
    }
  }, [isConnected, backendUrl]);

  const connectWallet = async () => {
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setAccount(accounts[0]);
      setIsConnected(true);
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      alert("Failed to connect wallet. Please ensure MetaMask is installed.");
    }
  };

  const addStudent = (student) => {
    setStudents([...students, student]);
  };

  const deleteStudent = async (id) => {
    try {
      console.log("Deleting from:", `${backendUrl}/students/${id}`);
      await axios.delete(`${backendUrl}/students/${id}`);
      setStudents(students.filter((student) => student._id !== id));
    } catch (error) {
      console.error("Failed to delete student:", error);
      alert("Failed to delete student.");
    }
  };

  const handleCloseHistory = () => {
    setSelectedStudentHistory(null);
    setSelectedStudentName("");
  };

  if (!isConnected) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center min-vh-100">
        <h1 className="mb-4">Blockchain Attendance System</h1>
        <button className="btn btn-primary btn-lg" onClick={connectWallet}>
          Connect Wallet
        </button>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <header className="bg-dark text-white p-3">
        <h1 className="text-center">Blockchain Attendance System</h1>
      </header>
      <main className="container my-5 flex-grow-1">
        <p className="text-center text-muted mb-4">Connected Account: {account}</p>
        <AddStudentForm onAddStudent={addStudent} />
        <AddAdmin />
        <StudentList
          students={students}
          onDeleteStudent={deleteStudent}
          setSelectedStudentHistory={setSelectedStudentHistory}
          setSelectedStudentName={setSelectedStudentName}
        />
        {selectedStudentHistory && (
          <AttendanceHistory
            attendance={selectedStudentHistory}
            studentName={selectedStudentName}
            onClose={handleCloseHistory}
          />
        )}
      </main>
      <footer className="bg-dark text-white text-center p-3 mt-auto">
        <p>© {new Date().getFullYear()} Blockchain Attendance System</p>
      </footer>
    </div>
  );
};

export default App;