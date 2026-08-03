import React, { useState, useEffect } from 'react';
import { Users, CheckCircle2, XCircle, Loader2, Award } from 'lucide-react';
import axios from 'axios';
import AppliedListSection from '../common/AppliedListSection';
import GenerateCertificateModal from './GenerateCertificateModal';
import { downloadCSVFromAPI } from '../utils/exportUtils';

const AttendanceTabSection = ({ eventId, eventType, eventTitle = "", organizerName = "" }) => {
  const [attendees, setAttendees] = useState([]);
  const [stats, setStats] = useState({
    totalRegistered: 0,
    totalPresent: 0,
    totalAbsent: 0,
    attendanceRate: "0",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Certificate Modal State
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const fetchAttendanceData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${BASE_URL}/api/users/attendance/stats/${eventId}?eventType=${eventType}`,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      if (response.data?.success) {
        setStats(response.data.data.stats);
        setAttendees(response.data.data.attendees || []);
      } else {
        setError("Failed to load attendance data.");
      }
    } catch (err) {
      console.error("Fetch Attendance Error:", err);
      setError(err.response?.data?.message || "Failed to load attendance.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (eventId) {
      fetchAttendanceData();
    }
  }, [eventId, eventType]);

  const handleOpenCertificateModal = (attendee) => {
    setSelectedCandidate(attendee);
    setIsCertModalOpen(true);
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    return d.toLocaleString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const attendanceColumns = [
    { title: '#', dataIndex: 'sNo', key: 'sNo' },
    { title: 'Name', dataIndex: 'fullName', key: 'fullName' },
    { title: 'College', dataIndex: 'collegeName', key: 'collegeName' },
    { title: 'Department', dataIndex: 'department', key: 'department' },
    { title: 'Time and Date', dataIndex: 'attendedAtFormatted', key: 'attendedAtFormatted' },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (_, record) => (
        <button
          onClick={(e) => {
            e?.stopPropagation();
            handleOpenCertificateModal(record);
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#171717] text-white hover:bg-[#171717] rounded-full text-xs font-semibold shadow-xs transition cursor-pointer"
        >
          <Award size={14} /> Certificate
        </button>
      ),
    },
  ];

  const formattedAttendanceData = attendees.map((item, index) => ({
    ...item,
    sNo: String(index + 1).padStart(2, '0'),
    name: item.fullName,
    college: item.collegeName,
    attendedAtFormatted: formatDateTime(item.attendedAt),
  }));

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] gap-3 bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
        <Loader2 className="w-8 h-8 text-[#171717] animate-spin" />
        <p className="text-gray-500 font-medium text-sm">Loading attendance records...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#171717] flex items-center justify-center font-bold">
            <Users size={22} />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Registered</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-0.5">{stats.totalRegistered}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 size={22} />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Present Count</p>
            <h3 className="text-2xl font-bold text-emerald-600 mt-0.5">{stats.totalPresent}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <XCircle size={22} />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Absent Count</p>
            <h3 className="text-2xl font-bold text-amber-600 mt-0.5">{stats.totalAbsent}</h3>
          </div>
        </div>
      </div>

      {/* Common Table Component (AppliedListSection wrapping DynamicTable) */}
      <AppliedListSection
        data={formattedAttendanceData}
        heading={attendanceColumns}
      />

      {/* Certificate Generation Modal */}
      <GenerateCertificateModal
        isOpen={isCertModalOpen}
        onClose={() => setIsCertModalOpen(false)}
        candidate={selectedCandidate}
        defaultDomain={eventTitle || `${eventType} Participation`}
        organizerName={organizerName}
      />
    </div>
  );
};

export default AttendanceTabSection;
