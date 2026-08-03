import React, { useState, useEffect } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import DynamicTable from "../../../common/DynamicTable"
import { useNavigate } from 'react-router-dom';
import { getAllSeminars } from '../../../services/admin/adminServices';
import { toast } from 'react-toastify';
import { useMain } from '../../../context/MainContext';
import { useTitle } from '../../../context/AdminTitle';

const TABS = [
  { label: "Community", value: "community" },
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
];

const Seminar = () => {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [seminars, setSeminars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("community");
  const navigate = useNavigate();
  const { user, dynamicPath } = useMain();
  const { setTitle } = useTitle();

  useEffect(() => { setTitle("Seminars"); }, []);

  useEffect(() => {
    fetchSeminars(activeTab);
  }, [activeTab]);

  const fetchSeminars = async (status) => {
    try {
      setIsLoading(true);
      const response = await getAllSeminars(status);
      if (response.success) {
        setSeminars(response.data);
      }
    } catch (error) {
      toast.error('Failed to fetch seminars');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (value) => {
    setActiveTab(value);
    setCurrentPage(1);
    setSearch('');
  };

  const columns = [
    {
      title: '#',
      key: 'index',
      render: (_, record, index) => {
        const idx = (currentPage - 1) * 10 + index + 1;
        return String(idx).padStart(2, '0');
      }
    },
    {
      title: 'Seminar Name',
      dataIndex: 'eventName',
      key: 'eventName',
      render: (text) => (
        <p className="max-w-[150px] truncate" title={text}>{text}</p>
      )
    },
    { title: 'Organizer', dataIndex: 'organizer', key: 'organizer' },
    {
      title: 'Date',
      dataIndex: 'eventDate',
      key: 'eventDate',
      render: (value) => value ? new Date(value).toLocaleDateString() : 'N/A'
    },
    { title: 'Mode', dataIndex: 'mode', key: 'mode' },
    { title: 'Reg Type', dataIndex: 'registrationType', key: 'registrationType' },
    {
      title: 'Fees',
      key: 'fees',
      render: (_, record) => `₹${record.individualFees || 0}`
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive) => (
        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[14px] font-semibold ${isActive ? 'bg-[#E6F8EE] text-[#23A55A]' : 'bg-[#F1F5F9] text-[#64748B]'
          }`}>
          <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-[#23A55A]' : 'bg-[#64748B]'}`} />
          {isActive ? 'Active' : 'Inactive'}
        </span>
      )
    }
  ];

  const filteredData = seminars.filter(item =>
    item.eventName?.toLowerCase().includes(search.toLowerCase()) ||
    item.organizer?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSearch = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  return (
    <div className="bg-[#F9FAFB] min-h-screen">

      {/* Tabs */}
      <div className="flex items-center gap-5 px-4 pt-4 pb-2">
        {
          user.role === "admin" &&
          TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => handleTabChange(tab.value)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${activeTab === tab.value
                  ? 'bg-[#171717] text-white shadow'
                  : 'bg-white text-[#64748B] border border-[#E2E8F0] hover:bg-blue-50 hover:text-blue-600'
                }`}
            >
              {tab.label}
            </button>
          ))
        }
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      ) : (
        <DynamicTable
          columns={columns}
          dataSource={filteredData}
          rowKey="_id"
          showSearch={true}
          searchPlaceholder="Search ..."
          onSearch={handleSearch}
          showAddButton={true}
          addButtonLabel="Add Seminar"
          addButtonIcon={<Plus size={18} />}
          onAdd={() => navigate(dynamicPath("seminar-form"))}
          showPagination={true}
          currentPage={currentPage}
          pageSize={10}
          onPageChange={setCurrentPage}
          onRowClick={(record) => navigate(dynamicPath(`seminar-profile/${record._id || record.id}`))}
        />
      )}
    </div>
  );
};

export default Seminar;