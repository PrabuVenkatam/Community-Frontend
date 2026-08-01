import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Download, FileText, ArrowLeft, Plus, X, Award, CheckCircle, ExternalLink, Loader2, Calendar } from 'lucide-react';
import { toast } from 'react-toastify';
import { generateCertificate } from '../services/admin/adminServices';
import { getCurrentUser } from '../services/auth/authServices';

const CandidateProfileSection = ({
  candidate = {},
  onStatusChange,
  onBack,
  isSelected = false,
  onAddPerformance,
  onCreateCertificate,
  isSubmitting = false,
}) => {
  const isSelectedView = isSelected || candidate.status === 'selected';

  const BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");

  // Certificate Modal State
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCert, setGeneratedCert] = useState(null);
  const [certForm, setCertForm] = useState({
    name: '',
    domain: '',
    companyName: 'Nulinz Community',
    issuedDate: new Date().toISOString().split('T')[0],
  });

  const handleOpenCertModal = async () => {
    let initialCompany = candidate.companyName || candidate.company || candidate.company_name || 'Nulinz Community';

    // Fetch user details from /api/users/me
    try {
      const res = await getCurrentUser();
      if (res?.status && res?.data?.user?.name) {
        initialCompany = res.data.user.name;
      }
    } catch (err) {
      console.warn("Could not fetch current user from /api/users/me:", err);
    }

    const initialDomain =
      candidate.internshipName ||
      candidate.internship_name ||
      candidate.internshipTitle ||
      candidate.internship_title ||
      candidate.jobTitle ||
      candidate.title ||
      candidate.openings ||
      candidate.domain ||
      candidate.role ||
      candidate.department ||
      candidate.degree ||
      '';

    setCertForm({
      name: candidate.name || candidate.fullName || '',
      domain: initialDomain,
      companyName: initialCompany,
      issuedDate: new Date().toISOString().split('T')[0],
    });
    setGeneratedCert(null);
    setIsCertModalOpen(true);
  };

  const handleGenerateCertificate = async (e) => {
    e.preventDefault();
    if (!certForm.name.trim() || !certForm.domain.trim() || !certForm.issuedDate) {
      toast.error('Please fill in all required fields (Name, Domain, and Date)');
      return;
    }

    setIsGenerating(true);
    try {
      const candidateUserId =
        candidate.userId?._id ||
        candidate.userId ||
        candidate.user_id ||
        candidate.user?._id ||
        candidate.user ||
        candidate.id ||
        candidate._id ||
        candidate.applicantId ||
        null;
      const resData = await generateCertificate({
        userId: candidateUserId,
        name: certForm.name.trim(),
        domain: certForm.domain.trim(),
        companyName: certForm.companyName.trim(),
        issuedDate: certForm.issuedDate,
        recipientEmail: candidate.mail || candidate.email || '',
      });

      toast.success('Certificate generated successfully!');
      setGeneratedCert(resData.data);
      if (onCreateCertificate) {
        onCreateCertificate(resData.data);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to generate certificate');
    } finally {
      setIsGenerating(false);
    }
  };

  const getFullUrl = (rawUrl) => {
    if (!rawUrl || rawUrl === '#') return '';
    if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) {
      try {
        const urlObj = new URL(rawUrl);
        if (urlObj.hostname === 'localhost' || urlObj.hostname === '127.0.0.1') {
          return `${BASE_URL}${urlObj.pathname}`;
        }
      } catch (e) {
        // Fallback if URL parsing fails
      }
      return rawUrl;
    }
    const cleanPath = rawUrl.startsWith('/') ? rawUrl : `/${rawUrl}`;
    return `${BASE_URL}${cleanPath}`;
  };

  const rawPic = candidate.profile_pic || candidate.profilePic;

  const profileData = {
    name: candidate.name || candidate.fullName || '',
    college: candidate.college || candidate.collegeName || '',
    degree: candidate.degree || '',
    department: candidate.department || '',
    openings: candidate.openings || '',
    contact: candidate.contact || candidate.phoneNumber || '',
    mail: candidate.mail || candidate.email || '',
    profilePic: rawPic ? getFullUrl(rawPic) : '',
    address: candidate.address || '',
    highestQualification: candidate.education || candidate.highestQualification || '',
    ugCompletion: candidate.year || candidate.ugCompletion || candidate.ugYear || '',
    ugModeOfStudy: candidate.ugModeOfStudy || '',
    academicAchievement: candidate.academicAchievement || '',
    status: candidate.status || 'applied',
    resumeUrl: candidate.resumeUrl || '#',
    primarySkills: candidate.primarySkills?.length ? candidate.primarySkills : [],
    toolsAndTechnologies: candidate.toolsAndTechnologies?.length ? candidate.toolsAndTechnologies : [],
    languagesKnown: candidate.languagesKnown?.length ? candidate.languagesKnown : [],
  };

  const handleOpenAndDownloadResume = async () => {
    const rawUrl = profileData.resumeUrl;
    const fullUrl = getFullUrl(rawUrl);
    const cleanName = profileData.name ? profileData.name.trim().replace(/\s+/g, '_') : 'Candidate';
    const fileName = `${cleanName}_resume.pdf`;

    if (!fullUrl) {
      toast.info(`Resume URL not available for ${profileData.name}`);
      return;
    }

    // 1. Open URL in a new window/tab
    window.open(fullUrl, '_blank', 'noopener,noreferrer');

    // 2. Trigger download with custom filename personsName_resume.pdf
    try {
      const response = await fetch(fullUrl);
      if (!response.ok) throw new Error("Failed to fetch resume file");
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      toast.success(`Downloaded as ${fileName}`);
    } catch (err) {
      console.warn("Direct blob download fallback to link click:", err);
      const link = document.createElement('a');
      link.href = fullUrl;
      link.setAttribute('download', fileName);
      link.setAttribute('target', '_blank');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <section className="bg-white rounded-[16px] md:rounded-[24px] border border-gray-200 p-4 md:p-6 shadow-sm space-y-6">

      {/* Top Profile Header Card */}
      <div className="flex flex-col xl:flex-row justify-between xl:items-center gap-6 pb-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
          <img
            src={profileData.profilePic}
            alt={profileData.name}
            className="w-[110px] h-[110px] rounded-[18px] object-cover border border-gray-200 shadow-xs shrink-0"
          />
          <div className="space-y-1">
            <h2 className="text-[22px] font-bold text-[#1D2939] leading-tight">{profileData.name}</h2>
            <p className="text-[15px] font-semibold text-[#344054]">{profileData.college}</p>
            <p className="text-[14px] font-medium text-[#475467]">
              {[profileData.degree, profileData.department].filter(Boolean).join(' - ')}
            </p>
            {isSelectedView ? (
              <p className="text-[14px] font-medium text-[#475467]">{profileData.openings}</p>
            ) : (
              <>
                <p className="text-[14px] font-medium text-[#475467]">{profileData.contact}</p>
                <p className="text-[14px] font-medium text-[#475467]">{profileData.mail}</p>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-col items-start xl:items-end gap-4 w-full xl:w-auto">
          {/* Action Buttons */}
          {isSelectedView ? (
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={onAddPerformance || (() => toast.info("Add Performance feature triggered"))}
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-[12px] font-semibold text-[14px] border border-gray-300 bg-white text-[#344054] hover:bg-gray-50 transition-all shadow-2xs flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <Plus size={18} />
                <span>Add Performance</span>
              </button>
              <button
                type="button"
                onClick={handleOpenCertModal}
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-[12px] font-semibold text-[14px] bg-[#0091D5] hover:bg-[#007fb8] text-white transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <Plus size={18} />
                <span>Create Certificate</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => onStatusChange?.('selected')}
                className={`flex-1 sm:flex-none px-7 py-2.5 rounded-full font-semibold text-[15px] transition-all shadow-xs cursor-pointer ${
                  profileData.status === 'selected'
                    ? 'bg-[#10B981] text-white ring-2 ring-[#10B981]/30'
                    : 'bg-[#10B981] hover:bg-[#059669] text-white active:scale-95'
                }`}
              >
                Selected
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => onStatusChange?.('rejected')}
                className={`flex-1 sm:flex-none px-7 py-2.5 rounded-full font-semibold text-[15px] transition-all shadow-xs cursor-pointer ${
                  profileData.status === 'rejected'
                    ? 'bg-[#EF4444] text-white ring-2 ring-[#EF4444]/30'
                    : 'bg-[#EF4444] hover:bg-[#DC2626] text-white active:scale-95'
                }`}
              >
                Not Selected
              </button>
            </div>
          )}

          {/* Download Resume Box */}
          <div 
            onClick={handleOpenAndDownloadResume}
            className="w-full sm:w-auto min-w-[280px] bg-white border border-gray-200 rounded-[16px] p-4 flex items-center justify-between gap-4 shadow-xs hover:border-[#2563EB]/40 transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#2563EB] flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform">
                <FileText size={20} />
              </div>
              <span className="font-semibold text-[15px] text-[#1D2939] group-hover:text-[#2563EB] transition-colors">Resume.Pdf</span>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleOpenAndDownloadResume();
              }}
              className="p-2 text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
              title="Open and Download Resume"
            >
              <Download size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Middle Grid Row - Separated Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Card 1: Personal Information */}
        <div className="lg:col-span-5 bg-white rounded-[22px] border border-gray-200 p-5 md:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-[16px] md:text-[18px] font-bold text-[#101828] mb-3">Personal Information</h3>
            <div className="space-y-1">
              <p className="text-[14px] font-bold text-[#344054]">Address</p>
              <p className="text-[14px] font-medium text-[#475467] leading-relaxed">{profileData.address}</p>
            </div>
          </div>
        </div>

        {/* Card 2: Educational Details */}
        <div className="lg:col-span-7 bg-white rounded-[22px] border border-gray-200 p-5 md:p-6 shadow-xs">
          <h3 className="text-[16px] md:text-[18px] font-bold text-[#101828] mb-3">Educational Details</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <p className="text-[13px] font-bold text-[#344054] mb-1">Highest Qualification</p>
              <p className="text-[14px] font-medium text-[#475467]">{profileData.highestQualification}</p>
            </div>
            <div>
              <p className="text-[13px] font-bold text-[#344054] mb-1">UG Completion</p>
              <p className="text-[14px] font-medium text-[#475467]">{profileData.ugCompletion}</p>
            </div>
            <div>
              <p className="text-[13px] font-bold text-[#344054] mb-1">UG Mode of Study</p>
              <p className="text-[14px] font-medium text-[#475467]">{profileData.ugModeOfStudy}</p>
            </div>
            <div>
              <p className="text-[13px] font-bold text-[#344054] mb-1">Academic Achievement</p>
              <p className="text-[14px] font-medium text-[#475467]">{profileData.academicAchievement}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Grid Row - Separated Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Primary Skills */}
        <div className="bg-white rounded-[22px] border border-gray-200 p-5 md:p-6 shadow-xs">
          <h3 className="text-[16px] md:text-[18px] font-bold text-[#101828] mb-3">Primary Skills</h3>
          <ul className="space-y-2 list-disc list-inside text-[14px] font-semibold text-[#344054]">
            {profileData.primarySkills.map((skill, index) => (
              <li key={`skill-${index}`}>{skill}</li>
            ))}
          </ul>
        </div>

        {/* Tool & Technologies */}
        <div className="bg-white rounded-[22px] border border-gray-200 p-5 md:p-6 shadow-xs">
          <h3 className="text-[16px] md:text-[18px] font-bold text-[#101828] mb-3">Tool & Technologies</h3>
          <ul className="space-y-2 list-disc list-inside text-[14px] font-semibold text-[#344054]">
            {profileData.toolsAndTechnologies.map((tool, index) => (
              <li key={`tool-${index}`}>{tool}</li>
            ))}
          </ul>
        </div>

        {/* Language Known */}
        <div className="bg-white rounded-[22px] border border-gray-200 p-5 md:p-6 shadow-xs">
          <h3 className="text-[16px] md:text-[18px] font-bold text-[#101828] mb-3">Language Known</h3>
          <ul className="space-y-2 list-disc list-inside text-[14px] font-semibold text-[#344054]">
            {profileData.languagesKnown.map((lang, index) => (
              <li key={`lang-${index}`}>{lang}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Certificate Modal */}
      {isCertModalOpen &&
        ReactDOM.createPortal(
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-[20px] max-w-lg w-full p-6 shadow-2xl border border-gray-100 relative space-y-5 animate-in fade-in zoom-in-95 duration-200">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#0091D5]/10 flex items-center justify-center shrink-0">
                    <Award className="w-5 h-5 text-[#0091D5]" />
                  </div>
                  <div>
                    <h3 className="text-[18px] font-bold text-[#101828]">Create Certificate</h3>
                    <p className="text-[13px] text-[#475467]">Generate an internship completion certificate</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCertModalOpen(false)}
                  className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Generated Success State */}
              {generatedCert ? (
                <div className="space-y-4">
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-[14px] text-emerald-800 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-[15px]">
                      <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                      <span>Certificate Generated Successfully!</span>
                    </div>
                    <p className="text-[13px] text-emerald-700">
                      Certificate ID: <strong className="font-mono">{generatedCert.certificateId}</strong>
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <a
                      href={getFullUrl(generatedCert.fileUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-4 bg-[#0091D5] hover:bg-[#007fb8] text-white text-[14px] font-semibold rounded-[12px] flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xs"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download PDF</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        const targetUrl = getFullUrl(generatedCert.fileUrl);
                        navigator.clipboard.writeText(targetUrl);
                        toast.success("Certificate link copied to clipboard!");
                      }}
                      className="w-full py-2.5 px-4 border border-gray-300 hover:bg-gray-50 text-[#344054] text-[14px] font-semibold rounded-[12px] flex items-center justify-center gap-2 transition-all active:scale-95"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Copy Link</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsCertModalOpen(false)}
                    className="w-full py-2 text-[14px] font-medium text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    Close
                  </button>
                </div>
              ) : (
                /* Input Form */
                <form onSubmit={handleGenerateCertificate} className="space-y-4">
                  <div>
                    <label className="block text-[13px] font-bold text-[#344054] mb-1.5">
                      Candidate Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={certForm.name}
                      onChange={(e) => setCertForm((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter full name"
                      className="w-full px-3.5 py-2.5 text-[14px] border border-gray-300 rounded-[12px] focus:ring-2 focus:ring-[#0091D5]/20 focus:border-[#0091D5] outline-none transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[13px] font-bold text-[#344054] mb-1.5">
                      Domain / Role <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={certForm.domain}
                      onChange={(e) => setCertForm((prev) => ({ ...prev, domain: e.target.value }))}
                      placeholder="e.g. Full-Stack Web Development"
                      className="w-full px-3.5 py-2.5 text-[14px] border border-gray-300 rounded-[12px] focus:ring-2 focus:ring-[#0091D5]/20 focus:border-[#0091D5] outline-none transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[13px] font-bold text-[#344054] mb-1.5">
                      Company Name
                    </label>
                    <input
                      type="text"
                      value={certForm.companyName}
                      onChange={(e) => setCertForm((prev) => ({ ...prev, companyName: e.target.value }))}
                      placeholder="e.g. Nulinz Community"
                      className="w-full px-3.5 py-2.5 text-[14px] border border-gray-300 rounded-[12px] focus:ring-2 focus:ring-[#0091D5]/20 focus:border-[#0091D5] outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[13px] font-bold text-[#344054] mb-1.5">
                      Issue Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={certForm.issuedDate}
                      onChange={(e) => setCertForm((prev) => ({ ...prev, issuedDate: e.target.value }))}
                      className="w-full px-3.5 py-2.5 text-[14px] border border-gray-300 rounded-[12px] focus:ring-2 focus:ring-[#0091D5]/20 focus:border-[#0091D5] outline-none transition-all"
                      required
                    />
                  </div>

                  {/* Form Buttons */}
                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => setIsCertModalOpen(false)}
                      className="px-4 py-2.5 text-[14px] font-semibold text-[#344054] hover:bg-gray-100 rounded-[12px] transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isGenerating}
                      className="px-5 py-2.5 text-[14px] font-semibold text-white bg-[#0091D5] hover:bg-[#007fb8] rounded-[12px] flex items-center gap-2 transition-all shadow-xs disabled:opacity-50 active:scale-95 cursor-pointer"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Generating...</span>
                        </>
                      ) : (
                        <>
                          <Award className="w-4 h-4" />
                          <span>Generate Certificate</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>,
          document.body
        )}
    </section>
  );
};

export default CandidateProfileSection;
