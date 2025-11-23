import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaArrowLeft,
  FaPrint,
  FaSignOutAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
} from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";

const AdminStudentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudentDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchStudentDetails = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        navigate("/admin/login");
        return;
      }

      const response = await axios.get(
        `http://localhost:5000/api/admin/students/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setStudent(response.data.student);
      }
    } catch (error) {
      console.error("Error fetching student details:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("adminToken");
        navigate("/admin/login");
        toast.error("Session expired. Please login again.");
      } else {
        toast.error("Failed to fetch student details");
        navigate("/admin/students");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/admin/students/${id}/status`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        toast.success("Status updated successfully");
        setStudent({ ...student, status: newStatus });
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminData");
    toast.success("Logged out successfully");
    navigate("/admin/login");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 print:bg-white">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-amber-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 print:bg-white">
        <p className="text-slate-600">Student not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 print:bg-white">
      {/* Top Navigation - Hidden in print */}
      <nav className="bg-white shadow-sm border-b border-slate-200 print:hidden">
        <div className="mx-auto max-w-6xl px-4 lg:px-6">
          <div className="flex justify-between items-center py-3">
            <div className="flex items-center gap-3">
              <Link
                to="/admin/students"
                className="text-slate-500 hover:text-slate-800"
              >
                <FaArrowLeft size={18} />
              </Link>
              <div>
                <h1 className="text-lg md:text-xl font-semibold text-slate-900">
                  Student Registration Form
                </h1>
                <p className="text-xs text-slate-500">
                  Print-ready format matching official layout
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-full border border-red-500/40 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-500/20 transition"
            >
              <FaSignOutAlt className="text-sm" />
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-5xl px-3 md:px-4 lg:px-6 py-6 print:p-4 print:max-w-full">
        {/* Action Buttons - Hidden in print */}
        <div className="mb-4 flex flex-wrap gap-3 print:hidden">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-amber-600 transition"
          >
            <FaPrint />
            Print / Download PDF
          </button>
          {/* {student.status !== "Approved" && (
            <button
              onClick={() => handleStatusChange("Approved")}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 transition"
            >
              <FaCheckCircle />
              Approve
            </button>
          )}
          {student.status !== "Rejected" && (
            <button
              onClick={() => handleStatusChange("Rejected")}
              className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition"
            >
              <FaTimesCircle />
              Reject
            </button>
          )}
          {student.status !== "Pending" && (
            <button
              onClick={() => handleStatusChange("Pending")}
              className="inline-flex items-center gap-2 rounded-lg bg-yellow-500 px-4 py-2 text-sm font-semibold text-white hover:bg-yellow-600 transition"
            >
              <FaClock />
              Mark as Pending
            </button>
          )} */}
        </div>

        {/* PRINT AREA - Exact PDF Format */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
            @media print {
              @page {
                size: A4;
                margin: 0.5cm;
              }
              
              html, body {
                height: auto;
                overflow: visible;
                print-color-adjust: exact;
                -webkit-print-color-adjust: exact;
                background: white !important;
              }
              
              body > div:not(#root) {
                display: none;
              }
              
              nav, .print\\:hidden {
                display: none !important;
              }
              
              #print-area {
                display: block !important;
                position: relative;
                width: 100%;
                margin: 0;
                padding: 0;
              }
              
              #print-area * {
                visibility: visible !important;
              }
              
              table {
                page-break-inside: auto;
              }
              
              tr {
                page-break-inside: avoid;
                page-break-after: auto;
              }
            }
            
            @media screen {
              #print-area {
                display: block;
              }
            }
          `,
          }}
        />

        <div id="print-area">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white shadow-md print:shadow-none"
            style={{
              border: "3px solid #000",
              padding: "10px",
              fontFamily: "Arial, sans-serif",
              fontSize: "12px",
            }}
          >
            {/* Header with Logo */}
            <div
              className="flex items-center justify-between mb-4 p-auto pl-10"
              style={{ borderBottom: "2px solid #000" }}
            >
              <div className="flex items-center gap-4">
                <div
                  style={{
                    width: "100px",
                    height: "100px",
                    // border: "2px solid #000",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <div style={{ textAlign: "center", marginBottom: "6px" }}>
                    <img
                      src="/logo.png"
                      alt="College Logo"
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "contain",
                        display: "block",
                        margin: "0 auto",
                      }}
                    />
                  </div>
                </div>
                <div style={{ textAlign: "center", flex: 1 }}>
                  <h1
                    style={{
                      fontSize: "29px",
                      fontWeight: "bold",
                      color: "#B8860B",
                      letterSpacing: "2px",
                      margin: 0,
                    }}
                  >
                    CITY COLLEGE OF MANAGEMENT
                  </h1>
                  <div
                    style={{
                      fontSize: "16px",
                      fontWeight: "bold",
                      color: "#000",
                      marginTop: "2px",
                    }}
                  >
                    COLLEGE CODE - 290044
                  </div>
                  <div
                    style={{
                      fontSize: "18px",
                      fontWeight: "bold",
                      color: "#B8860B",
                      marginTop: "2px",
                    }}
                  >
                    Tiwariganj, Chinhat, Ayodhya Road, Lucknow
                  </div>
                </div>
              </div>
            </div>

            {/* Registration Number Row */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "10px",
                marginBottom: "10px",
                border: "2px solid #000",
              }}
            >
              <div
                style={{
                  padding: "4px",
                  borderRight: "2px solid #000",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <span style={{ fontWeight: "bold" }}>RegistrationNo</span>
                <span style={{ marginLeft: "10px" }}>
                  {student.registrationNo || ""}
                </span>
              </div>
              <div
                style={{
                  padding: "4px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ fontWeight: "bold" }}>Barcode:</span>
                <div
                  style={{
                    width: "200px",
                    height: "30px",
                    border: "1px solid #000",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background:
                      "repeating-linear-gradient(90deg, #000 0px, #000 2px, #fff 2px, #fff 4px)",
                  }}
                ></div>
              </div>
            </div>

            {/* PERSONAL DETAILS Section */}
            <div style={{ marginBottom: "10px" }}>
              <div
                style={{
                  backgroundColor: "#4a5568",
                  color: "#fff",
                  padding: "6px 10px",
                  fontWeight: "bold",
                  fontSize: "13px",
                  textAlign: "center",
                }}
              >
                PERSONAL DETAILS
              </div>
              <table
                style={{
                  width: "100%",
                  border: "2px solid #000",
                  borderCollapse: "collapse",
                }}
              >
                <tbody>
                  <tr>
                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "6px 10px",
                        fontWeight: "bold",
                        width: "25%",
                        backgroundColor: "#f7fafc",
                      }}
                    >
                      Student Name
                    </td>
                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "6px 10px",
                        width: "25%",
                      }}
                    >
                      {student.studentName || student.fullName || ""}
                    </td>
                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "6px 10px",
                        fontWeight: "bold",
                        width: "25%",
                        backgroundColor: "#f7fafc",
                      }}
                    >
                      Date of Birth
                    </td>
                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "6px 10px",
                        width: "25%",
                      }}
                    >
                      {formatDate(student.dateOfBirth)}
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "6px 10px",
                        fontWeight: "bold",
                        backgroundColor: "#f7fafc",
                      }}
                    >
                      Mother Name
                    </td>
                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "6px 10px",
                      }}
                    >
                      {student.motherName || ""}
                    </td>
                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "6px 10px",
                        fontWeight: "bold",
                        backgroundColor: "#f7fafc",
                      }}
                    >
                      Gender
                    </td>
                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "6px 10px",
                      }}
                    >
                      {student.gender || ""}
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "6px 10px",
                        fontWeight: "bold",
                        backgroundColor: "#f7fafc",
                      }}
                    >
                      Father Name
                    </td>
                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "6px 10px",
                      }}
                    >
                      {student.fatherName || ""}
                    </td>
                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "6px 10px",
                        fontWeight: "bold",
                        backgroundColor: "#f7fafc",
                      }}
                    >
                      Category
                    </td>
                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "6px 10px",
                      }}
                    >
                      {student.category || ""}
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "6px 10px",
                        fontWeight: "bold",
                        backgroundColor: "#f7fafc",
                      }}
                    >
                      Phone No
                    </td>
                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "6px 10px",
                      }}
                    >
                      {student.phone || ""}
                    </td>
                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "6px 10px",
                        fontWeight: "bold",
                        backgroundColor: "#f7fafc",
                      }}
                    >
                      Adhar Number
                    </td>
                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "6px 10px",
                      }}
                    >
                      {student.aadharNumber || ""}
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "6px 10px",
                        fontWeight: "bold",
                        backgroundColor: "#f7fafc",
                      }}
                    >
                      Sub Category
                    </td>
                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "6px 10px",
                      }}
                    >
                      {student.subCategory || ""}
                    </td>
                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "6px 10px",
                        fontWeight: "bold",
                        backgroundColor: "#f7fafc",
                      }}
                    >
                      Father Contact no.
                    </td>
                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "6px 10px",
                      }}
                    >
                      {student.fatherContact || ""}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* EDUCATION DETAILS Section */}
            <div style={{ marginBottom: "10px" }}>
              <div
                style={{
                  backgroundColor: "#4a5568",
                  color: "#fff",
                  padding: "6px 10px",
                  fontWeight: "bold",
                  fontSize: "13px",
                  textAlign: "center",
                }}
              >
                EDUCATION DETAILS
              </div>
              <table
                style={{
                  width: "100%",
                  border: "2px solid #000",
                  borderCollapse: "collapse",
                }}
              >
                <thead>
                  <tr style={{ backgroundColor: "#e2e8f0" }}>
                    <th
                      style={{
                        border: "1px solid #000",
                        padding: "6px 10px",
                        fontWeight: "bold",
                        textAlign: "left",
                      }}
                    >
                      Qualification
                    </th>
                    <th
                      style={{
                        border: "1px solid #000",
                        padding: "3px 5px",
                        fontWeight: "bold",
                        textAlign: "left",
                      }}
                    >
                      Board/University
                      <br />
                      Name
                    </th>
                    <th
                      style={{
                        border: "1px solid #000",
                        padding: "6px 10px",
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                    >
                      Year
                    </th>
                    <th
                      style={{
                        border: "1px solid #000",
                        padding: "6px 10px",
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                    >
                      Marksheet
                      <br />
                      No
                    </th>
                    <th
                      style={{
                        border: "1px solid #000",
                        padding: "6px 10px",
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                    >
                      Rollno
                    </th>
                    <th
                      style={{
                        border: "1px solid #000",
                        padding: "6px 10px",
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                    >
                      Total
                      <br />
                      Marks
                    </th>
                    <th
                      style={{
                        border: "1px solid #000",
                        padding: "6px 10px",
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                    >
                      Obtained
                      <br />
                      Marks
                    </th>
                    <th
                      style={{
                        border: "1px solid #000",
                        padding: "6px 10px",
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                    >
                      Marks
                      <br />
                      Per(%)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "6px 10px",
                        fontWeight: "bold",
                      }}
                    >
                      10 Th or
                      <br />
                      Equivalent
                    </td>
                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "6px 10px",
                      }}
                    >
                      {student.tenthBoard || ""}
                    </td>
                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "6px 10px",
                        textAlign: "center",
                      }}
                    >
                      {student.tenthYear || ""}
                    </td>
                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "6px 10px",
                        textAlign: "center",
                      }}
                    >
                      {student.tenthMarksheetNo || ""}
                    </td>
                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "6px 10px",
                        textAlign: "center",
                      }}
                    >
                      {student.tenthRollNo || ""}
                    </td>
                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "6px 10px",
                        textAlign: "center",
                      }}
                    >
                      {student.tenthTotalMarks || ""}
                    </td>
                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "6px 10px",
                        textAlign: "center",
                      }}
                    >
                      {student.tenthMarksObtained || ""}
                    </td>
                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "6px 10px",
                        textAlign: "center",
                      }}
                    >
                      {student.tenthPercentage || ""}%
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "6px 10px",
                        fontWeight: "bold",
                      }}
                    >
                      12 Th or
                      <br />
                      Equivalent
                    </td>
                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "6px 10px",
                      }}
                    >
                      {student.twelfthBoard || ""}
                    </td>
                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "6px 10px",
                        textAlign: "center",
                      }}
                    >
                      {student.twelfthYear || ""}
                    </td>
                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "6px 10px",
                        textAlign: "center",
                      }}
                    >
                      {student.twelfthMarksheetNo || ""}
                    </td>
                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "6px 10px",
                        textAlign: "center",
                      }}
                    >
                      {student.twelfthRollNo || ""}
                    </td>
                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "6px 10px",
                        textAlign: "center",
                      }}
                    >
                      {student.twelfthTotalMarks || ""}
                    </td>
                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "6px 10px",
                        textAlign: "center",
                      }}
                    >
                      {student.twelfthMarksObtained || ""}
                    </td>
                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "6px 10px",
                        textAlign: "center",
                      }}
                    >
                      {student.twelfthPercentage || ""}%
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "6px 10px",
                        fontWeight: "bold",
                      }}
                    >
                      Graduation
                    </td>
                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "6px 10px",
                      }}
                    >
                      {student.graduationBoard || ""}
                    </td>
                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "6px 10px",
                        textAlign: "center",
                      }}
                    >
                      {student.graduationYear || ""}
                    </td>
                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "6px 10px",
                        textAlign: "center",
                      }}
                    >
                      {student.graduationMarksheetNo || ""}
                    </td>
                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "6px 10px",
                        textAlign: "center",
                      }}
                    >
                      {student.graduationRollNo || ""}
                    </td>
                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "6px 10px",
                        textAlign: "center",
                      }}
                    >
                      {student.graduationTotalMarks || ""}
                    </td>
                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "6px 10px",
                        textAlign: "center",
                      }}
                    >
                      {student.graduationMarksObtained || ""}
                    </td>
                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "6px 10px",
                        textAlign: "center",
                      }}
                    >
                      {student.graduationPercentage || ""}%
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "6px 10px",
                        fontWeight: "bold",
                      }}
                    >
                      other
                    </td>
                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "6px 10px",
                      }}
                    ></td>
                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "6px 10px",
                      }}
                    ></td>
                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "6px 10px",
                      }}
                    ></td>
                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "6px 10px",
                      }}
                    ></td>
                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "6px 10px",
                      }}
                    ></td>
                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "6px 10px",
                      }}
                    ></td>
                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "6px 10px",
                      }}
                    ></td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* COMMUNICATION/CORRESPONDANCE DETAILS Section */}
            <div style={{ marginBottom: "10px" }}>
              <div
                style={{
                  backgroundColor: "#4a5568",
                  color: "#fff",
                  padding: "6px 10px",
                  fontWeight: "bold",
                  fontSize: "13px",
                  textAlign: "center",
                }}
              >
                COMMUNICATION/CORRESPONDANCE DETAILS
              </div>
              <table
                style={{
                  width: "100%",
                  border: "2px solid #000",
                  borderCollapse: "collapse",
                }}
              >
                <tbody>
                  <tr>
                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "6px 10px",
                        fontWeight: "bold",
                        width: "25%",
                        backgroundColor: "#f7fafc",
                      }}
                    >
                      Address
                    </td>
                    <td
                      colSpan={3}
                      style={{
                        border: "1px solid #000",
                        padding: "6px 10px",
                      }}
                    >
                      {student.address || ""}
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "6px 10px",
                        fontWeight: "bold",
                        backgroundColor: "#f7fafc",
                      }}
                    >
                      District
                    </td>
                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "6px 10px",
                        width: "25%",
                      }}
                    >
                      {student.district || ""}
                    </td>
                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "6px 10px",
                        fontWeight: "bold",
                        width: "25%",
                        backgroundColor: "#f7fafc",
                      }}
                    >
                      State
                    </td>
                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "6px 10px",
                        width: "25%",
                      }}
                    >
                      {student.state || ""}
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "6px 10px",
                        fontWeight: "bold",
                        backgroundColor: "#f7fafc",
                      }}
                    >
                      Pin Code
                    </td>
                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "6px 10px",
                      }}
                    >
                      {student.pincode || ""}
                    </td>
                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "6px 10px",
                        fontWeight: "bold",
                        backgroundColor: "#f7fafc",
                      }}
                    >
                      Email id
                    </td>
                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "6px 10px",
                      }}
                    >
                      {student.email || ""}
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "6px 10px",
                        fontWeight: "bold",
                        backgroundColor: "#f7fafc",
                      }}
                    >
                      Pan/Voter id Number
                    </td>
                    <td
                      colSpan={3}
                      style={{
                        border: "1px solid #000",
                        padding: "6px 10px",
                      }}
                    >
                      {student.panVoterId || ""}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* DOCUMENT UPLOADED Section */}
            <div>
              <div
                style={{
                  backgroundColor: "#4a5568",
                  color: "#fff",
                  padding: "6px 5px",
                  fontWeight: "bold",
                  fontSize: "13px",
                  textAlign: "center",
                }}
              >
                DOCUMENT UPLOADED
              </div>
              <table
                style={{
                  width: "100%",
                  border: "2px solid #000",
                  borderCollapse: "collapse",
                }}
              >
                <tbody>
                  <tr>
                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "5px",
                        width: "50%",
                        height: "200px",
                        textAlign: "center",
                        verticalAlign: "top",
                      }}
                    >
                      <div style={{ fontWeight: "bold", marginBottom: "10px" }}>
                        Photograph
                      </div>
                      {student.documents?.photo ? (
                        <img
                          src={`${import.meta.env.VITE_API_URL}${
                            student.documents.photo
                          }`}
                          alt="Student Photo"
                          style={{
                            maxWidth: "120px",
                            maxHeight: "160px",
                            objectFit: "contain",
                            margin: "0 auto",
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: "120px",
                            height: "160px",
                            border: "1px dashed #ccc",
                            margin: "0 auto",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#999",
                          }}
                        >
                          No Photo
                        </div>
                      )}
                    </td>
                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "10px",
                        width: "50%",
                        height: "200px",
                        textAlign: "center",
                        verticalAlign: "top",
                      }}
                    >
                      <div style={{ fontWeight: "bold", marginBottom: "10px" }}>
                        Signature
                      </div>
                      {student.documents?.signature ? (
                        <img
                          src={`${import.meta.env.VITE_API_URL}${
                            student.documents.signature
                          }`}
                          alt="Student Signature"
                          style={{
                            maxWidth: "200px",
                            maxHeight: "80px",
                            objectFit: "contain",
                            margin: "0 auto",
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: "200px",
                            height: "80px",
                            border: "1px dashed #ccc",
                            margin: "0 auto",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#999",
                          }}
                        >
                          No Signature
                        </div>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Footer Space */}
            <div
              style={{
                height: "60px",
                border: "2px solid #000",
                borderTop: "none",
                backgroundColor: "#fff",
              }}
            ></div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminStudentDetail;
