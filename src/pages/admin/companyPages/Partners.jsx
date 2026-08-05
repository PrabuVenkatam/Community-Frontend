import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Search,
  Building2,
  MapPin,
  Globe,
  Mail,
  Phone,
  User,
  X,
  ExternalLink,
  Loader2,
  Sparkles,
  Layers,
  ArrowRight,
  Users,
} from "lucide-react";
import { toast } from "react-toastify";
import { apiGetAllCompanies } from "../../../services/companyServices";
import { useTitle } from "../../../context/AdminTitle";
import { useMain } from "../../../context/MainContext";
import setFileName from "../../../utils/setFileName";

const Partners = () => {
  const { setTitle } = useTitle();
  const { user } = useMain();

  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedCompany, setSelectedCompany] = useState(null);

  useEffect(() => {
    setTitle("Partners");
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const res = await apiGetAllCompanies();
      if (res?.success && Array.isArray(res.data)) {
        // Filter out inactive companies and current company profile
        const activePartners = res.data.filter(
          (c) =>
            c.is_active !== false &&
            c.email !== user?.email &&
            c._id !== user?.companyId &&
            c.c_by !== user?._id
        );
        setCompanies(activePartners);
      } else {
        setCompanies([]);
      }
    } catch (err) {
      toast.error(err?.message || "Failed to load partners");
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  };

  // Derive unique company types for filter
  const companyTypes = [
    "All",
    ...new Set(
      companies
        .map((c) => c.companyType)
        .filter(Boolean)
        .map((t) => t.trim())
    ),
  ];

  // Filtered companies based on search and type
  const filteredCompanies = companies.filter((company) => {
    const matchesType =
      selectedType === "All" || company.companyType === selectedType;

    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesType;

    const matchesName = company.companyName?.toLowerCase().includes(query);
    const matchesCity = company.city?.toLowerCase().includes(query);
    const matchesState = company.state?.toLowerCase().includes(query);
    const matchesTech = Array.isArray(company.technologies)
      ? company.technologies.some((t) => t.toLowerCase().includes(query))
      : typeof company.technologies === "string"
      ? company.technologies.toLowerCase().includes(query)
      : false;

    return matchesType && (matchesName || matchesCity || matchesState || matchesTech);
  });

  return (
    <div className="space-y-6">
      {/* ── SEARCH & FILTER HEADER ───────────────────────────── */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center bg-white p-4 md:p-6 rounded-[24px] border border-gray-200/80 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search partners by name, tech stack, or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200/80 rounded-full text-sm outline-none focus:ring-2 focus:ring-[#171717]/20 focus:border-[#171717] focus:bg-white transition-all font-medium"
          />
        </div>

        {/* Company Type Filter Tabs */}
        {companyTypes.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {companyTypes.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setSelectedType(type)}
                className={`px-4 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedType === type
                    ? "bg-[#171717] text-white shadow-sm ring-2 ring-[#171717]/20"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── LOADING STATE ────────────────────────────────────── */}
      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-9 h-9 text-[#171717] animate-spin" />
          <p className="text-gray-500 font-semibold text-sm">Discovering partner network...</p>
        </div>
      ) : filteredCompanies.length === 0 ? (
        /* Empty State */
        <div className="py-20 text-center bg-white rounded-[24px] border border-dashed border-gray-300 space-y-3">
          <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto text-gray-400">
            <Building2 size={28} />
          </div>
          <h3 className="font-bold text-gray-800 text-lg">No partner companies found</h3>
          <p className="text-sm text-gray-500 max-w-sm mx-auto">
            {searchQuery
              ? `No companies matching "${searchQuery}"`
              : "No other partner companies registered yet."}
          </p>
        </div>
      ) : (
        /* ── CARDS GRID ───────────────────────────────────────── */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {filteredCompanies.map((company) => {
            const logoUrl = company.companyLogo ? setFileName(company.companyLogo) : null;
            const coverUrl = company.coverImage ? setFileName(company.coverImage) : null;
            const techList = Array.isArray(company.technologies)
              ? company.technologies
              : typeof company.technologies === "string"
              ? company.technologies.split(",").map((t) => t.trim()).filter(Boolean)
              : [];

            return (
              <div
                key={company._id}
                onClick={() => setSelectedCompany(company)}
                className="group relative bg-white rounded-[24px] border border-gray-200/80 shadow-xs hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden flex flex-col justify-between cursor-pointer hover:border-[#171717]/40"
              >
                <div>
                  {/* Top Cover Banner */}
                  <div className="relative h-32 w-full overflow-hidden bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A]">
                    {coverUrl ? (
                      <img
                        src={coverUrl}
                        alt="Cover"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-800 via-gray-900 to-black opacity-90 flex items-center justify-center">
                        <Sparkles className="w-10 h-10 text-white/15 animate-pulse" />
                      </div>
                    )}

                    {/* Company Type Glassmorphism Badge */}
                    {company.companyType && (
                      <span className="absolute top-3.5 right-3.5 bg-white/90 backdrop-blur-md text-gray-900 text-[11px] font-extrabold px-3 py-1 rounded-full shadow-sm border border-white/40">
                        {company.companyType}
                      </span>
                    )}
                  </div>

                  {/* Logo Avatar & Details */}
                  <div className="px-6 pt-0 pb-5 relative">
                    {/* Floating Avatar */}
                    <div className="-mt-11 mb-3 flex items-end justify-between">
                      <div className="w-20 h-20 rounded-[20px] border-4 border-white bg-white shadow-lg overflow-hidden flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
                        {logoUrl ? (
                          <img
                            src={logoUrl}
                            alt={company.companyName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Building2 className="w-9 h-9 text-gray-400" />
                        )}
                      </div>
                    </div>

                    {/* Company Name */}
                    <h3 className="font-extrabold text-[19px] text-gray-900 leading-snug group-hover:text-[#171717] transition-colors line-clamp-1">
                      {company.companyName || "Unnamed Company"}
                    </h3>

                    {/* Tagline */}
                    {company.companyTagLine && (
                      <p className="text-xs font-semibold text-gray-500 italic mt-0.5 line-clamp-1">
                        "{company.companyTagLine}"
                      </p>
                    )}

                    {/* Location Badge */}
                    {(company.city || company.state) && (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100/80 text-gray-600 font-semibold text-[12px] mt-3">
                        <MapPin size={13} className="text-gray-500 shrink-0" />
                        <span className="truncate">
                          {[company.city, company.state].filter(Boolean).join(", ")}
                        </span>
                      </div>
                    )}

                    {/* Tech Stack Pills */}
                    {techList.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-4">
                        {techList.slice(0, 3).map((tech, idx) => (
                          <span
                            key={idx}
                            className="bg-slate-50 text-slate-700 border border-slate-200/70 text-[11px] font-bold px-2.5 py-1 rounded-lg"
                          >
                            {tech}
                          </span>
                        ))}
                        {techList.length > 3 && (
                          <span className="bg-slate-100 text-slate-500 text-[11px] font-bold px-2 py-1 rounded-lg">
                            +{techList.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Action Bar */}
                <div className="px-6 py-4 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500">
                    <Users size={14} className="text-gray-400" />
                    <span>{company.employees ? `${company.employees} Team` : "Verified Partner"}</span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCompany(company);
                    }}
                    className="inline-flex items-center gap-1.5 bg-[#171717] hover:bg-black text-white px-4 py-2 rounded-full text-xs font-bold shadow-xs group-hover:shadow-md transition-all cursor-pointer active:scale-95"
                  >
                    <span>View Details</span>
                    <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── CLEAN & ELEGANT MINIMALIST MODAL ────────────────── */}
      {selectedCompany &&
        createPortal(
          <div
            className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
            onClick={() => setSelectedCompany(null)}
          >
          <div
            className="bg-white w-full max-w-xl rounded-[28px] overflow-hidden shadow-2xl border border-gray-100 p-6 md:p-8 relative my-auto space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedCompany(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            {/* Header: Logo & Title */}
            <div className="flex items-start gap-4 pr-8">
              <div className="w-16 h-16 rounded-[18px] bg-gray-50 border border-gray-200 overflow-hidden flex items-center justify-center shrink-0 shadow-2xs">
                {selectedCompany.companyLogo ? (
                  <img
                    src={setFileName(selectedCompany.companyLogo)}
                    alt={selectedCompany.companyName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Building2 className="w-8 h-8 text-gray-400" />
                )}
              </div>

              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-xl font-bold text-gray-900 truncate">
                    {selectedCompany.companyName}
                  </h3>
                  {selectedCompany.companyType && (
                    <span className="bg-gray-100 text-gray-700 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-gray-200">
                      {selectedCompany.companyType}
                    </span>
                  )}
                </div>

                {selectedCompany.companyTagLine && (
                  <p className="text-xs font-medium text-gray-500 italic truncate">
                    "{selectedCompany.companyTagLine}"
                  </p>
                )}

                {(selectedCompany.city || selectedCompany.state) && (
                  <div className="flex items-center gap-1 text-xs font-semibold text-gray-500 pt-0.5">
                    <MapPin size={13} className="text-gray-400 shrink-0" />
                    <span className="truncate">
                      {[selectedCompany.city, selectedCompany.state]
                        .filter(Boolean)
                        .join(", ")}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Key Information Summary Grid */}
            <div className="grid grid-cols-2 gap-3 bg-gray-50/80 p-4 rounded-[20px] border border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white border border-gray-200/80 flex items-center justify-center text-gray-600 shrink-0">
                  <Mail size={15} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Email</p>
                  <p className="text-xs font-semibold text-gray-900 truncate">
                    {selectedCompany.email || "—"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white border border-gray-200/80 flex items-center justify-center text-gray-600 shrink-0">
                  <Phone size={15} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Phone</p>
                  <p className="text-xs font-semibold text-gray-900 truncate">
                    {selectedCompany.phone || "—"}
                  </p>
                </div>
              </div>

              {selectedCompany.contactPersonName && (
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-white border border-gray-200/80 flex items-center justify-center text-gray-600 shrink-0">
                    <User size={15} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Contact Person</p>
                    <p className="text-xs font-semibold text-gray-900 truncate">
                      {selectedCompany.contactPersonName}
                    </p>
                  </div>
                </div>
              )}

              {selectedCompany.employees && (
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-white border border-gray-200/80 flex items-center justify-center text-gray-600 shrink-0">
                    <Users size={15} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Team Size</p>
                    <p className="text-xs font-semibold text-gray-900 truncate">
                      {selectedCompany.employees} Employees
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* About Us (Short Summary if present) */}
            {selectedCompany.aboutUs && (
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  About
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed line-clamp-4">
                  {selectedCompany.aboutUs}
                </p>
              </div>
            )}

            {/* Tech Stack (Chips) */}
            {selectedCompany.technologies && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers size={14} className="text-gray-500" />
                  <span>Technologies</span>
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {(Array.isArray(selectedCompany.technologies)
                    ? selectedCompany.technologies
                    : typeof selectedCompany.technologies === "string"
                    ? selectedCompany.technologies.split(",")
                    : []
                  ).map((tech, idx) => (
                    <span
                      key={idx}
                      className="bg-slate-100 text-slate-800 font-semibold text-xs px-2.5 py-1 rounded-md"
                    >
                      {tech.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Modal Footer Actions */}
            <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-3">
              {selectedCompany.websiteLink ? (
                <a
                  href={
                    selectedCompany.websiteLink.startsWith("http")
                      ? selectedCompany.websiteLink
                      : `https://${selectedCompany.websiteLink}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#171717] hover:underline"
                >
                  <Globe size={14} />
                  <span>{selectedCompany.websiteLink.replace(/^https?:\/\//, '')}</span>
                  <ExternalLink size={12} />
                </a>
              ) : (
                <span className="text-xs text-gray-400 font-medium">Partner Profile</span>
              )}

              <button
                type="button"
                onClick={() => setSelectedCompany(null)}
                className="px-5 py-2 bg-[#171717] hover:bg-black text-white text-xs font-bold rounded-full transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default Partners;
