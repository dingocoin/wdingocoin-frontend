import { Link } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-dark-900 text-white px-4 py-3">
      <div className="flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
          <img src={`${process.env.PUBLIC_URL}/wDingocoin.png`} alt="wDingocoin Logo" className="h-8 w-8" />
          <span className="font-bold text-lg sm:text-xl">wDingocoin Bridge</span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-6">
          <Link to="/" className="hover:text-primary-400 transition-colors">Home</Link>
          <Link to="/bridge" className="hover:text-primary-400 transition-colors">Bridge</Link>
          <Link to="/status" className="hover:text-primary-400 transition-colors">Status</Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 hover:bg-dark-800 rounded-lg transition-colors"
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 pb-4 border-t border-dark-800">
          <div className="flex flex-col gap-4 pt-4">
            <Link 
              to="/" 
              className="hover:text-primary-400 transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/bridge" 
              className="hover:text-primary-400 transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Bridge
            </Link>
            <Link 
              to="/status" 
              className="hover:text-primary-400 transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Status
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}