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

const API_BASE = "https://clc-backend-0isa.onrender.com";

const RegistrationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState(false);
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

  // Wait for images to load before printing
  useEffect(() => {
    if (student) {
      const photoUrl = student.documents?.photo ? `${API_BASE}${student.documents.photo}` : null;
      const signatureUrl = student.documents?.signature ? `${API_BASE}${student.documents.signature}` : null;

      const loadImage = (url) => {
        return new Promise((resolve) => {
          if (!url) {
            resolve();
            return;
          }
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = () => resolve();
          img.src = url;
        });
      };

      Promise.all([
        loadImage(photoUrl),
        loadImage(signatureUrl),
      ]).then(() => {
        setTimeout(() => setImagesLoaded(true), 500);
      });
    }
  }, [student]);

  // Print handler with proper page styles
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Registration_${student?.registrationNo || id}`,
    onBeforePrint: () => {
      return new Promise((resolve) => {
        if (!imagesLoaded) {
          toast.warning("Loading images... Please wait.");
          setTimeout(resolve, 1000);
        } else {
          resolve();
        }
      });
    },
    onAfterPrint: () => {
      toast.success("Document printed successfully!");
    },
    pageStyle: `
      @page {
        size: A4;
        margin: 15mm;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          color-adjust: exact !important;
        }
        * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        html, body {
          height: 100%;
          margin: 0;
          padding: 0;
        }
      }
    `
  });

  // Download as PDF
  const handleDownload = () => {
    if (!imagesLoaded) {
      toast.warning("Loading images... Please try again in a moment.");
      return;
    }
    toast.info("Please use 'Save as PDF' option in the print dialog.");
    setTimeout(() => {
      handlePrint();
    }, 500);
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
        className="max-w-5xl mx-auto mb-6 print:hidden"
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
        className="max-w-5xl mx-auto mb-6 print:hidden"
      >
        <div className="bg-white rounded-xl shadow-md p-4 flex flex-wrap gap-3 justify-center">
          <button
            onClick={handleDownload}
            disabled={!imagesLoaded}
            className={`bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg ${!imagesLoaded ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <FaDownload />
            {imagesLoaded ? 'Download PDF' : 'Loading...'}
          </button>
          <button
            onClick={handlePrint}
            disabled={!imagesLoaded}
            className={`bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg ${!imagesLoaded ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <FaPrint />
            {imagesLoaded ? 'Print Form' : 'Loading...'}
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
        className="max-w-5xl mx-auto"
      >
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden print:shadow-none print:rounded-none">
          {/* Print Content - SINGLE PAGE LAYOUT */}
          <div ref={printRef} className="bg-white p-6" style={{ fontSize: '11px' }}>
            
            {/* HEADER - Compact */}
            <div className="border-b-3 border-yellow-600 pb-3 mb-3" style={{ borderBottomWidth: '3px', borderBottomColor: '#d97706' }}>
              <div className="flex items-start justify-between gap-3">
                <img
                  src="/logo.png"
                  alt="College Logo"
                  className="h-16 w-16 object-contain flex-shrink-0"
                  crossOrigin="anonymous"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
                <div className="flex-1 text-center">
                  <h1 className="text-xl font-extrabold text-yellow-700 leading-tight mb-0.5" style={{ color: '#b45309' }}>
                    CITY COLLEGE OF MANAGEMENT
                  </h1>
                  <p className="text-xs text-yellow-600 font-semibold" style={{ color: '#d97706' }}>
                    (Under DCRUST University, Murthal)
                  </p>
                  <p className="text-xs text-gray-600 mt-0.5" style={{ fontSize: '10px' }}>
                    Sector M, Nishatganj, Lucknow-226006 | Phone: +91-0522 4064545, 4064546, 4029550
                  </p>
                </div>
                <img
                  src="/lucknow-university-logo.png"
                  alt="University Logo"
                  className="h-16 w-16 object-contain flex-shrink-0"
                  crossOrigin="anonymous"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              </div>

              <div className="mt-2 text-center bg-yellow-600 text-white py-1.5 rounded font-bold text-sm" style={{ backgroundColor: '#d97706' }}>
                REGISTRATION FORM
              </div>
            </div>

            {/* Main Content Grid - 2 Columns Layout */}
            <div className="grid grid-cols-3 gap-4">
              
              {/* LEFT COLUMN - 2/3 width */}
              <div className="col-span-2 space-y-3">
                
                {/* REGISTRATION INFO & BARCODE */}
                <div className="flex items-center justify-between border-b border-gray-300 pb-2">
                  <div>
                    <h2 className="text-sm font-bold text-gray-800">
                      Registration No: <span className="text-blue-600">{regNo}</span>
                    </h2>
                    <p className="text-xs text-gray-600 mt-0.5">Date: {submissionDate}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <Barcode
                      value={regNo}
                      width={1.2}
                      height={30}
                      fontSize={10}
                      margin={2}
                    />
                  </div>
                </div>

                {/* COURSE SELECTION */}
                <section>
                  <h3 className="bg-blue-600 text-white text-xs font-bold px-2 py-1 mb-1" style={{ backgroundColor: '#2563eb' }}>
                    COURSE SELECTION
                  </h3>
                  <div className="border border-gray-300">
                    <table className="w-full" style={{ fontSize: '10px' }}>
                      <tbody>
                        <tr>
                          <td className="px-2 py-1.5 font-semibold text-gray-700 bg-gray-50 w-1/3">
                            Course
                          </td>
                          <td className="px-2 py-1.5 text-gray-900 font-medium" colSpan={3}>
                            {student.course}
                            {student.specialization && ` - ${student.specialization}`}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </section>

                {/* STUDENT DETAILS */}
                <section>
                  <h3 className="bg-green-600 text-white text-xs font-bold px-2 py-1 mb-1" style={{ backgroundColor: '#16a34a' }}>
                    STUDENT DETAILS
                  </h3>
                  <div className="border border-gray-300">
                    <table className="w-full" style={{ fontSize: '10px' }}>
                      <tbody>
                        <tr className="border-b border-gray-200">
                          <td className="px-2 py-1.5 font-semibold text-gray-700 bg-gray-50 w-1/4">Full Name</td>
                          <td className="px-2 py-1.5 text-gray-900 w-1/4 font-medium">{student.fullName || student.studentName}</td>
                          <td className="px-2 py-1.5 font-semibold text-gray-700 bg-gray-50 w-1/4">Father's Name</td>
                          <td className="px-2 py-1.5 text-gray-900 w-1/4">{student.fatherName}</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="px-2 py-1.5 font-semibold text-gray-700 bg-gray-50">Mother's Name</td>
                          <td className="px-2 py-1.5 text-gray-900">{student.motherName}</td>
                          <td className="px-2 py-1.5 font-semibold text-gray-700 bg-gray-50">Date of Birth</td>
                          <td className="px-2 py-1.5 text-gray-900">{dob}</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="px-2 py-1.5 font-semibold text-gray-700 bg-gray-50">Gender</td>
                          <td className="px-2 py-1.5 text-gray-900">{student.gender}</td>
                          <td className="px-2 py-1.5 font-semibold text-gray-700 bg-gray-50">Category</td>
                          <td className="px-2 py-1.5 text-gray-900">{student.category}</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="px-2 py-1.5 font-semibold text-gray-700 bg-gray-50">Nationality</td>
                          <td className="px-2 py-1.5 text-gray-900">{student.nationality}</td>
                          <td className="px-2 py-1.5 font-semibold text-gray-700 bg-gray-50">Aadhar Number</td>
                          <td className="px-2 py-1.5 text-gray-900">{student.aadharNumber || 'N/A'}</td>
                        </tr>
                        <tr>
                          <td className="px-2 py-1.5 font-semibold text-gray-700 bg-gray-50">Mobile Number</td>
                          <td className="px-2 py-1.5 text-gray-900">{student.phone}</td>
                          <td className="px-2 py-1.5 font-semibold text-gray-700 bg-gray-50">Email</td>
                          <td className="px-2 py-1.5 text-gray-900">{student.email}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </section>

                {/* EDUCATIONAL QUALIFICATIONS */}
                <section>
                  <h3 className="bg-purple-600 text-white text-xs font-bold px-2 py-1 mb-1" style={{ backgroundColor: '#9333ea' }}>
                    EDUCATIONAL QUALIFICATIONS
                  </h3>
                  <div className="border border-gray-300">
                    <table className="w-full" style={{ fontSize: '10px' }}>
                      <tbody>
                        <tr className="border-b border-gray-200">
                          <td className="px-2 py-1.5 font-semibold text-gray-700 bg-gray-50 w-1/4">Last Qualification</td>
                          <td className="px-2 py-1.5 text-gray-900 w-1/4">{student.lastQualification || 'N/A'}</td>
                          <td className="px-2 py-1.5 font-semibold text-gray-700 bg-gray-50 w-1/4">Board/University</td>
                          <td className="px-2 py-1.5 text-gray-900 w-1/4">{student.board || 'N/A'}</td>
                        </tr>
                        <tr>
                          <td className="px-2 py-1.5 font-semibold text-gray-700 bg-gray-50">Year of Passing</td>
                          <td className="px-2 py-1.5 text-gray-900">{student.passingYear || 'N/A'}</td>
                          <td className="px-2 py-1.5 font-semibold text-gray-700 bg-gray-50">Marks/Percentage</td>
                          <td className="px-2 py-1.5 text-gray-900">{student.percentage ? `${student.percentage}%` : 'N/A'}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </section>

                {/* ADDRESS DETAILS */}
                <section>
                  <h3 className="bg-pink-600 text-white text-xs font-bold px-2 py-1 mb-1" style={{ backgroundColor: '#db2777' }}>
                    ADDRESS DETAILS
                  </h3>
                  <div className="border border-gray-300">
                    <table className="w-full" style={{ fontSize: '10px' }}>
                      <tbody>
                        <tr className="border-b border-gray-200">
                          <td className="px-2 py-1.5 font-semibold text-gray-700 bg-gray-50 w-1/4">Address</td>
                          <td className="px-2 py-1.5 text-gray-900" colSpan={3}>{student.address}</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="px-2 py-1.5 font-semibold text-gray-700 bg-gray-50 w-1/4">City</td>
                          <td className="px-2 py-1.5 text-gray-900 w-1/4">{student.city}</td>
                          <td className="px-2 py-1.5 font-semibold text-gray-700 bg-gray-50 w-1/4">Tahsil</td>
                          <td className="px-2 py-1.5 text-gray-900 w-1/4">{student.tahsil || 'N/A'}</td>
                        </tr>
                        <tr>
                          <td className="px-2 py-1.5 font-semibold text-gray-700 bg-gray-50">District</td>
                          <td className="px-2 py-1.5 text-gray-900">{student.district}</td>
                          <td className="px-2 py-1.5 font-semibold text-gray-700 bg-gray-50">State</td>
                          <td className="px-2 py-1.5 text-gray-900">{displayState}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </section>

              </div>

              {/* RIGHT COLUMN - 1/3 width for Documents */}
              <div className="col-span-1 space-y-3">
                <section>
                  <h3 className="bg-orange-600 text-white text-xs font-bold px-2 py-1 mb-1" style={{ backgroundColor: '#ea580c' }}>
                    DOCUMENTS
                  </h3>
                  
                  {/* Photo */}
                  <div className="border border-gray-300 p-2 mb-2">
                    <p className="text-xs font-semibold text-gray-700 mb-1 text-center">Photograph</p>
                    <div className="bg-gray-100 border border-gray-300 flex items-center justify-center" style={{ height: '140px' }}>
                      {photoUrl ? (
                        <img
                          src={photoUrl}
                          alt="Photo"
                          className="max-h-full max-w-full object-contain"
                          crossOrigin="anonymous"
                          onError={(e) => {
                            e.target.parentElement.innerHTML = '<span class="text-gray-400 text-xs">No Photo</span>';
                          }}
                        />
                      ) : (
                        <span className="text-gray-400 text-xs">No Photo</span>
                      )}
                    </div>
                  </div>

                  {/* Signature */}
                  <div className="border border-gray-300 p-2">
                    <p className="text-xs font-semibold text-gray-700 mb-1 text-center">Signature</p>
                    <div className="bg-gray-100 border border-gray-300 flex items-center justify-center" style={{ height: '80px' }}>
                      {signatureUrl ? (
                        <img
                          src={signatureUrl}
                          alt="Signature"
                          className="max-h-full max-w-full object-contain"
                          crossOrigin="anonymous"
                          onError={(e) => {
                            e.target.parentElement.innerHTML = '<span class="text-gray-400 text-xs">No Signature</span>';
                          }}
                        />
                      ) : (
                        <span className="text-gray-400 text-xs">No Signature</span>
                      )}
                    </div>
                  </div>
                </section>
              </div>
            </div>

            {/* DECLARATION - Full Width at Bottom */}
            <section className="mt-3">
              <h3 className="bg-gray-700 text-white text-xs font-bold px-2 py-1 mb-1" style={{ backgroundColor: '#374151' }}>
                DECLARATION
              </h3>
              <div className="border border-gray-300 p-2">
                <p className="text-xs leading-relaxed text-gray-700 mb-2" style={{ fontSize: '9px', lineHeight: '1.3' }}>
                  मैं प्रमाणित करता हूँ कि ऑनलाइन आवेदन में भरी गयी समस्त प्रविष्टियाँ मेरे पास उपलब्ध अभिलेखों पर आधारित हैं एवं मेरे व्यक्तिगत जानकारी में सही एवं सत्य हैं। आवेदन करने की तिथि को मेरे पास ऑनलाइन आवेदन में उल्लिखित समस्त अंकों के प्रमाण पत्र, आरक्षण एवं विशेष आरक्षण सम्बन्धी प्रमाण पत्र उपलब्ध हैं। ऑनलाइन आवेदन पत्र में अपलोड की गयी मेरी फोटो एवं हस्ताक्षर स्पष्ट एवं दिये गये निर्देशानुसार हैं। यदि किसी भी स्तर पर जांचोपरांत ऑनलाइन आवेदन पत्र में कोई भी विवरण त्रुटिपूर्ण / असत्य पाया जाता है तो उसका समस्त उत्तरदायित्व मेरा होगा एवं संबंधित अधिकारी को मेरा अभ्यर्थन निरस्त करने तथा मेरे विरुद्ध वैधानिक कार्यवाही करने का पूर्ण अधिकार होगा।
                </p>
                <div className="flex items-center gap-2 p-1.5 bg-gray-50 rounded border border-gray-200">
                  <FaCheckCircle className="text-green-600 text-sm flex-shrink-0" />
                  <span className="font-semibold text-gray-800 text-xs">
                    Student Confirmation: I agree to the above declaration
                  </span>
                </div>
              </div>
            </section>

            {/* FOOTER */}
            <div className="flex justify-between text-xs text-gray-600 mt-2 pt-2 border-t border-gray-300" style={{ fontSize: '9px' }}>
              <span><strong>Submission Date:</strong> {submissionDate}</span>
              <span><strong>Print Date:</strong> {printDate}</span>
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
                  disabled={!imagesLoaded}
                  className={`bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all duration-300 ${!imagesLoaded ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <FaDownload />
                  {imagesLoaded ? 'Download' : 'Loading...'}
                </button>
                <button
                  onClick={handlePrint}
                  disabled={!imagesLoaded}
                  className={`bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all duration-300 ${!imagesLoaded ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <FaPrint />
                  {imagesLoaded ? 'Print' : 'Loading...'}
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