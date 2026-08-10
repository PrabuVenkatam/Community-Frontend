import React, { useEffect, useState, useMemo } from 'react';
import { assets } from '../assets/assets';
import AppliedListSection from './AppliedListSection';
import AttendanceSection from './AttendanceSection';
import CandidateProfileSection from './CandidateProfileSection';
import PerformanceEvaluationSection from './PerformanceEvaluationSection';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  getInternshipById,
  toggleInternshipStatus,
  updateJobStatus,
  getAppliedCandidateProfile,
  updateCandidateApplicationStatus,
  getSelectedCandidates,
  saveAttendance,
  getAttendanceHistory,
  getAttendanceDetails,
  getJobById,
  toggleJobStatus,
  getAppliedCandidateProfileJob,
  updateCandidateApplicationStatusJob,
} from '../services/admin/adminServices';
import ConfirmActionButton from './ConfirmActionButton';
import { useTitle } from '../context/AdminTitle';
import StatusActionButtons from './AcceptRejectButtons';
import { useMain } from '../context/MainContext';

const JobsProfile = ({ module = 'admin', jobType = 'Internship' }) => {
  const isJob = jobType === 'Job' || window.location.pathname.includes('/job-profile');
  const [activeTab, setActiveTab] = useState('overview');
  const [attendanceSubView, setAttendanceSubView] = useState('list'); // 'list' | 'view' | 'mark'
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedCandidateProfile, setSelectedCandidateProfile] = useState(null);
  const [isEvaluatingPerformance, setIsEvaluatingPerformance] = useState(false);
  const [candidateStatuses, setCandidateStatuses] = useState({});
  const [attendanceHistory, setAttendanceHistory] = useState([
    { id: 'att-1', sNo: '01', date: '23/07/2026', presentCount: 20, absentCount: 3 },
    { id: 'att-2', sNo: '02', date: '22/07/2026', presentCount: 18, absentCount: 4 },
    { id: 'att-3', sNo: '03', date: '21/07/2026', presentCount: 23, absentCount: null },
    { id: 'att-4', sNo: '04', date: '20/07/2026', presentCount: 23, absentCount: null },
  ]);

  const [internship, setInternship] = useState(null);
  const [applications, setApplications] = useState({ count: 0, list: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState(false);
  const [isTogglingStatus, setIsTogglingStatus] = useState(false);

  const { id } = useParams();
  const { user } = useMain();
  const navigate = useNavigate();
  const { setTitle } = useTitle();

  const isAttendanceView = activeTab === 'attendance' && attendanceSubView === 'view';
  const isAddAttendance = activeTab === 'attendance' && attendanceSubView === 'mark';
  const isAttendanceProfile = isAttendanceView || isAddAttendance;

  useEffect(() => {
    if (selectedCandidateProfile) {
      if (isEvaluatingPerformance) {
        setTitle('Performance Evaluation');
      } else if (activeTab === 'selected' || selectedCandidateProfile.status === 'selected') {
        setTitle('Selected Candidate Profile');
      } else {
        setTitle('Candidate Profile');
      }
    } else if (isAttendanceProfile) {
      if (attendanceSubView === 'mark') {
        setTitle('Add Attendance');
      } else {
        setTitle('Attendance Profile');
      }
    } else {
      setTitle(isJob ? 'Job Profile' : 'Internship Profile');
    }
  }, [selectedCandidateProfile, isEvaluatingPerformance, activeTab, isAttendanceProfile, attendanceSubView, setTitle, isJob]);

  // Reset scroll position to top when switching tabs or candidate subviews
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    const mainElement = document.querySelector("main");
    if (mainElement) {
      mainElement.scrollTop = 0;
      if (typeof mainElement.scrollTo === "function") {
        mainElement.scrollTo({ top: 0, left: 0, behavior: "instant" });
      }
    }
  }, [activeTab, selectedCandidateProfile, attendanceSubView, isEvaluatingPerformance]);

  const updateStatus = async (status, rejected_reason) => {
    try {
      setStatusLoading(true);
      const response = await updateJobStatus(id, isJob ? 'job' : 'internship', status, rejected_reason);
      if (response.success || response.status) {
        setInternship(response.data);
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    } catch (err) {
      toast.error(err.message);
      console.error(err);
    } finally {
      setStatusLoading(false);
    }
  };

  useEffect(() => {
    const fetchInternship = async () => {
      if (!id) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const fetchFn = isJob ? getJobById : getInternshipById;
        const response = await fetchFn(id);
        if (response.success || response.status) {
          const profileData = response.data?.job || response.data?.internship || response.data;
          setInternship(profileData);
          setApplications(response.data?.applications || { count: 0, list: [] });
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || `Failed to load ${isJob ? 'job' : 'internship'} profile`);
        setInternship(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInternship();
  }, [id, isJob]);

  // Fetch Selected Candidates API
  const [selectedCandidatesList, setSelectedCandidatesList] = useState([]);

  useEffect(() => {
    const fetchSelectedCandidates = async () => {
      if (!id) return;
      try {
        const response = await getSelectedCandidates(id);
        if (response.success && response.data) {
          setSelectedCandidatesList(response.data);
        }
      } catch (err) {
        console.warn("Could not fetch selected candidates from API:", err);
      }
    };

    if (id) {
      fetchSelectedCandidates();
    }
  }, [id, activeTab]);

  // Fetch Attendance History List
  const [attendanceHistoryList, setAttendanceHistoryList] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!id || activeTab !== 'attendance') return;
      try {
        const res = await getAttendanceHistory(id);
        if (res.success && res.data) {
          setAttendanceHistoryList(res.data);
        }
      } catch (err) {
        console.warn("Could not fetch attendance history:", err);
      }
    };

    fetchHistory();
  }, [id, activeTab, attendanceSubView]);

  const formatDate = (value) => {
    if (!value) return '-';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '-';
    return date.toLocaleDateString('en-GB');
  };

  const displaySelectedDate = useMemo(() => {
    if (!selectedDate) return '23/07/2026';
    if (selectedDate.includes('/')) return selectedDate;
    const dateObj = new Date(selectedDate);
    if (isNaN(dateObj.getTime())) return selectedDate;
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();
    return `${day}/${month}/${year}`;
  }, [selectedDate]);

  const statusLabel = internship?.isActive ? 'Active' : 'Inactive';
  const statusIsActive = internship?.isActive;
  const responsibilities = Array.isArray(internship?.responsibilities) ? internship.responsibilities : [];
  const eligibility = Array.isArray(internship?.eligibility) ? internship.eligibility : [];
  const skillSet = Array.isArray(internship?.skill_set) ? internship.skill_set : [];
  const benefits = Array.isArray(internship?.benefits) ? internship.benefits : [];
  const learningOutcomes = Array.isArray(internship?.learning_outcomes) ? internship.learning_outcomes : [];
  const developmentBenefits = Array.isArray(internship?.development_benefits) ? internship.development_benefits : [];
  const developmentResources = Array.isArray(internship?.development_resources) ? internship.development_resources : [];
  const fallbackList = ['-'];

  const appliedListHeading = [
    { title: '#', dataIndex: 'sNo', key: 'sNo' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Degree', dataIndex: 'department', key: 'department' },
    { title: 'Year', dataIndex: 'year', key: 'year' },
    { title: 'Contact Number', dataIndex: 'contact', key: 'contact' },
    { title: 'Mail id', dataIndex: 'mail', key: 'mail' },
  ];

  const selectedListHeading = [
    { title: '#', dataIndex: 'sNo', key: 'sNo' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'College', dataIndex: 'college', key: 'college' },
    { title: 'Year', dataIndex: 'year', key: 'year' },
    { title: 'Contact Number', dataIndex: 'contact', key: 'contact' },
    { title: 'Mail id', dataIndex: 'mail', key: 'mail' },
    { title: 'Location', dataIndex: 'location', key: 'location' },
  ];

  // Calculate Live Attendance Counts
  const presentCount = useMemo(() => {
    return Object.values(candidateStatuses).filter((s) => s === 'Present').length;
  }, [candidateStatuses]);

  const absentCount = useMemo(() => {
    return Object.values(candidateStatuses).filter((s) => s === 'Absent').length;
  }, [candidateStatuses]);

  const ListCard = ({ title, items }) => (
    <div className="bg-white rounded-[22px] border border-gray-200 shadow-sm p-5 md:p-6">
      <h3 className="text-[16px] md:text-[18px] font-bold text-primary mb-3">{title}</h3>
      <ul className="space-y-2 list-disc list-inside text-[14px] md:text-[15px] leading-[28px] font-semibold text-secondary">
        {items.map((item, index) => (
          <li key={`${title}-${index}`}>{item}</li>
        ))}
      </ul>
    </div>
  );

  const TextCard = ({ title, text }) => (
    <div className="bg-white rounded-[22px] border border-gray-200 shadow-sm p-5 md:p-6">
      <h3 className="text-[16px] md:text-[18px] font-bold text-primary mb-3">{title}</h3>
      <p className="text-[14px] md:text-[15px] leading-[30px] font-medium text-secondary">{text}</p>
    </div>
  );

  const handleToggleStatus = async () => {
    if (!internship?._id || isTogglingStatus) return;

    try {
      setIsTogglingStatus(true);
      const toggleFn = isJob ? toggleJobStatus : toggleInternshipStatus;
      const response = await toggleFn(internship._id);
      setInternship(response?.data || internship);
      toast.success(response?.message || `${isJob ? 'Job' : 'Internship'} status updated`);
    } catch (error) {
      toast.error(error?.response?.data?.message || `Failed to update ${isJob ? 'job' : 'internship'} status`);
    } finally {
      setIsTogglingStatus(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-[#f8f9fa] min-h-screen">
        <section className="bg-white rounded-[16px] md:rounded-[24px] border border-gray-200 p-6 shadow-sm">
          <p className="text-secondary">Loading...</p>
        </section>
      </div>
    );
  }

  if (!internship) {
    return (
      <div className="bg-[#f8f9fa] min-h-screen">
        <section className="bg-white rounded-[16px] md:rounded-[24px] border border-gray-200 p-6 shadow-sm space-y-4">
          <p className="text-secondary">{isJob ? 'Job' : 'Internship'} details not found.</p>
          <button
            type="button"
            onClick={() => navigate(`/${module}/jobs/${isJob ? 'job' : 'internship'}`)}
            className="bg-[#171717] text-white px-6 py-2 rounded font-bold"
          >
            Back to {isJob ? 'Job' : 'Internship'} List
          </button>
        </section>
      </div>
    );
  }

  const handleCandidateSelect = async (candidateRecord) => {
    const appId = candidateRecord?.applicationId || candidateRecord?._id;
    if (appId) {
      try {
        const getCandidateFn = isJob ? getAppliedCandidateProfileJob : getAppliedCandidateProfile;
        const response = await getCandidateFn(appId);
        if (response.success && response.data) {
          setSelectedCandidateProfile(response.data);
          return;
        }
      } catch (err) {
        console.warn("Could not fetch profile from API, fallback to record:", err);
      }
    }
    setSelectedCandidateProfile(candidateRecord);
  };

  if (selectedCandidateProfile) {
    const isSelectedCandidate = activeTab === 'selected' || selectedCandidateProfile.status === 'selected';

    if (isEvaluatingPerformance) {
      return (
        <div className="bg-[#f8f9fa] min-h-screen">
          <PerformanceEvaluationSection
            candidate={selectedCandidateProfile}
            onBack={() => setIsEvaluatingPerformance(false)}
            onSave={() => {
              toast.success('Performance evaluation saved successfully!');
              setIsEvaluatingPerformance(false);
            }}
          />
        </div>
      );
    }

    return (
      <div className="bg-[#f8f9fa] min-h-screen">
        <CandidateProfileSection
          candidate={selectedCandidateProfile ? {
            ...selectedCandidateProfile,
            internshipName: selectedCandidateProfile.internshipName || internship?.internshipName || internship?.title || internship?.jobTitle || internship?.internship_title || internship?.profileRole || ''
          } : {}}
          isSelected={isSelectedCandidate}
          onBack={() => {
            setSelectedCandidateProfile(null);
            setIsEvaluatingPerformance(false);
          }}
          onAddPerformance={() => setIsEvaluatingPerformance(true)}
          onStatusChange={async (newStatus) => {
            const appId = selectedCandidateProfile?.applicationId;
            if (appId) {
              try {
                const updateCandidateFn = isJob ? updateCandidateApplicationStatusJob : updateCandidateApplicationStatus;
                await updateCandidateFn(appId, newStatus);
              } catch (err) {
                toast.error(err?.message || "Failed to update candidate status");
              }
            }
            setSelectedCandidateProfile((prev) => ({ ...prev, status: newStatus }));
            toast.success(`Candidate marked as ${newStatus === 'selected' ? 'Selected' : 'Not Selected'}`);
          }}
        />
      </div>
    );
  }

  return (
    <div className="bg-[#f8f9fa] min-h-screen">
      <section className="bg-white rounded-[16px] md:rounded-[24px] border border-gray-200 p-4 md:p-6 shadow-sm">

        {/* Dynamic Top Header Section (Displayed in Internship & Attendance View, Hidden ONLY in Add Attendance) */}
        {!isAddAttendance && (
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 pb-6 border-b border-gray-200">
            <div className="flex gap-4 md:gap-6">
              <div className="w-[86px] h-[86px] md:w-[118px] md:h-[118px] rounded-[12px] border border-gray-300 flex items-center justify-center bg-white p-2">
                <img src={assets.logo} alt="Company logo" className="w-[54px] md:w-[84px] h-auto object-contain" />
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="font-semibold text-[18px] leading-none tracking-normal text-primary">
                    {internship.jobTitle || '-'}
                  </h1>
                  {!isAttendanceView && (
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[12px] font-semibold ${statusIsActive ? 'bg-[#E6F8EE] text-[#23A55A]' : 'bg-[#F1F5F9] text-[#64748B]'}`}>
                      <span className={`w-2 h-2 rounded-full ${statusIsActive ? 'bg-[#23A55A]' : 'bg-[#64748B]'}`} />
                      {statusLabel}
                    </span>
                  )}
                </div>
                <p className="font-jakarta font-semibold text-[16px] text-secondary">{internship.companyName || '-'}</p>
                <p className="font-jakarta font-medium text-[14px] text-[#344054]">{internship.mode || '-'}</p>

                {!isAttendanceView && (
                  <>
                    <p className="font-jakarta font-medium text-[14px] text-[#344054]">
                      {internship.totalOpenings ?? 0} Openings
                    </p>
                    <p className="font-jakarta font-medium text-[14px] text-[#344054]">Rs {internship.salary ?? 0}</p>
                  </>
                )}
              </div>
            </div>

            {/* Top Right Summary Cards */}
            {isAttendanceView ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full xl:w-auto">
                {/* Card 1: DATE */}
                <div className="rounded-[18px] bg-[linear-gradient(119.97deg,_#171717_0%,_#171717_100%)] text-white p-4 md:p-5 flex flex-col justify-center sm:min-w-[160px] shadow-sm">
                  <p className="uppercase tracking-[1px] text-[10px] md:text-[11px] font-bold mb-2 opacity-90">DATE</p>
                  <p className="text-[20px] md:text-[26px] leading-none font-bold text-white">{displaySelectedDate}</p>
                </div>

                {/* Card 2: PRESENT */}
                <div className="rounded-[18px] bg-white border border-gray-200 p-4 md:p-5 flex flex-col justify-center sm:min-w-[150px] shadow-xs">
                  <p className="uppercase tracking-[1px] text-[10px] md:text-[11px] font-bold mb-2 text-[#7D89A0]">PRESENT</p>
                  <p className="text-[26px] md:text-[36px] leading-none font-bold text-[#171717]">{presentCount}</p>
                </div>

                {/* Card 3: ABSENT */}
                <div className="rounded-[18px] bg-white border border-gray-200 p-4 md:p-5 flex flex-col justify-center sm:min-w-[150px] shadow-xs">
                  <p className="uppercase tracking-[1px] text-[10px] md:text-[11px] font-bold mb-2 text-[#7D89A0]">ABSENT</p>
                  <p className="text-[26px] md:text-[36px] leading-none font-bold text-[#171717]">{absentCount}</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full xl:w-auto">
                <div className="rounded-[18px] bg-[linear-gradient(119.97deg,_#171717_0%,_#171717_100%)] text-white p-4 md:p-5 min-h-[100px] md:min-h-[130px] flex flex-col justify-center sm:min-w-[150px]">
                  <p className="uppercase tracking-[1px] text-[10px] md:text-[11px] font-bold mb-3">Total Openings</p>
                  <p className="text-[28px] md:text-[40px] leading-none font-bold">{internship.totalOpenings ?? 0}</p>
                </div>

                <div className="rounded-[18px] bg-white border border-gray-200 text-[#0C5F94] p-4 md:p-5 min-h-[100px] md:min-h-[130px] flex flex-col justify-center sm:min-w-[150px]">
                  <p className="uppercase tracking-[1px] text-[10px] md:text-[11px] font-bold mb-3 text-[#7D89A0]">Intern Start Date</p>
                  <p className="text-[18px] md:text-[26px] leading-none font-bold">{formatDate(internship.internStartDate)}</p>
                </div>

                <div className="rounded-[18px] bg-white border border-gray-200 text-[#0C5F94] p-4 md:p-5 min-h-[100px] md:min-h-[130px] flex flex-col justify-center sm:min-w-[150px]">
                  <p className="uppercase tracking-[1px] text-[10px] md:text-[11px] font-bold mb-3 text-[#7D89A0]">Application Deadline</p>
                  <p className="text-[18px] md:text-[26px] leading-none font-bold">{formatDate(internship.applicationDeadline)}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tabs Row (Only visible when NOT in Attendance Profile mode) */}
        {!isAttendanceProfile && (
          <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 pt-6 pb-4">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => {
                  setSelectedCandidateProfile(null);
                  setActiveTab('overview');
                  setAttendanceSubView('list');
                }}
                className={`px-5 py-2.5 rounded-full text-[15px] font-medium transition-colors ${activeTab === 'overview' && !selectedCandidateProfile ? 'bg-[#171717] text-white' : 'bg-white text-[#344054] border border-gray-300'
                  }`}
              >
                Overview
              </button>
              {internship?.status === 'approved' && (
                <button
                  onClick={() => {
                    setSelectedCandidateProfile(null);
                    setActiveTab('applied');
                    setAttendanceSubView('list');
                  }}
                  className={`px-5 py-2.5 rounded-full text-[15px] font-medium transition-colors ${activeTab === 'applied' || (selectedCandidateProfile && activeTab === 'applied') ? 'bg-[#171717] text-white' : 'bg-white text-[#344054] border border-gray-300'
                    }`}
                >
                  Applied List
                </button>
              )}
              {internship?.status === 'approved' && (
                <button
                  onClick={() => {
                    setSelectedCandidateProfile(null);
                    setActiveTab('selected');
                    setAttendanceSubView('list');
                  }}
                  className={`px-5 py-2.5 rounded-full text-[15px] font-medium transition-colors ${activeTab === 'selected' || (selectedCandidateProfile && activeTab === 'selected') ? 'bg-[#171717] text-white' : 'bg-white text-[#344054] border border-gray-300'
                    }`}
                >
                  Selected Candidate
                </button>
              )}
              {internship?.status === 'approved' && (
                <button
                  onClick={() => {
                    setSelectedCandidateProfile(null);
                    setActiveTab('attendance');
                    setAttendanceSubView('list');
                  }}
                  className={`px-5 py-2.5 rounded-full text-[15px] font-medium transition-colors ${activeTab === 'attendance' ? 'bg-[#171717] text-white' : 'bg-white text-[#344054] border border-gray-300'
                    }`}
                >
                  Attendance
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {internship.status === 'approved' && (
                <>
                  <ConfirmActionButton
                    isActive={statusIsActive}
                    isSubmitting={isTogglingStatus}
                    onConfirm={handleToggleStatus}
                    activateText="Activate"
                    deactivateText="Deactivate"
                    type={isJob ? "Job" : "Internship"}
                    apply="apply"
                  />
                  <button
                    type="button"
                    onClick={() => navigate(`/${module}/jobs/${isJob ? 'job-form' : 'internship-form'}`, { state: { editData: internship } })}
                    className="inline-flex items-center gap-2 bg-white border border-[#D0D5DD] text-[#344054] px-6 py-2.5 rounded-full text-[15px] font-medium hover:bg-gray-50 transition-colors"
                  >
                    <img src={assets.edit} alt="Edit" className="w-5 h-5 object-contain" />
                    Edit Details
                  </button>
                </>
              )}

              {user.role === 'admin' && internship.status === 'pending' && (
                <StatusActionButtons type={isJob ? "Job" : "Internship"} isSubmitting={statusLoading} onConfirm={updateStatus} />
              )}
            </div>
          </div>
        )}

        {internship.status === 'rejected' && (
          <div className="space-y-6 pt-4">
            <p className="text-red-600 font-semibold">{internship?.rejected_reason}</p>
          </div>
        )}

        {/* Tab Body View */}
        {activeTab === 'overview' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 pt-2">
            <ListCard title="Responsibilities" items={responsibilities.length ? responsibilities : fallbackList} />
            <ListCard title="Eligibility Criteria" items={eligibility.length ? eligibility : fallbackList} />
            <ListCard title="Required Skill Set" items={skillSet.length ? skillSet : fallbackList} />

            <ListCard title="Learning Benefits" items={benefits.length ? benefits : fallbackList} />
            <ListCard title="Skill Development Benefits" items={developmentBenefits.length ? developmentBenefits : fallbackList} />
            <ListCard title="Supported Development Resources" items={developmentResources.length ? developmentResources : fallbackList} />
            <TextCard title="Description" text={internship.description || '-'} />

            <div className="xl:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextCard title="Learning Outcomes" text={learningOutcomes.join(', ') || '-'} />
              <TextCard title="Certificate Availability" text={internship.certificateAvailability || '-'} />
            </div>
          </div>
        ) : activeTab === 'applied' ? (
          <div className="pt-2">
            <AppliedListSection
              data={applications.list.map((app, idx) => ({
                ...app,
                sNo: app.sNo || String(idx + 1).padStart(2, '0'),
                appliedAt: app.appliedAt ? new Date(app.appliedAt).toLocaleDateString('en-GB') : '-',
              }))}
              heading={appliedListHeading}
              onRowClick={handleCandidateSelect}
            />
          </div>
        ) : activeTab === 'selected' ? (
          <div className="pt-2">
            <AppliedListSection
              data={
                selectedCandidatesList.length > 0
                  ? selectedCandidatesList
                  : applications.list
                    .filter((app) => app.status === 'selected')
                    .map((app, idx) => ({
                      ...app,
                      sNo: String(idx + 1).padStart(2, '0'),
                      college: app.college || app.collegeName || '-',
                      location: app.location || '-',
                    }))
              }
              heading={selectedListHeading}
              onRowClick={handleCandidateSelect}
            />
          </div>
        ) : (
          <AttendanceSection
            mode={attendanceSubView}
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            selectedCandidates={selectedCandidatesList}
            onReturn={() => {
              setAttendanceSubView('list');
              setActiveTab('overview');
            }}
            onModeChange={(newMode) => {
              if (newMode === 'mark') {
                setSelectedDate(new Date().toISOString().split('T')[0]);
                setCandidateStatuses({});
              }
              setAttendanceSubView(newMode);
            }}
            onRowClick={async (record) => {
              if (!record) return;
              const dateVal = record.date || record.rawDate;
              setSelectedDate(dateVal);

              try {
                const res = await getAttendanceDetails(id, record.rawDate || record.date);
                if (res.success && res.data) {
                  const initial = {};
                  res.data.forEach((item) => {
                    initial[item.id] = item.status === 'Absent' ? 'Absent' : 'Present';
                  });
                  setCandidateStatuses(initial);
                }
              } catch (err) {
                console.warn("Could not fetch date attendance details:", err);
              }
              setAttendanceSubView('view');
            }}
            attendanceData={attendanceHistoryList}
            candidateStatuses={candidateStatuses}
            onStatusChange={(candId, status) => {
              setCandidateStatuses((prev) => ({
                ...prev,
                [candId]: status,
              }));
            }}
            onSaveAttendance={async () => {
              if (!id) return;
              const currentDateISO = new Date().toISOString().split('T')[0];
              const records = selectedCandidatesList.map((cand) => {
                const candId = cand._id || cand.id || cand.userId;
                const st = candidateStatuses[candId] || 'Present';
                return {
                  userId: cand.userId || cand._id || cand.id,
                  status: st.toLowerCase(),
                };
              });

              try {
                const res = await saveAttendance(id, {
                  date: currentDateISO,
                  records,
                });
                if (res.success) {
                  toast.success(res.message || "Attendance saved successfully!");
                  setAttendanceSubView('list');
                }
              } catch (err) {
                toast.error(err?.message || "Failed to save attendance");
              }
            }}
          />
        )}
      </section>
    </div>
  );
};

export default JobsProfile;
