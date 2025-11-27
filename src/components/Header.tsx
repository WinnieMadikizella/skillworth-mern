import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: '/about', label: 'About Us' },
    { href: '/mentors', label: 'Mentors' },
    { href: '/for-learners', label: 'For Learners' },
    { href: '/for-employers', label: 'For Employers' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-gray-800">SkillWorth</Link>
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map(link => (
            <Link key={link.href} to={link.href} className="text-gray-600 hover:text-blue-600 transition-colors duration-300">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600 focus:outline-none">
            <Menu size={24} />
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden bg-white py-2">
          {navLinks.map(link => (
            <Link key={link.href} to={link.href} className="block px-6 py-2 text-gray-600 hover:bg-gray-100" onClick={() => setIsMenuOpen(false)}>
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}