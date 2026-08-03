import React, { useEffect, useState } from 'react';
import { assets } from '../assets/assets';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getFreelanceById, toggleFreelanceStatus, updateJobStatus } from '../services/admin/adminServices';
import AppliedListSection from '../common/AppliedListSection';
import ConfirmActionButton from '../common/ConfirmActionButton';
import { useTitle } from '../context/AdminTitle';
import { useMain } from '../context/MainContext';
import StatusActionButtons from '../common/AcceptRejectButtons';

const FreelanceProfile = ({ module = 'admin' }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [freelance, setFreelance] = useState(null);
  const [applications, setApplications] = useState({ count: 0, list: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState(false)
  const [isTogglingStatus, setIsTogglingStatus] = useState(false);
  const { id } = useParams();
  const { user, dynamicPath } = useMain()
  const navigate = useNavigate();
  const { setTitle } = useTitle()
  useEffect(() => {
    setTitle("Freelance Profile")
  }, [])
  const updateStatus = async (status, rejected_reason) => {
    try {
      setStatusLoading(true);
      const response = await updateJobStatus(id, "freelance", status, rejected_reason);
      console.log(response)
      if (response.success) {
        setFreelance(response.data)
        toast.success(response.message);
      }
      else {
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
    const fetchFreelance = async () => {
      if (!id) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await getFreelanceById(id);
        if (response.success) {
          setFreelance(response.data.freelance);
          setApplications(response.data.applications || { count: 0, list: [] });
        } else {
          setError("Freelance not found");
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || 'Failed to load freelance profile');
        setFreelance(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFreelance();
  }, [id]);

  const formatDate = (value) => {
    if (!value) return '-';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '-';
    return date.toLocaleDateString('en-GB');
  };

  const statusLabel = freelance?.isActive ? 'Active' : 'Inactive';
  const statusIsActive = freelance?.isActive;
  const projectNeeds = Array.isArray(freelance?.projectNeeds) ? freelance.projectNeeds : [];
  const eligibility = Array.isArray(freelance?.eligibility) ? freelance.eligibility : [];
  const security = Array.isArray(freelance?.security) ? freelance.security : [];
  const referenceWebsite = Array.isArray(freelance?.referenceWebsite) ? freelance.referenceWebsite : [];
  const skillSet = Array.isArray(freelance?.skill_set) ? freelance.skill_set : [];
  const rules = Array.isArray(freelance?.rules) ? freelance.rules : [];
  const paymentStructure = Array.isArray(freelance?.payment_structure) ? freelance.payment_structure : [];
  const supportingFiles = Array.isArray(freelance?.supporting_files) ? freelance.supporting_files : [];
  const eligibilityCriteria = Array.isArray(freelance?.eligibility_criteria) ? freelance.eligibility_criteria : [];
  const fallbackList = ['-'];

  const appliedListColumns = [
    { title: '#', dataIndex: 'sNo', key: 'sNo' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    // { title: 'College', dataIndex: 'college', key: 'college' },
    { title: 'Department', dataIndex: 'department', key: 'department' },
    { title: 'Year', dataIndex: 'year', key: 'year' },
    { title: 'Contact Number', dataIndex: 'contact', key: 'contact' },
    { title: 'Mail id', dataIndex: 'mail', key: 'mail' },
    { title: 'Location', dataIndex: 'location', key: 'location' },
  ];

  const appliedListData = [];

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
    if (!freelance?._id || isTogglingStatus) return;

    try {
      setIsTogglingStatus(true);
      const response = await toggleFreelanceStatus(freelance._id);
      setFreelance(response?.data || freelance);
      toast.success(response?.message || 'Freelance status updated');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to update freelance status');
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

  if (!freelance) {
    return (
      <div className="bg-[#f8f9fa] min-h-screen">
        <section className="bg-white rounded-[16px] md:rounded-[24px] border border-gray-200 p-6 shadow-sm space-y-4">
          <p className="text-secondary">Freelance details not found.</p>
          <button
            type="button"
            onClick={() => navigate(`/${module}/jobs/freelance`)}
            className="bg-[#171717] text-white px-6 py-2 rounded font-bold"
          >
            Back to Freelance List
          </button>
        </section>
      </div>
    );
  }

  return (
    <div className="bg-[#f8f9fa] min-h-screen ">
      <section className="bg-white rounded-[16px] md:rounded-[24px] border border-gray-200 p-4 md:p-6 shadow-sm">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 pb-6 border-b border-gray-200">
          <div className="flex gap-4 md:gap-6">
            <div className="w-[86px] h-[86px] md:w-[118px] md:h-[118px] rounded-[12px] border border-gray-300 flex items-center justify-center bg-white">
              <img src={assets.logo} alt="Company logo" className="w-[54px] md:w-[84px] h-auto object-contain" />
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-semibold text-[18px] leading-none tracking-normal text-primary">
                  {freelance.jobTitle || '-'}
                </h1>
                <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[12px] font-semibold ${statusIsActive ? 'bg-[#E6F8EE] text-[#23A55A]' : 'bg-[#F1F5F9] text-[#64748B]'
                  }`}>
                  <span className={`w-2 h-2 rounded-full ${statusIsActive ? 'bg-[#23A55A]' : 'bg-[#64748B]'}`} />
                  {statusLabel}
                </span>
              </div>
              <p className="font-jakarta font-semibold text-[16px] text-secondary">{freelance.companyName || '-'}</p>
              <p className="font-jakarta font-medium text-[14px] text-[#344054]">{freelance.mode || '-'}</p>
              <p className="font-jakarta font-medium text-[14px] text-[#344054]">
                {freelance.totalOpenings ?? 0} Openings
              </p>
              <p className="font-jakarta font-medium text-[14px] text-[#344054]">Rs {freelance.salary ?? 0}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full xl:w-auto">
            <div className="rounded-[18px] bg-[linear-gradient(119.97deg,_#171717_0%,_#171717_100%)] text-white p-4 md:p-5 min-h-[100px] md:min-h-[130px] flex flex-col justify-center sm:min-w-[150px]">
              <p className="uppercase tracking-[1px] text-[10px] md:text-[11px] font-bold mb-3">Total Openings</p>
              <p className="text-[28px] md:text-[40px] leading-none font-bold">{freelance.totalOpenings ?? 0}</p>
            </div>

            <div className="rounded-[18px] bg-white border border-gray-200 text-[#0C5F94] p-4 md:p-5 min-h-[100px] md:min-h-[130px] flex flex-col justify-center sm:min-w-[150px]">
              <p className="uppercase tracking-[1px] text-[10px] md:text-[11px] font-bold mb-3 text-[#7D89A0]">Job Start Date</p>
              <p className="text-[18px] md:text-[26px] leading-none font-bold">{formatDate(freelance.jobStartDate)}</p>
            </div>

            <div className="rounded-[18px] bg-white border border-gray-200 text-[#0C5F94] p-4 md:p-5 min-h-[100px] md:min-h-[130px] flex flex-col justify-center sm:min-w-[150px]">
              <p className="uppercase tracking-[1px] text-[10px] md:text-[11px] font-bold mb-3 text-[#7D89A0]">Application Deadline</p>
              <p className="text-[18px] md:text-[26px] leading-none font-bold">{formatDate(freelance.applicationDeadline)}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 pt-6 pb-4">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-5 py-2.5 rounded-full text-[15px] font-medium transition-colors ${activeTab === 'overview'
                ? 'bg-[#171717] text-white'
                : 'bg-white text-[#344054] border border-gray-300'
                }`}
            >
              Overview
            </button>

            {(freelance?.status === "approved") &&

              <button
                onClick={() => setActiveTab('applied')}
                className={`px-5 py-2.5 rounded-full text-[15px] font-medium transition-colors ${activeTab === 'applied'
                  ? 'bg-[#171717] text-white'
                  : 'bg-white text-[#344054] border border-gray-300'
                  }`}
              >
                Applied List
              </button>
            }
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {
              freelance.status === "approved" && <>


                <ConfirmActionButton
                  isActive={statusIsActive}
                  isSubmitting={isTogglingStatus}
                  onConfirm={handleToggleStatus}
                  activateText="Activate"
                  deactivateText="Deactivate"
                  type='Freelance'
                  apply="apply"
                />
                <button
                  type="button"
                  onClick={() => navigate(`/${module}/jobs/freelance-form`, { state: { editData: freelance } })}
                  className="inline-flex items-center gap-2 bg-white border border-[#D0D5DD] text-[#344054] px-6 py-2.5 rounded-full text-[15px] font-medium hover:bg-gray-50 transition-colors"
                >
                  <img src={assets.edit} alt="Edit" className="w-5 h-5 object-contain" />
                  Edit Details
                </button>
              </>}

            {
              user.role === "admin" && freelance.status === "pending" && <StatusActionButtons type='Freelance' isSubmitting={statusLoading} onConfirm={updateStatus} />
            }
          </div>
        </div>
        {
          freelance.status === "rejected" && (
            <div className="space-y-6">
              <p className="text-red-600 font-semibold">
                {freelance?.rejected_reason}
              </p>
            </div>
          )
        }
        {activeTab === 'overview' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            <ListCard title="Project Needs" items={projectNeeds.length ? projectNeeds : fallbackList} />
            <ListCard title="Eligibility" items={eligibility.length ? eligibility : fallbackList} />
            <ListCard title="Security" items={security.length ? security : fallbackList} />

            <ListCard title="Reference Website" items={referenceWebsite.length ? referenceWebsite : fallbackList} />
            <ListCard title="Required Skill Set" items={skillSet.length ? skillSet : fallbackList} />

            <TextCard title="Learning" text={freelance.learning || '-'} />
            <TextCard title="Description" text={freelance.description || '-'} />
            <ListCard title="Eligibility Criteria" items={eligibilityCriteria.length ? eligibilityCriteria : fallbackList} />
            <ListCard title="Rules" items={rules.length ? rules : fallbackList} />
            <ListCard title="Payment Structure" items={paymentStructure.length ? paymentStructure : fallbackList} />
            <ListCard title="Supporting Files" items={supportingFiles.length ? supportingFiles : fallbackList} />

            <div className="xl:col-span-2">
              <TextCard title="Duration" text={freelance.duration || '-'} />
            </div>
            <TextCard title="Certificate Availability" text={freelance.certificateAvailability || '-'} />
          </div>
        ) : (
          <AppliedListSection
            data={applications.list.map((app) => ({
              ...app,
              appliedAt: new Date(app.appliedAt).toLocaleDateString('en-GB'),
            }))}
            heading={appliedListColumns}
          />
        )}
      </section>
    </div>
  );
};

export default FreelanceProfile;
