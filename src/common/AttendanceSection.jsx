import React, { useState, useMemo } from 'react';
import DynamicTable from './DynamicTable';
import { Plus, Calendar } from 'lucide-react';

const AttendanceSection = ({
  mode = 'list', // 'list' | 'view' | 'mark'
  onModeChange,
  onRowClick,
  onReturn,
  attendanceData = [],
  selectedCandidates = [],
  candidateStatuses = {},
  onStatusChange,
  onSaveAttendance,
  isLoading = false,
}) => {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Current Date formatted as DD/MM/YY (non-editable, auto-fetched)
  const currentDateFormatted = useMemo(() => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yy = String(today.getFullYear()).slice(-2);
    return `${dd}/${mm}/${yy}`;
  }, []);

  // Attendance history records
  const effectiveAttendanceData = useMemo(() => {
    return attendanceData && Array.isArray(attendanceData) ? attendanceData : [];
  }, [attendanceData]);

  // Dynamic Candidate List mapped directly from selectedCandidates prop
  const candidateList = useMemo(() => {
    if (selectedCandidates && selectedCandidates.length > 0) {
      return selectedCandidates.map((cand, idx) => ({
        id: cand._id || cand.id || cand.userId || `cand-${idx}`,
        sNo: String(idx + 1).padStart(2, '0'),
        name: cand.name || cand.fullName || cand.userName || cand.user?.name || '-',
        college: cand.college || cand.collegeName || cand.user?.collegeName || '-',
        contact: cand.contact || cand.phoneNumber || cand.user?.phone || '-',
        mail: cand.mail || cand.mailId || cand.user?.email || '-',
      }));
    }
    return [];
  }, [selectedCandidates]);

  // List view columns
  const listColumns = [
    {
      title: '#',
      dataIndex: 'sNo',
      key: 'sNo',
      render: (_, record, index) => record.sNo || String(index + 1).padStart(2, '0'),
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Present',
      dataIndex: 'presentCount',
      key: 'presentCount',
      render: (val) => (val && val > 0 ? val : '-'),
    },
    {
      title: 'Absent',
      dataIndex: 'absentCount',
      key: 'absentCount',
      render: (val) => (val && val > 0 ? val : '-'),
    },
  ];

  // Filtered attendance records for list mode
  const filteredAttendanceData = useMemo(() => {
    return effectiveAttendanceData.filter((item) => {
      const q = search.toLowerCase();
      return (
        (item?.date || '').toLowerCase().includes(q) ||
        String(item?.presentCount ?? '').includes(q) ||
        String(item?.absentCount ?? '').includes(q)
      );
    });
  }, [effectiveAttendanceData, search]);

  // Detail / Mark Columns
  const detailColumns = [
    {
      title: '#',
      dataIndex: 'sNo',
      key: 'sNo',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Contact Number',
      dataIndex: 'contact',
      key: 'contact',
    },
    {
      title: 'Mail id',
      dataIndex: 'mail',
      key: 'mail',
    },
    {
      title: mode === 'mark' ? 'Action' : 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (_, record) => {
        const currentStatus = candidateStatuses[record.id];

        if (mode === 'view') {
          return (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
              currentStatus === 'Absent' ? 'bg-[#FEE2E2] text-[#EF4444]' : 'bg-[#E6F8EE] text-[#23A55A]'
            }`}>
              {currentStatus || record.status || 'Present'}
            </span>
          );
        }

        return (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onStatusChange?.(record.id, 'Present')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-[8px] border transition-all cursor-pointer ${
                currentStatus === 'Present'
                  ? 'bg-[#23A55A] text-white border-[#23A55A] shadow-xs'
                  : 'bg-white text-[#475467] border-gray-200 hover:bg-gray-50'
              }`}
            >
              Present
            </button>
            <button
              type="button"
              onClick={() => onStatusChange?.(record.id, 'Absent')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-[8px] border transition-all cursor-pointer ${
                currentStatus === 'Absent'
                  ? 'bg-[#EF4444] text-white border-[#EF4444] shadow-xs'
                  : 'bg-white text-[#475467] border-gray-200 hover:bg-gray-50'
              }`}
            >
              Absent
            </button>
          </div>
        );
      },
    },
  ];

  // ----------------------------------------------------
  // VIEW MODE 1: ATTENDANCE HISTORY LIST TABLE
  // ----------------------------------------------------
  if (mode === 'list') {
    return (
      <DynamicTable
        columns={listColumns}
        dataSource={filteredAttendanceData}
        rowKey="id"
        onRowClick={onRowClick}
        showSearch={true}
        searchPlaceholder="Search ..."
        onSearch={(val) => {
          setSearch(val);
          setCurrentPage(1);
        }}
        showAddButton={true}
        addButtonLabel="Add Attendance"
        addButtonIcon={<Plus size={18} />}
        onAdd={() => onModeChange?.('mark')}
        showPagination={true}
        currentPage={currentPage}
        pageSize={10}
        onPageChange={setCurrentPage}
        loading={isLoading}
        plain={true}
      />
    );
  }

  // ----------------------------------------------------
  // VIEW MODE 2: ADD ATTENDANCE PAGE
  // ----------------------------------------------------
  return (
    <div className="space-y-6 pt-2">
      {/* Title & Non-Editable Date Section */}
      <div className="space-y-4">
        <h2 className="text-[18px] md:text-[20px] font-bold text-primary">
          {mode === 'mark' ? '' : 'Attendance Details'}
        </h2>

        {/* Non-Editable Date Input Field */}
        {mode === 'mark' && (
          <div className="space-y-1.5 pt-2">
            <label className="block text-[14px] font-semibold text-[#1D2939]">
              Date <span className="text-red-500">*</span>
            </label>
            <div className="relative w-[180px] sm:w-[220px]">
              <input
                type="text"
                readOnly
                value={currentDateFormatted}
                className="w-full pl-4 pr-10 py-2.5 bg-[#F9FAFB] border border-gray-200 rounded-[14px] text-sm text-[#344054] font-medium focus:outline-none cursor-not-allowed select-none"
              />
              <Calendar className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
            </div>
          </div>
        )}
      </div>

      {/* Dynamic Candidates Table - NO SEARCH BAR, NO PAGINATION */}
      <DynamicTable
        columns={detailColumns}
        dataSource={candidateList}
        rowKey="id"
        showPagination={false}
        plain={true}
      />

      {/* Bottom Save Button */}
      {mode === 'mark' && (
        <div className="flex items-center justify-end pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onSaveAttendance}
            className="px-8 py-2.5 bg-[#0091D5] text-white rounded-full text-[15px] font-bold hover:bg-[#007fb8] transition-all shadow-md shadow-blue-100 active:scale-95 cursor-pointer"
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
};

export default AttendanceSection;
