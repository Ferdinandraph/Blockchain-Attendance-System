const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(express.json());

const mongodburl = process.env.MONGODB_URL

mongoose.connect(`${mongodburl}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected"));

const studentSchema = new mongoose.Schema({
  name: String,
  registrationNumber: String,
});

const Student = mongoose.model("Student", studentSchema);

app.get("/students", async (req, res) => {
  const students = await Student.find();
  res.json(students);
});

app.post("/students", async (req, res) => {
  const { name, registrationNumber } = req.body;
  if (!name || !registrationNumber) {
    return res.status(400).json({ error: "All fields are required" });
  }
  const student = new Student({ name, registrationNumber });
  await student.save();
  res.json(student);
});

app.delete("/students/:id", async (req, res) => {
  const { id } = req.params;
  await Student.findByIdAndDelete(id);
  res.json({ message: "Student deleted" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));