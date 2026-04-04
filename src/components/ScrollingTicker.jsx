import React from 'react';

const ScrollingTicker = () => {
  const newsItems = [
    "URGENT: B+ Blood needed at Apollo Hospital",
    "BE A HERO: Join our donor community today",
    "CHARITY ORGANIZATION",
    "FAITH BASED DONATION",
    "HELP THE NEEDY",
    "SAVE LIVES IN MINUTES",
    "JOIN 50,000+ HEROES",
    "RELIGIOUS CHARITY"
  ];

  return (
    <div className="bg-red-700 py-3 overflow-hidden border-y border-red-800 shadow-lg relative flex items-center">
      {/* Animation wrapper */}
      <div className="flex whitespace-nowrap animate-marquee items-center">
        {/* Repeating items for seamless loop */}
        {[...newsItems, ...newsItems].map((item, index) => (
          <div key={index} className="flex items-center mx-10">
            <span className="text-white font-black text-sm md:text-base tracking-widest uppercase italic">
              {item}
            </span>
            <span className="ml-12 text-red-300 text-2xl font-bold">•</span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          animation: marquee 25s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default ScrollingTicker;