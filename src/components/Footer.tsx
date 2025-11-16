import { Instagram, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="relative mt-20 overflow-hidden bg-gray-900">
      <div className="relative z-10 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {/* Brand Section */}
            <div className="space-y-4">
              <Link to="/" className="inline-block">
                <h2 className="font-playfair text-3xl md:text-4xl font-bold text-white mb-2">
                  The Coutures
                </h2>
                <p className="text-white/90 text-lg md:text-xl italic tracking-wide">
                  "your style, our signature"
                </p>
              </Link>
              <p className="text-white/70 text-sm leading-relaxed">
                The Coutures brings you premium fabrics and luxury apparel with unmatched quality and style. 
                Your destination for elegant fashion and exquisite craftsmanship.
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Quick Links</h3>
              <div className="space-y-2 text-sm">
                <Link to="/" className="block text-white/70 hover:text-white transition-colors">
                  Home
                </Link>
                <Link to="/products" className="block text-white/70 hover:text-white transition-colors">
                  All Products
                </Link>
                <Link to="/category/shirt-fabrics" className="block text-white/70 hover:text-white transition-colors">
                  Shirt Fabrics
                </Link>
                <Link to="/category/trouser-fabrics" className="block text-white/70 hover:text-white transition-colors">
                  Trouser Fabrics
                </Link>
                <Link to="/category/indo-western" className="block text-white/70 hover:text-white transition-colors">
                  Indo-Western
                </Link>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Get in Touch</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-white/60 flex-shrink-0" />
                  <a href="tel:9146565907" className="text-white/70 hover:text-white transition-colors">
                    9146565907
                  </a>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="w-4 h-4 text-white/60 flex-shrink-0 mt-1" />
                  <span className="text-white/70">
                    Atul Nagar, Warje, Pune - 58
                  </span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex items-center space-x-3 pt-4">
                <a 
                  href="https://www.instagram.com/the__coutures?igsh=MXJ0YmRzdmMxYW5hOA=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                  aria-label="Follow us on Instagram"
                >
                  <Instagram className="w-4 h-4 text-white" />
                </a>
                <span className="text-white/70 text-sm">Follow Us On Instagram</span>
              </div>
            </div>
          </div>

          {/* Decorative Separator */}
          <div className="flex items-center justify-center my-8">
            <div className="w-16 h-px bg-white/30" />
            <div className="mx-4 w-2 h-2 bg-white/50 rounded-full" />
            <div className="w-16 h-px bg-white/30" />
          </div>

          {/* Copyright */}
          <div className="text-center space-y-2">
            <p className="text-white/80 text-base md:text-lg">Premium Fabrics & Luxury Apparel</p>
            <p className="text-white/60 text-xs md:text-sm">
              © 2025 The Coutures. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
