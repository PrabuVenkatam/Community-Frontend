import React, { useState, useEffect } from "react";
import { useTitle } from "../../context/AdminTitle";
import { getInfluencerReferrals } from "../../services/influencer/influencerServices";
import DynamicTable from "../../common/DynamicTable";
import setFileName from "../../utils/setFileName";
import { toast } from "react-toastify";
import { Users } from "lucide-react";

const InfluencerReferralList = () => {
  const { setTitle } = useTitle();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setTitle("Referral List");
    fetchReferralList();
  }, []);

  const fetchReferralList = async () => {
    try {
      setLoading(true);
      const res = await getInfluencerReferrals();
      if (res?.success) {
        setUsers(Array.isArray(res.data) ? res.data : []);
      }
    } catch (error) {
      console.error("Failed to fetch referral list:", error);
      toast.error(error?.message || "Failed to load referral list");
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
      title: "Registered User Name",
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
      title: "Joined Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (val) =>
        val
          ? new Date(val).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : "N/A",
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
    {
      title: "Activity XP Points",
      dataIndex: "xp",
      key: "xp",
      render: (val) => (
        <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100 text-xs">
          ⚡ {val ?? 0} XP
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <DynamicTable
        columns={columns}
        dataSource={filteredUsers}
        rowKey="_id"
        isLoading={loading}
        showSearch={true}
        onSearch={handleSearch}
        searchPlaceholder="Search user name..."
        showPagination={true}
        currentPage={currentPage}
        pageSize={10}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default InfluencerReferralList;
