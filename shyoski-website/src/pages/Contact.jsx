import React from 'react';
import { Mail, Phone, MapPin, Clock, ArrowRight } from 'lucide-react';

const Contact = () => {
  const googleFormLink = "https://docs.google.com/forms/d/e/1FAIpQLSeey9kkc0SgDn3_zgfK1DRA-E0LloHQpNMvmg1E9rOq2DS31A/viewform?usp=publish-editor"; 

  return (
    <div className="bg-slate-50 min-h-screen">
      
      {/* --- HEADER --- */}
      <div className="pt-32 pb-10 text-center px-4 bg-white shadow-sm">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Get in Touch</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Have questions about the internship program or our services? We are here to help.
        </p>
      </div>

      {/* --- CONTACT CARDS --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          
          {/* Email Card */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mx-auto mb-6">
              <Mail size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Email Us</h3>
            <p className="text-slate-500 mb-4">For general inquiries and support</p>
            <a href="mailto:contact@shyoski.com" className="text-blue-600 font-semibold hover:underline">
              contact@shyoski.com
            </a>
          </div>

          {/* Phone Card */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-6">
              <Phone size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Call Us</h3>
            <p className="text-slate-500 mb-4">Mon-Fri from 9am to 6pm</p>
            <p className="text-slate-900 font-semibold">
              +91 98765 43210
            </p>
          </div>

          {/* Office Card */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mx-auto mb-6">
              <MapPin size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Visit Office</h3>
            <p className="text-slate-500 mb-4">Bengaluru, Karnataka</p>
            <p className="text-sm text-slate-400">
              (Visits by appointment only)
            </p>
          </div>
        </div>

        {/* --- FAQ / CTA SECTION --- */}
        <div className="bg-blue-600 rounded-3xl p-8 md:p-16 text-center text-white shadow-xl">
          <h2 className="text-3xl font-bold mb-4">Ready to start your career?</h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            The December 5th batch is filling up fast. Don't wait for the last minute to secure your spot in the internship program.
          </p>
          <a 
            href={googleFormLink}
            target="_blank" 
            className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-50 transition-colors"
          >
            Apply Now <ArrowRight size={20} />
          </a>
        </div>

      </div>
    </div>
  );
};

export default Contact;