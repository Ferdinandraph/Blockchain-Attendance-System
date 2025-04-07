const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const Attendance = await ethers.getContractFactory("Attendance");
  const attendance = await Attendance.deploy();
  await attendance.waitForDeployment();
  console.log("Attendance contract deployed to:", await attendance.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});