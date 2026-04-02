import React from 'react';
import { Droplet, Facebook, Twitter, Linkedin, Instagram, MapPin, Phone, Mail } from 'lucide-react';

const Footer = ({ setPage }) => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-white cursor-pointer" onClick={() => setPage('home')}>
              <Droplet className="fill-current text-red-600" size={32} />
              <span className="text-2xl font-black tracking-tight">BLOODFLOW</span>
            </div>
            <p className="text-sm leading-relaxed text-gray-400">
              We are a non-profit platform dedicated to bridging the gap between blood donors and recipients across Bangladesh. Saving lives, one drop at a time.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 hover:text-white transition-all"><Facebook size={18}/></a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 hover:text-white transition-all"><Twitter size={18}/></a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 hover:text-white transition-all"><Linkedin size={18}/></a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 hover:text-white transition-all"><Instagram size={18}/></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-6 text-lg border-l-4 border-red-600 pl-3">Quick Links</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><button onClick={() => setPage('home')} className="hover:text-red-500 transition-colors">Home</button></li>
              <li><button onClick={() => setPage('search')} className="hover:text-red-500 transition-colors">Search Donors</button></li>
              <li><button onClick={() => setPage('register')} className="hover:text-red-500 transition-colors">Be a Donor</button></li>
              <li><button onClick={() => setPage('login')} className="hover:text-red-500 transition-colors">Login</button></li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="text-white font-bold mb-6 text-lg border-l-4 border-red-600 pl-3">Get Help</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><a href="#" className="hover:text-red-500 transition-colors">Emergency Blood Request</a></li>
              <li><a href="#" className="hover:text-red-500 transition-colors">Donation Centers</a></li>
              <li><a href="#" className="hover:text-red-500 transition-colors">How to Donate?</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-bold mb-6 text-lg border-l-4 border-red-600 pl-3">Contact Us</h4>
            <div className="space-y-4 text-sm">
              <p className="flex items-start gap-3">
                <MapPin className="text-red-600 shrink-0" size={18}/>
                <span>Mirpur 10, Dhaka - 1216, Bangladesh</span>
              </p>
              <p className="flex items-center gap-3">
                <Phone className="text-red-600 shrink-0" size={18}/>
                <span>+880 1234 567890</span>
              </p>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center text-xs text-gray-500">
          © 2024 BloodFlow Platform. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;