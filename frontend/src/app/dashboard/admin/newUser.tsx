"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import axios from "axios";
import { getSession } from "@/lib/auth";
import { toast } from "sonner";

const departments = [
  "Architecture and Planning",
  "Bioscience and Engineering",
  "Chemical Engineering",
  "Chemistry",
  "Civil Engineering",
  "Computer Science & Engineering",
  "Department of Education",
  "Electrical Engineering",
  "Electronics & Communication Engineering",
  "Humanities, Arts and Social Sciences",
  "Materials Science and Engineering",
  "Mathematics",
  "Management Studies",
  "Mechanical Engineering",
  "Physics",
];

const repDepartments = {
  academic: departments,
  nonAcademic: [
    "Library",
    "Hostel Administration",
    "Accounts and Finance Department",
    "Training and Placement Cell",
    "Sports and Physical Education Department",
    "IT Services / Computer Centre",
    "Transport Department",
  ],
};

const programs = {
  "Architecture and Planning": [
    "Bachelor of Architecture (B.Arch.)",
    "Master of Planning (Urban Planning) (M.Plan.)",
    "Ph.D.",
  ],
  "Bioscience and Engineering": [
    "B.Tech Biotechnology",
    "M.Tech Bioengineering",
    "Ph.D.",
  ],
  "Chemical Engineering": [
    "B.Tech Chemical Engineering",
    "M.Tech Chemical Engineering",
    "Ph.D.",
  ],
  Chemistry: ["M.Sc. Chemistry", "Ph.D."],
  "Civil Engineering": [
    "B.Tech Civil Engineering",
    "M.Tech Environmental Engineering",
    "M.Tech Water Resources Engineering",
    "M.Tech Offshore Structures",
    "M.Tech Geotechnical Engineering",
    "M.Tech Traffic and Transportation Planning",
    "M.Tech Structural Engineering",
    "Ph.D.",
  ],
  "Computer Science & Engineering": [
    "B.Tech Computer Science & Engineering",
    "M.Tech Computer Science & Engineering",
    "M.Tech Computer Science & Engineering (Artificial Intelligence & Data Analytics)",
    "M.Tech Computer Science & Engineering (Information Security)",
    "Ph.D.",
  ],
  "Department of Education": [
    "4-year Integrated Teacher Education Programme (ITEP) B.Sc-B.Ed.",
    "Ph.D.",
  ],
  "Electrical Engineering": [
    "B.Tech Electrical & Electronics Engineering",
    "M.Tech Electric Vehicle Engineering",
    "M.Tech High Voltage Engineering",
    "M.Tech Industrial Power & Automation",
    "M.Tech Power Electronics",
    "M.Tech Power Systems",
    "M.Tech Instrumentation & Control Systems",
    "Ph.D.",
  ],
  "Electronics & Communication Engineering": [
    "B.Tech Electronics & Communication Engineering",
    "M.Tech Telecommunication",
    "M.Tech Signal Processing",
    "M.Tech Microelectronics & VLSI Design",
    "M.Tech Electronics Design & Technology",
    "Ph.D.",
  ],
  "Humanities, Arts and Social Sciences": ["Ph.D."],
  "Materials Science and Engineering": [
    "B.Tech Materials Science & Engineering",
    "M.Tech Nanotechnology",
    "M.Tech Materials Science & Technology",
    "Ph.D.",
  ],
  Mathematics: ["M.Sc. Mathematics", "Ph.D."],
  "Management Studies": ["Master of Business Administration (MBA)", "Ph.D."],
  "Mechanical Engineering": [
    "B.Tech Mechanical Engineering",
    "M.Tech Thermal Sciences",
    "M.Tech Manufacturing Technology",
    "M.Tech Machine Design",
    "M.Tech Industrial Engineering & Management",
    "M.Tech Energy Engineering & Management",
    "Ph.D.",
  ],
  Physics: ["M.Sc. Physics", "Ph.D."],
};

