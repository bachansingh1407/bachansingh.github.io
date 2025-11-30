"use client"
import Link from 'next/link';
import { FaEnvelope, FaLinkedin, FaGithub, FaPaperPlane, FaCheck } from 'react-icons/fa';
import { useFormik } from 'formik';
import { contactFormSchema } from '../utils/validation';
import { useDispatch, useSelector } from 'react-redux';
import { sendMailAction } from '../slices/mailSlice';
import toast from 'react-hot-toast';

export default function Contact() {
    const dispatch = useDispatch();
    const { sendMailLoader } = useSelector((state) => state.mail);

    const contactMethods = [
        {
            platform: 'Email',
            value: 'bachansingh1407@gmail.com',
            icon: <FaEnvelope className="text-xl" />,
            link: 'mailto:bachansingh1407@gmail.com',
            description: 'Send me an email for professional inquiries'
        },
        {
            platform: 'LinkedIn',
            value: 'bachan-singh',
            icon: <FaLinkedin className="text-xl" />,
            link: 'https://linkedin.com/in/bachan-singh',
            description: 'Connect with me professionally'
        },
        {
            platform: 'GitHub',
            value: 'bachansingh1407',
            icon: <FaGithub className="text-xl" />,
            link: 'https://github.com/bachansingh1407',
            description: 'Check out my projects and contributions'
        }
    ];

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            subject: '',
            message: ''
        },
        validationSchema: contactFormSchema,
        onSubmit: async (values, { resetForm }) => {
            try {
                const result = await dispatch(sendMailAction(values)).unwrap();
                toast.success(result?.message || "Email sent successfully! I'll get back to you soon.");
                resetForm();
            } catch (error) {
                toast.error(error || "Failed to send message. Please try again.");
            }
        }
    });

    return (
        <section id="contact" className="py-12 md:py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-12 md:mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                        Let's Work <span className="text-blue-600">Together</span>
                    </h2>
                    <div className="w-20 h-1 bg-blue-600 mx-auto mb-4 md:mb-6"></div>
                    <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4 sm:px-0">
                        Ready to bring your ideas to life? Let's discuss how we can create something amazing.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
                    {/* Left Side - Contact Methods */}
                    <div className="space-y-6 md:space-y-8 px-4 sm:px-0">
                        <div>
                            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                                Got ideas? I've got the skills. Let's team up.
                            </h3>
                            <p className="text-gray-600 mb-6 text-sm sm:text-base">
                                I'm always interested in hearing about new projects and opportunities.
                            </p>
                            
                            <div className="space-y-3 mb-6 md:mb-8">
                                <div className="flex items-center space-x-3">
                                    <FaCheck className="text-green-500 text-sm flex-shrink-0" />
                                    <span className="text-gray-700 text-sm sm:text-base">Available for freelance work</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <FaCheck className="text-green-500 text-sm flex-shrink-0" />
                                    <span className="text-gray-700 text-sm sm:text-base">Quick response time</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <FaCheck className="text-green-500 text-sm flex-shrink-0" />
                                    <span className="text-gray-700 text-sm sm:text-base">Professional collaboration</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {contactMethods.map((contact, index) => (
                                <Link
                                    key={index}
                                    href={contact.link}
                                    target={contact.platform !== "Email" ? "_blank" : "_self"}
                                    rel={contact.platform !== "Email" ? "noopener noreferrer" : ""}
                                    className="group block"
                                >
                                    <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 border border-gray-200 rounded-lg hover:border-blue-400 hover:shadow-sm transition-all duration-200">
                                        <div className="flex items-center space-x-3 sm:space-x-4">
                                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-lg flex items-center justify-center text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                                                {contact.icon}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors text-sm sm:text-base truncate">
                                                    {contact.platform}
                                                </h4>
                                                <p className="text-gray-600 text-xs sm:text-sm truncate">{contact.value}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                                            <span className="text-sm font-medium hidden sm:inline">Reach out</span>
                                            <FaPaperPlane className="text-xs flex-shrink-0" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Right Side - Contact Form */}
                    <div className="bg-gray-50 rounded-xl p-4 sm:p-6 lg:p-8 border border-gray-200">
                        <form onSubmit={formik.handleSubmit} className="space-y-4 sm:space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                        Your Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formik.values.name}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className={`w-full px-3 sm:px-4 py-2 sm:py-3 bg-white border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base ${
                                            formik.touched.name && formik.errors.name 
                                                ? 'border-red-500' 
                                                : 'border-gray-300'
                                        }`}
                                        placeholder="Enter your name"
                                    />
                                    {formik.touched.name && formik.errors.name && (
                                        <p className="mt-1 text-xs sm:text-sm text-red-600">{formik.errors.name}</p>
                                    )}
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formik.values.email}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className={`w-full px-3 sm:px-4 py-2 sm:py-3 bg-white border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base ${
                                            formik.touched.email && formik.errors.email 
                                                ? 'border-red-500' 
                                                : 'border-gray-300'
                                        }`}
                                        placeholder="Enter your email"
                                    />
                                    {formik.touched.email && formik.errors.email && (
                                        <p className="mt-1 text-xs sm:text-sm text-red-600">{formik.errors.email}</p>
                                    )}
                                </div>
                            </div>
                            
                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                                    Subject *
                                </label>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    value={formik.values.subject}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className={`w-full px-3 sm:px-4 py-2 sm:py-3 bg-white border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base ${
                                        formik.touched.subject && formik.errors.subject 
                                            ? 'border-red-500' 
                                            : 'border-gray-300'
                                    }`}
                                    placeholder="What's this about?"
                                />
                                {formik.touched.subject && formik.errors.subject && (
                                    <p className="mt-1 text-xs sm:text-sm text-red-600">{formik.errors.subject}</p>
                                )}
                            </div>
                            
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                                    Message *
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows="4"
                                    value={formik.values.message}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className={`w-full px-3 sm:px-4 py-2 sm:py-3 bg-white border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none text-sm sm:text-base ${
                                        formik.touched.message && formik.errors.message 
                                            ? 'border-red-500' 
                                            : 'border-gray-300'
                                    }`}
                                    placeholder="Tell me about your project..."
                                ></textarea>
                                {formik.touched.message && formik.errors.message && (
                                    <p className="mt-1 text-xs sm:text-sm text-red-600">{formik.errors.message}</p>
                                )}
                            </div>
                            
                            <button
                                type="submit"
                                disabled={sendMailLoader || formik.isSubmitting}
                                className="w-full bg-blue-600 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-lg font-semibold text-base sm:text-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center space-x-2"
                            >
                                {sendMailLoader ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span className="text-sm sm:text-base">Sending...</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="text-sm sm:text-base">Send Message</span>
                                        <FaPaperPlane className="text-xs sm:text-sm" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}