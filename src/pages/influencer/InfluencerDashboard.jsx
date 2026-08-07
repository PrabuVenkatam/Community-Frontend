import React, { useState, useEffect } from "react";
import { useMain } from "../../context/MainContext";
import { useTitle } from "../../context/AdminTitle";
import { getInfluencerDashboard } from "../../services/influencer/influencerServices";
import DynamicTable from "../../common/DynamicTable";
import setFileName from "../../utils/setFileName";
import { assets } from "../../assets/assets";
import { toast } from "react-toastify";
import { Copy, CheckCircle2 } from "lucide-react";

const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`} />
);

const InfluencerDashboard = () => {
  const { user } = useMain();
  const { setTitle } = useTitle();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setTitle("Dashboard");
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await getInfluencerDashboard();
      if (res?.success) {
        setDashboardData(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      toast.error(error?.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const influencerCode = user?.influencerCode || dashboardData?.influencerCode || "";
  const referralLink =
    dashboardData?.referralLink ||
    (influencerCode ? `https://community.nulinz.com/download?influencerCode=${influencerCode}` : "");

  const handleCopyLink = () => {
    if (!referralLink) return;
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success("Referral link copied to clipboard!");
    setTimeout(() => setCopied(false), 3000);
  };

  const registeredUsersList = dashboardData?.registeredUsers || [];

  const stats = {
    totalRegistered: dashboardData?.totalRegistered ?? 0,
    activeUsers: dashboardData?.activeUsers ?? 0,
    totalXpEarned: dashboardData?.totalXpEarned ?? "0 XP",
    conversionRate: dashboardData?.conversionRate ?? "0%",
  };

  // ── Metric Cards Grid ──
  const metricCards = [
    {
      key: "totalRegistered",
      title: "Total App Downloads",
      value: stats.totalRegistered,
      highlighted: true,
      subtext: "Total referred signups",
    },
    {
      key: "activeUsers",
      title: "Active Users",
      value: stats.activeUsers,
      highlighted: false,
      subtext: "Currently active members",
    },
    {
      key: "totalXpEarned",
      title: "Total XP Bonus",
      value: stats.totalXpEarned,
      highlighted: false,
      subtext: "Earned from referrals",
    },
    {
      key: "conversionRate",
      title: "Conversion Rate",
      value: stats.conversionRate,
      highlighted: false,
      subtext: "Link clicks to signups",
    },
  ];

  // ── Recent Registers Table Columns ──
  const recentColumns = [
    { title: "#", dataIndex: "index", key: "index" },
    {
      title: "Registered User",
      dataIndex: "name",
      key: "name",
      // render: (text, row) => (
      //   <div className="flex items-center gap-3">
      //     {row.profileImage ? (
      //       <img
      //         src={setFileName(row.profileImage)}
      //         alt={text}
      //         className="w-8 h-8 rounded-full object-cover border border-gray-100"
      //       />
      //     ) : (
      //       <div className="w-8 h-8 rounded-full bg-[#171717] text-white flex items-center justify-center font-bold text-xs">
      //         {text ? text.charAt(0).toUpperCase() : "U"}
      //       </div>
      //     )}
      //     <span className="font-semibold text-gray-900">{text || "Anonymous User"}</span>
      //   </div>
      // ),
    },
    {
      title: "Registration Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (val) =>
        val
          ? new Date(val).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : "—",
    },
    {
      title: "Account Status",
      dataIndex: "is_active",
      key: "is_active",
      render: (val) => {
        const active = val !== false;
        return (
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
              active ? "bg-[#E6F8EE] text-[#23A55A]" : "bg-gray-100 text-gray-600"
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${active ? "bg-[#23A55A]" : "bg-gray-400"}`} />
            {active ? "Active" : "Pending"}
          </span>
        );
      },
    },
  ];

  const recentRows = registeredUsersList.slice(0, 5).map((row, i) => ({
    ...row,
    index: `0${i + 1}`,
    id: row._id || row.id || `row_${i}`,
  }));

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* ── Referral Link Hero Banner ── */}
      {/* <div className="bg-white rounded-[24px] border border-[#EAECF0] p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-blue-50 text-blue-600 border border-blue-100 mb-2">
              CODE: {influencerCode}
            </span>
            <h1 className="text-xl font-bold text-gray-900">Your Exclusive Referral Link</h1>
            <p className="text-xs text-secondary mt-0.5">
              Share this link to track registrations and earn referral commission bonuses.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-[#F9FAFB] p-2.5 rounded-[16px] border border-[#EAECF0] max-w-lg w-full">
            <input
              type="text"
              readOnly
              value={referralLink}
              className="bg-transparent text-xs font-mono text-gray-700 w-full focus:outline-none truncate px-2"
            />
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 bg-[#171717] hover:bg-black text-white px-4 py-2 rounded-xl text-xs font-semibold transition-all active:scale-95 flex-shrink-0 shadow"
            >
              {copied ? <CheckCircle2 size={14} /> : <Copy size={14} />}
              {copied ? "Copied" : "Copy Link"}
            </button>
          </div>
        </div>
      </div>

      {/* ── Metric Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {metricCards.map((card) => {
          const isHighlighted = card.highlighted;

          return (
            <div
              key={card.key}
              className={`rounded-[24px] border p-6 flex flex-col justify-between transition-all ${
                isHighlighted
                  ? "bg-[linear-gradient(180deg,_#171717_0%,_#171717_100%)] border-transparent text-white shadow-lg"
                  : "bg-white border-[#EAECF0] text-primary shadow-sm"
              }`}
            >
              <div className="flex items-center justify-between">
                <h3
                  className={`text-[20px] font-semibold leading-[100%] ${
                    isHighlighted ? "text-white" : "text-primary"
                  }`}
                >
                  {card.title}
                </h3>
                <span
                  className={`w-9 h-9 rounded-[12px] inline-flex items-center justify-center ${
                    isHighlighted ? "bg-white/20" : "bg-[#F2F4F7]"
                  }`}
                >
                  <img src={isHighlighted ? assets.up_i : assets.down_i} alt="" />
                </span>
              </div>

              <div className="mt-4">
                {loading ? (
                  <Skeleton className="h-9 w-20 mb-2" />
                ) : (
                  <>
                    <p
                      className={`text-[35px] font-bold leading-[1] ${
                        isHighlighted ? "text-white" : "text-[#101828]"
                      }`}
                    >
                      {card.value}
                    </p>
                    <p
                      className={`text-xs mt-2 font-medium ${
                        isHighlighted ? "text-white/80" : "text-secondary"
                      }`}
                    >
                      {card.subtext}
                    </p>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Recent 5 Registers Section ── */}
      <section className="rounded-[24px] border border-[#EAECF0] bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
          <div>
            <h2 className="text-[20px] font-semibold text-primary">Recent 5 Registers</h2>
            <p className="text-xs text-secondary mt-0.5">
              Latest user signups attributed to your referral link.
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
            Top 5 Recent
          </span>
        </div>

        {loading ? (
          <div className="space-y-3 py-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : (
          <DynamicTable
            columns={recentColumns}
            dataSource={recentRows}
            rowKey="id"
            showPagination={false}
            plain={true}
          />
        )}
      </section>
    </div>
  );
};

export default InfluencerDashboard;
