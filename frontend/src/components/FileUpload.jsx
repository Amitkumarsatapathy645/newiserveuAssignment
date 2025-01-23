import React, { useState, useCallback, useEffect } from "react";
import {
  Upload,
  FileUp,
  Check,
  AlertCircle,
  Loader2,
  X,
  Download,
} from "lucide-react";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_FILE_TYPES = [
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

const Alert = ({ children, variant = "default" }) => {
  const bgColor =
    variant === "success"
      ? "bg-green-50 border-green-500"
      : variant === "destructive"
      ? "bg-red-50 border-red-500"
      : "bg-gray-50 border-gray-500";

  return (
    <div className={`p-4 rounded-lg border ${bgColor} mt-4`}>{children}</div>
  );
};

const Button = ({
  children,
  onClick,
  disabled,
  variant = "default",
  className = "",
}) => {
  const baseStyle =
    "px-4 py-2 rounded-md font-medium transition-colors duration-200";
  const variantStyles = {
    default: "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400",
    outline: "border border-gray-300 hover:bg-gray-50",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variantStyles[variant]} ${className} ${
        disabled ? "cursor-not-allowed opacity-50" : ""
      }`}
    >
      {children}
    </button>
  );
};

const ProgressBar = ({ value }) => (
  <div className="w-full bg-gray-200 rounded-full h-2.5">
    <div
      className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
      style={{ width: `${value}%` }}
    />
  </div>
);

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [status, setStatus] = useState(null);
  const [students, setStudents] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredStudents, setFilteredStudents] = useState([]);

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    const filtered = (students || []).filter(
      (student) =>
        student.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.id.toString().includes(searchTerm) ||
        student.address.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStudents(filtered);
  }, [searchTerm, students]);

  const validateFile = (file) => {
    if (!file) return "Please select a file";
    if (file.size > MAX_FILE_SIZE) return "File size exceeds 5MB limit";
    if (!ALLOWED_FILE_TYPES.includes(file.type))
      return "Invalid file type. Please upload an Excel (.xlsx) file";
    return null;
  };

  const showToast = (message, type = "default") => {
    setStatus({ type, message });
    setTimeout(() => setStatus(null), 3000);
  };

  const handleFileChange = useCallback((e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const error = validateFile(selectedFile);
    if (error) {
      showToast(error, "destructive");
      return;
    }

    setFile(selectedFile);
    setStatus(null);
    setUploadProgress(0);
  }, []);

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setUploadProgress(0);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:3000/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      showToast("File uploaded successfully!", "success");
      await fetchStudents();
      setFile(null);
    } catch (error) {
      console.error("Upload error:", error);
      showToast(
        error.message || "Error uploading file. Please try again.",
        "destructive"
      );
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDownloadHighScorers = async () => {
    if (downloading) return;

    setDownloading(true);
    try {
      showToast("Starting download...", "default");

      const response = await fetch(
        "http://localhost:3000/api/download/highscorers",
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error("Download failed");
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "high_scorers.csv";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(downloadUrl);
      showToast("Download completed successfully!", "success");
    } catch (error) {
      console.error("Download error:", error);
      showToast("Error downloading file. Please try again.", "destructive");
    } finally {
      setDownloading(false);
    }
  };

  const fetchStudents = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:3000/api/students");

      if (!response.ok) {
        throw new Error("Failed to fetch students");
      }

      const data = await response.json();
      setStudents(data);
      setFilteredStudents(data);
    } catch (error) {
      console.error("Error fetching students:", error);
      setError("Failed to load students. Please refresh the page.");
      showToast("Failed to load students", "destructive");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();

    const droppedFile = e.dataTransfer.files[0];
    if (!droppedFile) return;

    const error = validateFile(droppedFile);
    if (error) {
      showToast(error, "destructive");
      return;
    }

    setFile(droppedFile);
    setStatus(null);
    setUploadProgress(0);
  }, []);

  const handleFileClick = (e) => {
    e.stopPropagation();
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
      fileInput.value = ""; // Reset the input value
      fileInput.click();
    }
  };

  const handleExport = useCallback(() => {
    handleDownloadHighScorers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Student Data Management Iserveu
          </h1>
          <p className="text-lg text-gray-600">
            Upload and manage student records
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex flex-col items-center">
            <div className="w-full max-w-md">
              <div
                onClick={handleFileClick}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={`
                  flex flex-col items-center justify-center w-full h-64
                  border-2 border-dashed rounded-lg cursor-pointer
                  transition-colors duration-300
                  ${uploading ? "pointer-events-none" : ""}
                  ${
                    file
                      ? "border-green-400 bg-green-50"
                      : "border-gray-300 hover:bg-gray-50"
                  }
                `}
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {!file ? (
                    <>
                      <Upload className="w-12 h-12 mb-4 text-gray-500" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">
                        Excel files only (max 5MB)
                      </p>
                    </>
                  ) : (
                    <div className="flex flex-col items-center">
                      <FileUp className="w-12 h-12 mb-4 text-green-500" />
                      <p className="text-sm text-green-600 font-medium">
                        {file.name}
                      </p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setFile(null);
                        }}
                        className="mt-2 text-red-500 hover:text-red-700"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept=".xlsx"
                  onChange={handleFileChange}
                  disabled={uploading}
                />
              </div>

              {uploadProgress > 0 && (
                <div className="mt-4">
                  <ProgressBar value={uploadProgress} />
                  <p className="text-sm text-gray-600 text-center mt-2">
                    {uploadProgress}% uploaded
                  </p>
                </div>
              )}

              {status && (
                <Alert
                  variant={
                    status.type === "success" ? "success" : "destructive"
                  }
                >
                  <div className="flex items-center">
                    {status.type === "success" ? (
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                    )}
                    <span
                      className={
                        status.type === "success"
                          ? "text-green-700"
                          : "text-red-700"
                      }
                    >
                      {status.message}
                    </span>
                  </div>
                </Alert>
              )}

              <Button
                onClick={handleUpload}
                disabled={!file || uploading}
                className="w-full mt-4"
              >
                {uploading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </div>
                ) : (
                  "Upload File"
                )}
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Student Records</h2>
            <div className="flex space-x-4">
              <input
                type="text"
                placeholder="Search students..."
                className="px-4 py-2 border rounded-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button
                onClick={handleExport}
                variant="outline"
                className="flex items-center"
                disabled={downloading}
              >
                {downloading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Export High Scorers
                  </>
                )}
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4 mr-2" />
              <span>{error}</span>
            </Alert>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Address
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Mark
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {(filteredStudents || []).map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {student.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {student.student_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {student.address}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {student.mark}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredStudents && filteredStudents.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No students found
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
