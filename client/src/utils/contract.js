import { ethers } from "ethers";

const contractAddress = "0x8da1437a351e844F7D685Ad7919965A710631001";
const contractABI = [
  "function markAttendance(string memory registrationNumber) external",
  "function unmarkAttendance(string memory registrationNumber) external",
  "function isMarkedToday(string memory registrationNumber) external view returns (bool)",
  "function getAttendance(string memory registrationNumber) external view returns (uint256[] memory)",
  "function addAdmin(address newAdmin) external",
  "function removeAdmin(address admin) external",
  "function isAdmin(address account) external view returns (bool)",
  "event AttendanceMarked(string indexed registrationNumber, uint256 date)",
  "event AttendanceUnmarked(string indexed registrationNumber, uint256 date)",
  "event AdminAdded(address indexed admin)",
  "event AdminRemoved(address indexed admin)",
];

export const getContract = () => {
  const provider = new ethers.BrowserProvider(window.ethereum);
  return provider.getSigner().then((signer) => {
    return new ethers.Contract(contractAddress, contractABI, signer);
  });
};