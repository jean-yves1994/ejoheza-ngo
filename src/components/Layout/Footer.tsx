import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin, Users } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and About */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">EJO Heza</h3>
                <p className="text-xs text-muted-foreground">Sport Training Organization</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Empowering youth through sports, fostering talent, and building stronger communities 
              through comprehensive training programs and cultural engagement.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
              <Twitter className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
              <Instagram className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Quick Links</h4>
            <nav className="space-y-2">
              {[
                { name: "About Us", href: "/about" },
                { name: "Get Involved", href: "/get-involved" },
                { name: "Volunteer", href: "/volunteer" },
                { name: "News & Updates", href: "/news" },
              ].map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Support</h4>
            <nav className="space-y-2">
              {[
                { name: "Donate", href: "/donate" },
                { name: "Reports & Transparency", href: "/reports" },
                { name: "Contact Us", href: "/contact" },
              ].map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-muted-foreground">ejohezasto@gmail.com</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <Phone className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-muted-foreground">+250788256754</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    Kigali, Rwanda
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-muted-foreground">
            © 2024 EJO Heza Sport Training Organization. All rights reserved.
          </p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <Link
              to="/terms"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;