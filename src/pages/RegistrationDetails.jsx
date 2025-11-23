import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Barcode from "react-barcode";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { FaPrint, FaCheckCircle, FaHome } from "react-icons/fa";

const API_BASE = "https://clc-backend-0isa.onrender.com";

const RegistrationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/students/${id}`);
        setStudent(res.data.data);
      } catch (error) {
        console.error("Error fetching student:", error);
        toast.error("Unable to fetch registration details.");
        navigate("/registration");
      } finally {
        setLoading(false);
      }
    };
    fetchStudent();
  }, [id, navigate]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
          <p className="text-xl font-semibold text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-semibold text-red-600">Registration not found!</p>
          <button
            onClick={() => navigate("/registration")}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Go to Registration
          </button>
        </div>
      </div>
    );
  }

  const regNo = student.registrationNo || id;
  const dob = student.dateOfBirth
    ? new Date(student.dateOfBirth).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).split('/').reverse().join('-')
    : "";

  const submissionDate = student.createdAt
    ? new Date(student.createdAt).toLocaleString("en-IN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).replace(/(\d+)\/(\d+)\/(\d+),/, "$3-$2-$1")
    : "";

  const printDate = new Date()
    .toLocaleDateString("en-IN", {
      year: "2-digit",
      month: "2-digit",
      day: "2-digit",
    })
    .split("/")
    .reverse()
    .join("-");

  const photoUrl = student.documents?.photo
    ? `${API_BASE}${student.documents.photo}`
    : null;

  const signatureUrl = student.documents?.signature
    ? `${API_BASE}${student.documents.signature}`
    : null;

  const displayState = student.state === "Uttar Pradesh" ? "UP" : student.state || "";

  return (
    <>
      <style>{`
  @media print {
    html, body {
      width: 210mm;
      height: 297mm;
      margin: 0;
      padding: 0;
      background: #ffffff;
    }

    body * {
      visibility: hidden;
    }

    #printable-area,
    #printable-area * {
      visibility: visible;
    }

    #printable-area {
      position: relative;
      left: 0;
      top: 0;
      width: 100%;
      page-break-after: avoid;
    }

    .no-print {
      display: none !important;
    }

    @page {
      size: A4 portrait;
      margin: 10mm;
    }

    * {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
  }

  /* --- LAYOUT / SIZING TUNED FOR 1-PAGE A4 --- */

  .registration-form {
    width: 190mm;                    /* content area inside 10mm margins */
    margin: 0 auto;
    background: white;
    font-family: Arial, sans-serif;
    box-sizing: border-box;
    padding: 5mm 5mm 4mm 5mm;        /* compact padding so everything fits */
  }

  .registration-form * {
    box-sizing: border-box;
  }

  .registration-form table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;             /* prevent columns from blowing up */
  }

  .registration-form td,
  .registration-form th {
    border: 1px solid #000;
    padding: 4px;
    font-size: 11px;                 /* slightly smaller so all fits */
    word-wrap: break-word;
  }

  .registration-form .section-header {
    background-color: #333;
    color: white;
    font-weight: bold;
    text-align: center;
    padding: 4px;
    font-size: 12px;
  }

  .registration-form .label-cell {
    background-color: #f5f5f5;
    font-weight: 600;
    width: 22%;
  }

  .registration-form .header-section {
    border: 2px solid #000;
    padding: 6px;
    margin-bottom: 4px;
  }

  .registration-form .college-title {
    color: #B8860B;
    font-size: 20px;
    font-weight: bold;
    text-align: center;
    margin: 0;
    font-family: 'Times New Roman', serif;
  }

  .registration-form .college-code {
    color: #B8860B;
    font-size: 14px;
    font-weight: bold;
    text-align: center;
    margin: 2px 0;
  }

  .registration-form .college-address {
    color: #B8860B;
    font-size: 12px;
    font-weight: bold;
    text-align: center;
    margin: 2px 0;
  }

  .registration-form .reg-barcode-row td {
    padding: 4px;
  }

  .registration-form .education-table th {
    background-color: #f5f5f5;
    font-weight: 600;
    font-size: 10px;
    text-align: left;
  }

  .registration-form .education-table .qual-label {
    background-color: #f5f5f5;
    font-weight: 600;
  }

  .registration-form .document-cell {
    text-align: center;
    vertical-align: top;
    padding: 8px;
  }

  .registration-form .document-img {
    max-width: 110px;
    max-height: 110px;               /* smaller photo/sign so they fit */
    margin: 6px auto;
    display: block;
  }

  .registration-form .declaration-text {
    text-align: justify;
    font-size: 10px;
    line-height: 1.4;
    padding: 8px;
  }

  .registration-form .footer-dates {
    font-size: 10px;
    padding: 6px 8px;
  }
