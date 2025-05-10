import { Link } from 'react-router-dom';
import { Github, Linkedin, Twitter } from 'lucide-react';
import Logo from './Logo';

const Footer = () => {
  return (
    <footer className="bg-primary-dark border-t border-primary-light">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <Logo className="h-10 w-auto" />
            </Link>
            <p className="text-gray-400 mb-4">
              Connecting talented students with mentors to unlock opportunities.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-accent transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-accent transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-accent transition-colors">
                <Github size={20} />
              </a>
            </div>
          </div>

          <div className="col-span-1">
            <h3 className="text-white font-semibold text-lg mb-4">Platform</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/learn-more" className="text-gray-400 hover:text-accent transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/learn-more" className="text-gray-400 hover:text-accent transition-colors">
                  For Students
                </Link>
              </li>
              <li>
                <Link to="/learn-more" className="text-gray-400 hover:text-accent transition-colors">
                  For Mentors
                </Link>
              </li>
              <li>
                <Link to="/learn-more" className="text-gray-400 hover:text-accent transition-colors">
                  Success Stories
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="text-white font-semibold text-lg mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/learn-more" className="text-gray-400 hover:text-accent transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/learn-more" className="text-gray-400 hover:text-accent transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/learn-more" className="text-gray-400 hover:text-accent transition-colors">
                  Partners
                </Link>
              </li>
              <li>
                <Link to="/learn-more" className="text-gray-400 hover:text-accent transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="text-white font-semibold text-lg mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/learn-more" className="text-gray-400 hover:text-accent transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/learn-more" className="text-gray-400 hover:text-accent transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/learn-more" className="text-gray-400 hover:text-accent transition-colors">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link to="/learn-more" className="text-gray-400 hover:text-accent transition-colors">
                  GDPR Compliance
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-light mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} AceTogether. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;