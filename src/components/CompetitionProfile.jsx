import React, { useRef, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    MapPin, Briefcase, CalendarDays, Download, Plus, X, Upload, Loader2, SquarePen,
    DollarSign, IndianRupee, QrCode
} from 'lucide-react';
import { assets } from '../assets/assets';
import AppliedListSection from '../common/AppliedListSection';
import AttendanceTabSection from './AttendanceTabSection';
import EventQRCodeModal from './EventQRCodeModal';
import { downloadCSVFromAPI } from '../utils/exportUtils';
import { getCompetitionById, toggleCompetitionStatus, addCompetitionPost, updateEventStatus } from '../services/admin/adminServices';
import { toast } from 'react-toastify';
import { useMain } from '../context/MainContext';
import { formatAddress } from '../utils/formatAddress';
import getRemainingDays from '../utils/getRemainingDays';
import ConfirmActionButton from '../common/ConfirmActionButton';
import { useTitle } from '../context/AdminTitle';
import { EducationIcon } from './icons';
import StatusActionButtons from '../common/AcceptRejectButtons';


const CompetitionProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [isQRModalOpen, setIsQRModalOpen] = useState(false);
    const [isAddPostModalOpen, setIsAddPostModalOpen] = useState(false);
    const [uploadedPosts, setUploadedPosts] = useState([]);
    const [statusLoading, setStatusLoading] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [competition, setCompetition] = useState(null);
    const [registrations, setRegistrations] = useState({ count: 0, list: [], revenue: null }); // ✅ add
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);
    const { user, dynamicPath } = useMain()
    const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
    const STATIC_URL = BASE_URL.replace("/api", "");
    const { setTitle } = useTitle()
    useEffect(() => {
        setTitle("Competition Profile")
    }, [])
    useEffect(() => {
        fetchCompetitionData();
    }, [id]);

    const updateStatus = async (status, rejected_reason) => {
        try {
            setStatusLoading(true);
            const response = await updateEventStatus(id, "competition", status, rejected_reason);
            console.log(response)
            if (response.success) {
                setCompetition(response.data)
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
    const fetchCompetitionData = async () => {
        try {
            setIsLoading(true);
            const response = await getCompetitionById(id);
            if (response.success) {
                setCompetition(response?.data?.competition);
                setRegistrations(response.data.registrations || { count: 0, list: [], revenue: null });
            } else {
                setError("Competition not found");
            }
        } catch (err) {
            setError("Failed to fetch competition details");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggleStatus = async () => {
        try {
            setIsSubmitting(true);
            const response = await toggleCompetitionStatus(competition._id || competition.id);
            if (response.success) {
                toast.success(response.message);
                setCompetition((prev) => ({ ...prev, isActive: response.data.isActive }));
            }
        } catch (err) {
            toast.error("Failed to update status");
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                <p className="text-secondary font-medium mt-2">Loading Profile...</p>
            </div>
        );
    }

    if (error || !competition) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6 text-secondary">
                <p className="text-lg font-semibold">{error || "Competition not found"}</p>
                <button onClick={() => navigate(-1)} className="mt-4 text-blue-600 font-bold hover:underline">Go Back</button>
            </div>
        );
    }

    const InfoCard = ({ title, children, className = "" }) => (
        <div className={`bg-white p-5 sm:p-6 lg:p-7 rounded-[20px] md:rounded-[24px] shadow-sm border border-gray-100 ${className}`}>
            <h3 className="text-[18px] sm:text-[20px] font-bold text-[#1a1a1a] mb-5 sm:mb-7">{title}</h3>
            {children}
        </div>
    );

    const DataItem = ({ label, value }) => (
        <div className="flex flex-col gap-2 min-w-0">
            <p className="font-source text-[15px] sm:text-[16px] font-semibold leading-snug tracking-normal text-primary break-words">
                {label}
            </p>
            <p className="text-[13px] sm:text-[14px] font-medium leading-snug tracking-normal text-secondary mt-1 sm:mt-2 break-words">
                {value || "—"}
            </p>
        </div>
    );

    const onUploadInputChange = async (event) => {
        const files = event.target.files;
        if (!files.length) return;
        await handleAddPosts(files);
        event.target.value = '';
    };

    const onUploadDrop = async (event) => {
        event.preventDefault();
        const files = event.dataTransfer.files;
        if (!files.length) return;
        await handleAddPosts(files);
    };

    const handleAddPosts = async (files) => {
        try {
            setIsSubmitting(true);
            const formData = new FormData();
            Array.from(files).forEach(file => {
                formData.append('posts', file);
            });

            const response = await addCompetitionPost(competition._id, formData);
            if (response.success) {
                toast.success("Posts added successfully");
                setCompetition(response.data);
                setIsAddPostModalOpen(false);
            }
        } catch (err) {
            toast.error("Failed to add posts");
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const appliedListColumns = [
        { title: '#', dataIndex: 'sNo', key: 'sNo' },
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'College', dataIndex: 'college', key: 'college' },
        { title: 'Department', dataIndex: 'department', key: 'department' },
        { title: 'Year', dataIndex: 'year', key: 'year' },
        { title: 'Registered At', dataIndex: 'registeredAt', key: 'registeredAt' },
    ];

    return (
        <div className="bg-[#f8f9fa] min-h-screen ">
            <section className="bg-white rounded-[16px] md:rounded-[24px] border border-gray-200 p-4 md:p-6 shadow-sm">
                <div
                    className="relative overflow-hidden rounded-[20px] md:rounded-[22px] xl:rounded-[24px] text-white p-5 pt-8 pb-6 sm:p-6 md:p-7 lg:p-8 xl:p-10 xl:pt-16 xl:pb-10 min-h-[320px] md:min-h-[360px] lg:min-h-[380px] xl:min-h-[400px] flex flex-col xl:flex-row justify-between xl:items-end gap-6 md:gap-7 xl:gap-8 mb-6 md:mb-7 xl:mb-8"
                    style={{
                        backgroundColor: '#0a0f26',
                        backgroundImage: `linear-gradient(to right, rgba(10, 15, 38, 0.95), rgba(10, 15, 38, 0.4)), url('${competition.coverImage ? `${STATIC_URL}/${competition.coverImage}` : 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=2000'}')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                >
                    {/* Left Side Content */}
                    <div className="z-10">
                        <h1 className="text-[24px] sm:text-[30px] md:text-[34px] lg:text-[38px] xl:text-[48px] font-extrabold leading-[32px] sm:leading-[38px] md:leading-[44px] lg:leading-[48px] xl:leading-[60px] tracking-[0px] align-middle mb-4 md:mb-6 xl:mb-8">{competition.eventName}</h1>
                        <div className="grid grid-cols-1 gap-y-2 font-source text-[13px] sm:text-[14px] md:text-[15px] xl:text-[16px] font-normal leading-[18px] sm:leading-[19px] md:leading-[20px] tracking-[0px] align-middle text-[#FFFFFF]">
                            <span className="flex items-center gap-2 "><EducationIcon /> {competition.organizer}</span>
                            <span className="flex items-center gap-2 "><MapPin size={16} /> {formatAddress(competition)}</span>
                            <span className="flex items-center gap-2 "><Briefcase size={16} /> {competition.mode}</span>
                            <span className="flex items-center gap-2 "><CalendarDays size={16} /> {competition.eventDate ? new Date(competition.eventDate).toLocaleDateString() : 'N/A'}</span>
                        </div>
                    </div>

                    {/* Right Side Stats Widgets */}
                    <div className="z-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:flex gap-3 md:gap-4 xl:gap-4 items-stretch xl:items-end w-full xl:w-auto">
                        <div className="bg-[linear-gradient(119.97deg,_#171717_0%,_#171717_100%)] p-3 sm:p-3.5 md:p-4 xl:p-6 rounded-[14px] sm:rounded-[16px] xl:rounded-[24px] min-w-0 xl:min-w-[180px] flex flex-col justify-center shadow-lg w-full xl:w-auto">
                            <p className="font-source text-[8px] sm:text-[9px] md:text-[10px] xl:text-[10px] font-semibold leading-[13px] sm:leading-[14px] tracking-[0.5px] align-middle uppercase text-[#FFFFFF] mb-1">Total Registration</p>
                            <p className="text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px] xl:text-[30px] font-bold leading-[24px] sm:leading-[26px] md:leading-[28px] lg:leading-[30px] xl:leading-[36px] tracking-[0px] align-middle text-[#ffffff] text-source">{registrations?.count ?? 0} <span className='text-[20px] text-gray-300 ' >/{competition?.totalSeats}</span></p>
                        </div>
                        <div className="bg-white p-3 sm:p-3.5 md:p-4 xl:p-6 rounded-[14px] sm:rounded-[16px] xl:rounded-[24px] min-w-0 xl:min-w-[180px] flex flex-col justify-center text-gray-900 shadow-xl w-full xl:w-auto">
                            <p className="font-source text-[8px] sm:text-[9px] md:text-[10px] xl:text-[10px] font-semibold leading-[13px] sm:leading-[14px] tracking-[0.5px] align-middle uppercase text-[#64748B] mb-1">Revenue Generated</p>
                            <div className="flex items-center gap-1">
                                <IndianRupee size={24} className="text-[#171717] font-bold" />

                                <p className="text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px] xl:text-[30px] font-bold leading-[24px] sm:leading-[26px] md:leading-[28px] lg:leading-[30px] xl:leading-[36px] tracking-[0px] align-middle text-[#171717] text-source">
                                    {registrations?.revenue?.totalAmount || 0}
                                </p>
                            </div>
                        </div>
                        <div className="bg-white p-3 sm:p-3.5 md:p-4 xl:p-6 rounded-[14px] sm:rounded-[16px] xl:rounded-[24px] min-w-0 xl:min-w-[180px] flex flex-col justify-center items-start shadow-xl w-full xl:w-auto">
                            <p className="font-source text-[8px] sm:text-[9px] md:text-[10px] xl:text-[10px] font-semibold leading-[13px] sm:leading-[14px] tracking-[0.5px] align-middle uppercase text-[#64748B] mb-1">Days Remaining</p>
                            <p className="text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px] xl:text-[30px] font-bold leading-[24px] sm:leading-[26px] md:leading-[28px] lg:leading-[30px] xl:leading-[36px] tracking-[0px] align-middle text-[#171717] text-source">{getRemainingDays(competition.eventDate)}</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row justify-between lg:items-center xl:items-center gap-4 xl:gap-0 pb-4 mb-6">
                    <div className="flex flex-wrap xl:flex-nowrap gap-3">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`px-[16px] py-[10px] rounded-full font-source text-[16px] font-medium leading-none tracking-normal transition-colors ${activeTab === 'overview'
                                ? 'bg-[#171717] text-[#ffffff]'
                                : 'text-[#344054] border border-gray-400 bg-white'
                                }`}
                        >
                            Overview
                        </button>
                        {(competition?.status === "approved") && (
                            <>
                                <button
                                    onClick={() => setActiveTab('applied')}
                                    className={`px-[16px] py-[10px] rounded-full font-source text-[16px] font-medium leading-none tracking-normal transition-colors ${activeTab === 'applied'
                                        ? 'bg-[#171717] text-[#ffffff]'
                                        : 'text-[#344054] border border-gray-400 bg-white'
                                        }`}
                                >
                                    Applied List
                                </button>
                                <button
                                    onClick={() => setActiveTab('attendance')}
                                    className={`px-[16px] py-[10px] rounded-full font-source text-[16px] font-medium leading-none tracking-normal transition-colors ${activeTab === 'attendance'
                                        ? 'bg-[#171717] text-[#ffffff]'
                                        : 'text-[#344054] border border-gray-400 bg-white'
                                        }`}
                                >
                                    Attendance
                                </button>
                            </>
                        )}
                    </div>
                    <div className="flex flex-wrap xl:flex-nowrap gap-3 md:gap-4 items-center">
                        {
                            competition.status === "approved" &&
                            <>
                                <span className={`flex items-center gap-2 px-4 py-2 rounded-full text-[12px] font-bold border ${competition.isActive ? 'bg-[#E6F8EE] text-[#0ca678] border-[#c3fae8]' : 'bg-gray-50 text-secondary border-gray-200'}`}>
                                    <div className={`w-2 h-2 rounded-full ${competition.isActive ? 'bg-[#0ca678]' : 'bg-secondary'}`}></div> {competition.isActive ? 'Active' : 'Inactive'}
                                </span>
                                <ConfirmActionButton
                                    isActive={competition?.isActive}
                                    isSubmitting={isSubmitting}
                                    onConfirm={handleToggleStatus}
                                    activateText="Activate"
                                    deactivateText="Deactivate"
                                    type="Competition"
                                />
                                <button
                                    onClick={() => setIsQRModalOpen(true)}
                                    className="flex gap-2 items-center bg-[#171717] text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-[#171717] transition-all shadow-sm"
                                >
                                    <QrCode size={18} /> QR Code
                                </button>
                                <button
                                    onClick={() => setIsAddPostModalOpen(true)}
                                    className="flex gap-2 items-center bg-white border border-[#D0D5DD] text-gray-700 px-6 py-2.5 rounded-full text-sm font-bold hover:bg-gray-50 transition-all shadow-sm"
                                >
                                    <Plus size={18} /> Add Post
                                </button>
                                <button
                                    onClick={() =>
                                        navigate(
                                            dynamicPath("competition-form"),
                                            { state: { editData: competition } }
                                        )
                                    }
                                    className="flex gap-2 items-center bg-white border border-[#D0D5DD] text-gray-700 px-6 py-2.5 rounded-full text-sm font-bold hover:bg-gray-50 transition-all shadow-sm"
                                >
                                    <SquarePen size={18} /> Edit Details
                                </button>
                            </>}
                        {
                            user.role === "admin" && competition.status === "pending" && <StatusActionButtons isSubmitting={statusLoading} type="Competition" onConfirm={updateStatus} />
                        }
                    </div>
                </div>

                {
                    competition.status === "rejected" && (
                        <div className="space-y-6">
                            <p className="text-red-600 font-semibold">
                                {competition?.rejected_reason}
                            </p>
                        </div>
                    )
                }

                {activeTab === 'overview' ? (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <InfoCard title="Basic Details">
                                <div className="grid grid-cols-2 xl:grid-cols-3 gap-6">
                                    <DataItem label="Registration Type" value={competition.registrationType} />
                                    <DataItem label="Reg Start Date" value={competition.registrationStartDate ? new Date(competition.registrationStartDate).toLocaleDateString() : 'N/A'} />
                                    <DataItem label="Reg End Date" value={competition.registrationEndDate ? new Date(competition.registrationEndDate).toLocaleDateString() : 'N/A'} />
                                    <DataItem label="Total Seats" value={competition.totalSeats} />
                                    <DataItem label="Event Mode" value={competition.mode} />
                                </div>
                            </InfoCard>

                            <InfoCard title="Fees Details">
                                <div className="grid grid-cols-2 xl:grid-cols-3 gap-6">
                                    <DataItem label="Individual Fees" value={`₹${competition.individualFees || 0}`} />
                                    <DataItem label="Team Fees" value={`₹${competition.teamFees || 0}`} />
                                    <DataItem label="Late Fees" value={`₹${competition.lateFees || 0}`} />
                                </div>
                            </InfoCard>

                            <InfoCard title="Prize Details">
                                <div className="grid grid-cols-2 xl:grid-cols-4 gap-6">
                                    <DataItem label="1st Prize" value={competition.firstPrize} />
                                    <DataItem label="2nd Prize" value={competition.secondPrize} />
                                    <DataItem label="3rd Prize" value={competition.thirdPrize} />
                                    <DataItem label="Participation" value={competition.participationPrize} />
                                </div>
                            </InfoCard>

                            <InfoCard title="Opportunities">
                                <div className="grid grid-cols-2 xl:grid-cols-3 gap-6">
                                    <DataItem label="Internship" value={competition.internshipOpportunity} />
                                    <DataItem label="Placement" value={competition.placementOpportunity} />
                                    <DataItem label="Industry Exposure" value={competition.industryExposure} />
                                    <DataItem label="Industry Partners" value={competition.industryPartners} />
                                </div>
                            </InfoCard>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            <InfoCard title="Food & Accommodation">
                                <div className="grid grid-cols-2 gap-4">
                                    <DataItem label="Food Provided" value={competition.foodProvide} />
                                    <DataItem label="Food Type" value={competition.vegNonVeg} />
                                    <DataItem label="Accommodation" value={competition.accommodationProvide} />
                                    <DataItem label="Midnight Snacks" value={competition.midnightSnacks} />
                                </div>
                            </InfoCard>

                            <InfoCard title="Team Rules">
                                <div className="grid grid-cols-2 gap-4">
                                    <DataItem label="Type" value={competition.teamOrIndividualEvent} />
                                    <DataItem label="Min Size" value={competition.teamSizeMinimum} />
                                    <DataItem label="Max Size" value={competition.teamSizeMaximum} />
                                </div>
                            </InfoCard>

                            <InfoCard title="Venue Details">
                                <div className="space-y-4">
                                    <DataItem label="Venue Name" value={competition.venueName} />
                                    <DataItem label="Address" value={formatAddress(competition)} />
                                </div>
                            </InfoCard>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {competition.rounds?.length > 0 && (
                                <InfoCard title="Round Details">
                                    <div className="grid grid-cols-1 gap-6">
                                        {competition.rounds.map((round, index) => (
                                            <DataItem
                                                key={index}
                                                label={`Round ${round.roundNumber}: ${round.roundName}`}
                                                value={round.roundDescription}
                                            />
                                        ))}
                                    </div>
                                </InfoCard>
                            )}

                            {competition.incharges?.length > 0 && (
                                <InfoCard title="Contact Info">
                                    <div className="grid grid-cols-1 gap-6">
                                        {competition.incharges.map((person, index) => (
                                            <div key={index} className="space-y-1">
                                                <p className="font-bold text-primary">{person.type}: {person.name}</p>
                                                <p className="text-sm text-secondary">Call: {person.phoneNumber}</p>
                                                <p className="text-sm text-secondary">Mail: {person.mailId}</p>
                                            </div>
                                        ))}
                                    </div>
                                </InfoCard>
                            )}

                            {competition.schedule?.length > 0 && (
                                <InfoCard title="Schedule">
                                    <div className="space-y-4">
                                        {competition.schedule.map((slot, index) => (
                                            <DataItem
                                                key={index}
                                                label={slot.name}
                                                value={`${slot.startTime} - ${slot.endTime}`}
                                            />
                                        ))}
                                    </div>
                                </InfoCard>
                            )}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <InfoCard title="Allowed Departments">
                                <ul className="list-disc pl-5 space-y-1 text-secondary text-sm">
                                    {competition?.allowedDepartments?.length > 0 ? (
                                        competition.allowedDepartments.map((dept, index) => (
                                            <li key={index}>{dept}</li>
                                        ))
                                    ) : (
                                        <li>Open to all departments</li>
                                    )}
                                </ul>
                            </InfoCard>
                            <InfoCard title="Eligibility">
                                <p className="text-secondary text-sm leading-relaxed">{competition.eligibilityDetails}</p>
                            </InfoCard>
                            <InfoCard title="Description">
                                <p className="text-secondary text-sm leading-relaxed whitespace-pre-wrap">{competition.description}</p>
                            </InfoCard>
                        </div>

                        <div className="md:col-span-2 xl:col-span-3 bg-white p-5 sm:p-6 lg:p-7 rounded-[20px] md:rounded-[24px] shadow-sm border border-gray-100">
                            <h3 className="text-[18px] sm:text-[20px] font-bold text-[#1a1a1a] mb-5 sm:mb-6">Post</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                                {competition.posts?.map((image, index) => (
                                    <div key={`${image}-${index}`} className="rounded-[18px] overflow-hidden border border-gray-200 bg-gray-50">
                                        <img
                                            src={`${STATIC_URL}/${image}`}
                                            alt={`Post ${index + 1}`}
                                            className="w-full aspect-[3/4] object-cover"
                                            loading="lazy"
                                        />
                                    </div>
                                ))}
                                {(!competition.posts || competition.posts.length === 0) && (
                                    <p className="text-secondary text-sm col-span-full">No posts uploaded yet.</p>
                                )}
                            </div>
                        </div>

                        <InfoCard title="Rule" className="max-w-2xl">
                            <div className="space-y-6">
                                {competition.additionalRules && (
                                    <p className="text-[13px] sm:text-[14px] font-medium leading-relaxed tracking-normal text-secondary whitespace-pre-wrap">
                                        {competition.additionalRules}
                                    </p>
                                )}
                                {competition.ruleBook && (
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border-2 border-gray-200 rounded-[14px]">
                                        <div className="flex items-center gap-4 sm:gap-6">
                                            <div className="w-7 h-7 flex items-center justify-center">
                                                <img src={assets.doc} alt="Doc" />
                                            </div>
                                            <p className="text-[16px] font-semibold text-[#1a1a1a]">Rule Book</p>
                                        </div>
                                        <a
                                            href={`${STATIC_URL}/${competition.ruleBook}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-secondary hover:text-[#171717] transition-colors"
                                        >
                                            <Download size={24} />
                                        </a>
                                    </div>
                                )}
                                {!competition.additionalRules && !competition.ruleBook && (
                                    <p className="text-secondary text-sm">No rules specified.</p>
                                )}
                            </div>
                        </InfoCard>
                    </div>
                ) : activeTab === 'applied' ? (
                    <AppliedListSection
                        data={registrations.list.map((reg) => ({
                            ...reg,
                            registeredAt: new Date(reg.registeredAt).toLocaleDateString('en-GB'),
                        }))}
                        heading={appliedListColumns}
                        showExportButton={true}
                        onExport={() =>
                            downloadCSVFromAPI(
                                `/users/export/event-registrations/${competition._id || competition.id}?eventType=Competition`,
                                `${competition.eventName || "Competition"}_Registrations.csv`
                            )
                        }
                    />
                ) : activeTab === 'attendance' ? (
                    <AttendanceTabSection eventId={competition._id || competition.id} eventType="Competition" eventTitle={competition.eventName || competition.title} organizerName={competition.organizer} />
                ) : null}
            </section>

            <EventQRCodeModal
                isOpen={isQRModalOpen}
                onClose={() => setIsQRModalOpen(false)}
                eventData={competition}
                eventType="Competition"
            />

            {isAddPostModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/35 flex items-center justify-center p-3">
                    <div className="w-full max-w-[520px] bg-white rounded-[18px] border border-gray-200 shadow-xl p-4 sm:p-5">
                        <div className="flex items-start justify-between mb-0.5">
                            <h3 className="text-[28px] sm:text-[32px] font-semibold text-[#222831]">Add Post</h3>
                            <button
                                onClick={() => setIsAddPostModalOpen(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X size={28} />
                            </button>
                        </div>
                        <p className="text-[14px] text-[#6B7280] mb-4">Upload posters for this competition.</p>

                        <div
                            onDragOver={(event) => event.preventDefault()}
                            onDrop={onUploadDrop}
                            className="border border-[#D1D5DB] rounded-[14px] h-[150px] flex flex-col items-center justify-center gap-2 text-center"
                        >
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                                <Upload size={20} className="text-[#6B7280]" />
                            </div>
                            <p className="text-[13px] sm:text-[14px] text-[#6B7280]">
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="text-[#171717] font-semibold"
                                >
                                    Click to upload
                                </button>{' '}
                                or drag and drop
                            </p>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={onUploadInputChange}
                                className="hidden"
                            />
                        </div>

                        {isSubmitting && (
                            <div className="mt-4 flex items-center justify-center gap-2 text-blue-600">
                                <Loader2 className="animate-spin" size={20} />
                                <span className="text-sm font-medium">Uploading...</span>
                            </div>
                        )}

                        <div className="mt-5 grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setIsAddPostModalOpen(false)}
                                className="h-11 rounded-[10px] border border-[#D1D5DB] text-[#4B5563] text-[15px] font-semibold"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => setIsAddPostModalOpen(false)}
                                className="h-11 rounded-[10px] bg-[#171717] text-white text-[15px] font-semibold"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CompetitionProfile;