`}</style>


      <div className="min-h-screen bg-gray-50 py-8 px-4">
        {/* Success Banner - Only visible on screen */}
        {/* <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto mb-6 no-print"
        >
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl shadow-lg p-6 flex items-center gap-4">
            <div className="bg-white bg-opacity-20 p-4 rounded-full">
              <FaCheckCircle className="text-4xl" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-1">Registration Successful!</h2>
              <p className="text-green-50">
                Registration No: <strong>{regNo}</strong>
              </p>
            </div>
            <button
              onClick={() => navigate("/")}
              className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition-all flex items-center gap-2"
            >
              <FaHome />
              Home
            </button>
          </div>
        </motion.div> */}

        {/* Printable Form */}
        <div id="printable-area" className="registration-form" style={{ padding: "10px" }}>
          {/* Header with Logo, Title, and Barcode */}
          <div className="header-section">
            <table style={{ border: "none" }}>
              <tbody>
                <tr>
                  <td
                    style={{
                      border: "none",
                      width: "120px",
                      textAlign: "center",
                      verticalAlign: "middle",
                    }}
                  >
                    <img
                      src="/logo.png"
                      alt="Logo"
                      style={{ width: "100px", height: "100px" }}
                    />
                  </td>
                  <td style={{ border: "none", textAlign: "center", verticalAlign: "middle" }}>
                    <div className="college-title">CITY COLLEGE OF MANAGEMENT</div>
                    <div className="college-code">COLLEGE CODE - 290044</div>
                    <div className="college-address">
                      Tiwariganj, Chinhat, Ayodhya Road, Lucknow
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Registration No and Barcode Row */}
          <table>
            <tbody>
              <tr className="reg-barcode-row">
                <td className="label-cell" style={{ width: "20%" }}>
                  <strong>Registration No</strong>
                </td>
                <td style={{ width: "40%" }}>{regNo}</td>
                <td className="label-cell" style={{ width: "15%" }}>
                  <strong>Barcode :</strong>
                </td>
                <td style={{ width: "25%", textAlign: "center", padding: "5px" }}>
                  <Barcode value={regNo} width={1.5} height={50} fontSize={12} />
                </td>
              </tr>
            </tbody>
          </table>

          {/* Personal Details Section */}
          <div className="section-header">PERSONAL DETAILS</div>
          <table>
            <tbody>
              <tr>
                <td className="label-cell">
                  <strong>Student Name</strong>
                </td>
                <td>{student.studentName}</td>
                <td className="label-cell">
                  <strong>Date of Birth</strong>
                </td>
                <td>{dob}</td>
              </tr>
              <tr>
                <td className="label-cell">
                  <strong>Mother Name</strong>
                </td>
                <td>{student.motherName}</td>
                <td className="label-cell">
                  <strong>Gender</strong>
                </td>
                <td>{student.gender}</td>
              </tr>
              <tr>
                <td className="label-cell">
                  <strong>Father Name</strong>
                </td>
                <td>{student.fatherName}</td>
                <td className="label-cell">
                  <strong>Category</strong>
                </td>
                <td>{student.category}</td>
              </tr>
              <tr>
                <td className="label-cell">
                  <strong>Phone No</strong>
                </td>
                <td>{student.phone}</td>
                <td className="label-cell">
                  <strong>Nationality</strong>
                </td>
                <td>{student.nationality || "Indian"}</td>
              </tr>
              <tr>
                <td className="label-cell">
                  <strong>Sub Category</strong>
                </td>
                <td colSpan="3">{student.subCategory || "Not Applicable"}</td>
              </tr>
            </tbody>
          </table>

          {/* Education Details Section */}
          <div className="section-header">EDUCATION DETAILS</div>
          <table className="education-table">
            <thead>
              <tr>
                <th style={{ width: "15%" }}>Qualification</th>
                <th style={{ width: "18%" }}>Board/University Name</th>
                <th style={{ width: "8%" }}>Year</th>
                <th style={{ width: "13%" }}>Marksheet No</th>
                <th style={{ width: "10%" }}>Rollno</th>
                <th style={{ width: "10%" }}>Total Marks</th>
                <th style={{ width: "12%" }}>Obtained Marks</th>
                <th style={{ width: "10%" }}>Marks Per(%)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="qual-label">
                  <strong>10 Th or Equivalent</strong>
                </td>
                <td>{student.tenthBoard || ""}</td>
                <td>{student.tenthYear || ""}</td>
                <td>{student.tenthMarksheetNo || ""}</td>
                <td>{student.tenthRollNo || ""}</td>
                <td>{student.tenthTotalMarks || ""}</td>
                <td>{student.tenthMarksObtained || ""}</td>
                <td>{student.tenthPercentage || ""}</td>
              </tr>
              <tr>
                <td className="qual-label">
                  <strong>12 Th or Equivalent</strong>
                </td>
                <td>{student.twelfthBoard || ""}</td>
                <td>{student.twelfthYear || ""}</td>
                <td>{student.twelfthMarksheetNo || ""}</td>
                <td>{student.twelfthRollNo || ""}</td>
                <td>{student.twelfthTotalMarks || ""}</td>
                <td>{student.twelfthMarksObtained || ""}</td>
                <td>{student.twelfthPercentage || ""}</td>
              </tr>
              <tr>
                <td className="qual-label">
                  <strong>Graduation</strong>
                </td>
                <td>{student.graduationBoard || ""}</td>
                <td>{student.graduationYear || ""}</td>
                <td>{student.graduationMarksheetNo || ""}</td>
                <td>{student.graduationRollNo || ""}</td>
                <td>{student.graduationTotalMarks || ""}</td>
                <td>{student.graduationMarksObtained || ""}</td>
                <td>{student.graduationPercentage || ""}</td>
              </tr>
              <tr>
                <td className="qual-label">
                  <strong>other</strong>
                </td>
                <td>{student.otherBoard || ""}</td>
                <td>{student.otherYear || ""}</td>
                <td>{student.otherMarksheetNo || ""}</td>
                <td>{student.otherRollNo || ""}</td>
                <td>{student.otherTotalMarks || ""}</td>
                <td>{student.otherMarksObtained || ""}</td>
                <td>{student.otherPercentage || ""}</td>
              </tr>
            </tbody>
          </table>

          {/* Communication Details Section */}
          <div className="section-header">COMMUNICATION/CORRESPONDANCE DETAILS</div>
          <table>
            <tbody>
              <tr>
                <td className="label-cell" style={{ width: "25%" }}>
                  <strong>Address</strong>
                </td>
                <td colSpan="3">{student.address}</td>
              </tr>
              <tr>
                <td className="label-cell">
                  <strong>District</strong>
                </td>
                <td style={{ width: "25%" }}>{student.district}</td>
                <td className="label-cell" style={{ width: "25%" }}>
                  <strong>State</strong>
                </td>
                <td style={{ width: "25%" }}>{displayState}</td>
              </tr>
              <tr>
                <td className="label-cell">
                  <strong>Pin Code</strong>
                </td>
                <td>{student.pincode}</td>
                <td className="label-cell">
                  <strong>Email id</strong>
                </td>
                <td>{student.email}</td>
              </tr>
            </tbody>
          </table>

          {/* Document Uploaded Section */}
          <div className="section-header">DOCUMENT UPLOADED</div>
          <table>
            <tbody>
              <tr>
                <td className="document-cell" style={{ width: "50%" }}>
                  <strong>Photograph</strong>
                  <br />
                  {photoUrl ? (
                    <img
                      src={photoUrl}
                      alt="Photograph"
                      className="document-img"
                      crossOrigin="anonymous"
                    />
                  ) : (
                    <div
                      style={{
                        width: "150px",
                        height: "150px",
                        border: "1px solid #ccc",
                        margin: "10px auto",
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
                <td className="document-cell" style={{ width: "50%" }}>
                  <strong>Signature</strong>
                  <br />
                  {signatureUrl ? (
                    <img
                      src={signatureUrl}
                      alt="Signature"
                      className="document-img"
                      crossOrigin="anonymous"
                    />
                  ) : (
                    <div
                      style={{
                        width: "150px",
                        height: "150px",
                        border: "1px solid #ccc",
                        margin: "10px auto",
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

          {/* Declaration Section */}
          <div className="section-header">DECLARATION</div>
          <table>
            <tbody>
              <tr>
                <td className="declaration-text">
                  मैं प्रमाणित करता हूँ कि ऑनलाइन आवेदन में भरी गयी समस्त प्रविष्टियों मेरे पास
                  उपलब्ध अभिलेखों पर आधारित है एवं मेरे व्यक्तिगत जानकारी में सही एवं सत्य है।
                  आवेदन करने की तिथि को मेरे पास ऑनलाइन आवेदन में उल्लेखित समस्त
                  अंकप्रमाणपत्र आरक्षण एवं विशेष आरक्षण सम्बन्धी प्रमाण पत्र उपलब्ध है।
                  ऑनलाइन आवेदन पत्र में अपलोड की गयी मेरी फोटो स्वच्छ स्पष्ट एवं दिये गये
                  निर्देशानुसार हैं। मुझे विज्ञापन की दी गयी समस्त शर्त मान्य हैं। यदि परीक्षा
                  के पूर्व अथवा बाद में किसी भी स्तर पर जांचोपरान्त ऑनलाइन आवेदन पत्र में कोई
                  भी विवरण त्रुटिपूर्ण असत्य पाया जाता है तो उसका समस्त उत्तरदायित्व मेरा होगा
                  और सम्बन्धित अधिकारी को मेरा अभ्यर्थन निरस्त करने तथा मेरे विरुद्ध वैधानिक
                  कार्यवाही करने का अधिकार होगा।
                </td>
              </tr>
            </tbody>
          </table>

          {/* Footer with Dates */}
          <table>
            <tbody>
              <tr>
                <td className="footer-dates">
                  <strong>Submission Date:</strong>
                  {submissionDate}
                </td>
                <td className="footer-dates" style={{ textAlign: "right" }}>
                  <strong>Print Date :</strong> {printDate}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Print Button - Only visible on screen */}
        <div className="text-center mt-8 no-print">
          <button
            onClick={handlePrint}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-bold text-lg shadow-lg flex items-center gap-3 mx-auto transition-all"
          >
            <FaPrint className="text-2xl" />
            print
          </button>
        </div>
      </div>
    </>
  );
};

export default RegistrationDetails;