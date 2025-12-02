import React from 'react';
import { Target, Lightbulb, TrendingUp } from 'lucide-react';

const About = () => {
  return (
    <div className="bg-white">
      
      {/* --- HERO HEADER --- */}
      <div className="pt-32 pb-12 bg-slate-50 text-center px-4">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">About Shyoski</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          We are more than just an IT company. We are a launchpad for the next generation of software engineers.
        </p>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          
          {/* Text Section */}
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Mission</h2>
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Shyoski was founded with a single goal: To bridge the gap between academic learning and industry requirements.
            </p>
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              We realized that many brilliant students graduate without the practical skills needed to survive in a corporate environment. Our internship program changes that by providing an ecosystem where students work on <span className="text-blue-600 font-bold">real-world projects</span> under the guidance of industry experts.
            </p>
            <p className="text-lg text-slate-600 leading-relaxed">
              Simultaneously, as an IT Services firm, we deliver cutting-edge software solutions to our clients, ensuring that our code is always production-grade.
            </p>
          </div>

          {/* Image Section */}
          <div className="relative">
            {/* Decorative background blob */}
            <div className="absolute -inset-4 bg-blue-100 rounded-xl transform rotate-2"></div>
            
            {/* Actual Image */}
            <img 
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80" 
              alt="Shyoski Team Collaboration" 
              className="relative rounded-xl shadow-lg w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>

      {/* --- VALUES SECTION --- */}
      <div className="bg-slate-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4">
                <Target size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">Practical Focus</h3>
              <p className="text-slate-600">We believe in learning by doing. No theory-only lectures; just code.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600 mb-4">
                <Lightbulb size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">Innovation</h3>
              <p className="text-slate-600">We encourage students to think outside the box and solve complex problems.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600 mb-4">
                <TrendingUp size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">Career Growth</h3>
              <p className="text-slate-600">Our ultimate metric of success is your placement in a top company.</p>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
};

export default About;