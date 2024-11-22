import { Github, Mail, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">About MovieHub</h3>
            <p className="text-sm text-muted-foreground">
              Your ultimate destination for movie information, reviews, and recommendations. 
              Discover the magic of cinema with us.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/" className="hover:text-primary">Home</Link>
              </li>
              <li>
                <Link to="/movies" className="hover:text-primary">Movies</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-primary">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/privacy" className="hover:text-primary">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-primary">Terms of Service</Link>
              </li>
              <li>
                <Link to="/cookies" className="hover:text-primary">Cookie Policy</Link>
              </li>
              <li>
                <Link to="/disclaimer" className="hover:text-primary">Disclaimer</Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Connect With Us</h3>
            <div className="flex space-x-4">
              <a
                href="https://github.com/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="mailto:contact@moviehub.com"
                className="hover:text-primary"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
            <div className="text-sm text-muted-foreground">
              <p>Subscribe to our newsletter:</p>
              <div className="flex mt-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-3 py-1 border rounded-l-md w-full focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button className="bg-primary text-primary-foreground px-4 py-1 rounded-r-md hover:bg-primary/90">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>
            Powered by{' '}
            <a
              href="https://www.themoviedb.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              TMDB
            </a>
          </p>
          <p className="mt-2">
            © {currentYear} MovieHub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
} 