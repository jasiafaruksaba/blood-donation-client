import React, { useEffect, useState } from 'react';
import bloodDonateImg from "../assets/blood donation.png"
import { Link } from "react-router";
const Banner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative min-h-[85vh] flex items-center bg-slate-50 overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-red-50/50 rounded-l-[100px] -z-10 hidden lg:block translate-x-20"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Content (Motion effect from Left with delays) */}
          <div className="space-y-8">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-100 text-red-700 text-sm font-black tracking-wide uppercase transition-all duration-[800ms] ease-out ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
              </span>
              Donate Blood Save Life
            </div>
            
            <h1 className="text-5xl sm:text-7xl font-black text-slate-900 leading-[1.1] overflow-hidden">
              <span className={`block transition-all duration-[1000ms] delay-[100ms] ease-out ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}>
                Donate Your Blood
              </span>
              <span className={`block transition-all duration-[1000ms] delay-[300ms] ease-out ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}>
                To Us, <span className="text-red-600 underline decoration-red-200 underline-offset-8">Save More</span>
              </span>
              <span className={`block transition-all duration-[1000ms] delay-[500ms] ease-out ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}>
                Life Together
              </span>
            </h1>
            
            <p className={`text-slate-500 text-lg sm:text-xl max-w-xl leading-relaxed transition-all duration-[1000ms] delay-[700ms] ease-out ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'}`}>
              LifeDrop is a non-profit organization that helps people in need of blood. 
              Join our community and become a hero today by saving someone's life.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 ">
            <Link to="/register">
              <button  className="bg-red-600 text-white px-6 py-2.5 rounded-xl font-bold text-base hover:bg-red-700 transition-all shadow-lg shadow-red-200 active:scale-95">
                Join as Donor
              </button>
            </Link>

            <Link to="/search">
              <button  className="bg-rose-500 text-white px-6 py-2.5 rounded-xl font-bold text-base hover:bg-rose-700 transition-all shadow-lg shadow-red-200 active:scale-95">
                Search Donors
              </button>
            </Link>
          </div>
          </div>

          {/* Banner Image / Illustration */}
          <div className={`relative transition-all duration-[1500ms] delay-[200ms] ease-out ${isVisible ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}>
            <div className="aspect-square rounded-[60px] bg-red-100/30 border-8 border-white shadow-2xl overflow-hidden relative group">
              <img 
                src={bloodDonateImg}
                alt="Blood Donation" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
            
          
           
          </div>

        </div>
      </div>
    </section>
  );
};

export default Banner;