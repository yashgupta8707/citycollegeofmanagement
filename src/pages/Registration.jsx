import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { FaPaperPlane, FaUser, FaEnvelope, FaPhone, FaCalendar, FaGraduationCap, FaMapMarkerAlt } from 'react-icons/fa';

const Registration = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    fatherName: '',
    motherName: '',
    address: '',
    city: '',
    state: 'Uttar Pradesh',
    pincode: '',
    course: '',
    qualification: '',
    percentage: ''
  });

  const courses = [
    { code: 'BBA', name: 'Bachelor of Business Administration' },
    { code: 'BCA', name: 'Bachelor of Computer Applications' },
    { code: 'BCom', name: 'Bachelor of Commerce' },
    { code: 'BSc(AG)', name: 'Bachelor of Science (Agriculture)' },
    { code: 'BEd', name: 'Bachelor of Education' },
    { code: 'MEd', name: 'Master of Education' },
    { code: 'DElEd', name: 'Diploma in Elementary Education' }
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (formData.percentage < 0 || formData.percentage > 100) {
      toast.error('Please enter valid percentage (0-100)');
      return;
    }

    try {
      // Here you would make API call to backend
      // const response = await axios.post('http://localhost:5000/api/students/register', formData);
      
      toast.success('Registration successful! We will contact you soon.');
      
      // Reset form
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        gender: '',
        fatherName: '',
        motherName: '',
        address: '',
        city: '',
        state: 'Uttar Pradesh',
        pincode: '',
        course: '',
        qualification: '',
        percentage: ''
      });
    } catch (error) {
      toast.error('Registration failed. Please try again.');
    }
  };

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
            <p className="text-xl text-gray-200">Secure Your Future - Apply Now for Admission 2025</p>
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
            className="max-w-4xl mx-auto"
          >
            <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-primary-800 to-primary-900 p-6 text-white text-center">
                <h2 className="text-3xl font-bold mb-2">Course Online Registration Form</h2>
                <p className="opacity-90">* Specified fields are mandatory</p>
              </div>

              <form onSubmit={handleSubmit} className="p-8">
                {/* Personal Details Section */}
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-primary-900 mb-6 pb-2 border-b-2 border-secondary-500">
                    Personal Details
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        Student Name* <FaUser className="inline text-secondary-500" />
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        placeholder="Enter full name"
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        Date of Birth* <FaCalendar className="inline text-secondary-500" />
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

                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        Mother Name*
                      </label>
                      <input
                        type="text"
                        name="motherName"
                        value={formData.motherName}
                        onChange={handleChange}
                        required
                        placeholder="Enter mother's name"
                        className="input-field"
                      />
                    </div>

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

                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        Mobile No* <FaPhone className="inline text-secondary-500" />
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
                  </div>
                </div>

                {/* Educational Details Section */}
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-primary-900 mb-6 pb-2 border-b-2 border-secondary-500">
                    Educational Details
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        Course* <FaGraduationCap className="inline text-secondary-500" />
                      </label>
                      <select
                        name="course"
                        value={formData.course}
                        onChange={handleChange}
                        required
                        className="input-field"
                      >
                        <option value="">Choose category</option>
                        {courses.map(course => (
                          <option key={course.code} value={course.code}>{course.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        Last Qualification*
                      </label>
                      <input
                        type="text"
                        name="qualification"
                        value={formData.qualification}
                        onChange={handleChange}
                        required
                        placeholder="e.g., 10+2, Graduation"
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        Percentage*
                      </label>
                      <input
                        type="number"
                        name="percentage"
                        value={formData.percentage}
                        onChange={handleChange}
                        required
                        min="0"
                        max="100"
                        step="0.01"
                        placeholder="Enter percentage"
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        Email* <FaEnvelope className="inline text-secondary-500" />
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="Enter email address"
                        className="input-field"
                      />
                    </div>
                  </div>
                </div>

                {/* Communication Details Section */}
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-primary-900 mb-6 pb-2 border-b-2 border-secondary-500">
                    Communication/Correspondence Details
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-gray-700 font-semibold mb-2">
                        Address* <FaMapMarkerAlt className="inline text-secondary-500" />
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

                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        City*
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        placeholder="Enter city"
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        State*
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        required
                        className="input-field"
                      />
                    </div>

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
                        placeholder="Enter pincode"
                        className="input-field"
                      />
                    </div>
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="mb-6 p-4 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-700">
                  <p>
                    * यदि ऑनलाइन आवेदन भरते समय कोई त्रुटि हो जाती है तो पूर्ण रूप से प्रविष्टियों का सत्यापन सत्य एवं सही पाया जाता है।
                    प्रवेश समाप्ति से पूर्व आवेदक स्वयं इसके लिए दोषी रहेंगे। सत्यापन हेतु माता-पिता / आवेदक हेतु अभिभावक सभी कागज अभिलेख अनिवार्य लाना होगा। अन्यथा विवरण झूठा, गलत, पाया गया तो मुझ पर वैधानिक कार्यवाही करने हेतु मैं सहमत हूं।
                    (विभाग सहमत)
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

          {/* Important Notes */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto mt-12"
          >
            <div className="card p-8">
              <h3 className="text-2xl font-bold text-primary-900 mb-4">Important Instructions</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-secondary-500 mr-2">•</span>
                  Fill all mandatory fields marked with asterisk (*)
                </li>
                <li className="flex items-start">
                  <span className="text-secondary-500 mr-2">•</span>
                  Ensure all information provided is accurate and complete
                </li>
                <li className="flex items-start">
                  <span className="text-secondary-500 mr-2">•</span>
                  Keep all original documents ready for verification
                </li>
                <li className="flex items-start">
                  <span className="text-secondary-500 mr-2">•</span>
                  You will receive confirmation email/SMS after successful registration
                </li>
                <li className="flex items-start">
                  <span className="text-secondary-500 mr-2">•</span>
                  For any queries, contact: +91 8400133333 | +91 8177001081
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Registration;