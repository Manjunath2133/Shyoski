import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const googleFormLink = "https://docs.google.com/forms/d/e/1FAIpQLSeey9kkc0SgDn3_zgfK1DRA-E0LloHQpNMvmg1E9rOq2DS31A/viewform?usp=publish-editor"; // We will update this later

  return (
    <nav className="bg-white/90 backdrop-blur-md shadow-sm fixed w-full top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo Image */}
          <Link to="/" className="flex items-center">
          {/* Adjust h-10 (height) as needed to fit your specific logo shape */}
            <img 
              src="/logo-hd.png" 
              alt="Shyoski Logo" 
              className="h-10 w-auto object-contain" 
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link to="/" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">Home</Link>
            <Link to="/about" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">About</Link>
            <Link to="/contact" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">Contact</Link>
            
            <a 
              href={googleFormLink} 
              target="_blank" 
              className="bg-blue-600 text-white px-5 py-2.5 rounded-full font-medium hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/30"
            >
              Apply Now
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600 hover:text-blue-600">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 absolute w-full shadow-xl">
          <div className="px-4 pt-2 pb-6 space-y-2 flex flex-col">
            <Link to="/" className="py-3 text-slate-600 font-medium border-b border-gray-50" onClick={() => setIsOpen(false)}>Home</Link>
            <Link to="/about" className="py-3 text-slate-600 font-medium border-b border-gray-50" onClick={() => setIsOpen(false)}>About</Link>
            <Link to="/contact" className="py-3 text-slate-600 font-medium border-b border-gray-50" onClick={() => setIsOpen(false)}>Contact</Link>
            <a 
              href={googleFormLink} 
              target="_blank" 
              className="mt-4 bg-blue-600 text-center text-white py-3 rounded-lg font-bold"
            >
              Apply Now
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;