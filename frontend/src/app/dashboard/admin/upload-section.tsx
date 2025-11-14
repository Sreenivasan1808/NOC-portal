"use client";

import type React from "react";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileUp, Check } from "lucide-react";
import { uploadRequestsCsvAction } from "./actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function UploadSection() {
  const [isDragActive, setIsDragActive] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState<string>("students");

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      setFileName(files[0].name);
      setFile(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("userType", userType);

    try {
      await uploadRequestsCsvAction(formData);
      alert("Upload successful!");
      setFileName(null);
      setFile(null);
    } catch (error) {
      console.error(error);
      alert("Upload failed. Check console for details.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle>Upload CSV Data</CardTitle>
        <CardDescription>Import CSV file with student/faculty/representative data</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">User type</label>
          <Select value={userType} onValueChange={setUserType}>
            <SelectTrigger>
              <SelectValue placeholder="Select user type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="students">Student</SelectItem>
              <SelectItem value="faculties">Faculties</SelectItem>
              <SelectItem value="representatives">Representatives</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors relative ${
            isDragActive
              ? "border-primary bg-primary/5"
              : "border-border bg-background hover:border-primary/50"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center gap-3">
            {fileName ? (
              <>
                <Check className="w-8 h-8 text-green-500" />
                <div>
                  <p className="font-medium text-foreground">{fileName}</p>
                  <p className="text-sm text-foreground-muted">
                    Ready to upload
                  </p>
                </div>
              </>
            ) : (
              <>
                <FileUp className="w-8 h-8 text-primary" />
                <div>
                  <p className="font-medium text-foreground">
                    Drag and drop your CSV file here
                  </p>
                  <p className="text-sm text-foreground-muted">
                    or click to browse
                  </p>
                </div>
              </>
            )}
          </div>

          <Input
            type="file"
            accept=".csv"
            className="hidden"
            id="csv-input"
            onChange={handleFileChange}
          />
          <label
            htmlFor="csv-input"
            className="absolute inset-0 cursor-pointer rounded-lg"
          />
        </div>

        <div className="flex gap-3 mt-6">
          <Button
            className="flex-1 hover:cursor-pointer"
            onClick={handleUpload}
            disabled={!file || isLoading}
          >
            {isLoading ? "Uploading..." : "Upload"}
          </Button>
          <Button
            variant="outline"
            className="border-border bg-transparent hover:cursor-pointer"
            onClick={() => {
              setFile(null);
              setFileName(null);
            }}
          >
            Clear
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