export default function NewUser() {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState("");
  const [dept, setDept] = useState("");

  // Student form fields
  const [studentName, setStudentName] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [facultyAdvisor, setFacultyAdvisor] = useState("");
  const [program, setProgram] = useState("");
  const [hosteler, setHosteler] = useState("");

  // Faculty form fields
  const [facultyName, setFacultyName] = useState("");
  const [facultyEmail, setFacultyEmail] = useState("");
  const [facultyProgram, setFacultyProgram] = useState("");

  // Representative form fields
  const [repName, setRepName] = useState("");
  const [repEmail, setRepEmail] = useState("");

  const handleSubmit = async () => {
    const formData = {
      type: type,
      department: dept,
    };

    // Collect data based on user type
    if (type === "student") {
      Object.assign(formData, {
        name: studentName,
        rollNumber,
        email: studentEmail,
        facultyAdvisor,
        program,
        hosteler,
      });
    } else if (type === "faculty") {
      Object.assign(formData, {
        name: facultyName,
        email: facultyEmail,
        program: facultyProgram,
      });
    } else if (type === "representative") {
      Object.assign(formData, {
        name: repName,
        email: repEmail,
      });
    }

    const session = await getSession();

    console.log("Form submitted:", formData);
    // TODO: Send formData to your API endpoint
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/user`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${session}`,
          },
        }
      );
      if (response.status == 200) toast.success("User created successfully!");
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
    } finally {
      handleCancel();
    }
  };

  const handleCancel = () => {
    setOpen(false);
    // Reset all form fields
    setType("");
    setDept("");
    setStudentName("");
    setRollNumber("");
    setStudentEmail("");
    setFacultyAdvisor("");
    setProgram("");
    setHosteler("");
    setFacultyName("");
    setFacultyEmail("");
    setFacultyProgram("");
    setRepName("");
    setRepEmail("");
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="hover:cursor-pointer">
            <Plus /> Add New User
          </Button>
        </DialogTrigger>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
          </DialogHeader>

          {/* User Type */}
          <div className="space-y-4 mt-4">
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue placeholder="Select user type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="faculty">Faculty</SelectItem>
                <SelectItem value="representative">Representative</SelectItem>
              </SelectContent>
            </Select>

            {/* Student */}
            {type === "student" && (
              <div className="space-y-3">
                <Input
                  placeholder="Name"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                />
                <Input
                  placeholder="Roll Number"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                />
                <Input
                  placeholder="Email"
                  type="email"
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                />
                <Input
                  placeholder="Faculty Advisor Name"
                  value={facultyAdvisor}
                  onChange={(e) => setFacultyAdvisor(e.target.value)}
                />

                {/* Department */}
                <Select value={dept} onValueChange={setDept}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Program */}
                {dept && (
                  <Select value={program} onValueChange={setProgram}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Program" />
                    </SelectTrigger>
                    <SelectContent>
                      {(programs[dept as keyof typeof programs] ?? []).map(
                        (p) => (
                          <SelectItem key={p} value={p}>
                            {p}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                )}

                {/* Hosteler */}
                <Select value={hosteler} onValueChange={setHosteler}>
                  <SelectTrigger>
                    <SelectValue placeholder="Hosteler?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Faculty */}
            {type === "faculty" && (
              <div className="space-y-3">
                <Input
                  placeholder="Name"
                  value={facultyName}
                  onChange={(e) => setFacultyName(e.target.value)}
                />
                <Input
                  placeholder="Email"
                  type="email"
                  value={facultyEmail}
                  onChange={(e) => setFacultyEmail(e.target.value)}
                />

                <Select value={dept} onValueChange={setDept}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {dept && (
                  <Select
                    value={facultyProgram}
                    onValueChange={setFacultyProgram}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Program" />
                    </SelectTrigger>
                    <SelectContent>
                      {(programs[dept as keyof typeof programs] ?? [])?.map(
                        (p) => (
                          <SelectItem key={p} value={p}>
                            {p}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                )}
              </div>
            )}

            {/* Representative */}
            {type === "representative" && (
              <div className="space-y-3">
                <Input
                  placeholder="Name"
                  value={repName}
                  onChange={(e) => setRepName(e.target.value)}
                />
                <Input
                  placeholder="Email"
                  type="email"
                  value={repEmail}
                  onChange={(e) => setRepEmail(e.target.value)}
                />

                {/* Academic / Non Academic */}
                <Select value={dept} onValueChange={setDept}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent>
                    {repDepartments.academic.map((d) => (
                      <SelectItem key={d} value={d}>
                        {d} (Academic)
                      </SelectItem>
                    ))}

                    {repDepartments.nonAcademic.map((d) => (
                      <SelectItem key={d} value={d}>
                        {d} (Non Academic)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2 pt-4">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!type}>
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
