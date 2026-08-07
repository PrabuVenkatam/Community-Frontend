import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import DynamicTable from "../../../common/DynamicTable";
import { getAllInfluencers } from "../../../services/admin/adminServices";
import { useTitle } from "../../../context/AdminTitle";
import { toast } from "react-toastify";
import setFileName from "../../../utils/setFileName";
import { Plus } from "lucide-react";

const InfluencerList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [influencers, setInfluencers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { setTitle } = useTitle();

  useEffect(() => {
    setTitle("Influencers");
  }, []);

  useEffect(() => {
    fetchInfluencers();
  }, [location.state]);

  const fetchInfluencers = async () => {
    try {
      setIsLoading(true);
      const response = await getAllInfluencers();
      if (response.success) {
        const mappedData = (response.data || []).map((item) => ({
          ...item,
          id: item._id,
        }));
        setInfluencers(mappedData);
      }
    } catch (error) {
      console.error("Failed to fetch influencers:", error);
      toast.error(error.message || "Failed to load influencers");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const filteredRows = influencers.filter(
    (item) =>
      (item.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (item.email || "").toLowerCase().includes(search.toLowerCase()) ||
      (item.phone || "").toLowerCase().includes(search.toLowerCase()) ||
      (item.influencerCode || "").toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      title: "#",
      dataIndex: "index",
      key: "index",
      render: (_text, _record, index) => (currentPage - 1) * 10 + index + 1,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      // render: (val, record) => (
      //   <div className="flex items-center gap-3">
      //     {record.profileImage ? (
      //       <img
      //         src={setFileName(record.profileImage)}
      //         alt={val || "Avatar"}
      //         className="w-9 h-9 rounded-full object-cover border border-gray-200 shadow-sm flex-shrink-0"
      //       />
      //     ) : (
      //       <div className="w-9 h-9 rounded-full bg-[#171717] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
      //         {val ? val.charAt(0).toUpperCase() : "I"}
      //       </div>
      //     )}
      //     <span className="font-semibold text-gray-900">{val || "N/A"}</span>
      //   </div>
      // ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (val) => val || "N/A",
    },
    {
      title: "Mobile Number",
      dataIndex: "phone",
      key: "phone",
      render: (val) => val || "N/A",
    },
    {
      title: "Influencer Code",
      dataIndex: "influencerCode",
      key: "influencerCode",
      render: (val) => (
        <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-mono font-bold bg-blue-50 text-blue-600 border border-blue-100">
          {val || "N/A"}
        </span>
      ),
    },
    {
      title: "Created Date",
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
  ];

  return (
    <div className="animate-in fade-in duration-500">
      <DynamicTable
        columns={columns}
        dataSource={filteredRows}
        rowKey="_id"
        isLoading={isLoading}
        showSearch={true}
        onSearch={handleSearch}
        searchPlaceholder="Search name, email, code..."
        showAddButton={true}
        addButtonLabel="Add Influencer"
        addButtonIcon={<Plus size={18} />}
        onAdd={() => navigate("/admin/influencer-form")}
        showPagination={true}
        currentPage={currentPage}
        pageSize={10}
        onPageChange={setCurrentPage}
        onRowClick={(record) =>
          navigate(`/admin/influencer-profile/${record._id}`, { state: { editData: record } })
        }
      />
    </div>
  );
};

export default InfluencerList;
