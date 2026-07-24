import React from 'react';
import { Download, FileText, ArrowLeft, Plus } from 'lucide-react';
import { toast } from 'react-toastify';

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

  const profileData = {
    name: candidate.name || candidate.fullName || 'Sridhar',
    college: candidate.college || candidate.collegeName || 'Quantum Innovators Institute',
    degree: candidate.department || candidate.degree || 'B.Sc Computer Science',
    openings: candidate.openings || '10 Openings',
    contact: candidate.contact || candidate.phoneNumber || '8434298692',
    mail: candidate.mail || candidate.email || 'sridhar@gmail.com',
    profilePic: candidate.profile_pic || candidate.profilePic || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop',
    address: candidate.address || '1st Floor, NV Arcade Building, Near 5Roads, Next Reliance Mall, Salem – 636004',
    highestQualification: candidate.education || candidate.highestQualification || 'UG',
    ugCompletion: candidate.year || candidate.ugCompletion || '2026',
    ugModeOfStudy: candidate.ugModeOfStudy || 'Regular',
    academicAchievement: candidate.academicAchievement || '2026',
    status: candidate.status || 'applied',
    resumeUrl: candidate.resumeUrl || '#',
    primarySkills: candidate.primarySkills?.length ? candidate.primarySkills : ['AI Engineering', 'Data Management', 'Machine Learning', 'Robotics', 'Cloud Computing'],
    toolsAndTechnologies: candidate.toolsAndTechnologies?.length ? candidate.toolsAndTechnologies : ['AI Engineering', 'Data Management', 'Machine Learning', 'Robotics', 'Cloud Computing'],
    languagesKnown: candidate.languagesKnown?.length ? candidate.languagesKnown : ['Tamil', 'English', 'Telugu'],
  };

  const handleDownloadResume = () => {
    if (profileData.resumeUrl && profileData.resumeUrl !== '#') {
      window.open(profileData.resumeUrl, '_blank');
    } else {
      toast.info(`Downloading ${profileData.name}'s Resume...`);
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
            <p className="text-[14px] font-medium text-[#475467]">{profileData.degree}</p>
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
                onClick={onCreateCertificate || (() => toast.info("Create Certificate feature triggered"))}
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
          <div className="w-full sm:w-auto min-w-[280px] bg-white border border-gray-200 rounded-[16px] p-4 flex items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#2563EB] flex items-center justify-center text-white shrink-0">
                <FileText size={20} />
              </div>
              <span className="font-semibold text-[15px] text-[#1D2939]">Resume.Pdf</span>
            </div>
            <button
              type="button"
              onClick={handleDownloadResume}
              className="p-2 text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
              title="Download Resume"
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
    </section>
  );
};

export default CandidateProfileSection;
