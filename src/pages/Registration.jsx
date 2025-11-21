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

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "state") {
      setFormData((prev) => ({
        ...prev,
        state: value,
        district: "",
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
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

    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        payload.append(key, value);
      });
      payload.append("photo", photo);
      payload.append("signature", signature);

      const response = await axios.post(
        "http://localhost:5000/api/students/register",
        payload,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      toast.success("Registration successful! We will contact you soon.");

      const newId = response.data.data._id;
      navigate(`/registration-details/${newId}`);
    } catch (error) {
      console.error(error);
      const msg =
        error.response?.data?.message || "Registration failed. Please try again.";
      toast.error(msg);
    }
  };

  const stateOptions = Object.keys(stateDistricts);
  const districtOptions = formData.state
    ? stateDistricts[formData.state] || []
    : [];


  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center gradient-bg">
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              ONLINE REGISTRATION
            </h1>
            <p className="text-xl text-gray-200">
              Secure Your Future - Apply Now for Admission 2025
            </p>
          </motion.div>
        </div>
      </section>

      {/* Registration Notice */}
      <section className="bg-secondary-100 border-t-4 border-secondary-500 py-4">
        <div className="container mx-auto px-4 md:px-8">
          <p className="text-center text-gray-800 font-semibold">
            📢 Online Registration for Admission Session 2024-25 is started
          </p>
        </div>
      </section>

      {/* Registration Form */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto"
          >
            <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-primary-800 to-primary-900 p-6 text-white text-center">
                <h2 className="text-3xl font-bold mb-2">
                  Course Online Registration Form
                </h2>
                <p className="opacity-90">* Specified fields are mandatory</p>
              </div>

              <form onSubmit={handleSubmit} className="p-8">
                {/* Personal Details */}
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-primary-900 mb-6 pb-2 border-b-2 border-secondary-500">
                    Personal Details
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Student Name */}
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        Student Name*{" "}
                        <FaUser className="inline text-secondary-500" />
                      </label>
                      <input
                        type="text"
                        name="studentName"
                        value={formData.studentName}
                        onChange={handleChange}
                        required
                        placeholder="Enter full name"
                        className="input-field"
                      />
                    </div>

                    {/* Date of Birth */}
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        Date of Birth*{" "}
                        <FaCalendar className="inline text-secondary-500" />
                        <span className="ml-1 text-xs text-gray-500">
                          (dd-mm-yyyy)
                        </span>
                      </label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        required
                        className="input-field"
                      />
                    </div>

                    {/* Father Name */}
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        Father Name*
                      </label>
                      <input
                        type="text"
                        name="fatherName"
                        value={formData.fatherName}
                        onChange={handleChange}
                        required
                        placeholder="Enter father's name"
                        className="input-field"
                      />
                    </div>

                    {/* Mother Name */}
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        Mother Name
                      </label>
                      <input
                        type="text"
                        name="motherName"
                        value={formData.motherName}
                        onChange={handleChange}
                        placeholder="Enter mother's name"
                        className="input-field"
                      />
                    </div>

                    {/* Nationality */}
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        Nationality*
                      </label>
                      <select
                        name="nationality"
                        value={formData.nationality}
                        onChange={handleChange}
                        required
                        className="input-field"
                      >
                        <option value="">Select Nationality</option>
                        <option value="Indian">Indian</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        Category*
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                        className="input-field"
                      >
                        <option value="">Choose category</option>
                        <option value="General">General</option>
                        <option value="OBC">OBC</option>
                        <option value="SC">SC</option>
                        <option value="ST">ST</option>
                        <option value="EWS">EWS</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    {/* Gender */}
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        Gender*
                      </label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        required
                        className="input-field"
                      >
                        <option value="">Choose category</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    {/* Mobile No */}
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        Mobile No*{" "}
                        <FaPhone className="inline text-secondary-500" />
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        placeholder="Enter mobile number"
                        className="input-field"
                      />
                    </div>

                    {/* Sub Category */}
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        Sub Category*
                      </label>
                      <select
                        name="subCategory"
                        value={formData.subCategory}
                        onChange={handleChange}
                        required
                        className="input-field"
                      >
                        <option value="">Choose category</option>
                        <option value="None">None</option>
                        <option value="PWD">PWD</option>
                        <option value="Ex-Serviceman">Ex-Serviceman</option>
                        <option value="Freedom Fighter">Freedom Fighter</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Educational Details */}
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-primary-900 mb-6 pb-2 border-b-2 border-secondary-500">
                    Educational Details
                  </h3>

                  {/* Course Applied */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        Course Applying For*{" "}
                        <FaGraduationCap className="inline text-secondary-500" />
                      </label>
                      <select
                        name="course"
                        value={formData.course}
                        onChange={handleChange}
                        required
                        className="input-field"
                      >
                        <option value="">Choose course</option>
                        {courses.map((course) => (
                          <option key={course.code} value={course.code}>
                            {course.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* 10th */}
                  <div className="mb-6 border rounded-lg p-4">
                    <h4 className="font-semibold text-primary-800 mb-4">10th</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                          Board/University
                        </label>
                        <input
                          type="text"
                          name="tenthBoard"
                          value={formData.tenthBoard}
                          onChange={handleChange}
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                          Year
                        </label>
                        <input
                          type="text"
                          name="tenthYear"
                          value={formData.tenthYear}
                          onChange={handleChange}
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                          Marksheet No
                        </label>
                        <input
                          type="text"
                          name="tenthMarksheetNo"
                          value={formData.tenthMarksheetNo}
                          onChange={handleChange}
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                          Roll No
                        </label>
                        <input
                          type="text"
                          name="tenthRollNo"
                          value={formData.tenthRollNo}
                          onChange={handleChange}
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                          Total Marks
                        </label>
                        <input
                          type="number"
                          name="tenthTotalMarks"
                          value={formData.tenthTotalMarks}
                          onChange={handleChange}
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                          Marks Obtained
                        </label>
                        <input
                          type="number"
                          name="tenthMarksObtained"
                          value={formData.tenthMarksObtained}
                          onChange={handleChange}
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                          Percentage
                        </label>
                        <input
                          type="number"
                          name="tenthPercentage"
                          value={formData.tenthPercentage}
                          onChange={handleChange}
                          min="0"
                          max="100"
                          step="0.01"
                          className="input-field"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 12th */}
                  <div className="mb-6 border rounded-lg p-4">
                    <h4 className="font-semibold text-primary-800 mb-4">12th</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                          Board/University
                        </label>
                        <input
                          type="text"
                          name="twelfthBoard"
                          value={formData.twelfthBoard}
                          onChange={handleChange}
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                          Year
                        </label>
                        <input
                          type="text"
                          name="twelfthYear"
                          value={formData.twelfthYear}
                          onChange={handleChange}
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                          Marksheet No
                        </label>
                        <input
                          type="text"
                          name="twelfthMarksheetNo"
                          value={formData.twelfthMarksheetNo}
                          onChange={handleChange}
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                          Roll No
                        </label>
                        <input
                          type="text"
                          name="twelfthRollNo"
                          value={formData.twelfthRollNo}
                          onChange={handleChange}
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                          Total Marks
                        </label>
                        <input
                          type="number"
                          name="twelfthTotalMarks"
                          value={formData.twelfthTotalMarks}
                          onChange={handleChange}
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                          Marks Obtained
                        </label>
                        <input
                          type="number"
                          name="twelfthMarksObtained"
                          value={formData.twelfthMarksObtained}
                          onChange={handleChange}
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                          Percentage
                        </label>
                        <input
                          type="number"
                          name="twelfthPercentage"
                          value={formData.twelfthPercentage}
                          onChange={handleChange}
                          min="0"
                          max="100"
                          step="0.01"
                          className="input-field"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Graduation */}
                  <div className="mb-6 border rounded-lg p-4">
                    <h4 className="font-semibold text-primary-800 mb-4">
                      Graduation
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                          Board/University
                        </label>
                        <input
                          type="text"
                          name="graduationBoard"
                          value={formData.graduationBoard}
                          onChange={handleChange}
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                          Year
                        </label>
                        <input
                          type="text"
                          name="graduationYear"
                          value={formData.graduationYear}
                          onChange={handleChange}
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                          Marksheet No
                        </label>
                        <input
                          type="text"
                          name="graduationMarksheetNo"
                          value={formData.graduationMarksheetNo}
                          onChange={handleChange}
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                          Roll No
                        </label>
                        <input
                          type="text"
                          name="graduationRollNo"
                          value={formData.graduationRollNo}
                          onChange={handleChange}
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                          Total Marks
                        </label>
                        <input
                          type="number"
                          name="graduationTotalMarks"
                          value={formData.graduationTotalMarks}
                          onChange={handleChange}
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                          Marks Obtained
                        </label>
                        <input
                          type="number"
                          name="graduationMarksObtained"
                          value={formData.graduationMarksObtained}
                          onChange={handleChange}
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                          Percentage
                        </label>
                        <input
                          type="number"
                          name="graduationPercentage"
                          value={formData.graduationPercentage}
                          onChange={handleChange}
                          min="0"
                          max="100"
                          step="0.01"
                          className="input-field"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Other */}
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold text-primary-800 mb-4">
                      Other
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                          Board/University
                        </label>
                        <input
                          type="text"
                          name="otherBoard"
                          value={formData.otherBoard}
                          onChange={handleChange}
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                          Year
                        </label>
                        <input
                          type="text"
                          name="otherYear"
                          value={formData.otherYear}
                          onChange={handleChange}
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                          Marksheet No
                        </label>
                        <input
                          type="text"
                          name="otherMarksheetNo"
                          value={formData.otherMarksheetNo}
                          onChange={handleChange}
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                          Roll No
                        </label>
                        <input
                          type="text"
                          name="otherRollNo"
                          value={formData.otherRollNo}
                          onChange={handleChange}
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                          Total Marks
                        </label>
                        <input
                          type="number"
                          name="otherTotalMarks"
                          value={formData.otherTotalMarks}
                          onChange={handleChange}
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                          Marks Obtained
                        </label>
                        <input
                          type="number"
                          name="otherMarksObtained"
                          value={formData.otherMarksObtained}
                          onChange={handleChange}
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                          Percentage
                        </label>
                        <input
                          type="number"
                          name="otherPercentage"
                          value={formData.otherPercentage}
                          onChange={handleChange}
                          min="0"
                          max="100"
                          step="0.01"
                          className="input-field"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Communication / Correspondence Details */}
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-primary-900 mb-6 pb-2 border-b-2 border-secondary-500">
                    Communication/Correspondence Details
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Address */}
                    <div className="md:col-span-2">
                      <label className="block text-gray-700 font-semibold mb-2">
                        Address{" "}
                        <FaMapMarkerAlt className="inline text-secondary-500" />
                      </label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        rows="3"
                        placeholder="Enter your address"
                        className="textarea-field"
                      ></textarea>
                    </div>

                    {/* State (Dynamic) */}
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        State*
                      </label>
                      <select
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        required
                        className="input-field"
                      >
                        <option value="">--Select State--</option>
                        {stateOptions.map((state) => (
                          <option key={state} value={state}>
                            {state}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* District (Depends on State) */}
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        District*
                      </label>
                      <select
                        name="district"
                        value={formData.district}
                        onChange={handleChange}
                        required
                        disabled={!formData.state}
                        className="input-field"
                      >
                        <option value="">
                          {formData.state
                            ? "--Select District--"
                            : "Select State First"}
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
                      <label className="block text-gray-700 font-semibold mb-2">
                        Pincode*
                      </label>
                      <input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                        required
                        placeholder="Pincode"
                        className="input-field"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        Email*{" "}
                        <FaEnvelope className="inline text-secondary-500" />
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="Email Id"
                        className="input-field"
                      />
                    </div>
                  </div>
                </div>

                {/* Document Upload */}
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-primary-900 mb-6 pb-2 border-b-2 border-secondary-500">
                    Document Uploaded
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        Upload your photo*
                      </label>
                      <input
                        type="file"
                        name="photo"
                        accept="image/*"
                        onChange={handleFileChange}
                        required
                        className="block w-full text-sm text-gray-700"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        Upload Signature*
                      </label>
                      <input
                        type="file"
                        name="signature"
                        accept="image/*"
                        onChange={handleFileChange}
                        required
                        className="block w-full text-sm text-gray-700"
                      />
                    </div>
                  </div>
                </div>

                {/* Declaration (Hindi Text) */}
                <div className="mb-6 p-4 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-700 leading-relaxed">
                  <p>
                    मैं प्रमाणित करता हूँ कि आनलाइन आवेदन में भरी गयी समस्त
                    प्रविष्टियों मेरे पास उपलब्ध अभिलेखों पर आधारित है एवं मेरे
                    व्यक्तिगत जानकारी में सही एवं सत्य है। आवेदन करने की तिथि को
                    मेरे पास आनलाइन आवेदन में उल्लिखित समस्त अंकपरप्रमाणपर
                    आरक्षण एवं विशेष आरक्षण सम्बन्धी प्रमाण पत्र उपलब्ध है।
                    आनलाइन आवेदन पत्र में अपलोड की गयी मेरी फोटो स्वतः स्पष्ट एवं
                    दिये गये निर्देशानुसार हैं। मुझे विज्ञापन की दी गयी समस्त
                    शर्तें मान्य हैं। यदि परीक्षा के पूर्व अथवा बाद में किसी भी
                    स्तर पर जाँचोपरांत आनलाइन आवेदन पत्र में कोई भी विवरण
                    त्रुटिपूर्ण / असत्य पाया जाता है तो उसका समस्त उत्तरदायित्व
                    मेरा होगा और सम्बन्धित अधिकारी को मेरा अभ्यर्थन निरस्त करने
                    तथा मेरे विरुद्ध वैधानिक कार्यवाही करने का अधिकार होगा।
                  </p>
                </div>

                {/* Submit Button */}
                <div className="text-center">
                  <button
                    type="submit"
                    className="btn-primary px-12 py-4 text-lg flex items-center justify-center mx-auto"
                  >
                    <FaPaperPlane className="mr-3" />
                    Submit Application
                  </button>
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
