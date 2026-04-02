import React from 'react';


const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-10">

      <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-8">

        {/* Logo + About */}
        <div>
          <h2 className="text-xl font-bold text-red-500">BloodConnect</h2>
          <p className="mt-2 text-sm">
            Connecting donors with people in need. Save lives with your blood donation.
          </p>
        </div>

        {/* Links */}
        <div>
          <h3 className="font-semibold mb-2">Quick Links</h3>
          <ul className="space-y-1 text-sm">
            <li>Home</li>
            <li>Donation Requests</li>
            <li>Funding</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-semibold mb-2">Contact</h3>
          <p className="text-sm">Email: support@bloodconnect.com</p>
          <p className="text-sm">Phone: +880 1234-567890</p>
        </div>

      </div>

      <div className="text-center text-sm border-t border-gray-700 py-3">
        © 2026 BloodConnect. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;