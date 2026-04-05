import React, { useEffect, useState } from 'react';

const StackedSlider = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    const slides = [
        {
            id: 1,
            img: "https://i.ibb.co.com/Df99GjCm/blood4.jpg",
            tag: "Emergency"
        },
        {
            id: 2,
            img: "https://i.ibb.co.com/zhfJFGz8/blood2.jpg",
            tag: "Life Saver"
        },
        {
            id: 3,
            img: "https://i.ibb.co.com/XrKNJrDP/blood3.jpg",
            tag: "Community"
        },
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % slides.length);
        }, 3500);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative w-full h-[450px] flex items-center justify-center lg:justify-start">
            <div className="relative w-[280px] h-[380px] sm:w-[320px] sm:h-[420px]">
                {slides.map((slide, index) => {
                    let position = (index - activeIndex + slides.length) % slides.length;

                    return (
                        <div
                            key={slide.id}
                            className="absolute inset-0 transition-all duration-1000 ease-in-out rounded-[40px] overflow-hidden border-[6px] border-white shadow-2xl"
                            style={{
                                zIndex: slides.length - position,
                                transform: `translateX(${position * 35}px) translateY(${position * 15}px) scale(${1 - position * 0.1})`,
                                opacity: 1 - position * 0.2,
                            }}
                        >
                            <img
                                src={slide.img}
                                alt={`Blood Donation - ${slide.tag}`}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-6 left-6 bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                                {slide.tag}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

/**
 * AboutSection: Main section containing the stacked slider and content
 */
const AboutSection = () => {
    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-20 items-center">

                    {/* Left Side: Auto Stacked Slider */}
                    <div className="relative order-2 lg:order-1">
                        <StackedSlider />

                        {/* Background Glow Effect */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-red-50 rounded-full blur-[100px] -z-10 opacity-50"></div>
                    </div>

                    {/* Right Side: Content */}
                    <div className="space-y-8 order-1 lg:order-2">
                        <div className="space-y-4">
                            <h2 className="text-4xl lg:text-6xl font-black text-slate-900 leading-tight">
                                A Drop of Your Blood <br />
                                <span className="text-red-600">Can Bring Hope to Someone</span>
                            </h2>
                        </div>

                        <p className="text-slate-500 text-lg leading-relaxed font-medium">
                            Your one bag of blood can save a precious life. Blood donation is a noble act
                            that strengthens the bond of our society.
                        </p>

                        <div className="grid gap-6">
                            {/* Feature 1 */}
                            <div className="flex gap-5 items-start group">
                                <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-red-600 group-hover:text-white transition-all">
                                    <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-slate-900">Your Blood, Their Hope</h4>
                                    <p className="text-slate-500">
                                        Through your blood donation, you are giving someone a second chance to live.
                                    </p>
                                </div>
                            </div>

                            {/* Feature 2 */}
                            <div className="flex gap-5 items-start group">
                                <div className="w-14 h-14 bg-slate-50 text-slate-900 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-slate-900 group-hover:text-white transition-all">
                                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-slate-900">Urgent Need</h4>
                                    <p className="text-slate-500">
                                        Every day, hospitals have a huge demand for blood in emergency cases.
                                    </p>
                                </div>
                            </div>
                        </div>


                    </div>

                </div>
            </div>
        </section>
    );
};

export default AboutSection;