import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import {
  FaPaperPlane,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCalendar,
  FaGraduationCap,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaIdCard,
  FaBook,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// State → District mapping
const stateDistricts = {
  "Uttar Pradesh": [
    "Agra",
    "Aligarh",
    "Allahabad",
    "Ambedkar Nagar",
    "Amethi",
    "Ayodhya",
    "Azamgarh",
    "Barabanki",
    "Bareilly",
    "Basti",
    "Bhadohi",
    "Bijnor",
    "Budaun",
    "Bulandshahr",
    "Deoria",
    "Etah",
    "Etawah",
    "Farrukhabad",
    "Fatehpur",
    "Firozabad",
    "Gautam Buddha Nagar",
    "Ghaziabad",
    "Ghazipur",
    "Gonda",
    "Gorakhpur",
    "Hamirpur",
    "Hardoi",
    "Hathras",
    "Jalaun",
    "Jaunpur",
    "Jhansi",
    "Kanpur Dehat",
    "Kanpur Nagar",
    "Kasganj",
    "Kaushambi",
    "Kushinagar",
    "Lakhimpur Kheri",
    "Lalitpur",
    "Lucknow",
    "Maharajganj",
    "Mahoba",
    "Mainpuri",
    "Mathura",
    "Mau",
    "Meerut",
    "Mirzapur",
    "Moradabad",
    "Muzaffarnagar",
    "Prayagraj",
    "Raebareli",
    "Rampur",
    "Saharanpur",
    "Shahjahanpur",
    "Shrawasti",
    "Siddharthnagar",
    "Sitapur",
    "Sultanpur",
    "Unnao",
    "Varanasi",
  ],
  Bihar: ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Nalanda", "Purnia"],
  "Madhya Pradesh": ["Bhopal", "Indore", "Gwalior", "Jabalpur", "Ujjain"],
  Rajasthan: ["Jaipur", "Jodhpur", "Kota", "Ajmer", "Alwar", "Bikaner"],
  Delhi: [
    "New Delhi",
    "North Delhi",
    "South Delhi",
    "East Delhi",
    "West Delhi",
  ],
  Other: ["Other"],
};

const Registration = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [formData, setFormData] = useState({
    // Personal Details
    studentName: "",
    dateOfBirth: "",
    fatherName: "",
    motherName: "",
    nationality: "Indian",
    category: "",
    gender: "",
    phone: "",
    subCategory: "",
    // Educational Details - 10th
    tenthBoard: "",
    tenthYear: "",
    tenthMarksheetNo: "",
    tenthRollNo: "",
    tenthTotalMarks: "",
    tenthMarksObtained: "",
    tenthPercentage: "",
    // Educational Details - 12th
    twelfthBoard: "",
    twelfthYear: "",
    twelfthMarksheetNo: "",
    twelfthRollNo: "",
    twelfthTotalMarks: "",
    twelfthMarksObtained: "",
    twelfthPercentage: "",
    // Educational Details - Graduation
    graduationBoard: "",
    graduationYear: "",
    graduationMarksheetNo: "",
    graduationRollNo: "",
    graduationTotalMarks: "",
    graduationMarksObtained: "",
    graduationPercentage: "",
    // Educational Details - Other
    otherBoard: "",
    otherYear: "",
    otherMarksheetNo: "",
    otherRollNo: "",
    otherTotalMarks: "",
    otherMarksObtained: "",
    otherPercentage: "",
    // Course
    course: "",
    // Communication Details
    address: "",
    state: "",
    district: "",
    pincode: "",
    email: "",
    // Declaration
    declarationAccepted: false,
  });

  const [photo, setPhoto] = useState(null);
  const [signature, setSignature] = useState(null);

  const courses = [
    { code: "BBA", name: "Bachelor of Business Administration" },
    { code: "BCA", name: "Bachelor of Computer Applications" },
    { code: "BCom", name: "Bachelor of Commerce" },
    { code: "BSc(AG)", name: "Bachelor of Science (Agriculture)" },
    { code: "BEd", name: "Bachelor of Education" },
    { code: "MEd", name: "Master of Education" },
    { code: "DElEd", name: "Diploma in Elementary Education" },
  ];

  // Calculate percentage automatically
  const calculatePercentage = (obtained, total) => {
    if (!obtained || !total || total === "0") return "";
    const percentage = (parseFloat(obtained) / parseFloat(total)) * 100;
    return percentage.toFixed(2);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "state") {
      setFormData((prev) => ({
        ...prev,
        state: value,
        district: "",
      }));
      return;
    }

    // Auto-calculate percentages when marks are entered
    let updatedFormData = {
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    };

    // 10th percentage calculation
    if (name === "tenthTotalMarks" || name === "tenthMarksObtained") {
      const total = name === "tenthTotalMarks" ? value : formData.tenthTotalMarks;
      const obtained = name === "tenthMarksObtained" ? value : formData.tenthMarksObtained;
      updatedFormData.tenthPercentage = calculatePercentage(obtained, total);
    }

    // 12th percentage calculation
    if (name === "twelfthTotalMarks" || name === "twelfthMarksObtained") {
      const total = name === "twelfthTotalMarks" ? value : formData.twelfthTotalMarks;
      const obtained = name === "twelfthMarksObtained" ? value : formData.twelfthMarksObtained;
      updatedFormData.twelfthPercentage = calculatePercentage(obtained, total);
    }

    // Graduation percentage calculation
    if (name === "graduationTotalMarks" || name === "graduationMarksObtained") {
      const total = name === "graduationTotalMarks" ? value : formData.graduationTotalMarks;
      const obtained = name === "graduationMarksObtained" ? value : formData.graduationMarksObtained;
      updatedFormData.graduationPercentage = calculatePercentage(obtained, total);
    }

    // Other percentage calculation
    if (name === "otherTotalMarks" || name === "otherMarksObtained") {
      const total = name === "otherTotalMarks" ? value : formData.otherTotalMarks;
      const obtained = name === "otherMarksObtained" ? value : formData.otherMarksObtained;
      updatedFormData.otherPercentage = calculatePercentage(obtained, total);
    }

    setFormData(updatedFormData);
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === "photo") {
      setPhoto(files[0] || null);
    } else if (name === "signature") {
      setSignature(files[0] || null);
    }
  };

  const validatePercentage = (value) => {
    if (!value) return true;
    const num = Number(value);
    return num >= 0 && num <= 100;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const percentageFields = [
      "tenthPercentage",
      "twelfthPercentage",
      "graduationPercentage",
      "otherPercentage",
    ];

    for (const field of percentageFields) {
      if (!validatePercentage(formData[field])) {
        toast.error(
          "Please enter valid percentage (0-100) for all percentage fields"
        );
        return;
      }
    }

    if (!photo || !signature) {
      toast.error("Please upload both Photo and Signature");
      return;
    }

    if (!formData.declarationAccepted) {
      toast.error("Please accept the declaration to continue.");
      return;
    }

    const loadingToastId = toast.loading("Submitting your application...");

    try {
      const payload = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (key !== "declarationAccepted") {
          payload.append(key, value);
        }
      });

      payload.append("photo", photo);
      payload.append("signature", signature);

      const response = await axios.post(
        "https://clc-backend-0isa.onrender.com",
        payload,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      toast.dismiss(loadingToastId);

      if (response.status === 201) {
        toast.success("Registration successful! Redirecting to your details...");

        const studentId = response.data.data?._id || response.data.data?.id;

        // Redirect to registration details page to review and download
        setTimeout(() => {
          if (studentId) {
            navigate(`/registration-details/${studentId}`);
          } else {
            navigate("/");
          }
        }, 1500);
      }
    } catch (error) {
      toast.dismiss(loadingToastId);
      console.error("Error submitting registration:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to submit registration. Please try again."
      );
    }
  };

  const stateOptions = Object.keys(stateDistricts);
  const districtOptions = formData.state ? stateDistricts[formData.state] : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <section className="w-full max-w-7xl mx-auto">
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3">
              Student Registration Form
            </h1>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Please fill out all the required fields carefully and accurately
            </p>
          </motion.div>
        </div>

        <div className="w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 sm:px-8 lg:px-10 py-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
                <FaGraduationCap className="text-3xl sm:text-4xl" />
                Application Form
              </h2>
            </div>

            <div className="px-6 sm:px-8 lg:px-12 py-8 sm:py-10 lg:py-12">
              <form onSubmit={handleSubmit} className="space-y-10 sm:space-y-12">
                {/* Personal Details Section */}
                <section className="space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b-2 border-blue-100">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <FaUser className="text-blue-600 text-xl" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                        Personal Details
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">Step 1 of 4</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Student Name */}
                    <div className="lg:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Student Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaUser className="text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="studentName"
                          value={formData.studentName}
                          onChange={handleChange}
                          required
                          placeholder="Enter full name"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none"
                        />
                      </div>
                    </div>

                    {/* Date of Birth */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Date of Birth <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaCalendar className="text-gray-400" />
                        </div>
                        <input
                          type="date"
                          name="dateOfBirth"
                          value={formData.dateOfBirth}
                          onChange={handleChange}
                          required
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none"
                        />
                      </div>
                    </div>

                    {/* Father's Name */}
                    <div className="sm:col-span-2 lg:col-span-1">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Father's Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="fatherName"
                        value={formData.fatherName}
                        onChange={handleChange}
                        required
                        placeholder="Enter father's name"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none"
                      />
                    </div>

                    {/* Mother's Name */}
                    <div className="sm:col-span-2 lg:col-span-1">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Mother's Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="motherName"
                        value={formData.motherName}
                        onChange={handleChange}
                        required
                        placeholder="Enter mother's name"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none"
                      />
                    </div>

                    {/* Nationality */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Nationality <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="nationality"
                        value={formData.nationality}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none bg-gray-50"
                      />
                    </div>

                    {/* Gender */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Gender <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none"
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Category <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none"
                      >
                        <option value="">Select Category</option>
                        <option value="General">General</option>
                        <option value="OBC">OBC</option>
                        <option value="SC">SC</option>
                        <option value="ST">ST</option>
                        <option value="EWS">EWS</option>
                      </select>
                    </div>

                    {/* Sub Category */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Sub Category
                      </label>
                      <input
                        type="text"
                        name="subCategory"
                        value={formData.subCategory}
                        onChange={handleChange}
                        placeholder="If applicable"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none"
                      />
                    </div>

                    {/* Phone */}
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Contact Number <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaPhone className="text-gray-400" />
                        </div>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          placeholder="Enter 10-digit mobile number"
                          pattern="[0-9]{10}"
                          maxLength="10"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </section>

                {/* Course Selection */}
                <section className="space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b-2 border-blue-100">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <FaBook className="text-blue-600 text-xl" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                        Course Selection
                      </h3>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Select Course <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="course"
                      value={formData.course}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none"
                    >
                      <option value="">Select a Course</option>
                      {courses.map((course) => (
                        <option key={course.code} value={course.code}>
                          {course.code} - {course.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </section>

                {/* Educational Details Section */}
                <section className="space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b-2 border-blue-100">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <FaGraduationCap className="text-blue-600 text-xl" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                        Educational Qualifications
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">Step 2 of 4</p>
                    </div>
                  </div>

                  {/* 10th Details */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
                    <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">
                        1
                      </span>
                      10th Standard Details
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Board/University <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="tenthBoard"
                          value={formData.tenthBoard}
                          onChange={handleChange}
                          required
                          placeholder="e.g., CBSE, ICSE, State Board"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Year of Passing <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="tenthYear"
                          value={formData.tenthYear}
                          onChange={handleChange}
                          required
                          placeholder="e.g., 2020"
                          pattern="[0-9]{4}"
                          maxLength="4"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Roll Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="tenthRollNo"
                          value={formData.tenthRollNo}
                          onChange={handleChange}
                          required
                          placeholder="Enter roll number"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Marksheet Number
                        </label>
                        <input
                          type="text"
                          name="tenthMarksheetNo"
                          value={formData.tenthMarksheetNo}
                          onChange={handleChange}
                          placeholder="Enter marksheet number"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Total Marks <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          name="tenthTotalMarks"
                          value={formData.tenthTotalMarks}
                          onChange={handleChange}
                          required
                          placeholder="e.g., 500"
                          min="0"
                          step="0.01"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Marks Obtained <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          name="tenthMarksObtained"
                          value={formData.tenthMarksObtained}
                          onChange={handleChange}
                          required
                          placeholder="e.g., 450"
                          min="0"
                          step="0.01"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none bg-white"
                        />
                      </div>

                      <div className="sm:col-span-2 lg:col-span-1">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Percentage <span className="text-green-600">(Auto-calculated)</span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            name="tenthPercentage"
                            value={formData.tenthPercentage}
                            readOnly
                            placeholder="Auto-calculated"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-green-50 font-semibold text-green-700 cursor-not-allowed"
                          />
                          {formData.tenthPercentage && (
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600">
                              %
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 12th Details */}
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6">
                    <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <span className="bg-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">
                        2
                      </span>
                      12th Standard Details
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Board/University <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="twelfthBoard"
                          value={formData.twelfthBoard}
                          onChange={handleChange}
                          required
                          placeholder="e.g., CBSE, ICSE, State Board"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 outline-none bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Year of Passing <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="twelfthYear"
                          value={formData.twelfthYear}
                          onChange={handleChange}
                          required
                          placeholder="e.g., 2022"
                          pattern="[0-9]{4}"
                          maxLength="4"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 outline-none bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Roll Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="twelfthRollNo"
                          value={formData.twelfthRollNo}
                          onChange={handleChange}
                          required
                          placeholder="Enter roll number"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 outline-none bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Marksheet Number
                        </label>
                        <input
                          type="text"
                          name="twelfthMarksheetNo"
                          value={formData.twelfthMarksheetNo}
                          onChange={handleChange}
                          placeholder="Enter marksheet number"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 outline-none bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Total Marks <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          name="twelfthTotalMarks"
                          value={formData.twelfthTotalMarks}
                          onChange={handleChange}
                          required
                          placeholder="e.g., 500"
                          min="0"
                          step="0.01"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 outline-none bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Marks Obtained <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          name="twelfthMarksObtained"
                          value={formData.twelfthMarksObtained}
                          onChange={handleChange}
                          required
                          placeholder="e.g., 450"
                          min="0"
                          step="0.01"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 outline-none bg-white"
                        />
                      </div>

                      <div className="sm:col-span-2 lg:col-span-1">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Percentage <span className="text-green-600">(Auto-calculated)</span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            name="twelfthPercentage"
                            value={formData.twelfthPercentage}
                            readOnly
                            placeholder="Auto-calculated"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-green-50 font-semibold text-green-700 cursor-not-allowed"
                          />
                          {formData.twelfthPercentage && (
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600">
                              %
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Graduation Details */}
                  <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-6">
                    <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <span className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">
                        3
                      </span>
                      Graduation Details (If Applicable)
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Board/University
                        </label>
                        <input
                          type="text"
                          name="graduationBoard"
                          value={formData.graduationBoard}
                          onChange={handleChange}
                          placeholder="e.g., University Name"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200 outline-none bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Year of Passing
                        </label>
                        <input
                          type="text"
                          name="graduationYear"
                          value={formData.graduationYear}
                          onChange={handleChange}
                          placeholder="e.g., 2024"
                          pattern="[0-9]{4}"
                          maxLength="4"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200 outline-none bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Roll Number
                        </label>
                        <input
                          type="text"
                          name="graduationRollNo"
                          value={formData.graduationRollNo}
                          onChange={handleChange}
                          placeholder="Enter roll number"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200 outline-none bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Marksheet Number
                        </label>
                        <input
                          type="text"
                          name="graduationMarksheetNo"
                          value={formData.graduationMarksheetNo}
                          onChange={handleChange}
                          placeholder="Enter marksheet number"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200 outline-none bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Total Marks
                        </label>
                        <input
                          type="number"
                          name="graduationTotalMarks"
                          value={formData.graduationTotalMarks}
                          onChange={handleChange}
                          placeholder="e.g., 500"
                          min="0"
                          step="0.01"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200 outline-none bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Marks Obtained
                        </label>
                        <input
                          type="number"
                          name="graduationMarksObtained"
                          value={formData.graduationMarksObtained}
                          onChange={handleChange}
                          placeholder="e.g., 450"
                          min="0"
                          step="0.01"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200 outline-none bg-white"
                        />
                      </div>

                      <div className="sm:col-span-2 lg:col-span-1">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Percentage <span className="text-green-600">(Auto-calculated)</span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            name="graduationPercentage"
                            value={formData.graduationPercentage}
                            readOnly
                            placeholder="Auto-calculated"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-green-50 font-semibold text-green-700 cursor-not-allowed"
                          />
                          {formData.graduationPercentage && (
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600">
                              %
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Other Qualification Details */}
                  <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-6">
                    <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <span className="bg-orange-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">
                        4
                      </span>
                      Other Qualification (If Any)
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Board/University
                        </label>
                        <input
                          type="text"
                          name="otherBoard"
                          value={formData.otherBoard}
                          onChange={handleChange}
                          placeholder="Enter board/university name"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200 outline-none bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Year of Passing
                        </label>
                        <input
                          type="text"
                          name="otherYear"
                          value={formData.otherYear}
                          onChange={handleChange}
                          placeholder="e.g., 2024"
                          pattern="[0-9]{4}"
                          maxLength="4"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200 outline-none bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Roll Number
                        </label>
                        <input
                          type="text"
                          name="otherRollNo"
                          value={formData.otherRollNo}
                          onChange={handleChange}
                          placeholder="Enter roll number"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200 outline-none bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Marksheet Number
                        </label>
                        <input
                          type="text"
                          name="otherMarksheetNo"
                          value={formData.otherMarksheetNo}
                          onChange={handleChange}
                          placeholder="Enter marksheet number"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200 outline-none bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Total Marks
                        </label>
                        <input
                          type="number"
                          name="otherTotalMarks"
                          value={formData.otherTotalMarks}
                          onChange={handleChange}
                          placeholder="e.g., 500"
                          min="0"
                          step="0.01"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200 outline-none bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Marks Obtained
                        </label>
                        <input
                          type="number"
                          name="otherMarksObtained"
                          value={formData.otherMarksObtained}
                          onChange={handleChange}
                          placeholder="e.g., 450"
                          min="0"
                          step="0.01"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200 outline-none bg-white"
                        />
                      </div>

                      <div className="sm:col-span-2 lg:col-span-1">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Percentage <span className="text-green-600">(Auto-calculated)</span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            name="otherPercentage"
                            value={formData.otherPercentage}
                            readOnly
                            placeholder="Auto-calculated"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-green-50 font-semibold text-green-700 cursor-not-allowed"
                          />
                          {formData.otherPercentage && (
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600">
                              %
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Communication Details Section */}
                <section className="space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b-2 border-blue-100">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <FaMapMarkerAlt className="text-blue-600 text-xl" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                        Communication Details
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">Step 3 of 4</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Address */}
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Complete Address <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        rows="4"
                        placeholder="Enter your full residential address"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none resize-none"
                      ></textarea>
                    </div>

                    {/* State */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        State <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none"
                      >
                        <option value="">Select State</option>
                        {stateOptions.map((state) => (
                          <option key={state} value={state}>
                            {state}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* District */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        District <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="district"
                        value={formData.district}
                        onChange={handleChange}
                        required
                        disabled={!formData.state}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                      >
                        <option value="">
                          {formData.state ? "Select District" : "Select State First"}
                        </option>
                        {districtOptions.map((district) => (
                          <option key={district} value={district}>
                            {district}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Pincode */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Pincode <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                        required
                        placeholder="6-digit pincode"
                        pattern="[0-9]{6}"
                        maxLength="6"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaEnvelope className="text-gray-400" />
                        </div>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          placeholder="your.email@example.com"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </section>

                {/* Document Upload Section */}
                <section className="space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b-2 border-blue-100">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <FaIdCard className="text-blue-600 text-xl" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                        Document Upload
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">Step 4 of 4</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Upload Photo <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="file"
                          name="photo"
                          accept="image/*"
                          onChange={handleFileChange}
                          required
                          className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Passport size photo (Max 2MB, JPG/PNG)
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Upload Signature <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="file"
                          name="signature"
                          accept="image/*"
                          onChange={handleFileChange}
                          required
                          className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Clear signature (Max 1MB, JPG/PNG)
                      </p>
                    </div>
                  </div>
                </section>

                {/* Declaration Section */}
                <section className="space-y-4">
                  <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-xl p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <input
                        type="checkbox"
                        name="declarationAccepted"
                        checked={formData.declarationAccepted}
                        onChange={handleChange}
                        required
                        className="mt-1 h-5 w-5 border-2 border-gray-400 rounded text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                      />
                      <div className="flex-1">
                        <label className="text-base font-bold text-gray-900 flex items-center gap-2 cursor-pointer">
                          <FaCheckCircle className="text-blue-600" />
                          Declaration and Acceptance
                        </label>
                        <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                          मैं प्रमाणित करता हूँ कि आनलाइन आवेदन में भरी गयी समस्त
                          प्रविष्टियों मेरे पास उपलब्ध अभिलेखों पर आधारित है एवं मेरे
                          व्यक्तिगत जानकारी में सही एवं सत्य है। आवेदन करने की तिथि
                          को मेरे पास आनलाइन आवेदन में उल्लिखित समस्त
                          अंकपत्र/प्रमाणपत्र, आरक्षण एवं विशेष आरक्षण सम्बन्धी प्रमाण
                          पत्र उपलब्ध है। ऑनलाइन आवेदन पत्र में अपलोड की गयी मेरी फोटो
                          स्वतः स्पष्ट एवं दिये गये निर्देशानुसार हैं। मुझे विज्ञापन
                          की दी गयी समस्त शर्तें मान्य हैं। यदि परीक्षा के पूर्व अथवा
                          बाद में किसी भी स्तर पर जाँचोपरांत ऑनलाइन आवेदन पत्र में
                          कोई भी विवरण त्रुटिपूर्ण / असत्य पाया जाता है तो उसका समस्त
                          उत्तरदायित्व मेरा होगा और सम्बन्धित अधिकारी को मेरा
                          अभ्यर्थन निरस्त करने तथा मेरे विरुद्ध वैधानिक कार्यवाही
                          करने का अधिकार होगा।
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Submit Button */}
                <div className="flex justify-center pt-6">
                  <motion.button
                    type="submit"
                    disabled={!formData.declarationAccepted}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-12 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-3"
                  >
                    <FaPaperPlane className="text-xl" />
                    Submit Application
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Registration;