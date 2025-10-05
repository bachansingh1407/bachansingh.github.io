import React from 'react';
import Image from 'next/image';

const Contact = () => {
  const contactMethods = [
    {
      platform: 'Email',
      value: 'bachansingh1407@gmail.com',
      icon: '/assets/icons/gmail.png',
      link: 'mailto:bachansingh1407@gmail.com',
      gradient: 'from-red-400 to-red-600',
      description: 'Send me an email for professional inquiries'
    },
    {
      platform: 'LinkedIn',
      value: 'bachan-singh',
      icon: '/assets/icons/LinkedIn.png',
      link: 'https://linkedin.com/in/bachan-singh',
      gradient: 'from-blue-500 to-blue-700',
      description: 'Connect with me professionally'
    },
    {
      platform: 'GitHub',
      value: 'bachansingh1407',
      icon: '/assets/icons/GitHub.png',
      link: 'https://github.com/bachansingh1407',
      gradient: 'from-gray-700 to-gray-900',
      description: 'Check out my projects and contributions'
    },
    // {
    //   platform: 'Phone',
    //   value: '+91 XXXXX XXXXX',
    //   icon: '/assets/icons/phone.png', // You might need to add this icon
    //   link: 'tel:+91XXXXXXXXXX',
    //   gradient: 'from-green-400 to-green-600',
    //   description: 'Available for calls during business hours'
    // }
  ];

  return (
    <div className="min-h-screen py-20 px-4 relative overflow-hidden">

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-20">
          {/* <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 mb-6">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
            <span className="text-green-400 text-sm font-medium">Available for Opportunities</span>
          </div> */}
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6">
            Let's <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">Connect</span>
          </h1>
          <p className="text-xl text-gray-900 max-w-2xl mx-auto leading-relaxed">
            Ready to bring your ideas to life? Let's discuss how we can work together to create something amazing.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Contact Information */}
          <div className="space-y-8">
            {/* Main Contact Card */}
            <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                <svg className="w-8 h-8 mr-3 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Get In Touch
              </h2>
              <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                I'm always open to discussing new opportunities, creative projects, or just having a friendly chat about technology and development.
              </p>

              {/* Contact Methods Grid */}
              <div className="grid gap-6">
                {contactMethods.map((method, index) => (
                  <a
                    key={index}
                    href={method.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/5 hover:border-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                  >
                    <div className="flex items-center gap-4">
                      {/* Icon Container */}
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${method.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                        <Image
                          src={method.icon}
                          alt={method.platform}
                          width={24}
                          height={24}
                          className="w-6 h-6 object-contain"
                        />
                      </div>
                      
                      {/* Text Content */}
                      <div className="flex-1">
                        <h3 className="text-white font-semibold text-lg mb-1">{method.platform}</h3>
                        <p className="text-gray-300 text-sm mb-2">{method.value}</p>
                        <p className="text-gray-400 text-xs">{method.description}</p>
                      </div>
                      
                      {/* Arrow Icon */}
                      <div className="opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                        <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Availability Status */}
            {/* <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
                <svg className="w-6 h-6 mr-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Current Status
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Availability</span>
                  <span className="flex items-center text-green-400">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                    Available
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Response Time</span>
                  <span className="text-cyan-400">Within 24 hours</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Preferred Contact</span>
                  <span className="text-purple-400">Email & LinkedIn</span>
                </div>
              </div>
            </div> */}
          </div>

          {/* Contact Form */}
          <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
            <h2 className="text-3xl font-bold text-white mb-2">Send a Message</h2>
            <p className="text-gray-300 mb-8">Let's start a conversation about your project</p>

            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Your Name</label>
                  <input
                    type="text"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:bg-white/10 transition-all duration-300"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Your Email</label>
                  <input
                    type="email"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:bg-white/10 transition-all duration-300"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Subject</label>
                <input
                  type="text"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:bg-white/10 transition-all duration-300"
                  placeholder="What's this about?"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Message</label>
                <textarea
                  rows={6}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:bg-white/10 transition-all duration-300 resize-none"
                  placeholder="Tell me about your project or inquiry..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold py-4 rounded-2xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 group"
              >
                <span>Send Message</span>
                <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </form>

            {/* Quick Response Info */}
            <div className="mt-8 p-4 bg-cyan-500/10 rounded-2xl border border-cyan-500/20">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-cyan-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-cyan-300 text-sm">
                  I typically respond to all messages within 24 hours. For urgent matters, feel free to connect on LinkedIn.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        {/* <div className="text-center mt-20">
          <div className="bg-slate-800/40 backdrop-blur-xl rounded-3xl p-12 border border-white/10 shadow-2xl">
            <h3 className="text-3xl font-bold text-white mb-4">
              Ready to Start Your Project?
            </h3>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto text-lg">
              Let's transform your ideas into reality. Whether it's a web application, portfolio, or business solution, I'm here to help you succeed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold rounded-2xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                Schedule a Call
              </button>
              <button className="px-8 py-4 bg-white/10 text-white font-semibold rounded-2xl border border-white/20 hover:bg-white/20 hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                View My Work
              </button>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Contact; 