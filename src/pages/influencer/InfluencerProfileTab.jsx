import React, { useState, useEffect } from "react";
import { useMain } from "../../context/MainContext";
import { useTitle } from "../../context/AdminTitle";
import { getInfluencerDashboard, getInfluencerProfile } from "../../services/influencer/influencerServices";
import setFileName from "../../utils/setFileName";
import { toast } from "react-toastify";
import { Loader2, Copy, CheckCircle2, SquarePen } from "lucide-react";
import { useNavigate } from "react-router-dom";

const InfluencerProfileTab = () => {
  const { user } = useMain();
  const { setTitle } = useTitle();
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState(user || null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setTitle("Profile");
    fetchInfluencerProfile();
  }, []);

  const fetchInfluencerProfile = async () => {
    try {
      setLoading(true);
      const res = await getInfluencerProfile();
      if (res?.success && res.data) {
        setProfileData((prev) => ({
          ...prev,
          ...res.data,
        }));
      }
    } catch (error) {
      console.warn("Using auth context user profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const influencer = profileData || user || {};
  const influencerCode = influencer.influencerCode || "INF_CODE";
  const referralLink = `https://community.nulinz.com/download?influencerCode=${influencerCode}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success("Referral link copied to clipboard!");
    setTimeout(() => setCopied(false), 3000);
  };

  const SectionCard = ({ title, children, className = "" }) => (
    <div className={`rounded-[20px] border border-[#EAECF0] bg-[#FFFFFF] p-6 ${className}`}>
      <h2 className="text-[20px] font-semibold text-primary mb-[18px]">{title}</h2>
      {children}
    </div>
  );

  const DetailItem = ({ label, value }) => (
    <div className="space-y-1">
      <p className="text-[16px] font-semibold text-primary leading-normal">{label}</p>
      <p className="text-[14px] font-medium text-secondary leading-normal">{value || "N/A"}</p>
    </div>
  );

  const SocialItem = ({ iconSrc, label, url }) => (
    <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50/60">
      <img src={iconSrc} alt={label} className="w-8 h-8 object-contain flex-shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</p>
        {url ? (
          <a
            href={url.startsWith("http") ? url : `https://${url}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-blue-600 hover:underline truncate block"
          >
            {url}
          </a>
        ) : (
          <p className="text-sm font-medium text-gray-400">Not Provided</p>
        )}
      </div>
    </div>
  );

  const renderStatus = (value) => {
    const isActive = value !== false;
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[14px] font-semibold ${
          isActive ? "bg-[#E6F8EE] text-[#23A55A]" : "bg-[#F1F5F9] text-[#64748B]"
        }`}
      >
        <span className={`w-2 h-2 rounded-full ${isActive ? "bg-[#23A55A]" : "bg-[#64748B]"}`} />
        {isActive ? "Active" : "Inactive"}
      </span>
    );
  };

  if (loading && !profileData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        <p className="text-secondary font-medium">Loading Profile...</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mx-auto space-y-6">
        {/* Header Profile Card (Matching CompanyProfile / CollegeProfile design) */}
        <section className="bg-white rounded-[24px] border border-[#EAECF0] p-6 shadow-sm">
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 pb-6 border-b border-[#EAECF0]">
            <div className="flex flex-col sm:flex-row sm:items-start gap-6">
              <div className="w-[110px] h-[110px] rounded-[16px] border border-[#EAECF0] bg-white flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm">
                {influencer.profileImage ? (
                  <img
                    src={setFileName(influencer.profileImage)}
                    alt={influencer.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#171717] to-black text-white flex items-center justify-center text-4xl font-bold">
                    {influencer?.name ? influencer.name.charAt(0).toUpperCase() : "I"}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-[24px] md:text-[28px] font-bold text-primary tracking-tight">
                    {influencer.name || "Influencer Partner"}
                  </h1>
                  {renderStatus(influencer.is_active)}
                </div>
                <div className="space-y-1">
                  <p className="text-[16px] font-semibold text-secondary">Influencer Partner</p>
                  <p className="text-[14px] text-secondary font-medium">{influencer.email || "N/A"}</p>
                  <p className="text-[14px] text-secondary font-medium">{influencer.phone || "N/A"}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="min-w-[180px] md:min-w-[220px] rounded-[20px] p-6 bg-[linear-gradient(180deg,_#171717_0%,_#171717_100%)] text-white shadow-md flex flex-col justify-center">
                <p className="text-[10px] font-semibold uppercase tracking-[1.5px] mb-4 opacity-90">
                  Referral Code
                </p>
                <p className="text-[26px] font-mono font-bold leading-none">
                  {influencerCode}
                </p>
              </div>

              <div className="min-w-[180px] md:min-w-[220px] rounded-[20px] p-6 border border-[#EAECF0] bg-white shadow-sm flex flex-col justify-center">
                <p className="text-[10px] font-semibold uppercase tracking-[1.5px] text-secondary mb-4">
                  Joined Date
                </p>
                <p className="text-[24px] font-bold leading-none text-[#171717]">
                  {influencer.createdAt
                    ? new Date(influencer.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 items-center justify-end py-6">
            <button
              onClick={() =>
                navigate("/influencer/influencer-form", { state: { editData: influencer } })
              }
              className="inline-flex items-center gap-2 px-[16px] py-2.5 rounded-full border border-[#D0D5DD] text-[#344054] text-[15px] font-semibold bg-white shadow-sm hover:bg-[#F9FAFB] transition-colors"
            >
              <SquarePen size={18} /> Edit Details
            </button>

            {/* <button
              onClick={() => handleCopyLink()}
              className="px-[16px] py-2.5 rounded-full bg-[#171717] text-white text-[15px] font-semibold shadow-sm hover:bg-black transition-colors flex items-center gap-2"
            >
              {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
              {copied ? "Link Copied" : "Copy Referral Link"}
            </button> */}
          </div>

          {/* Overview Detail Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pt-2">
            <SectionCard title="Contact Information">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <DetailItem label="Full Name" value={influencer.name} />
                <DetailItem label="Phone Number" value={influencer.phone} />
                <DetailItem label="Mail ID" value={influencer.email} />
              </div>
            </SectionCard>

            <SectionCard title="Referral Link & Attribution">
              <div className="space-y-3">
                <DetailItem label="Influencer Referral Code" value={influencerCode} />
                <div>
                  <p className="text-[16px] font-semibold text-primary leading-normal mb-1">
                    App Download Link
                  </p>
                  <div className="flex items-center gap-2 bg-[#F9FAFB] p-2.5 rounded-[12px] border border-[#EAECF0]">
                    <input
                      type="text"
                      readOnly
                      value={referralLink}
                      className="bg-transparent text-xs text-gray-700 w-full focus:outline-none font-mono truncate px-1"
                    />
                    <button
                      onClick={handleCopyLink}
                      className="flex items-center gap-1.5 bg-[#171717] text-white px-3 py-1.5 rounded-md text-xs font-semibold hover:bg-black transition-all active:scale-95 flex-shrink-0"
                    >
                      {copied ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                      {copied ? "Copied" : "Copy"}
                    </button>
                  </div>
                </div>
              </div>
            </SectionCard>
          </div>

          {/* Social Media Section */}
          <div className="pt-5">
            <SectionCard title="Social Media Profiles">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <SocialItem
                  iconSrc="/icons/instagram.svg"
                  label="Instagram"
                  url={influencer.instagram}
                />
                <SocialItem
                  iconSrc="/icons/youtube.svg"
                  label="YouTube"
                  url={influencer.youtube}
                />
                <SocialItem
                  iconSrc="/icons/linkedin.svg"
                  label="LinkedIn"
                  url={influencer.linkedin}
                />
                <SocialItem
                  iconSrc="/icons/twitter.svg"
                  label="Twitter / X"
                  url={influencer.twitter}
                />
              </div>
            </SectionCard>
          </div>
        </section>
      </div>
    </div>
  );
};

export default InfluencerProfileTab;
