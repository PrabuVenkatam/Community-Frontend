import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";

const tocItems = [
    { id: "section-1", number: "1.", label: "What Information Do We Collect?" },
    { id: "section-2", number: "2.", label: "How Do We Process Your Information?" },
    { id: "section-3", number: "3.", label: "When And With Whom Do We Share Your Personal Information?" },
    { id: "section-4", number: "4.", label: "How Long Do We Keep Your Information?" },
    { id: "section-5", number: "5.", label: "How Do We Keep Your Information Safe?" },
    { id: "section-6", number: "6.", label: "Do We Collect Information From Minors?" },
    { id: "section-7", number: "7.", label: "What Are Your Privacy Rights?" },
    { id: "section-8", number: "8.", label: "Controls For Do-Not-Track Features" },
    { id: "section-9", number: "9.", label: "Do We Make Updates To This Notice?" },
    { id: "section-10", number: "10.", label: "How Can You Contact Us About This Notice?" },
    { id: "section-11", number: "11.", label: "Your Privacy Rights" },
    { id: "section-12", number: "12.", label: "How Can You Review, Update, Or Delete Data?" },
];

const PrivacyPolicy = () => {
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState("section-1");

    const scrollToSection = (id) => {
        setActiveSection(id);
        const element = document.getElementById(id);
        if (element) {
            const yOffset = -100;
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: "smooth" });
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY + 180;
            for (let i = tocItems.length - 1; i >= 0; i--) {
                const item = tocItems[i];
                const element = document.getElementById(item.id);
                if (element && element.offsetTop <= scrollPosition) {
                    setActiveSection(item.id);
                    break;
                }
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-white text-slate-800 font-outfit selection:bg-blue-600 selection:text-white flex flex-col justify-between">
    {/* ─────────────────────────────────────────────────────────────
        1. HEADER NAVIGATION
    ───────────────────────────────────────────────────────────── */}
            <header className="sticky top-0 z-50 w-full bg-[#080808]/90 backdrop-blur-md px-6 md:px-[80px] py-4 flex items-center justify-between transition-all border-b border-white/10">
                {/* Brand Logo */}
                <div
                    onClick={() => navigate("/")}
                    className="flex items-center gap-3 cursor-pointer group"
                >
                    <img
                        src={assets.landing_logo}
                        alt="GradEnvy Logo"
                        className="h-10 w-auto object-contain transition-transform group-hover:scale-105"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = assets.gradEnvyLogo;
                        }}
                    />
                </div>

                {/* Center Navigation Links */}
                <nav className="hidden md:flex items-center gap-8 text-[15px] font-medium">
                    {[
                        { label: "Why Choose", path: "/#why-choose" },
                        { label: "AI station", path: "/#ai-station" },
                        { label: "Career OS", path: "/#career-os" },
                        { label: "How it Works", path: "/#how-it-works" },
                    ].map((item, idx) => (
                        <button
                            key={idx}
                            onClick={() => navigate(item.path)}
                            className="text-gray-300 hover:text-white transition-colors"
                        >
                            {item.label}
                        </button>
                    ))}
                </nav>

                {/* Right Sign in Pill Button */}
                <button
                    onClick={() => navigate("/auth/login")}
                    className="px-7 py-2.5 rounded-full text-sm font-semibold bg-[#2D66FA] hover:bg-blue-600 text-white shadow-lg  transition-all"
                >
                    Sign in
                </button>
            </header>

            {/* ─────────────────────────────────────────────────────────────
          2. HERO HEADER BANNER (DARK GRADIENT)
      ───────────────────────────────────────────────────────────── */}
            <section className="relative w-full bg-[#050814] pt-16 pb-20 px-6 md:px-[80px] text-center overflow-hidden border-b border-white/10">
                {/* Background Subtle Radial Blue Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[#0084FF]/15 rounded-full blur-[120px] pointer-events-none" />

                <div className="relative z-10 max-w-3xl mx-auto space-y-4">
                    {/* Pill Badge */}
                    <div className="inline-block">
                        <span className="px-5 py-1.5 rounded-full text-[11px] font-outfit font-bold tracking-widest uppercase bg-[#0C1527]/90 text-[#00A3FF] border border-[#00A3FF]/40 backdrop-blur-md">
                            GRAD ENVY
                        </span>
                    </div>

                    {/* Main Title */}
                    <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold text-white tracking-tight leading-tight">
                        Privacy Notice
                    </h1>

                    {/* Subtitle / Last Updated */}
                    <p className="text-gray-400 text-sm sm:text-base font-normal">
                        Last updated: August 2026
                    </p>
                </div>
            </section>

            {/* ─────────────────────────────────────────────────────────────
          3. MAIN CONTENT SECTION (WHITE BACKGROUND)
      ───────────────────────────────────────────────────────────── */}
            <main className="w-full max-w-[1340px] mx-auto px-6 md:px-[80px] py-14 sm:py-20 flex-1">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    {/* ── LEFT SIDEBAR: TABLE OF CONTENTS ── */}
                    <aside className="lg:col-span-4 space-y-4">
                        <h2 className="text-[#090D16] font-bold text-xs tracking-widest uppercase">
                            TABLE OF CONTENTS
                        </h2>

                        <nav className="flex flex-col space-y-1">
                            {tocItems.map((item) => {
                                const isActive = activeSection === item.id;
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => scrollToSection(item.id)}
                                        className={`text-left text-xs sm:text-[13px] leading-relaxed py-2.5 px-3.5 rounded-xl transition-all duration-200 flex items-start gap-1.5 ${isActive
                                                ? "bg-[#EBF5FF] text-[#0070F3] font-bold shadow-sm"
                                                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium"
                                            }`}
                                    >
                                        <span className="shrink-0">{item.number}</span>
                                        <span>{item.label}</span>
                                    </button>
                                );
                            })}
                        </nav>
                    </aside>

                    {/* ── RIGHT COLUMN: PRIVACY NOTICE CONTENT ── */}
                    <article className="lg:col-span-8 space-y-10 text-slate-700 text-sm sm:text-base leading-relaxed">
                        {/* Introductory Text */}
                        <div className="space-y-4">
                            <p>
                                This privacy notice for Grad Envy ("<strong className="text-slate-900 font-bold">we</strong>", "<strong className="text-slate-900 font-bold">us</strong>", or "<strong className="text-slate-900 font-bold">our</strong>"), describes how and why we might collect, store, use, and/or share ("<strong className="text-slate-900 font-bold">process</strong>") your information when you use our services ("<strong className="text-slate-900 font-bold">Services</strong>"), such as when you:
                            </p>

                            <ul className="space-y-2.5 pl-4 sm:pl-6">
                                <li className="flex items-start gap-2">
                                    <span className="text-slate-400 select-none">•</span>
                                    <span>
                                        Download and use our mobile application (<strong className="text-slate-900 font-bold">Grad Envy</strong>), or any other application of ours that links to this privacy notice.
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-slate-400 select-none">•</span>
                                    <span>
                                        Engage with us in other related ways, including any sales, marketing, or events.
                                    </span>
                                </li>
                            </ul>

                            <p className="pt-2">
                                Questions or concerns? Reading this privacy notice will help you understand your privacy rights and choices. If you do not agree with our policies and practices, please do not use our Services. If you still have any questions or concerns, please contact us at{" "}
                                <a
                                    href="mailto:nulinz.official@gmail.com"
                                    className="text-[#0070F3] font-medium hover:underline break-all"
                                >
                                    nulinz.official@gmail.com
                                </a>.
                            </p>
                        </div>

                        {/* ── SUMMARY OF KEY POINTS BOX ── */}
                        <div className="bg-[#F0F7FF] border border-[#D0E4FF] rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
                            <h2 className="text-[#0070F3] font-bold text-xs sm:text-sm tracking-wider uppercase">
                                SUMMARY OF KEY POINTS
                            </h2>

                            <div className="space-y-5 text-xs sm:text-sm">
                                <div>
                                    <h3 className="font-bold text-slate-900 mb-1">
                                        What personal information do we process?
                                    </h3>
                                    <p className="text-slate-600">
                                        We may process personal information depending on how you interact with us.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="font-bold text-slate-900 mb-1">
                                        Do we process any sensitive personal information?
                                    </h3>
                                    <p className="text-slate-600">
                                        We do not process sensitive personal information.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="font-bold text-slate-900 mb-1">
                                        Do we receive any information from third parties?
                                    </h3>
                                    <p className="text-slate-600">
                                        We do not receive any information from third parties.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="font-bold text-slate-900 mb-1">
                                        How do we process your information?
                                    </h3>
                                    <p className="text-slate-600">
                                        We process your information to provide, improve, and administer our Services.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="font-bold text-slate-900 mb-1">
                                        How do we keep your information safe?
                                    </h3>
                                    <p className="text-slate-600">
                                        We have organisational and technical processes in place.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="font-bold text-slate-900 mb-1">
                                        What are your rights?
                                    </h3>
                                    <p className="text-slate-600">
                                        You may have certain rights regarding your personal information.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="font-bold text-slate-900 mb-1">
                                        How do you exercise your rights?
                                    </h3>
                                    <p className="text-slate-600">
                                        By submitting a data subject access request or contacting us.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* ── DETAILED SECTIONS (1 TO 12) ── */}
                        <div className="space-y-10 pt-4">
                            {/* Section 1 */}
                            <section id="section-1" className="scroll-mt-28 space-y-3.5">
                                <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                                    1. WHAT INFORMATION DO WE COLLECT?
                                </h2>

                                <div className="bg-[#F4F5F7] text-xs sm:text-sm text-slate-700 px-4 sm:px-5 py-3 rounded-xl my-3">
                                    <span className="font-bold text-slate-900">In Short: </span>
                                    <span>We collect personal information that you provide to us.</span>
                                </div>

                                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                                    We collect personal information that you voluntarily provide to us when you register on the Services, express an interest in obtaining information about us or our products and Services, when you participate in activities on the Services, or otherwise when you contact us.
                                </p>

                                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                                    <strong className="font-bold text-slate-900">Personal Information Provided by You:</strong> The personal information we collect may include: User Mobile Number.
                                </p>

                                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                                    <strong className="font-bold text-slate-900">Sensitive Information:</strong> We do not process sensitive information.
                                </p>
                            </section>

                            {/* Section 2 */}
                            <section id="section-2" className="scroll-mt-28 space-y-3.5 pt-4">
                                <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                                    2. HOW DO WE PROCESS YOUR INFORMATION?
                                </h2>

                                <div className="bg-[#F4F5F7] text-xs sm:text-sm text-slate-700 px-4 sm:px-5 py-3 rounded-xl my-3">
                                    <span className="font-bold text-slate-900">In Short: </span>
                                    <span>We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law.</span>
                                </div>

                                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                                    To facilitate account creation and authentication and otherwise manage user accounts.
                                </p>
                            </section>

                            {/* Section 3 */}
                            <section id="section-3" className="scroll-mt-28 space-y-3.5 pt-4">
                                <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                                    3. WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?
                                </h2>

                                <div className="bg-[#F4F5F7] text-xs sm:text-sm text-slate-700 px-4 sm:px-5 py-3 rounded-xl my-3">
                                    <span className="font-bold text-slate-900">In Short: </span>
                                    <span>We may share information in specific situations described in this section.</span>
                                </div>

                                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                                    <strong className="font-bold text-slate-900">Business Transfers:</strong> We may share or transfer your information in connection with any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.
                                </p>
                            </section>

                            {/* Section 4 */}
                            <section id="section-4" className="scroll-mt-28 space-y-3.5 pt-4">
                                <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                                    4. HOW LONG DO WE KEEP YOUR INFORMATION?
                                </h2>

                                <div className="bg-[#F4F5F7] text-xs sm:text-sm text-slate-700 px-4 sm:px-5 py-3 rounded-xl my-3">
                                    <span className="font-bold text-slate-900">In Short: </span>
                                    <span>We keep your information for as long as necessary to fulfil the purposes outlined in this privacy notice unless otherwise required by law.</span>
                                </div>

                                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                                    We will only keep your personal information for as long as it is necessary for the purposes set out in this privacy notice, unless a longer retention period is required or permitted by law.
                                </p>
                            </section>

                            {/* Section 5 */}
                            <section id="section-5" className="scroll-mt-28 space-y-3.5 pt-4">
                                <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                                    5. HOW DO WE KEEP YOUR INFORMATION SAFE?
                                </h2>

                                <div className="bg-[#F4F5F7] text-xs sm:text-sm text-slate-700 px-4 sm:px-5 py-3 rounded-xl my-3">
                                    <span className="font-bold text-slate-900">In Short: </span>
                                    <span>We aim to protect your personal information through a system of organisational and technical security measures.</span>
                                </div>

                                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                                    We have implemented appropriate technical and organisational security measures designed to protect the security of any personal information we process.
                                </p>
                            </section>

                            {/* Section 6 */}
                            <section id="section-6" className="scroll-mt-28 space-y-3.5 pt-4">
                                <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                                    6. DO WE COLLECT INFORMATION FROM MINORS?
                                </h2>

                                <div className="bg-[#F4F5F7] text-xs sm:text-sm text-slate-700 px-4 sm:px-5 py-3 rounded-xl my-3">
                                    <span className="font-bold text-slate-900">In Short: </span>
                                    <span>We do not knowingly collect data from or market to children under 18 years of age.</span>
                                </div>

                                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                                    By using the Services, you represent that you are at least 18 or that you are the parent or guardian of such a minor and consent to such minor dependent’s use of the Services.
                                </p>
                            </section>

                            {/* Section 7 */}
                            <section id="section-7" className="scroll-mt-28 space-y-3.5 pt-4">
                                <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                                    7. WHAT ARE YOUR PRIVACY RIGHTS?
                                </h2>

                                <div className="bg-[#F4F5F7] text-xs sm:text-sm text-slate-700 px-4 sm:px-5 py-3 rounded-xl my-3">
                                    <span className="font-bold text-slate-900">In Short: </span>
                                    <span>You may review, change, or terminate your account at any time based on your applicable privacy laws.</span>
                                </div>

                                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                                    In some regions, you have certain rights under applicable data protection laws. These may include the right to request access and obtain a copy of your personal information, to request rectification or erasure, and to restrict processing.
                                </p>
                            </section>

                            {/* Section 8 */}
                            <section id="section-8" className="scroll-mt-28 space-y-3.5 pt-4">
                                <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                                    8. CONTROLS FOR DO-NOT-TRACK FEATURES
                                </h2>

                                <div className="bg-[#F4F5F7] text-xs sm:text-sm text-slate-700 px-4 sm:px-5 py-3 rounded-xl my-3">
                                    <span className="font-bold text-slate-900">In Short: </span>
                                    <span>We do not currently respond to DNT browser signals or any other mechanism that automatically communicates your choice.</span>
                                </div>

                                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                                    Most web browsers and some mobile operating systems include a Do-Not-Track ("DNT") feature or setting you can activate to signal your privacy preference.
                                </p>
                            </section>

                            {/* Section 9 */}
                            <section id="section-9" className="scroll-mt-28 space-y-3.5 pt-4">
                                <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                                    9. DO WE MAKE UPDATES TO THIS NOTICE?
                                </h2>

                                <div className="bg-[#F4F5F7] text-xs sm:text-sm text-slate-700 px-4 sm:px-5 py-3 rounded-xl my-3">
                                    <span className="font-bold text-slate-900">In Short: </span>
                                    <span>Yes, we will update this notice as necessary to stay compliant with relevant laws.</span>
                                </div>

                                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                                    We may update this privacy notice from time to time. The updated version will be indicated by an updated "Revised" date.
                                </p>
                            </section>

                            {/* Section 10 */}
                            <section id="section-10" className="scroll-mt-28 space-y-3.5 pt-4">
                                <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                                    10. HOW CAN YOU CONTACT US ABOUT THIS NOTICE?
                                </h2>

                                <div className="bg-[#F4F5F7] text-xs sm:text-sm text-slate-700 px-4 sm:px-5 py-3 rounded-xl my-3">
                                    <span className="font-bold text-slate-900">In Short: </span>
                                    <span>If you have questions or comments about this notice, you may email us directly.</span>
                                </div>

                                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                                    If you have questions or comments about this notice, you may email us at{" "}
                                    <a
                                        href="mailto:nulinz.official@gmail.com"
                                        className="text-[#0070F3] font-medium hover:underline"
                                    >
                                        nulinz.official@gmail.com
                                    </a>.
                                </p>
                            </section>

                            {/* Section 11 */}
                            <section id="section-11" className="scroll-mt-28 space-y-3.5 pt-4">
                                <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                                    11. YOUR PRIVACY RIGHTS
                                </h2>

                                <div className="bg-[#F4F5F7] text-xs sm:text-sm text-slate-700 px-4 sm:px-5 py-3 rounded-xl my-3">
                                    <span className="font-bold text-slate-900">In Short: </span>
                                    <span>You may exercise your privacy rights by contacting us.</span>
                                </div>

                                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                                    Depending on your jurisdiction, you may exercise your rights by contacting us. We will consider and act upon any request in accordance with applicable data protection laws.
                                </p>
                            </section>

                            {/* Section 12 */}
                            <section id="section-12" className="scroll-mt-28 space-y-3.5 pt-4">
                                <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                                    12. HOW CAN YOU REVIEW, UPDATE, OR DELETE DATA?
                                </h2>

                                <div className="bg-[#F4F5F7] text-xs sm:text-sm text-slate-700 px-4 sm:px-5 py-3 rounded-xl my-3">
                                    <span className="font-bold text-slate-900">In Short: </span>
                                    <span>Submit a request to review, update, or delete your personal data.</span>
                                </div>

                                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                                    Based on the applicable laws of your country, you may have the right to request access to the personal information we collect from you, change that information, or delete it. To request to review, update, or delete your personal information, please submit a data subject access request by emailing us at{" "}
                                    <a
                                        href="mailto:nulinz.official@gmail.com"
                                        className="text-[#0070F3] font-medium hover:underline"
                                    >
                                        nulinz.official@gmail.com
                                    </a>.
                                </p>
                            </section>
                        </div>
                    </article>
                </div>
            </main>

            {/* ─────────────────────────────────────────────────────────────
          4. COMPREHENSIVE FOOTER
      ───────────────────────────────────────────────────────────── */}
            <footer className="relative z-20 bg-[#050814] pt-16 pb-12 px-6 md:px-[80px] text-white border-t border-white/10">
                <div className="w-full max-w-[1340px] mx-auto space-y-12">
                    {/* Footer Navigation Columns */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 text-left">
                        {/* Brand Left Column */}
                        <div className="lg:col-span-6 space-y-6">
                            <div className="flex items-center gap-3">
                                <img
                                    src={assets.landing_logo}
                                    alt="GradEnvy"
                                    className="h-10 w-auto object-contain cursor-pointer"
                                    onClick={() => navigate("/")}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = assets.gradEnvyLogo;
                                    }}
                                />
                            </div>
                            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed max-w-md">
                                A connected professional ecosystem where freelancing, career development, networking, recruitment, AI-powered learning, and events come together to build future-ready professionals.
                            </p>

                            {/* Social Icons */}
                            <div className="flex items-center gap-3 pt-2">
                                <a
                                    href="#"
                                    className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/20 transition-all"
                                    aria-label="LinkedIn"
                                >
                                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                                    </svg>
                                </a>
                                <a
                                    href="#"
                                    className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/20 transition-all"
                                    aria-label="Twitter"
                                >
                                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                    </svg>
                                </a>
                                <a
                                    href="#"
                                    className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/20 transition-all"
                                    aria-label="Instagram"
                                >
                                    <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                                    </svg>
                                </a>
                                <a
                                    href="#"
                                    className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/20 transition-all"
                                    aria-label="YouTube"
                                >
                                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                    </svg>
                                </a>
                            </div>
                        </div>

                        {/* Nav Right Columns */}
                        <div className="lg:col-span-6 grid grid-cols-3 gap-8">
                            {/* Column 1: PLATFORM */}
                            <div className="space-y-4">
                                <span className="text-[#0095FF] text-[11px] font-outfit font-bold tracking-widest uppercase block">
                                    PLATFORM
                                </span>
                                <ul className="space-y-2.5 text-xs sm:text-sm text-gray-300">
                                    {[
                                        "AI Station",
                                        "Prompt Hub",
                                        "Career OS",
                                        "Envy Marketplace",
                                        "Envy League",
                                        "University Platform",
                                    ].map((item, idx) => (
                                        <li key={idx}>
                                            <button
                                                onClick={() => navigate("/auth/login")}
                                                className="hover:text-white transition-colors text-left"
                                            >
                                                {item}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Column 2: COMPANY */}
                            <div className="space-y-4">
                                <span className="text-[#0095FF] text-[11px] font-outfit font-bold tracking-widest uppercase block">
                                    COMPANY
                                </span>
                                <ul className="space-y-2.5 text-xs sm:text-sm text-gray-300">
                                    {[
                                        "About Grad Envy",
                                        "Vision",
                                        "Mission",
                                        "Contact Us",
                                    ].map((item, idx) => (
                                        <li key={idx}>
                                            <button
                                                onClick={() => navigate("/auth/login")}
                                                className="hover:text-white transition-colors text-left"
                                            >
                                                {item}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Column 3: RESOURCES */}
                            <div className="space-y-4">
                                <span className="text-[#0095FF] text-[11px] font-outfit font-bold tracking-widest uppercase block">
                                    RESOURCES
                                </span>
                                <ul className="space-y-2.5 text-xs sm:text-sm text-gray-300">
                                    {[
                                        { label: "Help Center", path: "/auth/login" },
                                        { label: "Privacy Policy", path: "/privacy-policy" },
                                        { label: "Terms & Conditions", path: "/auth/login" },
                                    ].map((item, idx) => (
                                        <li key={idx}>
                                            <button
                                                onClick={() => navigate(item.path)}
                                                className="hover:text-white transition-colors text-left"
                                            >
                                                {item.label}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Copyright & Security Links Bar */}
                    <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
                        <p>© 2026 Grad Envy. All rights reserved.</p>
                        <div className="flex items-center gap-6">
                            <button
                                onClick={() => navigate("/auth/login")}
                                className="hover:text-white transition-colors"
                            >
                                Cookies Settings
                            </button>
                            <button
                                onClick={() => navigate("/auth/login")}
                                className="hover:text-white transition-colors"
                            >
                                Security
                            </button>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default PrivacyPolicy;
