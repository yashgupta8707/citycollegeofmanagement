import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Barcode from "react-barcode";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import {
  FaDownload,
  FaPrint,
  FaCheckCircle,
  FaHome,
  FaFileAlt,
} from "react-icons/fa";
import { useReactToPrint } from "react-to-print";

const API_BASE = "https://clc-backend-0isa.onrender.com"; // Update with your production URL

const RegistrationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const printRef = useRef(null);

  // Fetch student from backend using ID
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/students/${id}`);
        setStudent(res.data.data);
      } catch (error) {
        console.error("Error fetching student:", error);
        toast.error("Unable to fetch registration details. Please try again.");
        navigate("/registration");
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id, navigate]);

  // Print handler - UPDATED API
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Registration_${student?.registrationNo || id}`,
    onAfterPrint: () => toast.success("Document printed successfully!"),
  });

  // Download as PDF (using print dialog)
  const handleDownload = () => {
    toast.info("Please use 'Save as PDF' option in the print dialog.");
    handlePrint();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
          <p className="text-xl font-semibold text-gray-700">Loading registration details...</p>
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

  // Helpers
  const dob = student.dateOfBirth
    ? new Date(student.dateOfBirth).toLocaleDateString("en-GB").replace(/\//g, "-")
    : "";

  const submissionDate = student.createdAt
    ? new Date(student.createdAt).toLocaleString("en-GB")
    : "";

  const printDate = new Date().toLocaleDateString("en-GB");

  const photoUrl = student.documents?.photo
    ? `${API_BASE}${student.documents.photo}`
    : null;

  const signatureUrl = student.documents?.signature
    ? `${API_BASE}${student.documents.signature}`
    : null;

  const regNo = student.registrationNo || id;

  const displayState =
    student.state === "Uttar Pradesh" ? "UP" : student.state || "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      {/* Success Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto mb-6"
      >
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl shadow-lg p-6 flex items-center gap-4">
          <FaCheckCircle className="text-5xl flex-shrink-0" />
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-1">Registration Successful!</h2>
            <p className="text-green-50">
              Your registration has been submitted successfully. Please review your details below and download/print your registration form.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="max-w-4xl mx-auto mb-6 print:hidden"
      >
        <div className="bg-white rounded-xl shadow-md p-4 flex flex-wrap gap-3 justify-center">
          <button
            onClick={handleDownload}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <FaDownload />
            Download PDF
          </button>
          <button
            onClick={handlePrint}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <FaPrint />
            Print Form
          </button>
          <button
            onClick={() => navigate("/")}
            className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <FaHome />
            Go to Home
          </button>
        </div>
      </motion.div>

      {/* Registration Form Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="max-w-4xl mx-auto"
      >
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden print:shadow-none print:rounded-none">
          {/* Print Content */}
          <div ref={printRef} className="print:p-0">
            {/* HEADER */}
            <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border-b-4 border-yellow-600 px-6 py-6 print:bg-white print:border-black print:border-b-2">
              <div className="flex items-center justify-between gap-4">
                <img
                  src="/logo.jpeg"
                  alt="College Logo"
                  className="h-20 w-20 object-contain flex-shrink-0"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
                <div className="flex-1 text-center">
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-yellow-700 leading-tight mb-1">
                    CITY COLLEGE OF MANAGEMENT
                  </h1>
                  <p className="text-base sm:text-lg text-yellow-600 font-semibold">
                    (Under DCRUST University, Murthal)
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    Sector M, Nishatganj, Lucknow-226006 | Phone: +91-0522
                    4064545, 4064546, 4029550
                  </p>
                </div>
                <img
                  src="/lucknow-university-logo.png"
                  alt="Lucknow University Logo"
                  className="h-20 w-20 object-contain flex-shrink-0"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              </div>

              <div className="mt-4 text-center bg-gradient-to-r from-yellow-600 to-amber-600 text-white py-2 rounded-lg font-bold text-lg print:bg-gray-800">
                REGISTRATION FORM
              </div>
            </div>

            {/* CONTENT - Compact Spacing */}
            <div className="p-6 space-y-4 print:space-y-3 print:p-4">
              {/* REGISTRATION INFO & BARCODE */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b-2 border-gray-300 print:border-black">
                <div>
                  <h2 className="text-lg font-bold text-gray-800">
                    Registration No:{" "}
                    <span className="text-blue-600">{regNo}</span>
                  </h2>
                  <p className="text-xs text-gray-600 mt-1">
                    Date: {submissionDate}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <Barcode
                    value={regNo}
                    width={1.5}
                    height={40}
                    fontSize={12}
                    margin={5}
                  />
                </div>
              </div>

              {/* COURSE SELECTION */}
              <section>
                <h2 className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-sm font-bold px-4 py-2 rounded-t-lg print:bg-gray-800 print:rounded-none">
                  COURSE SELECTION
                </h2>
                <div className="border border-gray-300 rounded-b-lg overflow-hidden print:border-black print:rounded-none">
                  <table className="w-full text-sm">
                    <tbody>
                      <tr className="border-b border-gray-200 print:border-black">
                        <td className="px-4 py-3 font-semibold text-gray-700 bg-gray-50 w-1/4 print:bg-gray-100">
                          Course
                        </td>
                        <td className="px-4 py-3 text-gray-900 font-medium">
                          {student.course}
                        </td>
                      </tr>
                      {student.specialization && (
                        <tr>
                          <td className="px-4 py-3 font-semibold text-gray-700 bg-gray-50 print:bg-gray-100">
                            Specialization
                          </td>
                          <td className="px-4 py-3 text-gray-900">
                            {student.specialization}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* STUDENT DETAILS */}
              <section>
                <h2 className="bg-gradient-to-r from-green-600 to-teal-600 text-white text-sm font-bold px-4 py-2 rounded-t-lg print:bg-gray-800 print:rounded-none">
                  STUDENT DETAILS
                </h2>
                <div className="border border-gray-300 rounded-b-lg overflow-hidden print:border-black print:rounded-none">
                  <table className="w-full text-sm">
                    <tbody>
                      <tr className="border-b border-gray-200 print:border-black">
                        <td className="px-4 py-3 font-semibold text-gray-700 bg-gray-50 w-1/4 print:bg-gray-100">
                          Full Name
                        </td>
                        <td className="px-4 py-3 text-gray-900 w-1/4 font-medium">
                          {student.fullName || student.studentName}
                        </td>
                        <td className="px-4 py-3 font-semibold text-gray-700 bg-gray-50 w-1/4 print:bg-gray-100">
                          Father's Name
                        </td>
                        <td className="px-4 py-3 text-gray-900 w-1/4">
                          {student.fatherName}
                        </td>
                      </tr>
                      <tr className="border-b border-gray-200 print:border-black">
                        <td className="px-4 py-3 font-semibold text-gray-700 bg-gray-50 print:bg-gray-100">
                          Mother's Name
                        </td>
                        <td className="px-4 py-3 text-gray-900">
                          {student.motherName}
                        </td>
                        <td className="px-4 py-3 font-semibold text-gray-700 bg-gray-50 print:bg-gray-100">
                          Date of Birth
                        </td>
                        <td className="px-4 py-3 text-gray-900">{dob}</td>
                      </tr>
                      <tr className="border-b border-gray-200 print:border-black">
                        <td className="px-4 py-3 font-semibold text-gray-700 bg-gray-50 print:bg-gray-100">
                          Gender
                        </td>
                        <td className="px-4 py-3 text-gray-900">
                          {student.gender}
                        </td>
                        <td className="px-4 py-3 font-semibold text-gray-700 bg-gray-50 print:bg-gray-100">
                          Category
                        </td>
                        <td className="px-4 py-3 text-gray-900">
                          {student.category}
                        </td>
                      </tr>
                      <tr className="border-b border-gray-200 print:border-black">
                        <td className="px-4 py-3 font-semibold text-gray-700 bg-gray-50 print:bg-gray-100">
                          Nationality
                        </td>
                        <td className="px-4 py-3 text-gray-900">
                          {student.nationality}
                        </td>
                        <td className="px-4 py-3 font-semibold text-gray-700 bg-gray-50 print:bg-gray-100">
                          Aadhar Number
                        </td>
                        <td className="px-4 py-3 text-gray-900">
                          {student.aadharNumber}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-semibold text-gray-700 bg-gray-50 print:bg-gray-100">
                          Mobile Number
                        </td>
                        <td className="px-4 py-3 text-gray-900">
                          {student.phone}
                        </td>
                        <td className="px-4 py-3 font-semibold text-gray-700 bg-gray-50 print:bg-gray-100">
                          Email Address
                        </td>
                        <td className="px-4 py-3 text-gray-900">
                          {student.email}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              {/* EDUCATIONAL QUALIFICATIONS */}
              <section>
                <h2 className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-bold px-4 py-2 rounded-t-lg print:bg-gray-800 print:rounded-none">
                  EDUCATIONAL QUALIFICATIONS
                </h2>
                <div className="border border-gray-300 rounded-b-lg overflow-hidden print:border-black print:rounded-none">
                  <table className="w-full text-sm">
                    <tbody>
                      <tr className="border-b border-gray-200 print:border-black">
                        <td className="px-4 py-3 font-semibold text-gray-700 bg-gray-50 w-1/4 print:bg-gray-100">
                          Last Qualification
                        </td>
                        <td className="px-4 py-3 text-gray-900 w-1/4">
                          {student.lastQualification}
                        </td>
                        <td className="px-4 py-3 font-semibold text-gray-700 bg-gray-50 w-1/4 print:bg-gray-100">
                          Board/University
                        </td>
                        <td className="px-4 py-3 text-gray-900 w-1/4">
                          {student.board}
                        </td>
                      </tr>
                      <tr className="border-b border-gray-200 print:border-black">
                        <td className="px-4 py-3 font-semibold text-gray-700 bg-gray-50 print:bg-gray-100">
                          Year of Passing
                        </td>
                        <td className="px-4 py-3 text-gray-900">
                          {student.passingYear}
                        </td>
                        <td className="px-4 py-3 font-semibold text-gray-700 bg-gray-50 print:bg-gray-100">
                          Marks/Percentage
                        </td>
                        <td className="px-4 py-3 text-gray-900">
                          {student.percentage}%
                        </td>
                      </tr>
                      {student.rollNumber && (
                        <tr>
                          <td className="px-4 py-3 font-semibold text-gray-700 bg-gray-50 print:bg-gray-100">
                            Roll Number
                          </td>
                          <td
                            className="px-4 py-3 text-gray-900"
                            colSpan={3}
                          >
                            {student.rollNumber}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* ADDRESS */}
              <section>
                <h2 className="bg-gradient-to-r from-pink-600 to-rose-600 text-white text-sm font-bold px-4 py-2 rounded-t-lg print:bg-gray-800 print:rounded-none">
                  ADDRESS DETAILS
                </h2>
                <div className="border border-gray-300 rounded-b-lg overflow-hidden print:border-black print:rounded-none">
                  <table className="w-full text-sm">
                    <tbody>
                      <tr className="border-b border-gray-200 print:border-black">
                        <td className="px-4 py-3 font-semibold text-gray-700 bg-gray-50 w-1/4 print:bg-gray-100">
                          Address
                        </td>
                        <td
                          className="px-4 py-3 text-gray-900"
                          colSpan={3}
                        >
                          {student.address}
                        </td>
                      </tr>
                      <tr className="border-b border-gray-200 print:border-black">
                        <td className="px-4 py-3 font-semibold text-gray-700 bg-gray-50 w-1/4 print:bg-gray-100">
                          City
                        </td>
                        <td className="px-4 py-3 text-gray-900 w-1/4">
                          {student.city}
                        </td>
                        <td className="px-4 py-3 font-semibold text-gray-700 bg-gray-50 w-1/4 print:bg-gray-100">
                          Tahsil
                        </td>
                        <td className="px-4 py-3 text-gray-900 w-1/4">
                          {student.tahsil}
                        </td>
                      </tr>
                      <tr className="border-b border-gray-200 print:border-black">
                        <td className="px-4 py-3 font-semibold text-gray-700 bg-gray-50 w-1/4 print:bg-gray-100">
                          District
                        </td>
                        <td className="px-4 py-3 text-gray-900 w-1/4">
                          {student.district}
                        </td>
                        <td className="px-4 py-3 font-semibold text-gray-700 bg-gray-50 w-1/4 print:bg-gray-100">
                          State
                        </td>
                        <td className="px-4 py-3 text-gray-900 w-1/4">
                          {displayState}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-semibold text-gray-700 bg-gray-50 print:bg-gray-100">
                          Pin Code
                        </td>
                        <td className="px-4 py-3 text-gray-900">
                          {student.pincode}
                        </td>
                        <td className="px-4 py-3 font-semibold text-gray-700 bg-gray-50 print:bg-gray-100">
                          Email ID
                        </td>
                        <td className="px-4 py-3 text-gray-900">{student.email}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              {/* DOCUMENTS UPLOADED */}
              <section>
                <h2 className="bg-gradient-to-r from-orange-600 to-red-600 text-white text-sm font-bold px-4 py-2 rounded-t-lg print:bg-gray-800 print:rounded-none">
                  DOCUMENTS UPLOADED
                </h2>
                <div className="border border-gray-300 rounded-b-lg overflow-hidden print:border-black print:rounded-none">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6">
                    <div className="text-center">
                      <h3 className="font-semibold text-gray-700 mb-3 text-sm">
                        Photograph
                      </h3>
                      <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center min-h-[200px] print:border-black print:border-solid">
                        {photoUrl ? (
                          <img
                            src={photoUrl}
                            alt="Student Photograph"
                            className="max-h-48 max-w-full object-contain rounded"
                            onError={(e) => {
                              e.target.style.display = "none";
                              e.target.nextSibling.style.display = "block";
                            }}
                          />
                        ) : (
                          <span className="text-gray-400 text-sm">
                            No photo uploaded
                          </span>
                        )}
                        <span
                          className="text-gray-400 text-sm hidden"
                          style={{ display: "none" }}
                        >
                          Photo not available
                        </span>
                      </div>
                    </div>

                    <div className="text-center">
                      <h3 className="font-semibold text-gray-700 mb-3 text-sm">
                        Signature
                      </h3>
                      <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center min-h-[200px] print:border-black print:border-solid">
                        {signatureUrl ? (
                          <img
                            src={signatureUrl}
                            alt="Student Signature"
                            className="max-h-48 max-w-full object-contain rounded"
                            onError={(e) => {
                              e.target.style.display = "none";
                              e.target.nextSibling.style.display = "block";
                            }}
                          />
                        ) : (
                          <span className="text-gray-400 text-sm">
                            No signature uploaded
                          </span>
                        )}
                        <span
                          className="text-gray-400 text-sm hidden"
                          style={{ display: "none" }}
                        >
                          Signature not available
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* DECLARATION */}
              <section>
                <h2 className="bg-gradient-to-r from-gray-700 to-gray-800 text-white text-sm font-bold px-4 py-2 rounded-t-lg print:bg-gray-800 print:rounded-none">
                  DECLARATION
                </h2>
                <div className="border border-gray-300 rounded-b-lg p-6 bg-amber-50 print:border-black print:rounded-none print:bg-white">
                  <p className="text-xs leading-relaxed text-gray-700 mb-4">
                    मैं प्रमाणित करता हूँ कि ऑनलाइन आवेदन में भरी गयी समस्त
                    प्रविष्टियाँ मेरे पास उपलब्ध अभिलेखों पर आधारित हैं एवं मेरे
                    व्यक्तिगत जानकारी में सही एवं सत्य हैं। आवेदन करने की तिथि को
                    मेरे पास ऑनलाइन आवेदन में उल्लिखित समस्त अंकों के प्रमाण पत्र,
                    आरक्षण एवं विशेष आरक्षण सम्बन्धी प्रमाण पत्र उपलब्ध हैं।
                    ऑनलाइन आवेदन पत्र में अपलोड की गयी मेरी फोटो एवं हस्ताक्षर
                    स्पष्ट एवं दिये गये निर्देशानुसार हैं। यदि किसी भी स्तर पर
                    जांचोपरांत ऑनलाइन आवेदन पत्र में कोई भी विवरण त्रुटिपूर्ण /
                    असत्य पाया जाता है तो उसका समस्त उत्तरदायित्व मेरा होगा एवं
                    संबंधित अधिकारी को मेरा अभ्यर्थन निरस्त करने तथा मेरे विरुद्ध
                    वैधानिक कार्यवाही करने का पूर्ण अधिकार होगा।
                  </p>

                  <div className="flex items-center gap-3 p-3 bg-white rounded border border-amber-200">
                    <FaCheckCircle className="text-green-600 text-xl" />
                    <span className="font-semibold text-gray-800 text-sm">
                      Student Confirmation: I agree to the above declaration
                    </span>
                  </div>
                </div>
              </section>

              {/* FOOTER - Dates */}
              <div className="flex flex-col sm:flex-row justify-between gap-2 text-xs text-gray-600 pt-4 border-t border-gray-300 print:border-black">
                <span>
                  <strong>Submission Date:</strong> {submissionDate}
                </span>
                <span>
                  <strong>Print Date:</strong> {printDate}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Action Buttons */}
        <div className="mt-6 print:hidden">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <FaFileAlt className="text-blue-600 text-3xl" />
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">
                    Registration ID: {regNo}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Keep this for future reference
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleDownload}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all duration-300"
                >
                  <FaDownload />
                  Download
                </button>
                <button
                  onClick={handlePrint}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all duration-300"
                >
                  <FaPrint />
                  Print
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RegistrationDetails;