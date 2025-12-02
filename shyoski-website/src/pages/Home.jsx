import { ArrowRight, Calendar, Code, Laptop, Users, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  // REPLACE THIS with your specific Google Form URL
  const googleFormLink = "https://docs.google.com/forms/d/e/1FAIpQLSeey9kkc0SgDn3_zgfK1DRA-E0LloHQpNMvmg1E9rOq2DS31A/viewform?usp=publish-editor"; 

  return (
    <div className="bg-slate-50">
      
      {/* --- HERO SECTION --- */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto text-center">
          
          {/* Date Announcement Badge */}
          <div className="inline-flex items-center gap-2 bg-blue-100 border border-blue-200 text-blue-700 px-4 py-2 rounded-full text-sm font-bold mb-8 animate-bounce shadow-sm">
            <Calendar size={16} />
            <span>Next Batch Starts: December 5th</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-6">
            Launch Your IT Career with <span className="text-blue-600">Shyoski</span>
          </h1>
          
          <p className="mt-4 text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Stop just learning syntax. Start building real software. Join our internship program to work on live industry projects.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a 
              href={googleFormLink}
              target="_blank"
              className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white text-lg font-bold rounded-full shadow-xl hover:bg-blue-700 transition-all hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              Apply for Internship <ArrowRight size={20} />
            </a>
            <Link 
              to="/about"
              className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 border border-slate-200 text-lg font-bold rounded-full hover:bg-gray-50 transition-all flex items-center justify-center"
            >
              Learn More
            </Link>
          </div>

          <p className="mt-6 text-sm text-slate-500">
            Limited seats available for the December batch.
          </p>
        </div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Why Choose Shyoski?</h2>
            <p className="text-slate-600 mt-2">We don't just teach; we train you for the job.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-6">
                <Laptop size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">Live Projects</h3>
              <p className="text-slate-600">Work on actual software that goes into production, not just "To-Do List" apps.</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 mb-6">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">Expert Mentorship</h3>
              <p className="text-slate-600">Code reviews and daily guidance from developers who are currently working in the industry.</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600 mb-6">
                <Code size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">Modern Stack</h3>
              <p className="text-slate-600">Master React, Node.js, Flutter, and Cloud technologies that companies are hiring for right now.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- TECHNOLOGIES STRIP --- */}
      <section className="py-10 bg-slate-900 text-slate-400">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm uppercase tracking-widest mb-6 font-semibold">Technologies You Will Master</p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-70">
            <span className="text-xl font-bold text-white flex items-center gap-2"><CheckCircle size={18} className="text-blue-500"/> Full Stack Web Development</span>
            <span className="text-xl font-bold text-white flex items-center gap-2"><CheckCircle size={18} className="text-green-500"/> Cyber Security</span>
            <span className="text-xl font-bold text-white flex items-center gap-2"><CheckCircle size={18} className="text-cyan-500"/> Java</span>
            <span className="text-xl font-bold text-white flex items-center gap-2"><CheckCircle size={18} className="text-orange-500"/>Machine Learning</span>
            <span className="text-xl font-bold text-white flex items-center gap-2"><CheckCircle size={18} className="text-purple-500"/>UI/UX</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;