import React, { useState, useEffect } from "react";
import { useTitle } from "../../context/AdminTitle";
import { getInfluencerSubscribedUsers } from "../../services/influencer/influencerServices";
import DynamicTable from "../../common/DynamicTable";
import setFileName from "../../utils/setFileName";
import { CheckCircle2 } from "lucide-react";
import { toast } from "react-toastify";

const InfluencerSubscriptionList = () => {
  const { setTitle } = useTitle();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setTitle("Subscription List");
    fetchSubscribedUsers();
  }, []);

  const fetchSubscribedUsers = async () => {
    try {
      setLoading(true);
      const res = await getInfluencerSubscribedUsers();
      if (res?.success) {
        setUsers(Array.isArray(res.data) ? res.data : []);
      }
    } catch (error) {
      console.error("Failed to fetch subscribed users:", error);
      toast.error(error?.message || "Failed to load subscription list");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (val) => {
    setSearch(val);
    setCurrentPage(1);
  };

  const filteredUsers = users.filter((u) =>
    (u.name || "").toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      title: "#",
      dataIndex: "index",
      key: "index",
      render: (_text, _record, index) => (currentPage - 1) * 10 + index + 1,
    },
    {
      title: "Subscribed User",
      dataIndex: "name",
      key: "name",
      // render: (val, record) => (
      //   <div className="flex items-center gap-3">
      //     {record.profileImage ? (
      //       <img
      //         src={setFileName(record.profileImage)}
      //         alt={val}
      //         className="w-9 h-9 rounded-full object-cover border border-gray-200 shadow-sm flex-shrink-0"
      //       />
      //     ) : (
      //       <div className="w-9 h-9 rounded-full bg-[#171717] text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
      //         {val ? val.charAt(0).toUpperCase() : "U"}
      //       </div>
      //     )}
      //     <span className="font-semibold text-gray-900">{val || "Anonymous User"}</span>
      //   </div>
      // ),
    },
    {
      title: "Subscription Plan",
      dataIndex: "subscription",
      key: "planName",
      render: (sub) => sub?.planName || "N/A",
    },
    {
      title: "Subscription Amount",
      dataIndex: "subscription",
      key: "amount",
      render: (sub) => `₹${sub?.amount || sub?.planAmount || 499}`,
    },
    {
      title: "Commission Amount",
      dataIndex: "commission",
      key: "commission",
      render: (val, record) => `₹${val || record?.commissionAmount || 100}`,
    },
    {
      title: "Start Date",
      dataIndex: "subscription",
      key: "startDate",
      render: (sub) =>
        sub?.startDate
          ? new Date(sub.startDate).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : "N/A",
    },
    {
      title: "Expiry Date",
      dataIndex: "subscription",
      key: "expiryDate",
      render: (sub) =>
        sub?.expiryDate
          ? new Date(sub.expiryDate).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : "N/A",
    },
    {
      title: "Status",
      dataIndex: "subscription",
      key: "isPlanActive",
      render: (sub) => {
        const active = sub?.isPlanActive !== false;
        return (
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
              active ? "bg-[#E6F8EE] text-[#23A55A]" : "bg-gray-100 text-gray-600"
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${active ? "bg-[#23A55A]" : "bg-gray-400"}`} />
            {active ? "Active" : "Expired"}
          </span>
        );
      },
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* <div className="bg-white rounded-[24px] border border-[#EAECF0] p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Subscribed Referred Users</h1>
            <p className="text-xs text-secondary mt-0.5">
              List of users who registered using your referral code and activated a paid subscription. Contact details are protected per privacy standards.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2.5 rounded-2xl border border-emerald-100">
            <CheckCircle2 size={18} className="text-emerald-600" />
            <span className="text-xs font-bold text-emerald-900">
              Total Subscribed: {filteredUsers.length} Members
            </span>
          </div>
        </div>
      </div> */}

      <DynamicTable
        columns={columns}
        dataSource={filteredUsers}
        rowKey="_id"
        isLoading={loading}
        showSearch={true}
        onSearch={handleSearch}
        searchPlaceholder="Search subscribed user..."
        showPagination={true}
        currentPage={currentPage}
        pageSize={10}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default InfluencerSubscriptionList;
