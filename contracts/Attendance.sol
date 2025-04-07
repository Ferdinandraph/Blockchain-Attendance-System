// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Attendance {
    mapping(address => bool) public admins;
    mapping(string => mapping(uint256 => bool)) public attendanceRecords;
    mapping(string => uint256[]) public studentAttendanceDates;

    event AttendanceMarked(string indexed registrationNumber, uint256 date);
    event AttendanceUnmarked(string indexed registrationNumber, uint256 date);
    event AdminAdded(address indexed admin);
    event AdminRemoved(address indexed admin);

    constructor() {
        admins[msg.sender] = true; // Deployer is the first admin
    }

    modifier onlyAdmin() {
        require(admins[msg.sender], "Only an admin can perform this action");
        _;
    }

    function addAdmin(address newAdmin) external onlyAdmin {
        require(newAdmin != address(0), "New admin cannot be the zero address");
        require(!admins[newAdmin], "Address is already an admin");
        admins[newAdmin] = true;
        emit AdminAdded(newAdmin);
    }

    function removeAdmin(address admin) external onlyAdmin {
        require(admins[admin], "Address is not an admin");
        require(msg.sender != admin, "Cannot remove yourself");
        admins[admin] = false;
        emit AdminRemoved(admin);
    }

    function isAdmin(address account) external view returns (bool) {
        return admins[account];
    }

    function markAttendance(string memory registrationNumber) external onlyAdmin {
        uint256 today = block.timestamp / 1 days;
        require(!attendanceRecords[registrationNumber][today], "Already marked today");
        attendanceRecords[registrationNumber][today] = true;
        studentAttendanceDates[registrationNumber].push(today);
        emit AttendanceMarked(registrationNumber, today);
    }

    function unmarkAttendance(string memory registrationNumber) external onlyAdmin {
        uint256 today = block.timestamp / 1 days;
        require(attendanceRecords[registrationNumber][today], "Not marked today");
        attendanceRecords[registrationNumber][today] = false;
        uint256[] storage dates = studentAttendanceDates[registrationNumber];
        for (uint256 i = 0; i < dates.length; i++) {
            if (dates[i] == today) {
                dates[i] = dates[dates.length - 1];
                dates.pop();
                break;
            }
        }
        emit AttendanceUnmarked(registrationNumber, today);
    }

    function isMarkedToday(string memory registrationNumber) external view returns (bool) {
        uint256 today = block.timestamp / 1 days;
        return attendanceRecords[registrationNumber][today];
    }

    function getAttendance(string memory registrationNumber) external view returns (uint256[] memory) {
        return studentAttendanceDates[registrationNumber];
    }
}