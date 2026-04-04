import React, { useEffect, useState } from 'react';
import bloodImg from "../assets/blood donation for wellbeign.jpg"
const WhyDonate = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) setShow(true);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    { icon: '🩸', title: 'Your Blood, Their Second Chance', desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
    { icon: '❤️', title: 'Urgent Need, Every Day', desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
    { icon: '👤', title: 'Save Lives in Minutes', desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Image Side (Left) */}
          <div className={`relative transition-all duration-[1500ms] ${show ? 'translate-x-0 opacity-100 scale-100' : '-translate-x-20 opacity-0 scale-95'}`}>
            <div className="rounded-[40px] overflow-hidden shadow-2xl relative">
              <img 
                src={bloodImg}
                alt="Blood Drive" 
                className="w-full h-[500px] object-cover"
              />
              {/* Overlapping Hero Card */}
              <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur p-6 rounded-2xl shadow-xl flex items-center gap-4 border border-white">
                <div className="flex -space-x-3">
                  {[1,2,3].map(i => <img key={i} src={`https://i.pravatar.cc/100?u=${i}`} className="w-10 h-10 rounded-full border-2 border-white" alt="donor" />)}
                  <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white font-bold text-xs">+</div>
                </div>
                <div>
                  <p className="text-red-600 font-black text-sm">Join 50,000+ heroes</p>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">and be lifesavers for others</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content Side (Right) */}
          <div className="space-y-10">
            <div className={`transition-all duration-1000 delay-200 ${show ? 'opacity-100' : 'opacity-0'}`}>
              <span className="text-red-500 font-black text-lg tracking-widest uppercase">Why Donate?</span>
              <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mt-2 leading-tight">
                The Life You Save Could Be Someone You Love
              </h2>
              <p className="text-slate-500 mt-4 leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Rhoncus venenatis elit nostra lacinia inceptos. 
                Nascetur imperdiet pellentesque in eget.
              </p>
            </div>

            <div className="grid gap-8">
              {features.map((item, idx) => (
                <div 
                  key={idx} 
                  className={`flex gap-5 transition-all duration-1000 ${show ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'}`}
                  style={{ transitionDelay: `${400 + (idx * 200)}ms` }}
                >
                  <div className="w-14 h-14 bg-slate-50 rounded-xl flex items-center justify-center text-3xl shrink-0 shadow-sm">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-slate-900">{item.title}</h4>
                    <p className="text-slate-500 text-sm mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default WhyDonate;