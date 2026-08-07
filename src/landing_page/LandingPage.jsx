import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import {
  ArrowUpRight,
  ArrowRight,
  Briefcase,
  Calendar,
  Award,
  ShieldCheck,
  ChevronRight,
  Cpu,
  TrendingUp,
  UserCheck,
  Globe,
  Star,
  Settings,
  Terminal,
  Target,
  Trophy,
  Users,
  GraduationCap,
} from "lucide-react";

const LandingPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("");

  const scrollToSection = (id) => {
    setActiveTab(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#03040A] text-white font-outfit selection:bg-blue-600 selection:text-white">
      {/* ─────────────────────────────────────────────────────────────
          1. HERO SECTION WITH BACKDROP IMAGE (landing_bg.png)
      ───────────────────────────────────────────────────────────── */}
      <div
        className="relative w-full min-h-[750px] lg:min-h-[880px] bg-cover bg-center bg-no-repeat flex flex-col justify-between"
        style={{ backgroundImage: `url(${assets.landing_bg})` }}
      >
        {/* Dark overlay for top nav readability */}
        {/* <div className="absolute inset-0 bg-gradient-to-b from-[#03040A]/80 via-transparent to-[#03040A] pointer-events-none" /> */}

        {/* ── Top Navigation Bar ── */}
        <header className="sticky top-0 z-50 w-full bg-[#080808]/50 backdrop-blur-md px-6 md:px-[80px] py-4 flex items-center justify-between transition-all">
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
              { id: "why-choose", label: "Why Choose" },
              { id: "ai-station", label: "AI station" },
              { id: "ecosystem", label: "Our Ecosystem" },
              { id: "career-os", label: "Career OS" },
              { id: "how-it-works", label: "How it Works" },
            ].map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`relative py-1 transition-colors ${
                    isActive
                      ? "text-white font-semibold border-b-2 border-cyan-400 pb-1"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Sign in Pill Button */}
          <button
            onClick={() => navigate("/auth/login")}
            className="px-7 py-2.5 rounded-full text-sm font-semibold bg-[#2D66FA] hover:bg-blue-600 text-white shadow-lg shadow-blue-600/30 transition-all hover:scale-105 active:scale-95"
          >
            Sign in
          </button>
        </header>

        {/* ── Hero Content (Aligned with px-6 md:px-[80px]) ── */}
        <main className="relative z-20 w-full px-6 md:px-[80px] pt-12 pb-24 my-auto">
          <div className="max-w-xl space-y-6">
            {/* Pill Badge */}
            <div className="inline-block">
              <span className="px-3.5 py-1.5 rounded-full text-[11px] font-outfit font-bold tracking-widest uppercase bg-[#0C1527]/80 text-[#00A3FF] backdrop-blur-md">
                CONNECTED PROFESSIONAL ECOSYSTEM
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-bold text-white tracking-tight leading-[1.1]">
              Every skill. <br />
              Every connection. <br />
              Every opportunity.
            </h1>

            {/* Paragraph Sub-text */}
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed font-normal opacity-90 max-w-lg">
              Grad Envy brings freelancing, recruitment, events, and career intelligence into one platform — so every project you ship and every person you meet builds toward a single, growing professional identity.
            </p>

            {/* CTA Action Buttons */}
            <div className="flex items-center gap-4 pt-3">
              <button
                onClick={() => navigate("/auth/login")}
                className="px-7 py-3 rounded-full text-sm font-semibold bg-[#0095FF] hover:bg-[#0084E2] text-white shadow-xl shadow-[#0095FF]/30 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                Get Started <ArrowUpRight size={18} />
              </button>
              <button
                onClick={() => navigate("/auth/login")}
                className="px-8 py-3 rounded-full text-sm font-semibold bg-white text-[#0B0C10] hover:bg-gray-100 shadow-lg transition-all hover:scale-105 active:scale-95"
              >
                Sign in
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. SECTION: WHY GRAD ENVY (Exact Screenshot UI Design)
      ───────────────────────────────────────────────────────────── */}
      <section id="why-choose" className="relative z-10 py-24 bg-[#03040C] px-6 md:px-[80px] border-t border-white/10">
        <div className="w-full max-w-[1340px] mx-auto space-y-16">
          {/* Top 2-Column Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column Text & Headline */}
            <div className="lg:col-span-6 space-y-6 text-left">
              {/* Star Badge */}
              <div className="inline-block">
                <span className="px-4 py-1.5 rounded-full text-[11px] font-outfit font-bold tracking-widest uppercase bg-transparent text-[#00A3FF] border border-[#00A3FF]/40 inline-flex items-center gap-1.5">
                  <Star size={12} className="fill-[#00A3FF] stroke-none" /> WHY GRAD ENVY
                </span>
              </div>

              {/* Main Section Headline */}
              <h2 className="text-4xl sm:text-5xl lg:text-[52px] font-bold text-white tracking-tight leading-[1.12]">
                The future of <br />
                professional growth <br />
                is connected.
              </h2>

              {/* Paragraph 1 with Bold Highlights */}
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-xl">
                Today's professional journey isn't defined by a single resume.{" "}
                <span className="text-white font-bold">Skills are built through projects.</span>{" "}
                <span className="text-white font-bold">Experience is earned through freelancing.</span>{" "}
                <span className="text-white font-bold">Connections form through networking.</span>
              </p>

              {/* Paragraph 2 */}
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed max-w-xl">
                Growth happens through competitions, events, and internships — yet these experiences stay scattered across platforms that never talk to each other. Grad Envy brings them together into one ecosystem, where every achievement contributes to a professional identity that keeps evolving.
              </p>
            </div>

            {/* Right Column GradEnvy Globe Asset Image */}
            <div className="lg:col-span-6 flex justify-center items-center">
              <img
                src={assets.gradEnvyGlobe}
                alt="GradEnvy Globe Network"
                className="w-full max-w-[460px] h-auto object-contain transition-transform hover:scale-105 duration-500"
              />
            </div>
          </div>

          {/* Bottom Glassmorphic Category Navigation Bar */}
          <div className="w-full bg-[#080b1e]/80 border border-white/10 rounded-2xl p-4 sm:p-5 backdrop-blur-xl flex flex-wrap items-center justify-between gap-4 sm:gap-6 shadow-2xl">
            {[
              { icon: Award, label: "Competitions", color: "bg-blue-600" },
              { icon: Cpu, label: "University Engagement", color: "bg-teal-500" },
              { icon: UserCheck, label: "Professional Networking", color: "bg-purple-600" },
              { icon: Briefcase, label: "Freelancing", color: "bg-amber-600" },
              { icon: TrendingUp, label: "Career Development", color: "bg-emerald-500" },
              { icon: Globe, label: "Recruitment", color: "bg-indigo-600" },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2.5">
                <div className={`w-7 h-7 rounded-full ${item.color} flex items-center justify-center text-white shadow-md`}>
                  <item.icon size={14} />
                </div>
                <span className="text-white font-semibold text-xs sm:text-sm">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. SECTION: OUR ECOSYSTEM (Three pillars. One profile.)
      ───────────────────────────────────────────────────────────── */}
      <section id="ecosystem" className="relative z-10 py-24 bg-[#FAFAFD] text-slate-900 px-6 md:px-[80px]">
        <div className="w-full max-w-[1340px] mx-auto space-y-12">
          {/* Header */}
          <div className="text-left space-y-3 max-w-2xl">
            <span className="text-[#0095FF] text-[11px] font-outfit font-bold tracking-widest uppercase block">
              OUR ECOSYSTEM
            </span>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-[#090D16] tracking-tight leading-tight">
              Three pillars. One profile.
            </h2>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
              Freelancing, companies, and events feed the same professional identity — nothing you build here stays siloed.
            </p>
          </div>

          {/* 3 Pillar Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {/* Card 1: Freelancing */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200/80 shadow-[0_4px_25px_rgba(0,0,0,0.04)] flex flex-col justify-between hover:shadow-xl transition-all duration-300">
              <div className="space-y-4">
                <div className="text-center">
                  <span className="text-[#7C3AED] font-bold text-sm sm:text-base">Freelancing</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#090D16] leading-snug">
                  Freelancing — the foundation of Grad Envy
                </h3>
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                  Turn your skills into real-world experience. Connect with companies, startups, and organizations, and build a portfolio backed by verified work and client reviews.
                </p>

                {/* Tag Pills */}
                <div className="flex flex-wrap gap-2 pt-3">
                  {[
                    "FREELANCE OPPORTUNITIES",
                    "PORTFOLIO",
                    "VERIFIED SKILLS",
                    "COLLABORATION",
                    "TEAM FORMATION",
                    "CLIENT REVIEWS",
                  ].map((tag, idx) => (
                    <span
                      key={idx}
                      className="bg-[#F3F4F6] text-[#4B5563] px-3 py-1.5 rounded-md text-[10px] font-outfit font-semibold tracking-wider uppercase"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Purple Line Accent */}
              <div className="h-1 bg-[#7C3AED] rounded-full w-full mt-8" />
            </div>

            {/* Card 2: Companies */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200/80 shadow-[0_4px_25px_rgba(0,0,0,0.04)] flex flex-col justify-between hover:shadow-xl transition-all duration-300">
              <div className="space-y-4">
                <div className="text-center">
                  <span className="text-[#10B981] font-bold text-sm sm:text-base">Companies</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#090D16] leading-snug">
                  Discover talent beyond resumes
                </h3>
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                  Publish freelance projects, internships, and roles. Strengthen your employer brand and hire with confidence.
                </p>

                {/* Tag Pills */}
                <div className="flex flex-wrap gap-2 pt-3">
                  {[
                    "COMPANY PROFILE",
                    "TALENT DISCOVERY",
                    "RECRUITMENT",
                    "EMPLOYER BRANDING",
                  ].map((tag, idx) => (
                    <span
                      key={idx}
                      className="bg-[#F3F4F6] text-[#4B5563] px-3 py-1.5 rounded-md text-[10px] font-outfit font-semibold tracking-wider uppercase"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Green Line Accent */}
              <div className="h-1 bg-[#10B981] rounded-full w-full mt-8" />
            </div>

            {/* Card 3: Events */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200/80 shadow-[0_4px_25px_rgba(0,0,0,0.04)] flex flex-col justify-between hover:shadow-xl transition-all duration-300">
              <div className="space-y-4">
                <div className="text-center">
                  <span className="text-[#F59E0B] font-bold text-sm sm:text-base">Events</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#090D16] leading-snug">
                  Every event creates new opportunity
                </h3>
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                  Discover workshops, hackathons, conferences, and career fairs that become milestones on your profile.
                </p>

                {/* Tag Pills */}
                <div className="flex flex-wrap gap-2 pt-3">
                  {[
                    "WORKSHOPS",
                    "HACKATHONS",
                    "CAREER FAIRS",
                    "NETWORKING",
                  ].map((tag, idx) => (
                    <span
                      key={idx}
                      className="bg-[#F3F4F6] text-[#4B5563] px-3 py-1.5 rounded-md text-[10px] font-outfit font-semibold tracking-wider uppercase"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Orange Line Accent */}
              <div className="h-1 bg-[#F59E0B] rounded-full w-full mt-8" />
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. SECTION: CAREER TRAJECTORY (One project can change your whole trajectory.)
      ───────────────────────────────────────────────────────────── */}
      <section id="career-os" className="relative z-10 w-full mx-auto min-h-[491px] opacity-100 pt-[50px] pb-[50px] px-6 md:px-[80px] bg-[#080c1d] border-t border-b border-white/10 flex flex-col justify-between">
        <div className="w-full space-y-10 flex flex-col justify-between h-full">
          {/* Header */}
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h2 className="text-4xl sm:text-5xl lg:text-[52px] font-bold text-white tracking-tight leading-tight">
              One project can <br />
              change your whole trajectory.
            </h2>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              From discovery to growth, our ecosystem connects every step so you can focus on building what matters.
            </p>
          </div>

          {/* 5 Step Process Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-3 items-stretch relative">
            {[
              {
                step: "01",
                title: "DISCOVER",
                desc: "Find an AI tool that helps you build a project.",
                textColor: "text-emerald-400",
                bgColor: "bg-emerald-400",
              },
              {
                step: "02",
                title: "SHOWCASE",
                desc: "Add the project to your professional portfolio.",
                textColor: "text-cyan-400",
                bgColor: "bg-cyan-400",
              },
              {
                step: "03",
                title: "COLLABORATE",
                desc: "A company invites you onto a freelance project.",
                textColor: "text-purple-400",
                bgColor: "bg-purple-400",
              },
              {
                step: "04",
                title: "COMPETE",
                desc: "You join a hackathon and expand your network.",
                textColor: "text-blue-400",
                bgColor: "bg-blue-400",
              },
              {
                step: "05",
                title: "GROW",
                desc: "Those wins open internships and long-term roles.",
                textColor: "text-emerald-400",
                bgColor: "bg-emerald-400",
              },
            ].map((card, idx) => (
              <div
                key={idx}
                className="relative bg-[#0F172A] p-6 rounded-2xl border border-white/5 flex flex-col justify-between min-h-[190px] shadow-xl group hover:border-white/20 transition-all duration-300"
              >
                <div>
                  {/* Top Step Number & Indicator Line */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`font-outfit text-xs font-bold ${card.textColor}`}>
                      {card.step}
                    </span>
                  </div>
                  <div className={`w-5 h-[2px] ${card.bgColor} rounded-full mb-3`} />

                  {/* Card Title */}
                  <h3 className="text-white font-bold text-sm tracking-wider uppercase mb-2">
                    {card.title}
                  </h3>

                  {/* Card Description */}
                  <p className="text-gray-400 text-xs leading-relaxed opacity-90">
                    {card.desc}
                  </p>
                </div>

                {/* Connector Arrow for Cards 1 to 4 */}
                {idx < 4 && (
                  <div className="hidden lg:flex absolute -right-3.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-[#13192e] border border-white/10 items-center justify-center z-20 shadow-md">
                    <ArrowRight size={14} className={card.textColor} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. SECTION: EVERYTHING IS CONNECTED (Comprehensive Ecosystem Grid)
      ───────────────────────────────────────────────────────────── */}
      <section id="ai-station" className="relative z-10 py-24 bg-[#FAFAFD] text-slate-900 px-6 md:px-[80px]">
        <div className="w-full max-w-[1340px] mx-auto space-y-16">
          {/* Section Header */}
          <div className="text-center space-y-4 max-w-4xl mx-auto">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-[#090D16] tracking-tight leading-tight">
              Everything is connected
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-4xl mx-auto opacity-90">
              Imagine discovering an AI tool that helps you build a project. You showcase that project in your professional portfolio. A company discovers your profile and invites you to collaborate on a freelance project. Your successful project strengthens your portfolio and earns positive client reviews. You participate in a hackathon, expand your professional network, and gain industry recognition. Those achievements help you secure internships, career opportunities, and long-term professional growth. That's not multiple disconnected platforms. That's one connected professional ecosystem. That's Grad Envy.
            </p>
          </div>

          {/* 6 Feature Cards Grid (2 columns x 3 rows) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch text-left">
            {/* Card 1: AI Station */}
            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-[0_4px_25px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:shadow-xl transition-all duration-300">
              <div className="space-y-5">
                <div className="w-10 h-10 rounded-full bg-[#2563EB] text-white flex items-center justify-center shadow-md">
                  <Settings size={20} />
                </div>
                <span className="text-[#2563EB] text-[11px] font-outfit font-bold tracking-widest uppercase block">
                  AI STATION
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#090D16] tracking-tight">
                  Learn faster. Build smarter.
                </h3>
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                  AI Station is Grad Envy's dedicated artificial intelligence ecosystem, designed to help users discover, learn, and leverage the latest AI technologies throughout their professional journey. Whether you're writing content, designing presentations, generating images and videos, building software, conducting research, or automating workflows, AI Station provides curated resources that improve productivity, creativity, and learning.
                </p>
                <span className="text-[#2563EB] text-[11px] font-outfit font-bold tracking-widest uppercase block pt-2">
                  HIGHLIGHTS
                </span>
                <div className="flex flex-wrap gap-2 pt-1">
                  {[
                    "AI Tool Directory",
                    "AI Builder Platforms",
                    "AI Agent Platforms",
                    "Prompt Hub",
                    "Prompt Engineering Resources",
                    "AI Learning Resources",
                    "AI News & Updates",
                    "AI Research Tools",
                    "AI Recommendations",
                    "AI Collections",
                  ].map((tag, idx) => (
                    <span
                      key={idx}
                      className="bg-[#F3F4F6] text-[#4B5563] px-3.5 py-1.5 rounded-full text-xs font-medium flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] flex-shrink-0" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Card 2: Prompt Hub */}
            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-[0_4px_25px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:shadow-xl transition-all duration-300">
              <div className="space-y-5">
                <div className="w-10 h-10 rounded-full bg-[#2563EB] text-white flex items-center justify-center shadow-md">
                  <Terminal size={20} />
                </div>
                <span className="text-[#2563EB] text-[11px] font-outfit font-bold tracking-widest uppercase block">
                  PROMPT HUB
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#090D16] tracking-tight">
                  Better prompts. Better results.
                </h3>
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                  Prompt Hub helps users unlock the full potential of modern AI platforms through professionally crafted prompts for a wide range of real-world use cases. Instead of searching across multiple sources, users can explore ready-to-use prompts, organize collections, save favorites, and generate optimized prompts tailored for different AI models.
                </p>
                <span className="text-[#2563EB] text-[11px] font-outfit font-bold tracking-widest uppercase block pt-2">
                  HIGHLIGHTS
                </span>
                <div className="flex flex-wrap gap-2 pt-1">
                  {[
                    "Writing",
                    "Programming",
                    "Research",
                    "Image Generation",
                    "Video Generation",
                    "Daily Challenges",
                    "Resume Building",
                    "Presentations",
                    "Marketing",
                    "Business",
                    "Education",
                    "Design",
                    "Productivity",
                  ].map((tag, idx) => (
                    <span
                      key={idx}
                      className="bg-[#F3F4F6] text-[#4B5563] px-3.5 py-1.5 rounded-full text-xs font-medium flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] flex-shrink-0" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Card 3: Career OS */}
            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-[0_4px_25px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:shadow-xl transition-all duration-300">
              <div className="space-y-5">
                <div className="w-10 h-10 rounded-full bg-[#2563EB] text-white flex items-center justify-center shadow-md">
                  <Target size={20} />
                </div>
                <span className="text-[#2563EB] text-[11px] font-outfit font-bold tracking-widest uppercase block">
                  CAREER OS
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#090D16] tracking-tight">
                  Your career. Connected.
                </h3>
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                  Career OS is the intelligence layer of Grad Envy, bringing every achievement, project, certification, event, internship, competition, and freelance experience into one continuously evolving professional profile. It helps users track progress, measure growth, prepare for opportunities, and build a stronger professional identity throughout their career journey.
                </p>
                <span className="text-[#2563EB] text-[11px] font-outfit font-bold tracking-widest uppercase block pt-2">
                  HIGHLIGHTS
                </span>
                <div className="flex flex-wrap gap-2 pt-1">
                  {[
                    "Career Wallet",
                    "Career Roadmap",
                    "Career Goals",
                    "Career Score",
                    "Career Analytics",
                    "Resume Builder",
                    "Interview Preparation",
                    "Achievement Timeline",
                    "Skills Dashboard",
                  ].map((tag, idx) => (
                    <span
                      key={idx}
                      className="bg-[#F3F4F6] text-[#4B5563] px-3.5 py-1.5 rounded-full text-xs font-medium flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] flex-shrink-0" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Card 4: Envy League */}
            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-[0_4px_25px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:shadow-xl transition-all duration-300">
              <div className="space-y-5">
                <div className="w-10 h-10 rounded-full bg-[#2563EB] text-white flex items-center justify-center shadow-md">
                  <Trophy size={20} />
                </div>
                <span className="text-[#2563EB] text-[11px] font-outfit font-bold tracking-widest uppercase block">
                  ENVY LEAGUE
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#090D16] tracking-tight">
                  Compete. Improve. Get recognized.
                </h3>
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                  Envy League is Grad Envy's competitive ecosystem where users participate in technical, creative, academic, and business challenges to strengthen their skills and gain professional recognition. Every competition contributes to career growth through rankings, achievements, badges, and measurable accomplishments.
                </p>
                <span className="text-[#2563EB] text-[11px] font-outfit font-bold tracking-widest uppercase block pt-2">
                  HIGHLIGHTS
                </span>
                <div className="flex flex-wrap gap-2 pt-1">
                  {[
                    "Coding Challenges",
                    "Design Competitions",
                    "Innovation Challenges",
                    "Research Competitions",
                    "Business Case Competitions",
                    "Daily Challenges",
                    "Weekly Championships",
                    "Leaderboards",
                    "Hall of Fame",
                    "XP & Badges",
                  ].map((tag, idx) => (
                    <span
                      key={idx}
                      className="bg-[#F3F4F6] text-[#4B5563] px-3.5 py-1.5 rounded-full text-xs font-medium flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] flex-shrink-0" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Card 5: Professional Networking */}
            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-[0_4px_25px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:shadow-xl transition-all duration-300">
              <div className="space-y-5">
                <div className="w-10 h-10 rounded-full bg-[#2563EB] text-white flex items-center justify-center shadow-md">
                  <Users size={20} />
                </div>
                <span className="text-[#2563EB] text-[11px] font-outfit font-bold tracking-widest uppercase block">
                  PROFESSIONAL NETWORKING
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#090D16] tracking-tight">
                  Build meaningful professional connections.
                </h3>
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                  Networking on Grad Envy goes beyond sending connection requests. Connect with peers, mentors, recruiters, alumni, startups, universities, organizations, and industry professionals through one integrated professional ecosystem designed to encourage collaboration and long-term career growth.
                </p>
                <span className="text-[#2563EB] text-[11px] font-outfit font-bold tracking-widest uppercase block pt-2">
                  HIGHLIGHTS
                </span>
                <div className="flex flex-wrap gap-2 pt-1">
                  {[
                    "Student Profiles",
                    "Company Profiles",
                    "Professional Connections",
                    "Communities",
                    "Mentorship",
                    "Industry Networking",
                  ].map((tag, idx) => (
                    <span
                      key={idx}
                      className="bg-[#F3F4F6] text-[#4B5563] px-3.5 py-1.5 rounded-full text-xs font-medium flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] flex-shrink-0" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Card 6: University Platform */}
            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-[0_4px_25px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:shadow-xl transition-all duration-300">
              <div className="space-y-5">
                <div className="w-10 h-10 rounded-full bg-[#2563EB] text-white flex items-center justify-center shadow-md">
                  <GraduationCap size={20} />
                </div>
                <span className="text-[#2563EB] text-[11px] font-outfit font-bold tracking-widest uppercase block">
                  UNIVERSITY PLATFORM
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#090D16] tracking-tight">
                  Empowering universities through digital engagement.
                </h3>
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                  The University Platform helps educational institutions simplify campus management while improving student participation and engagement. Universities can efficiently manage events, registrations, attendance, certifications, and analytics through one integrated platform.
                </p>
                <span className="text-[#2563EB] text-[11px] font-outfit font-bold tracking-widest uppercase block pt-2">
                  HIGHLIGHTS
                </span>
                <div className="flex flex-wrap gap-2 pt-1">
                  {[
                    "Event Management",
                    "Student Registration",
                    "Attendance Tracking",
                    "QR Check-in",
                    "Certificate Generation",
                    "Department Dashboard",
                    "Reports & Analytics",
                    "Budget Tracking",
                    "Student Participation Analytics",
                  ].map((tag, idx) => (
                    <span
                      key={idx}
                      className="bg-[#F3F4F6] text-[#4B5563] px-3.5 py-1.5 rounded-full text-xs font-medium flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] flex-shrink-0" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          6. SECTION: HOW GRAD ENVY WORKS (Exact Screenshot UI)
      ───────────────────────────────────────────────────────────── */}
      <section id="how-it-works" className="relative z-10 py-24 bg-[#FAFAFD] text-slate-900 px-6 md:px-[80px] border-t border-slate-200/60">
        <div className="w-full max-w-[1340px] mx-auto space-y-16">
          {/* Centered Top Label */}
          <div className="text-center">
            <span className="text-[#6366F1] text-[11px] font-outfit font-bold tracking-widest uppercase block">
              HOW GRAD ENVY WORKS
            </span>
          </div>

          {/* 2 Column Main Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Text & Laptop Image Asset */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <h2 className="text-4xl sm:text-5xl font-extrabold text-[#090D16] tracking-tight leading-tight">
                One platform. <br />
                One connected <span className="text-[#0095FF]">journey</span>
              </h2>

              <p className="text-slate-500 text-sm sm:text-base leading-relaxed max-w-md">
                Five steps take you from a blank profile to a professional identity backed by real, verifiable work.
              </p>

              {/* Laptop Image Asset */}
              <div className="pt-4">
                <img
                  src={assets.landingLaptop}
                  alt="GradEnvy Laptop Dashboard"
                  className="w-full max-w-[500px] h-auto object-contain transition-transform hover:scale-105 duration-500"
                />
              </div>
            </div>

            {/* Right Column: 5 Vertical Step Cards Stepper */}
            <div className="lg:col-span-6 space-y-5 relative">
              {[
                {
                  step: "01",
                  title: "Create your profile",
                  desc: "Sign up as a Freelancer, Company, University, or Event Organizer and build a profile that represents your skills and expertise.",
                  color: "bg-[#7C3AED]",
                },
                {
                  step: "02",
                  title: "Build your professional identity",
                  desc: "Create your portfolio, showcase projects, earn certifications, and track your progress through Career OS.",
                  color: "bg-[#2563EB]",
                },
                {
                  step: "03",
                  title: "Discover opportunities",
                  desc: "Explore freelance projects, internships, competitions, AI resources, and industry events that align with your goals.",
                  color: "bg-[#10B981]",
                },
                {
                  step: "04",
                  title: "Connect & collaborate",
                  desc: "Work with companies, join communities, and gain real-world experience through meaningful collaboration.",
                  color: "bg-[#F97316]",
                },
                {
                  step: "05",
                  title: "Grow your career",
                  desc: "Every project, competition, event, and connection strengthens your profile - unlocking bigger opportunities over time.",
                  color: "bg-[#EC4899]",
                },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 group">
                  {/* Step Number Circle Indicator on the left */}
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 text-slate-400 font-outfit text-[11px] font-bold flex items-center justify-center">
                      {item.step}
                    </div>
                  </div>

                  {/* White Step Card */}
                  <div className="flex-1 bg-white rounded-2xl p-6 sm:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-200/80 relative overflow-hidden flex items-center gap-5 hover:shadow-lg transition-all duration-300">
                    {/* Left Accent Bar */}
                    <div className={`w-1.5 ${item.color} absolute left-0 top-0 bottom-0`} />

                    {/* Circular Step Badge */}
                    <div className={`w-9 h-9 rounded-full ${item.color} text-white font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-md`}>
                      {item.step}
                    </div>

                    {/* Text Content */}
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-[#090D16] mb-1">
                        {item.title}
                      </h3>
                      <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          7. SECTION: EXPLORE THE PLATFORM (Experience Grad Envy in Action.)
      ───────────────────────────────────────────────────────────── */}
      <section id="explore-platform" className="relative z-10 py-24 bg-[#050716] px-6 md:px-[80px] border-t border-white/10">
        <div className="w-full max-w-[1340px] mx-auto space-y-12">
          {/* Header */}
          <div className="text-left space-y-3 max-w-3xl">
            <span className="text-[#0095FF] text-[11px] font-outfit font-bold tracking-widest uppercase block">
              EXPLORE THE PLATFORM
            </span>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Experience Grad Envy in Action.
            </h2>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
              Explore a modern platform designed to simplify freelancing, professional networking, recruitment, career development, and university engagement through one connected ecosystem.
            </p>
          </div>

          {/* 3-Column Grid Table */}
          <div className="grid grid-cols-1 md:grid-cols-3 border-t border-l border-white/10 rounded-2xl overflow-hidden bg-[#070a1e]/60 shadow-2xl">
            {[
              "Home Dashboard",
              "Envy Marketplace",
              "Professional Profile",
              "Portfolio",
              "Resume Builder",
              "AI Station",
              "Prompt Hub",
              "Career OS",
              "Company Dashboard",
              "University Dashboard",
              "Event Dashboard",
              "Freelance Marketplace",
              "Project Details",
              "Job & Internship Portal",
              "Competition Hub",
              "Professional Networking",
              "Mobile Application",
            ].map((item, idx) => (
              <div
                key={idx}
                onClick={() => navigate("/auth/login")}
                className="px-6 py-4 sm:py-5 border-r border-b border-white/10 flex items-center justify-between group cursor-pointer hover:bg-white/[0.04] transition-all"
              >
                <span className="text-white font-semibold text-xs sm:text-sm group-hover:text-[#0095FF] transition-colors">
                  {item}
                </span>
                <ChevronRight
                  size={14}
                  className="text-gray-500 group-hover:text-[#0095FF] group-hover:translate-x-1 transition-all"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          8. SECTION: CONNECTED CAREER JOURNEY
      ───────────────────────────────────────────────────────────── */}
      <section className="relative z-10 bg-[#FAFAFD] pt-24 pb-56 px-6 md:px-[80px]">
        <div className="w-full max-w-[1340px] mx-auto">
          {/* Header */}
          <div className="text-center space-y-5 max-w-4xl mx-auto">
            <div className="inline-block">
              <span className="px-4 py-1.5 rounded-full text-[11px] font-outfit font-bold tracking-widest uppercase bg-white border border-slate-300 text-slate-800 shadow-sm">
                CONNECTED CAREER JOURNEY
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-[52px] font-extrabold text-[#090D16] tracking-tight leading-tight">
              Every experience builds your future
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-4xl mx-auto">
              A professional journey isn't defined by one achievement — it's built through continuous learning, collaboration, and experience. A user might begin in <span className="text-[#2563EB] font-bold">AI Station</span>, apply what they learn in a hackathon, then collaborate on a freelance project through <span className="text-[#10B981] font-bold">Envy</span>. As their portfolio grows, companies take notice — leading to internships, recruitment, and long-term career growth, all tracked in one continuously evolving identity.
            </p>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          9. COMPREHENSIVE FOOTER WITH OVERLAPPING 50/50 CTA CARD
      ───────────────────────────────────────────────────────────── */}
      <footer className="relative z-20 bg-[#050B1E] pb-16 px-6 md:px-[80px] text-white border-t border-white/10">
        <div className="w-full max-w-[1340px] mx-auto">
          {/* Floating Dark Carbon CTA Card centered 50/50 over section border */}
          <div className="relative z-30 -mt-44 sm:-mt-48 mb-20 max-w-full mx-auto rounded-[32px] p-10 sm:p-14 text-center bg-[#070913] border border-white/10 shadow-2xl overflow-hidden">
            {/* Subtle background glow dot */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-4 max-w-3xl mx-auto">
              <span className="text-slate-400 text-[10px] font-outfit font-bold tracking-widest uppercase block">
                READY TO SHAPE WHAT'S NEXT
              </span>
              <h3 className="text-3xl sm:text-4xl lg:text-[46px] font-extrabold text-white tracking-tight leading-[1.15]">
                Build skills. Create opportunities. <br />
                Shape your future.
              </h3>
              <p className="text-gray-400 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed pt-1">
                Whether you're building your identity, discovering freelance work, or recruiting future-ready talent - Grad Envy brings it together in one intelligent ecosystem.
              </p>
              <div className="pt-4 flex items-center justify-center gap-4">
                <button
                  onClick={() => navigate("/auth/login")}
                  className="px-7 py-3 rounded-full text-sm font-semibold bg-[#2563EB] hover:bg-blue-600 text-white shadow-lg shadow-blue-600/30 transition-all hover:scale-105 active:scale-95 inline-flex items-center gap-1.5"
                >
                  Get Started <ArrowUpRight size={16} />
                </button>
                <button
                  onClick={() => navigate("/auth/login")}
                  className="px-7 py-3 rounded-full text-sm font-semibold bg-[#262A37] hover:bg-[#313646] text-white border border-white/10 transition-all hover:scale-105 active:scale-95"
                >
                  Sign In
                </button>
              </div>
            </div>
          </div>

          {/* Footer Navigation Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 text-left">
            {/* Brand Left Column */}
            <div className="lg:col-span-6 space-y-6">
              <div className="flex items-center gap-3">
                <img src={assets.landing_logo} alt="GradEnvy" className="h-12 w-auto object-contain" />
              </div>
              <p className="text-slate-400 text-xs leading-relaxed max-w-md">
                A connected professional ecosystem where freelancing, career development, networking, recruitment, AI-powered learning, and events come together to build future-ready professionals.
              </p>
              {/* Social Icons */}
              <div className="flex items-center gap-3 pt-2">
                <a
                  href="#"
                  className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="LinkedIn"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Twitter"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Instagram"
                >
                  <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="YouTube"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
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
                <ul className="space-y-2.5 text-xs text-slate-400">
                  {[
                    "AI Station",
                    "Prompt Hub",
                    "Career OS",
                    "Envy Marketplace",
                    "Envy League",
                    "University Platform",
                  ].map((item, idx) => (
                    <li key={idx}>
                      <button onClick={() => navigate("/auth/login")} className="hover:text-white transition-colors">
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
                <ul className="space-y-2.5 text-xs text-slate-400">
                  {[
                    "About Grad Envy",
                    "Vision",
                    "Mission",
                    "Contact Us",
                  ].map((item, idx) => (
                    <li key={idx}>
                      <button onClick={() => navigate("/auth/login")} className="hover:text-white transition-colors">
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
                <ul className="space-y-2.5 text-xs text-slate-400">
                  {[
                    { label: "Help Center", path: "/auth/login" },
                    { label: "Privacy Policy", path: "/privacy-policy" },
                  ].map((item, idx) => (
                    <li key={idx}>
                      <button onClick={() => navigate(item.path)} className="hover:text-[#0095FF] transition-colors">
                        {item.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
