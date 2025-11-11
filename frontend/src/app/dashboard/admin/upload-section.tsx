"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FileUp, Check } from "lucide-react"

export function UploadSection() {
  const [isDragActive, setIsDragActive] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true)
    } else if (e.type === "dragleave") {
      setIsDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)

    const files = e.dataTransfer.files
    if (files && files[0]) {
      setFileName(files[0].name)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name)
    }
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle>Upload CSV Data</CardTitle>
        <CardDescription>Import student and faculty advisor data in CSV format</CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors relative ${
            isDragActive ? "border-primary bg-primary/5" : "border-border bg-background hover:border-primary/50"
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
                  <p className="text-sm text-foreground-muted">Ready to upload</p>
                </div>
              </>
            ) : (
              <>
                <FileUp className="w-8 h-8 text-primary" />
                <div>
                  <p className="font-medium text-foreground">Drag and drop your CSV file here</p>
                  <p className="text-sm text-foreground-muted">or click to browse</p>
                </div>
              </>
            )}
          </div>

          <Input type="file" accept=".csv" className="hidden" id="csv-input" onChange={handleFileChange} />
          <label htmlFor="csv-input" className="absolute inset-0 cursor-pointer rounded-lg" />
        </div>

        <div className="flex gap-3 mt-6">
          <Button className="flex-1">Upload</Button>
          <Button variant="outline" className="border-border bg-transparent" onClick={() => setFileName(null)}>
            Clear
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
