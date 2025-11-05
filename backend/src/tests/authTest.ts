import Student from "../models/student";
import FacultyAdvisor from "../models/facultyAdvisor";
import DepartmentRepresentative from "../models/departmentRepresentative";

import bcrypt from "bcrypt";
import { AcademicDeptPrograms } from "../constants";


// Sample data with plaintext passwords
const studentData = [
  {
    name: "Aarav Patel",
    rollNumber: "CSE2023001",
    email: "aarav@gmail.com",
    facultyAdvisorName: "Dr. Meera Nair",
    department: "CSE",
    program: AcademicDeptPrograms.CSE?.[0] ?? "",
    password: "password123",
    hosteler: true,
  },
  {
    name: "Isha Sharma",
    rollNumber: "EEE2023002",
    email: "sreekshasree270@gmail.com",
    facultyAdvisorName: "Dr. R. Krishnan",
    department: "EEE",
    program: AcademicDeptPrograms.EEE?.[0],
    password: "isha@123",
    hosteler: false,
  },
  {
    name: "Rohan Singh",
    rollNumber: "ME2023003",
    email: "rohan.singh@university.edu",
    facultyAdvisorName: "Dr. S. Iyer",
    department: "ME",
    program: AcademicDeptPrograms.ME?.[0],
    password: "rohan2023",
    hosteler: true,
  },
  {
    name: "Diya Menon",
    rollNumber: "CSE2023004",
    email: "diya.menon@university.edu",
    facultyAdvisorName: "Dr. Meera Nair",
    department: "CSE",
    program: AcademicDeptPrograms.CSE?.[0] ?? "", // AI & Data Analytics
    password: "diya@321",
    hosteler: false,
  },
  {
    name: "Aditya Verma",
    rollNumber: "ECE2023005",
    email: "aditya.verma@university.edu",
    facultyAdvisorName: "Dr. Anil Deshpande",
    department: "ECE",
    program: AcademicDeptPrograms.ECE?.[0],
    password: "aditya!456",
    hosteler: true,
  },
  {
    name: "Neha Pillai",
    rollNumber: "CE2023006",
    email: "neha.pillai@university.edu",
    facultyAdvisorName: "Dr. R. Balasubramanian",
    department: "CE",
    program: AcademicDeptPrograms.CE?.[0],
    password: "neha@civ",
    hosteler: false,
  },
  {
    name: "Vikram Rao",
    rollNumber: "EEE2023007",
    email: "vikram.rao@university.edu",
    facultyAdvisorName: "Prof. Kavita Joshi",
    department: "EEE",
    program: AcademicDeptPrograms.EEE?.[1], // M.Tech in Power Systems
    password: "vikramMBA",
    hosteler: true,
  },
  {
    name: "Sneha Reddy",
    rollNumber: "ECE2023008",
    email: "sneha.reddy@university.edu",
    facultyAdvisorName: "Dr. N. Suresh",
    department: "ECE",
    program: AcademicDeptPrograms.ECE?.[1], // M.Tech in VLSI Design
    password: "snehaBT@1",
    hosteler: false,
  },
  {
    name: "Karthik Iyer",
    rollNumber: "CSE2023009",
    email: "karthik.iyer@university.edu",
    facultyAdvisorName: "Dr. Meera Nair",
    department: "CSE",
    program: AcademicDeptPrograms.CSE?.[1] ?? "",
    password: "karthik123",
    hosteler: true,
  },
  {
    name: "Priya Das",
    rollNumber: "CE2023010",
    email: "priya.das@university.edu",
    facultyAdvisorName: "Dr. Alok Mishra",
    department: "CE",
    program: AcademicDeptPrograms.CE?.[1],
    password: "priyaCHE",
    hosteler: false,
  },
];

const facultyAdvisorData = [
  {
    name: "Dr. Meera Nair",
    email: "meera.nair@university.edu",
    department: "CSE",
    program: AcademicDeptPrograms.CSE?.[0] ?? "", // B.Tech in CSE
    password: "meeraCSE@123",
  },
  {
    name: "Dr. R. Krishnan",
    email: "r.krishnan@university.edu",
    department: "EEE",
    program: AcademicDeptPrograms.EEE?.[0] ?? "",
    password: "krishnanEEE@123",
  },
  {
    name: "Dr. S. Iyer",
    email: "s.iyer@university.edu",
    department: "ME",
    program: AcademicDeptPrograms.ME?.[0] ?? "",
    password: "iyerME@123",
  },
  {
    name: "Dr. Anil Deshpande",
    email: "anil.deshpande@university.edu",
    department: "ECE",
    program: AcademicDeptPrograms.ECE?.[0] ?? "",
    password: "deshpandeECE@123",
  },
  {
    name: "Dr. R. Balasubramanian",
    email: "r.balasubramanian@university.edu",
    department: "CE",
    program: AcademicDeptPrograms.CE?.[0] ?? "",
    password: "balaCE@123",
  },
  {
    name: "Prof. Kavita Joshi",
    email: "kavita.joshi@university.edu",
    department: "EEE",
    program: AcademicDeptPrograms.EEE?.[1] ?? "", // M.Tech in Power Systems
    password: "joshiEEE@456",
  },
  {
    name: "Dr. N. Suresh",
    email: "n.suresh@university.edu",
    department: "ECE",
    program: AcademicDeptPrograms.ECE?.[1] ?? "", // M.Tech in VLSI Design
    password: "sureshECE@789",
  },
  {
    name: "Dr. Alok Mishra",
    email: "alok.mishra@university.edu",
    department: "CE",
    program: AcademicDeptPrograms.CE?.[1] ?? "", // M.Tech in Structural Engg
    password: "alokCE@321",
  },
];

export const seedStudents = async () => {
  try {
    await Student.deleteMany({});
    console.log("🧹 Cleared existing students");

    // Hash passwords and insert new records
    const studentsWithHashedPasswords = await Promise.all(
      studentData.map(async (student) => {
        const hashedPassword = await bcrypt.hash(student.password, 10);
        return {
          ...student,
          passwordHash: hashedPassword
        };
      })
    );

    await Student.insertMany(studentsWithHashedPasswords);9
    console.log("🎉 Successfully inserted student records!");

  } catch (error) {
    console.error("❌ Error seeding students:", error);
  }
};

export const seedFacultyAdvisors = async () => {
  try {
    await FacultyAdvisor.deleteMany({});
    console.log("🧹 Cleared existing faculty advisors");

    const advisorsWithHashedPasswords = await Promise.all(
      facultyAdvisorData.map(async (advisor) => {
        const hashedPassword = await bcrypt.hash(advisor.password, 10);
        return {
          ...advisor,
          passwordHash: hashedPassword,
        };
      })
    );

    await FacultyAdvisor.insertMany(advisorsWithHashedPasswords);
    console.log("🎉 Successfully inserted faculty advisor records!");
  } catch (error) {
    console.error("❌ Error seeding faculty advisors:", error);
  }
};



