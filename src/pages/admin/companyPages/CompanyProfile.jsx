import React, { useRef, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BriefcaseBusiness, Clock3, LockKeyhole, MapPin, Plus, SquarePen, Upload, X, Loader2 } from 'lucide-react';
import { assets } from '../../../assets/assets';
import DynamicTable from '../../../common/DynamicTable';
import { getCompanyById, addCompanyPost, setCompanyPassword, getMyCompany, toggleCompanyStatus } from '../../../services/admin/adminServices';
import { toast } from 'react-toastify';
import setFileName from '../../../utils/setFileName';


import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useMain } from '../../../context/MainContext';
import { useTitle } from '../../../context/AdminTitle';
import ConfirmActionButton from '../../../common/ConfirmActionButton';
import Icon from '../../../components/icons';

dayjs.extend(relativeTime);

const tabs = ['About', 'Posts', 'Jobs', 'People'];

const CompanyProfile = ({ module }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('About');
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isAddPostModalOpen, setIsAddPostModalOpen] = useState(false);
  const [peopleSearch, setPeopleSearch] = useState('');
  const [peoplePage, setPeoplePage] = useState(1);
  const [password, setPassword] = useState('12345678');
  const [confirmPassword, setConfirmPassword] = useState('12345678');
  const [uploadedPosts, setUploadedPosts] = useState([]);
  const [postFiles, setPostFiles] = useState([]); // Store raw File objects
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState({ internships: [], freelances: [] });       // ✅ add
  const [followers, setFollowers] = useState({ count: 0, data: [] });          // ✅ add
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [isAboutExpanded, setIsAboutExpanded] = useState(false);
  const fileInputRef = useRef(null);
  const { user, setUser } = useMain()
  const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const { setTitle } = useTitle()
  useEffect(() => {
    setTitle("Company Profile")
  }, [])
  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        setIsLoading(true);
        let response;
        if (id) {
          response = await getCompanyById(id);
        } else if (module === 'company') {
          response = await getMyCompany();
        }
        console.log(response)
        if (response?.success) {
          setCompany(response.data.company);        // ✅ company is now nested
          setJobs(response.data.jobs || { internships: [], freelances: [] });
          setFollowers(response.data.followers || { count: 0, data: [] });
        } else {
          setError("Company not found");
        }
      } catch (err) {
        setError("Failed to fetch company details");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCompanyData();
  }, [id, module]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        <p className="text-secondary font-medium mt-2">Loading Profile...</p>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6">
        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-4 max-w-md">
          <p className="font-bold text-lg mb-1">Oops!</p>
          <p className="text-sm font-medium">{error || "Something went wrong"}</p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2 bg-primary text-white rounded-full font-semibold shadow-md hover:bg-opacity-90 transition-all"
        >
          Go Back
        </button>
      </div>
    );
  }

  const SectionCard = ({ title, children, className = '' }) => (
    <div className={`rounded-[20px] border border-[#EAECF0] bg-[#FFFFFF] p-[14px] ${className}`}>
      <h2 className="text-[20px] font-semibold text-primary mb-[18px]">{title}</h2>
      {children}
    </div>
  );

  const DetailItem = ({ label, value }) => (
    <div className="space-y-1">
      <p className="text-[16px] font-semibold text-primary leading-normal">{label}</p>
      <p className="text-[14px] font-medium text-secondary leading-normal">{value}</p>
    </div>
  );
  const filteredPeople = followers?.data?.filter((item) =>
    [item.name, item.status, item.education, item.degree, item.contact]
      .join(' ')
      .toLowerCase()
      .includes(peopleSearch.toLowerCase())
  );

  const addFilesToPosts = (files) => {
    const rawFiles = Array.from(files || []).filter((file) => file.type.startsWith('image/'));

    const items = rawFiles.map((file, index) => ({
      id: `${Date.now()}-${index}-${file.name}`,
      src: URL.createObjectURL(file),
    }));

    if (!items.length) return;
    setUploadedPosts((prev) => [...prev, ...items]);
    setPostFiles((prev) => [...prev, ...rawFiles]);
  };

  const handleUploadChange = (event) => {
    addFilesToPosts(event.target.files);
    event.target.value = '';
  };

  const handleDrop = (event) => {
    event.preventDefault();
    addFilesToPosts(event.dataTransfer.files);
  };

  const removePostImage = (id, index) => {
    setUploadedPosts((prev) => prev.filter((item) => item.id !== id));
    setPostFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSetPassword = async () => {
    const companyId = id || company?._id || company?.id;
    if (!companyId) {
      toast.error("Company id not found");
      return;
    }
    if (!password) {
      toast.error("Password is required");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await setCompanyPassword({ id: companyId, password, confirmPassword });
      if (response.success) {
        toast.success(response.message || "Password updated successfully");
        setPassword('');
        setConfirmPassword('');
        setIsPasswordModalOpen(false);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update password");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async () => {
    try {
      setIsSubmitting(true);
      const response = await toggleCompanyStatus(company._id || company.id);
      if (response.success) {
        toast.success(response.message);
        setCompany((prev) => ({ ...prev, is_active: response.data.is_active }));
      }
    } catch (err) {
      toast.error("Failed to update status");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmPosts = async () => {
    const companyId = id || company?._id || company?.id;
    if (!companyId) {
      toast.error("Company id not found");
      return;
    }

    if (postFiles.length === 0) {
      toast.error("Please select images first");
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      postFiles.forEach((file) => {
        formData.append('images', file);
      });

      const response = await addCompanyPost(companyId, formData);
      if (response.success) {
        toast.success(response.message || "Posts uploaded successfully");
        setUploadedPosts([]);
        setPostFiles([]);
        setIsAddPostModalOpen(false);
        // Refresh company data
        const refreshResponse = module === 'company'
          ? await getMyCompany()
          : await getCompanyById(companyId);
        if (refreshResponse.success) {
          setCompany(refreshResponse.data.company);
          setJobs(refreshResponse.data.jobs || { internships: [], freelances: [] });
          setFollowers(refreshResponse.data.followers || { count: 0, data: [] });
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to upload posts");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const InfoList = ({ items = [] }) => (
    <ul className="text-[14px] text-secondary font-medium leading-[1.6] list-disc pl-5 space-y-1">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );

  const mergedJobs = [...jobs?.internships, ...jobs?.freelances]


  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <section className="bg-white rounded-[24px] border border-[#EAECF0] overflow-hidden shadow-sm">
        <div
          className="h-[150px] md:h-[180px] bg-cover bg-center"
          style={{
            backgroundImage: company.coverImage
              ? `url(${BASE_URL}/${company.coverImage})`
              : "linear-gradient(90deg, rgba(91, 108, 131, 0.2), rgba(184, 199, 217, 0.18)), url('https://images.unsplash.com/photo-1618004912476-29818d81ae2e?auto=format&fit=crop&w=1600&q=80')",
          }}
        />

        <div className="px-6 pb-6">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-6 -mt-[56px]">
            <div className="flex-1 min-w-0">
              <div className="w-[124px] h-[124px] rounded-[20px] border-[4px] border-white bg-white flex items-center justify-center overflow-hidden flex-shrink-0 shadow-lg">
                {company.companyLogo ? (
                  <img src={`${BASE_URL}/${company.companyLogo}`} alt={company.companyName} className="w-full h-full object-contain" />
                ) : (
                  <div className="w-full h-full bg-[#0B3A53] flex items-center justify-center text-white text-4xl font-bold">
                    {company?.companyName?.charAt(0)}
                  </div>
                )}
              </div>

              <div className="mt-4 space-y-2 max-w-[760px]">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-[30px] font-bold text-primary tracking-tight">{company.companyName}</h1>
                  <span className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[14px] font-semibold ${company.is_active ? 'bg-[#ECFDF3] text-[#027A48]' : 'bg-gray-100 text-gray-600'}`}>
                    <span className={`w-2 h-2 rounded-full ${company.is_active ? 'bg-[#12B76A]' : 'bg-gray-400'}`} />
                    {company.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-[14px] text-secondary">
                  <span className='text-[16px] font-semibold'>{company.companyTagLine} .</span> {company.city}, {company.state}
                </p>
                <p className="text-[14px] text-secondary font-medium">
                  <span className='text-[16px] font-semibold'>Year Founded: {company.yearFounded ? new Date(company.yearFounded).getFullYear() : 'N/A'}</span> {company.websiteLink && <a href={company.websiteLink.startsWith('http') ? company.websiteLink : `https://${company.websiteLink}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 ml-2 hover:underline">{company.websiteLink}</a>}
                </p>
                <p className="text-[16px] text-secondary font-normal leading-[1.7] max-w-2xl mt-4">
                  {company.aboutUs ? (
                    <>
                      {isAboutExpanded || company.aboutUs.length <= 200
                        ? company.aboutUs
                        : `${company.aboutUs.slice(0, 200)}... `}
                      {company.aboutUs.length > 200 && (
                        <button
                          type="button"
                          onClick={() => setIsAboutExpanded(!isAboutExpanded)}
                          className="text-blue-600 font-semibold ml-1.5 hover:underline focus:outline-none cursor-pointer"
                        >
                          {isAboutExpanded ? "Read Less" : "Read More"}
                        </button>
                      )}
                    </>
                  ) : (
                    'No description provided.'
                  )}
                </p>
                <p className="text-[14px] text-secondary font-medium mt-3">
                  <span className="text-[#171717] font-bold">
                    {followers?.count} {followers?.count === 1 ? "Follower" : "Followers"}
                  </span>
                  <span className="mx-4 text-[#D0D5DD]">.</span>
                  <span>{company?.employees} employees</span>
                </p>
              </div>
            </div>

            <div className="lg:min-w-[440px] lg:pt-[40px] flex flex-col gap-4">
              <div className="flex flex-wrap gap-4">
                <div className="min-w-[180px] md:min-w-[210px] rounded-[24px] p-6 bg-[linear-gradient(135deg,_#171717_0%,_#171717_100%)] text-white shadow-xl flex flex-col justify-center">
                  <p className="text-[11px] font-bold uppercase tracking-[1.5px] mb-3 opacity-80">Total Jobs</p>
                  <p className="text-[34px] font-black leading-none">{mergedJobs?.length}</p>
                </div>
                <div className="min-w-[180px] md:min-w-[210px] rounded-[24px] p-6 border border-[#EAECF0] bg-[#F8FAFC] shadow-sm flex flex-col justify-center">
                  <p className="text-[11px] font-bold uppercase tracking-[1.5px] text-secondary mb-3">Established Year</p>
                  <p className="text-[34px] font-black leading-none text-[#171717]">{company.yearFounded ? new Date(company.yearFounded).getFullYear() : '---'}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mt-2">
                {user.role === 'admin' && (
                  <>
                    <ConfirmActionButton
                      isActive={company?.is_active}
                      isSubmitting={isSubmitting}
                      onConfirm={handleToggleStatus}
                    />

                    <button
                      onClick={() => setIsPasswordModalOpen(true)}
                      className="px-[20px] py-3 rounded-full bg-[#171717] text-white text-[15px] font-bold shadow-md hover:bg-[#171717] transition-all active:scale-95"
                    >
                      Set Password
                    </button>
                  </>
                )}
                {/* bg-[#171717] */}
                {
                  user?.role !== "admin" &&
                  <button
                    onClick={() => setIsAddPostModalOpen(true)}
                    className="flex items-center gap-2 px-[20px] py-3 rounded-full  text-[15px] font-bold shadow-md  transition-all active:scale-95"
                  >
                    <Plus size={18} />
                    Add Post
                  </button>
                }
                {/* border border-[#EAECF0] bg-[#FFFFFF] */}
                <button
                  onClick={() => navigate(`/${user.role}/company-form`, { state: { editData: company } })}
                  className="flex border border-[#EAECF0] bg-[#FFFFFF] items-center gap-2 px-[20px] py-3 rounded-full   text-[15px] font-bold shadow-md  transition-all active:scale-95 "
                >
                  <Icon src="/icons/Edit.png" size={18} />
                  Edit Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-[24px] border border-[#EAECF0] p-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-0 border-b border-[#EAECF0] pb-0 px-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative px-6 py-4 text-[18px] font-medium transition-colors ${activeTab === tab ? 'text-[#171717] font-semibold' : 'text-[#475467] hover:text-[#344054]'
                }`}
            >
              {tab}
              {activeTab === tab && <span className="absolute left-0 right-0 bottom-0 h-[2px] bg-[#171717] rounded-full" />}
            </button>
          ))}
        </div>

        {activeTab === 'About' && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 pt-6">
            <div className="space-y-5">
              <SectionCard title="Contact Information">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                  <DetailItem label="Contact Person Name" value={company.contactPersonName} />
                  <DetailItem label="Phone" value={company.phone} />
                  <DetailItem label="Email" value={company.email} />
                </div>
                <div className="pt-2 border-t border-gray-100 mt-2">
                  <DetailItem
                    label="Location"
                    value={`${company.address}, ${company.city}, ${company.state} - ${company.pincode}`}
                  />
                </div>
              </SectionCard>

              {company.companyCultureTags && (
                <SectionCard title="Company Culture Tags">
                  <div className="flex flex-wrap gap-3">
                    {company?.companyCultureTags.map((tag) => (
                      <span
                        key={tag}
                        className="px-4 py-1.5 rounded-full border border-[#D0D5DD] bg-[#F8FAFC] text-[14px] font-semibold text-secondary"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                </SectionCard>
              )}

              {company.technologies?.length > 0 && (
                <SectionCard title="Technologies We Use">
                  <InfoList items={company.technologies} />
                </SectionCard>
              )}

              {company.whatWeDo?.length > 0 && (
                <SectionCard title="What We Do">
                  <InfoList items={company.whatWeDo} />
                </SectionCard>
              )}
            </div>

            <div className="space-y-5">
              <SectionCard title="About Us">
                <p className="text-[14px] md:text-[15px] text-secondary leading-[1.8] font-medium whitespace-pre-wrap">
                  {company.aboutUs}
                </p>
              </SectionCard>

              {company.certificateAvailability && (
                <SectionCard title="Certificate Availability">
                  <p className="text-[14px] md:text-[15px] text-secondary leading-[1.8] font-medium whitespace-pre-wrap">
                    {company.certificateAvailability}
                  </p>
                </SectionCard>
              )}

              {company.learningBenefits?.length > 0 && (
                <SectionCard title="Learning Benefits">
                  <InfoList items={company.learningBenefits} />
                </SectionCard>
              )}

              {company.learningOutcomes?.length > 0 && (
                <SectionCard title="Learning Outcomes">
                  <InfoList items={company.learningOutcomes} />
                </SectionCard>
              )}
            </div>
          </div>
        )}

        {activeTab === 'Posts' && (
          <div className="pt-6">
            <SectionCard title="Posts">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                {company.posts && company.posts.length > 0 ? (
                  company.posts.map((path, index) => (
                    <div key={index} className="rounded-[16px] overflow-hidden border border-[#EAECF0] aspect-square shadow-sm bg-gray-50 group relative">
                      <img
                        src={`${BASE_URL}${path}`}
                        alt={`Company Post ${index + 1}`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-12 text-center bg-gray-50 rounded-[16px] border border-dashed border-gray-300">
                    <p className="text-secondary font-medium italic">No posts uploaded yet.</p>
                  </div>
                )}
              </div>
            </SectionCard>
          </div>
        )}

        {activeTab === 'Jobs' && (
          <div className="pt-6 space-y-6">

            {/* Internships */}
            {(mergedJobs.length > 0 || mergedJobs.length > 0) && (

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {mergedJobs.map((job) => (
                  <div key={job._id} className="rounded-[14px] border border-[#EAECF0] bg-white p-4 shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className="w-14 h-14 rounded-[10px] border border-[#EAECF0] bg-[#F8FAFC] flex items-center justify-center overflow-hidden flex-shrink-0">
                        <img src={setFileName(company?.companyLogo)} alt="Company" className=" object-contain" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-[18px] font-semibold leading-[1.2] text-primary truncate">{job.jobTitle}</h3>
                        <p className="mt-1 text-[14px] font-medium text-[#667085]">{job.companyName}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-[14px] text-[#475467] font-medium">
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin size={16} className="text-[#667085]" />
                        {job?.location || "---"}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Clock3 size={16} className="text-[#667085]" />
                        {job?.duration || "---"}
                      </span>

                      <span className="inline-flex items-center gap-1.5">
                        <BriefcaseBusiness size={16} className="text-[#667085]" />
                        {job?.salary || "---"}
                      </span>
                    </div>
                    <p className="mt-2 text-[16px] text-[#475467] font-medium truncate">
                      {job?.eligibility?.join(", ")}
                    </p>
                    <p className="mt-3 text-[12px] text-[#667085] font-medium">
                      {dayjs(job?.createdAt).fromNow()}
                    </p>
                  </div>



                ))}

              </div>

            )}
            {/* Empty state */}
            {jobs.internships.length === 0 && jobs.freelances.length === 0 && (
              <div className="py-12 text-center bg-gray-50 rounded-[16px] border border-dashed border-gray-300">
                <p className="text-secondary font-medium italic">No jobs posted yet.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'People' && (
          <div className="pt-6">
            <DynamicTable
              columns={[
                { title: '#', dataIndex: 'index', key: 'index' },
                { title: 'Name', dataIndex: 'name', key: 'name' },
                { title: 'Status', dataIndex: 'currentStatus', key: 'currentStatus' },
                { title: 'Education', dataIndex: 'education', key: 'education' },
                { title: 'Degree', dataIndex: 'ugDegree', key: 'ugDegree' },
                // { title: 'Job Title', dataIndex: 'jobTitle', key: 'jobTitle' },
                { title: 'Contact', dataIndex: 'phone', key: 'phone' },
                { title: 'email', dataIndex: 'email', key: 'email' },
                // { title: 'Followed On', dataIndex: 'followedAt', key: 'followedAt' },
              ]}
              dataSource={filteredPeople?.map((person, i) => ({
                ...person,
                index: String(i + 1).padStart(2, '0'),
                followedAt: new Date(person.followedAt).toLocaleDateString(),
              }))}
              rowKey="userId"
              showSearch={true}
              searchPlaceholder="Search people..."
              onSearch={(value) => setPeopleSearch(value)}
              showPagination={true}
              currentPage={peoplePage}
              pageSize={10}
              onPageChange={setPeoplePage}
            />
          </div>
        )}
      </section>

      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/35 flex items-center justify-center p-4">
          <div className="w-full max-w-[520px] bg-white border border-[#EAECF0] rounded-[16px] shadow-xl p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-[10px] border border-[#EAECF0] inline-flex items-center justify-center text-[#667085]">
                  <LockKeyhole size={18} />
                </span>
                <h3 className="text-[20px] font-bold text-primary">Set Password</h3>
              </div>
              <button onClick={() => setIsPasswordModalOpen(false)} className="text-[#98A2B3] hover:text-[#667085]">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-[16px] font-source font-semibold text-secondary mb-1">Mobile Number</p>
                <p className="text-[16px] font-source text-primary">{company.phone}</p>
              </div>

              <div>
                <label className="block text-[16px] font-source font-semibold text-secondary mb-2">Password</label>
                <input
                  type="text"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full h-12 px-4 rounded-[12px] border border-[#D0D5DD] outline-none focus:ring-1 focus:ring-[#171717]"
                />
              </div>

              <div>
                <label className="block text-[16px] font-source font-semibold text-secondary mb-2">Confirm Password</label>
                <input
                  type="text"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  className="w-full h-12 px-4 rounded-[12px] border border-[#D0D5DD] outline-none focus:ring-1 focus:ring-[#171717]"
                />
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                onClick={() => setIsPasswordModalOpen(false)}
                className="h-12 rounded-[10px] border border-[#D0D5DD] text-[#344054] text-[16px] font-semibold"
              >
                Cancel
              </button>
              <button
                disabled={isSubmitting}
                onClick={handleSetPassword}
                className="h-12 rounded-[10px] bg-[#171717] text-white text-[16px] font-semibold disabled:bg-gray-400 flex items-center justify-center gap-2"
              >
                {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {isAddPostModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/35 flex items-center justify-center p-4">
          <div className="w-full max-w-[560px] bg-white rounded-[16px] border border-[#EAECF0] shadow-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[20px] font-bold text-primary">Add Post</h3>
              <button onClick={() => setIsAddPostModalOpen(false)} className="text-[#98A2B3] hover:text-[#667085]">
                <X size={24} />
              </button>
            </div>
            <p className="text-[14px] text-secondary mb-4">Upload poster for this company.</p>

            <div
              onDragOver={(event) => event.preventDefault()}
              onDrop={handleDrop}
              className="border border-[#D0D5DD] rounded-[14px] h-[150px] flex flex-col items-center justify-center gap-2 text-center"
            >
              <div className="w-10 h-10 rounded-full bg-[#F2F4F7] flex items-center justify-center">
                <Upload size={20} className="text-[#667085]" />
              </div>
              <p className="text-[14px] text-[#667085]">
                <button type="button" onClick={() => fileInputRef.current?.click()} className="text-[#171717] font-semibold">
                  Click to upload
                </button>{' '}
                or drag and drop
              </p>
              <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleUploadChange} className="hidden" />
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {uploadedPosts.slice(0, 3).map((item) => (
                <div key={item.id} className="relative rounded-[12px] overflow-hidden border border-[#EAECF0] bg-[#F9FAFB]">
                  <img src={item.src} alt="Post preview" className="w-full h-[120px] object-cover" />
                  <button
                    onClick={() => removePostImage(item.id)}
                    className="absolute top-2 right-2 w-5 h-5 rounded-full bg-white text-[#D92D20] border border-[#F4C7C3] flex items-center justify-center"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                onClick={() => setIsAddPostModalOpen(false)}
                className="h-11 rounded-[10px] border border-[#D0D5DD] text-[#344054] text-[15px] font-semibold"
              >
                Cancel
              </button>
              <button
                disabled={isSubmitting}
                onClick={handleConfirmPosts}
                className="h-11 rounded-[10px] bg-[#171717] text-white text-[15px] font-bold disabled:bg-gray-400 flex items-center justify-center gap-2"
              >
                {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyProfile;


