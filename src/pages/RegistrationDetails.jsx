import React from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
// import axios from "axios"; // 🔓 UNCOMMENT LATER WHEN YOU REALLY WANT TO FETCH FROM BACKEND

const RegistrationDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  // Data passed from Registration.jsx via navigate(..., { state: {...} })
  const state = location.state;

  // If user refreshed or opened URL directly, there will be no state
  if (!state || !state.formData) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <p className="text-lg mb-4">
          No registration data found for this session.
        </p>
        <button
          onClick={() => navigate("/registration")}
          className="btn-primary px-8 py-3"
        >
          Go back to Registration Form
        </button>
      </div>
    );
  }

  const { formData, photoUrl, signatureUrl, submittedAt } = state;

  const submissionDate = submittedAt
    ? new Date(submittedAt).toLocaleString()
    : "";

  return (
    <div className="bg-gray-100 py-10 print:bg-white">
      <div className="w-[900px] mx-auto bg-white shadow-lg border print:shadow-none print:border-black">
        {/* HEADER */}
        <div className="text-center border-b border-black pb-4 px-4 pt-4">
          {/* Replace with your actual logo path */}
          <div className="flex items-center justify-center gap-4 mb-2">
            <img src="/logo.jpeg" alt="Logo" className="h-20" />
            <div className="text-left">
              <h1 className="text-3xl font-extrabold text-yellow-700 leading-tight">
                CITY COLLEGE OF MANAGEMENT
              </h1>
              <p className="font-semibold text-xs tracking-wide">
                COLLEGE CODE - 290044
              </p>
              <p className="text-xs">
                TiwariGanj, Chinhat, Ayodhya Road, Lucknow
              </p>
            </div>
          </div>
        </div>

        {/* REG NO & BARCODE ROW (dummy barcode for now) */}
        <table className="w-full text-xs border-t border-black">
          <tbody>
            <tr className="bg-gray-200 font-semibold">
              <td className="border border-black px-2 py-2 w-32">
                Registration No
              </td>
              <td className="border border-black px-2 py-2 w-56">
                {id || state.id}
              </td>
              <td className="border border-black px-2 py-2 w-20">Barcode :</td>
              <td className="border border-black px-2 py-2">
                {/* You can replace this with an actual <img src="barcode" /> later */}
                <div className="h-8 bg-gray-300" />
              </td>
            </tr>
          </tbody>
        </table>

        {/* PERSONAL DETAILS */}
        <h2 className="bg-gray-800 text-white text-xs font-bold px-2 py-1 mt-2">
          PERSONAL DETAILS
        </h2>
        <table className="w-full text-xs border border-black border-t-0">
          <tbody>
            <tr>
              <td className="td border border-black px-2 py-1 w-32">
                Student Name
              </td>
              <td className="td border border-black px-2 py-1">
                {formData.studentName}
              </td>
              <td className="td border border-black px-2 py-1 w-32">
                Date of Birth
              </td>
              <td className="td border border-black px-2 py-1 w-40">
                {formData.dateOfBirth}
              </td>
            </tr>
            <tr>
              <td className="td border border-black px-2 py-1">Mother Name</td>
              <td className="td border border-black px-2 py-1">
                {formData.motherName}
              </td>
              <td className="td border border-black px-2 py-1">Gender</td>
              <td className="td border border-black px-2 py-1">
                {formData.gender}
              </td>
            </tr>
            <tr>
              <td className="td border border-black px-2 py-1">Father Name</td>
              <td className="td border border-black px-2 py-1">
                {formData.fatherName}
              </td>
              <td className="td border border-black px-2 py-1">Category</td>
              <td className="td border border-black px-2 py-1">
                {formData.category}
              </td>
            </tr>
            <tr>
              <td className="td border border-black px-2 py-1">Phone No</td>
              <td className="td border border-black px-2 py-1">
                {formData.phone}
              </td>
              <td className="td border border-black px-2 py-1">Nationality</td>
              <td className="td border border-black px-2 py-1">
                {formData.nationality}
              </td>
            </tr>
            <tr>
              <td className="td border border-black px-2 py-1">Sub Category</td>
              <td className="td border border-black px-2 py-1">
                {formData.subCategory}
              </td>
              <td className="td border border-black px-2 py-1"></td>
              <td className="td border border-black px-2 py-1"></td>
            </tr>
          </tbody>
        </table>

        {/* EDUCATION DETAILS */}
        <h2 className="bg-gray-800 text-white text-xs font-bold px-2 py-1 mt-2">
          EDUCATION DETAILS
        </h2>
        <table className="w-full text-xs border border-black border-t-0">
          <thead className="bg-gray-200 font-semibold">
            <tr>
              <th className="border border-black px-1 py-1">Qualification</th>
              <th className="border border-black px-1 py-1">
                Board/University Name
              </th>
              <th className="border border-black px-1 py-1">Year</th>
              <th className="border border-black px-1 py-1">Marksheet No</th>
              <th className="border border-black px-1 py-1">Roll No</th>
              <th className="border border-black px-1 py-1">Total Marks</th>
              <th className="border border-black px-1 py-1">Obtained Marks</th>
              <th className="border border-black px-1 py-1">Marks Per(%)</th>
            </tr>
          </thead>
          <tbody>
            {/* 10th */}
            <tr>
              <td className="border border-black px-1 py-1">
                10th or Equivalent
              </td>
              <td className="border border-black px-1 py-1">
                {formData.tenthBoard}
              </td>
              <td className="border border-black px-1 py-1">
                {formData.tenthYear}
              </td>
              <td className="border border-black px-1 py-1">
                {formData.tenthMarksheetNo}
              </td>
              <td className="border border-black px-1 py-1">
                {formData.tenthRollNo}
              </td>
              <td className="border border-black px-1 py-1">
                {formData.tenthTotalMarks}
              </td>
              <td className="border border-black px-1 py-1">
                {formData.tenthMarksObtained}
              </td>
              <td className="border border-black px-1 py-1">
                {formData.tenthPercentage}
              </td>
            </tr>

            {/* 12th */}
            <tr>
              <td className="border border-black px-1 py-1">
                12th or Equivalent
              </td>
              <td className="border border-black px-1 py-1">
                {formData.twelfthBoard}
              </td>
              <td className="border border-black px-1 py-1">
                {formData.twelfthYear}
              </td>
              <td className="border border-black px-1 py-1">
                {formData.twelfthMarksheetNo}
              </td>
              <td className="border border-black px-1 py-1">
                {formData.twelfthRollNo}
              </td>
              <td className="border border-black px-1 py-1">
                {formData.twelfthTotalMarks}
              </td>
              <td className="border border-black px-1 py-1">
                {formData.twelfthMarksObtained}
              </td>
              <td className="border border-black px-1 py-1">
                {formData.twelfthPercentage}
              </td>
            </tr>

            {/* Graduation */}
            <tr>
              <td className="border border-black px-1 py-1">Graduation</td>
              <td className="border border-black px-1 py-1">
                {formData.graduationBoard}
              </td>
              <td className="border border-black px-1 py-1">
                {formData.graduationYear}
              </td>
              <td className="border border-black px-1 py-1">
                {formData.graduationMarksheetNo}
              </td>
              <td className="border border-black px-1 py-1">
                {formData.graduationRollNo}
              </td>
              <td className="border border-black px-1 py-1">
                {formData.graduationTotalMarks}
              </td>
              <td className="border border-black px-1 py-1">
                {formData.graduationMarksObtained}
              </td>
              <td className="border border-black px-1 py-1">
                {formData.graduationPercentage}
              </td>
            </tr>

            {/* Other */}
            <tr>
              <td className="border border-black px-1 py-1">Other</td>
              <td className="border border-black px-1 py-1">
                {formData.otherBoard}
              </td>
              <td className="border border-black px-1 py-1">
                {formData.otherYear}
              </td>
              <td className="border border-black px-1 py-1">
                {formData.otherMarksheetNo}
              </td>
              <td className="border border-black px-1 py-1">
                {formData.otherRollNo}
              </td>
              <td className="border border-black px-1 py-1">
                {formData.otherTotalMarks}
              </td>
              <td className="border border-black px-1 py-1">
                {formData.otherMarksObtained}
              </td>
              <td className="border border-black px-1 py-1">
                {formData.otherPercentage}
              </td>
            </tr>
          </tbody>
        </table>

        {/* COMMUNICATION DETAILS */}
        <h2 className="bg-gray-800 text-white text-xs font-bold px-2 py-1 mt-2">
          COMMUNICATION/CORRESPONDENCE DETAILS
        </h2>
        <table className="w-full text-xs border border-black border-t-0">
          <tbody>
            <tr>
              <td className="border border-black px-2 py-1 w-32">Address</td>
              <td className="border border-black px-2 py-1">
                {formData.address}
              </td>
            </tr>
            <tr>
              <td className="border border-black px-2 py-1">District</td>
              <td className="border border-black px-2 py-1">
                {formData.district}
              </td>
              <td className="border border-black px-2 py-1 w-20">State</td>
              <td className="border border-black px-2 py-1 w-24">
                {formData.state}
              </td>
            </tr>
            <tr>
              <td className="border border-black px-2 py-1">Pin Code</td>
              <td className="border border-black px-2 py-1">
                {formData.pincode}
              </td>
              <td className="border border-black px-2 py-1">Email id</td>
              <td className="border border-black px-2 py-1">
                {formData.email}
              </td>
            </tr>
          </tbody>
        </table>

        {/* DOCUMENT UPLOADED */}
        <h2 className="bg-gray-800 text-white text-xs font-bold px-2 py-1 mt-2">
          DOCUMENT UPLOADED
        </h2>
        <table className="w-full text-xs border border-black border-t-0">
          <tbody>
            <tr>
              <td className="border border-black px-2 py-1 w-32 align-top">
                Photograph
              </td>
              <td className="border border-black px-2 py-2">
                {photoUrl ? (
                  <img
                    src={photoUrl}
                    alt="Photograph"
                    className="h-32 w-32 object-contain mx-auto"
                  />
                ) : (
                  "Not uploaded"
                )}
              </td>
              <td className="border border-black px-2 py-1 w-32 align-top">
                Signature
              </td>
              <td className="border border-black px-2 py-2">
                {signatureUrl ? (
                  <img
                    src={signatureUrl}
                    alt="Signature"
                    className="h-32 w-32 object-contain mx-auto"
                  />
                ) : (
                  "Not uploaded"
                )}
              </td>
            </tr>
          </tbody>
        </table>

        {/* DECLARATION */}
        <h2 className="bg-gray-800 text-white text-xs font-bold px-2 py-1 mt-2">
          DECLARATION
        </h2>
        <div className="border border-black border-t-0 px-3 py-3 text-xs leading-relaxed">
          <p>
            मैं प्रमाणित करता हूँ कि ऑनलाइन आवेदन में भरी गयी समस्त प्रविष्टियाँ मेरे
            पास उपलब्ध अभिलेखों पर आधारित हैं एवं मेरे व्यक्तिगत जानकारी में सही एवं
            सत्य हैं। आवेदन करने की तिथि को मेरे पास ऑनलाइन आवेदन में उल्लिखित समस्त
            अंकों के प्रमाण पत्र, आरक्षण एवं विशेष आरक्षण सम्बन्धी प्रमाण पत्र उपलब्ध
            हैं। ऑनलाइन आवेदन पत्र में अपलोड की गयी मेरी फोटो एवं हस्ताक्षर स्पष्ट
            एवं दिये गये निर्देशानुसार हैं। यदि किसी भी स्तर पर जांचोपरांत ऑनलाइन
            आवेदन पत्र में कोई भी विवरण त्रुटिपूर्ण / असत्य पाया जाता है तो उसका
            समस्त उत्तरदायित्व मेरा होगा एवं संबंधित अधिकारी को मेरा अभ्यर्थन निरस्त
            करने तथा मेरे विरुद्ध वैधानिक कार्यवाही करने का पूर्ण अधिकार होगा।
          </p>
        </div>

        {/* FOOTER WITH DATES */}
        <div className="flex justify-between text-[10px] px-3 py-2 border border-t-0 border-black">
          <span>Submission Date: {submissionDate}</span>
          <span>Print Date : {new Date().toISOString().slice(0, 10)}</span>
        </div>

        {/* PRINT BUTTON (hidden when actually printing) */}
        <div className="text-center py-4 print:hidden">
          <button
            onClick={() => window.print()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-2 font-bold text-sm"
          >
            Print
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegistrationDetails;
