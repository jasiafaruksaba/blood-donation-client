import React, { useEffect, useRef, useState } from 'react';

const StatsCounter = () => {
const CounterItem = ({ target, title, icon, delay }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.2 }
    );
    if (countRef.current) observer.observe(countRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    
    // Animation delay for text showing up
    const timeout = setTimeout(() => {
      let start = 0;
      const end = parseInt(target);
      const duration = 2500; // 2.5 seconds for smoother feel
      const increment = end / (duration / 16); 

      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      return () => clearInterval(timer);
    }, delay);

    return () => clearTimeout(timeout);
  }, [isVisible, target, delay]);

  return (
    <div 
      ref={countRef} 
      className={`flex flex-col items-center p-8 space-y-4 group transition-all duration-1000 transform 
      ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="w-20 h-20 bg-red-600/10 text-red-600 rounded-3xl flex items-center justify-center text-4xl mb-2 border border-red-200 group-hover:bg-red-600 group-hover:text-white transition-all duration-500 shadow-sm group-hover:shadow-red-200 group-hover:shadow-lg">
        {icon}
      </div>
      <div className="text-4xl lg:text-6xl font-black text-slate-900 flex items-center">
        {count}<span className="text-red-600 ml-1">+</span>
      </div>
      <p className="text-slate-600 font-bold text-sm uppercase tracking-widest text-center">{title}</p>
    </div>
  );
};

 
  const stats = [
    { target: "24", title: "Years Experience", icon: "🏆", delay: 100 },
    { target: "98", title: "Expert Staff", icon: "👥", delay: 300 },
    { target: "50", title: "Blood Per-Month", icon: "🩸", delay: 500 },
    { target: "33", title: "Cooperation", icon: "🤝", delay: 700 }
  ];

  return (
    <section className="relative py-32 bg-gradient-to-b from-white to-red-50/30 overflow-hidden border-t border-red-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-24 overflow-hidden">
          <span className="text-red-600 font-black text-sm tracking-widest uppercase mb-4 block px-4 py-1.5 bg-red-100 inline-block rounded-full animate-pulse">
             Impactful Numbers
          </span>
          <h2 className="text-4xl lg:text-6xl font-black text-slate-900 mt-6 leading-tight">
             Our Lifesaving Achievements
          </h2>
          <p className="text-slate-500 mt-8 max-w-2xl mx-auto text-lg leading-relaxed font-medium">
             Behind every number is a story of hope and a life saved. Together, we are building a stronger, healthier community.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat, index) => (
            <CounterItem key={index} {...stat} />
          ))}
        </div>
      </div>
      
      {/* Dynamic Background Elements for Blood Donation Theme */}
      <div className="absolute top-1/4 -right-20 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-red-600/5 rounded-full blur-[100px] pointer-events-none"></div>
    </section>
  );
};
export default StatsCounter;