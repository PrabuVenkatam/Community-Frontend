import React, { useRef, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    MapPin, Briefcase, CalendarDays, Plus, X, Upload, Loader2, SquarePen,
    IndianRupee, QrCode
} from 'lucide-react';
import AppliedListSection from '../common/AppliedListSection';
import AttendanceTabSection from './AttendanceTabSection';
import EventQRCodeModal from './EventQRCodeModal';
import { downloadCSVFromAPI } from '../utils/exportUtils';
import { getSeminarById, toggleSeminarStatus, addSeminarPost, updateEventStatus } from '../services/admin/adminServices';
import { toast } from 'react-toastify';
import { useMain } from '../context/MainContext';
import { formatAddress } from '../utils/formatAddress';
import getRemainingDays from '../utils/getRemainingDays';
import ConfirmActionButton from '../common/ConfirmActionButton';
import { useTitle } from '../context/AdminTitle';
import { EducationIcon } from './icons';
import StatusActionButtons from '../common/AcceptRejectButtons';

const SeminarProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [isQRModalOpen, setIsQRModalOpen] = useState(false);
    const [isAddPostModalOpen, setIsAddPostModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [seminar, setSeminar] = useState(null);
    const [statusLoading, setStatusLoading] = useState(false)
    const [registrations, setRegistrations] = useState({ count: 0, list: [], revenue: null });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const fileInputRef = useRef(null);
    const { user, dynamicPath } = useMain()
    const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
    const { setTitle } = useTitle()
    useEffect(() => {
        setTitle("Seminar Profile")
    }, [])
    useEffect(() => {
        fetchSeminarData();
    }, [id]);

    const updateStatus = async (status, rejected_reason) => {
        try {
            setStatusLoading(true);
            const response = await updateEventStatus(id, "seminar", status, rejected_reason);
            console.log(response)
            if (response.success) {
                setSeminar(response.data)
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

    const fetchSeminarData = async () => {
        try {
            setIsLoading(true);
            const response = await getSeminarById(id);
            if (response.success) {
                setSeminar(response.data.seminar);
                setRegistrations(response.data.registrations || { count: 0, list: [], revenue: null });
                console.log("first reg item:", registrations.list[0]);
                console.log("full response:", response.data);
            } else {
                setError("Seminar not found");
            }
        } catch (err) {
            setError("Failed to fetch seminar details");
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggleStatus = async () => {
        try {
            setIsSubmitting(true);
            const response = await toggleSeminarStatus(seminar._id || seminar.id);
            if (response.success) {
                toast.success(response.message);
                setSeminar((prev) => ({ ...prev, isActive: response.data.isActive }));
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

    if (error || !seminar) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6 text-secondary">
                <p className="text-lg font-semibold">{error || "Seminar not found"}</p>
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

    const onUploadInputChange = (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;
        setSelectedFiles(prev => [...prev, ...files]);
        e.target.value = '';
    };

    const onUploadDrop = (e) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files);
        if (!files.length) return;
        setSelectedFiles(prev => [...prev, ...files]);
    };

    const removeSelectedFile = (indexToRemove) => {
        setSelectedFiles(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    const closeAddPostModal = () => {
        setIsAddPostModalOpen(false);
        setSelectedFiles([]);
    };

    const handleConfirmAddPosts = async () => {
        if (!selectedFiles.length) {
            closeAddPostModal();
            return;
        }
        await handleAddPosts(selectedFiles);
    };

    const handleAddPosts = async (files) => {
        try {
            setIsSubmitting(true);
            const formData = new FormData();
            Array.from(files).forEach(file => {
                formData.append('posts', file);
            });

            const response = await addSeminarPost(seminar._id, formData);
            if (response.success) {
                toast.success("Posts added successfully");
                setSeminar(response.data);
                closeAddPostModal();
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
        { title: 'Name', dataIndex: 'fullName', key: 'fullName' },
        { title: 'College', dataIndex: 'college', key: 'college' },
        { title: 'Department', dataIndex: 'department', key: 'department' },
        { title: 'Year', dataIndex: 'year', key: 'year' },
    ];

    return (
        <div className="bg-[#f8f9fa] min-h-screen font-sans">
            <section className="bg-white rounded-[16px] md:rounded-[24px] border border-gray-200 p-4 md:p-6 shadow-sm">

                {/* Hero Banner */}
                <div
                    className="relative overflow-hidden rounded-[20px] md:rounded-[22px] xl:rounded-[24px] text-white p-5 pt-8 pb-6 sm:p-6 md:p-7 lg:p-8 xl:p-10 xl:pt-16 xl:pb-10 min-h-[320px] md:min-h-[360px] lg:min-h-[380px] xl:min-h-[400px] flex flex-col xl:flex-row justify-between xl:items-end gap-6 md:gap-7 xl:gap-8 mb-6 md:mb-7 xl:mb-8"
                    style={{
                        backgroundColor: '#0a0f26',
                        backgroundImage: `linear-gradient(to right, rgba(10, 15, 38, 0.95), rgba(10, 15, 38, 0.4)), url('${seminar.coverImage ? `${BASE_URL}/${seminar.coverImage}` : 'https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?auto=format&fit=crop&q=80&w=2000'}')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                >
                    <div className="z-10">
                        <h1 className="text-[24px] sm:text-[30px] md:text-[34px] lg:text-[38px] xl:text-[48px] font-extrabold leading-tight mb-4 md:mb-6 xl:mb-8">{seminar.eventName}</h1>
                        <div className="grid grid-cols-1 gap-y-2 font-source text-[13px] sm:text-[14px] md:text-[15px] xl:text-[16px] font-normal text-[#FFFFFF]">
                            <span className="flex items-center gap-2"><EducationIcon /> {seminar.organizer}</span>
                            <span className="flex items-center gap-2"><MapPin size={16} /> {formatAddress(seminar)}</span>
                            <span className="flex items-center gap-2"><Briefcase size={16} /> {seminar.mode}</span>
                            <span className="flex items-center gap-2"><CalendarDays size={16} /> {seminar.eventDate ? new Date(seminar.eventDate).toLocaleDateString() : 'N/A'}</span>
                        </div>
                    </div>

                    <div className="z-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:flex gap-3 md:gap-4 xl:gap-4 items-stretch xl:items-end w-full xl:w-auto">
                        <div className="bg-[linear-gradient(119.97deg,_#006098_0%,_#00C1FD_100%)] p-3 sm:p-3.5 md:p-4 xl:p-6 rounded-[14px] sm:rounded-[16px] xl:rounded-[24px] min-w-0 xl:min-w-[180px] flex flex-col justify-center shadow-lg w-full xl:w-auto">
                            <p className="font-source text-[8px] sm:text-[9px] md:text-[10px] xl:text-[10px] font-semibold leading-[13px] sm:leading-[14px] tracking-[0.5px] align-middle uppercase text-[#FFFFFF] mb-1">Total Registration</p>
                            <p className="text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px] xl:text-[30px] font-bold leading-[24px] sm:leading-[26px] md:leading-[28px] lg:leading-[30px] xl:leading-[36px] tracking-[0px] align-middle text-[#ffffff] text-source">{registrations.count} <span className='text-[20px] text-gray-300 ' >/{seminar?.totalSeats}</span></p>
                        </div>
                        <div className="bg-white p-3 sm:p-3.5 md:p-4 xl:p-6 rounded-[14px] sm:rounded-[16px] xl:rounded-[24px] min-w-0 xl:min-w-[180px] flex flex-col justify-center text-gray-900 shadow-xl w-full xl:w-auto">
                            <p className="font-source text-[8px] sm:text-[9px] md:text-[10px] xl:text-[10px] font-semibold leading-[13px] sm:leading-[14px] tracking-[0.5px] align-middle uppercase text-[#64748B] mb-1">Revenue Generated</p>
                            <div className="flex items-center gap-1">
                                <IndianRupee size={24} className="text-[#006098] font-bold" />

                                <p className="text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px] xl:text-[30px] font-bold leading-[24px] sm:leading-[26px] md:leading-[28px] lg:leading-[30px] xl:leading-[36px] tracking-[0px] align-middle text-[#006098] text-source">
                                    {registrations?.revenue?.totalAmount || 0}
                                </p>
                            </div>
                        </div>
                        <div className="bg-white p-3 sm:p-3.5 md:p-4 xl:p-6 rounded-[14px] sm:rounded-[16px] xl:rounded-[24px] min-w-0 xl:min-w-[180px] flex flex-col justify-center items-start shadow-xl w-full xl:w-auto">
                            <p className="font-source text-[8px] sm:text-[9px] md:text-[10px] xl:text-[10px] font-semibold leading-[13px] sm:leading-[14px] tracking-[0.5px] align-middle uppercase text-[#64748B] mb-1">Days Remaining</p>
                            <p className="text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px] xl:text-[30px] font-bold leading-[24px] sm:leading-[26px] md:leading-[28px] lg:leading-[30px] xl:leading-[36px] tracking-[0px] align-middle text-[#006098] text-source">{getRemainingDays(seminar.eventDate)}</p>
                        </div>
                    </div>
                </div>

                {/* Tabs & Actions */}
                <div className="flex flex-col lg:flex-row justify-between lg:items-center xl:items-center gap-4 xl:gap-0 pb-4 mb-6">
                    <div className="flex flex-wrap xl:flex-nowrap gap-3">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`px-[16px] py-[10px] rounded-full font-source text-[16px] font-medium leading-none tracking-normal transition-colors ${activeTab === 'overview' ? 'bg-[#0989D4] text-[#ffffff]' : 'text-[#344054] border border-gray-400 bg-white'}`}
                        >
                            Overview
                        </button>
                        {(seminar?.status === "approved") && (
                            <>
                                <button
                                    onClick={() => setActiveTab('applied')}
                                    className={`px-[16px] py-[10px] rounded-full font-source text-[16px] font-medium leading-none tracking-normal transition-colors ${activeTab === 'applied' ? 'bg-[#0989D4] text-[#ffffff]' : 'text-[#344054] border border-gray-400 bg-white'}`}
                                >
                                    Applied List
                                </button>
                                <button
                                    onClick={() => setActiveTab('attendance')}
                                    className={`px-[16px] py-[10px] rounded-full font-source text-[16px] font-medium leading-none tracking-normal transition-colors ${activeTab === 'attendance' ? 'bg-[#0989D4] text-[#ffffff]' : 'text-[#344054] border border-gray-400 bg-white'}`}
                                >
                                    Attendance
                                </button>
                            </>
                        )}
                    </div>
                    <div className="flex flex-wrap xl:flex-nowrap gap-3 md:gap-4 items-center">
                        {
                            seminar.status === "approved" &&
                            <>
                                <span className={`flex items-center gap-2 px-4 py-2 rounded-full text-[12px] font-bold border ${seminar.isActive ? 'bg-[#E6F8EE] text-[#0ca678] border-[#c3fae8]' : 'bg-gray-50 text-secondary border-gray-200'}`}>
                                    <div className={`w-2 h-2 rounded-full ${seminar.isActive ? 'bg-[#0ca678]' : 'bg-secondary'}`}></div>
                                    {seminar.isActive ? 'Active' : 'Inactive'}
                                </span>
                                <ConfirmActionButton
                                    isActive={seminar?.isActive}
                                    isSubmitting={isSubmitting}
                                    onConfirm={handleToggleStatus}
                                    activateText="Activate"
                                    deactivateText="Deactivate"
                                    type="Seminar"
                                />
                                <button
                                    onClick={() => setIsQRModalOpen(true)}
                                    className="flex gap-2 items-center bg-[#006098] text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-[#004d7a] transition-all shadow-sm"
                                >
                                    <QrCode size={18} /> QR Code
                                </button>
                                <button
                                    onClick={() => { setIsAddPostModalOpen(true); setSelectedFiles([]); }}
                                    className="flex gap-2 items-center bg-white border border-[#D0D5DD] text-gray-700 px-6 py-2.5 rounded-full text-sm font-bold hover:bg-gray-50 transition-all shadow-sm"
                                >
                                    <Plus size={18} /> Add Post
                                </button>
                                <button
                                    onClick={() =>
                                        navigate(
                                            dynamicPath("seminar-form"),
                                            { state: { editData: seminar } }
                                        )
                                    }
                                    className="flex gap-2 items-center bg-white border border-[#D0D5DD] text-gray-700 px-6 py-2.5 rounded-full text-sm font-bold hover:bg-gray-50 transition-all shadow-sm"
                                >
                                    <SquarePen size={18} /> Edit Details
                                </button>

                            </>}

                        {
                            user.role === "admin"  && <StatusActionButtons isSubmitting={statusLoading} onConfirm={updateStatus} />
                        }
                    </div>
                </div>
{
                    seminar.status === "rejected" && (
                        <div className="space-y-6">
                            <p className="text-red-600 font-semibold">
                                {seminar?.rejected_reason}
                            </p>
                        </div>
                    )
                }
                {/* Tab Content */}
                {activeTab === 'overview' ? (
                    <div className="space-y-6">

                        {/* Row 1: Basic + Fees + Prize + Opportunities */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <InfoCard title="Basic Details">
                                <div className="grid grid-cols-2 xl:grid-cols-3 gap-6">
                                    <DataItem label="Event Type" value={seminar.eventType} />
                                    <DataItem label="Registration Type" value={seminar.registrationType} />
                                    <DataItem label="Reg Start Date" value={seminar.registrationStartDate ? new Date(seminar.registrationStartDate).toLocaleDateString() : 'N/A'} />
                                    <DataItem label="Reg End Date" value={seminar.registrationEndDate ? new Date(seminar.registrationEndDate).toLocaleDateString() : 'N/A'} />
                                    <DataItem label="Total Seats" value={seminar.totalSeats} />
                                    <DataItem label="Event Mode" value={seminar.mode} />
                                </div>
                            </InfoCard>

                            <InfoCard title="Fees Details">
                                <div className="grid grid-cols-2 xl:grid-cols-3 gap-6">
                                    <DataItem label="Individual Fees" value={`₹${seminar.individualFees || 0}`} />
                                    <DataItem label="Team Fees" value={`₹${seminar.teamFees || 0}`} />
                                    <DataItem label="Late Fees" value={`₹${seminar.lateFees || 0}`} />
                                </div>
                            </InfoCard>

                            <InfoCard title="Prize Details">
                                <div className="grid grid-cols-2 xl:grid-cols-4 gap-6">
                                    <DataItem label="1st Prize" value={seminar.firstPrize} />
                                    <DataItem label="2nd Prize" value={seminar.secondPrize} />
                                    <DataItem label="3rd Prize" value={seminar.thirdPrize} />
                                    <DataItem label="Participation" value={seminar.participationPrize} />
                                </div>
                            </InfoCard>

                            <InfoCard title="Opportunities">
                                <div className="grid grid-cols-2 xl:grid-cols-3 gap-6">
                                    <DataItem label="Internship" value={seminar.internshipOpportunity} />
                                    <DataItem label="Placement" value={seminar.placementOpportunity} />
                                    <DataItem label="Industry Exposure" value={seminar.industryExposure} />
                                    <DataItem label="Industry Partners" value={seminar.industryPartners} />
                                </div>
                            </InfoCard>
                        </div>

                        {/* Row 2: Food + Team + Venue */}
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            <InfoCard title="Food & Accommodation">
                                <div className="grid grid-cols-2 gap-4">
                                    <DataItem label="Food Provided" value={seminar.foodProvide} />
                                    <DataItem label="Food Type" value={seminar.vegNonVeg} />
                                    <DataItem label="Accommodation" value={seminar.accommodationProvide} />
                                    <DataItem label="Midnight Snacks" value={seminar.midnightSnacks} />
                                </div>
                            </InfoCard>

                            <InfoCard title="Team Rules">
                                <div className="grid grid-cols-2 gap-4">
                                    <DataItem label="Type" value={seminar.teamOrIndividualEvent} />
                                    <DataItem label="Min Size" value={seminar.teamSizeMinimum} />
                                    <DataItem label="Max Size" value={seminar.teamSizeMaximum} />
                                </div>
                            </InfoCard>

                            <InfoCard title="Venue Details">
                                <div className="space-y-4">
                                    <DataItem label="Venue Name" value={seminar.venueName} />
                                    <DataItem label="Address" value={formatAddress(seminar)} />
                                </div>
                            </InfoCard>
                        </div>

                        {/* Row 3: Rounds + Contact + Schedule */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {seminar.rounds?.length > 0 && (
                                <InfoCard title="Round Details">
                                    <div className="grid grid-cols-1 gap-6">
                                        {seminar.rounds.map((round, index) => (
                                            <DataItem
                                                key={index}
                                                label={`Round ${round.roundNumber}: ${round.roundName}`}
                                                value={round.roundDescription}
                                            />
                                        ))}
                                    </div>
                                </InfoCard>
                            )}

                            {seminar.incharges?.length > 0 && (
                                <InfoCard title="Contact Info">
                                    <div className="grid grid-cols-1 gap-6">
                                        {seminar.incharges.map((person, index) => (
                                            <div key={index} className="space-y-1">
                                                <p className="font-bold text-primary">{person.type}: {person.name}</p>
                                                <p className="text-sm text-secondary">Call: {person.phoneNumber}</p>
                                                <p className="text-sm text-secondary">Mail: {person.mailId}</p>
                                            </div>
                                        ))}
                                    </div>
                                </InfoCard>
                            )}

                            {seminar.schedule?.length > 0 && (
                                <InfoCard title="Schedule">
                                    <div className="space-y-4">
                                        {seminar.schedule.map((slot, index) => (
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

                        {/* Row 4: Departments + Eligibility + Description */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <InfoCard title="Allowed Departments">
                                <ul className="list-disc pl-5 space-y-1 text-secondary text-sm">
                                    {seminar?.allowedDepartments?.length > 0 ? (
                                        seminar.allowedDepartments.map((dept, index) => (
                                            <li key={index}>{dept}</li>
                                        ))
                                    ) : (
                                        <li>Open to all departments</li>
                                    )}
                                </ul>
                            </InfoCard>
                            <InfoCard title="Eligibility">
                                <p className="text-secondary text-sm leading-relaxed">{seminar.eligibilityDetails}</p>
                            </InfoCard>
                            <InfoCard title="Description">
                                <p className="text-secondary text-sm leading-relaxed whitespace-pre-wrap">{seminar.description}</p>
                            </InfoCard>
                        </div>

                        {/* Gallery / Posts */}
                        <div className="md:col-span-2 xl:col-span-3 bg-white p-5 sm:p-6 lg:p-7 rounded-[20px] md:rounded-[24px] shadow-sm border border-gray-100">
                            <h3 className="text-[18px] sm:text-[20px] font-bold text-[#1a1a1a] mb-5 sm:mb-6">Post</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                                {seminar.posts?.map((image, index) => (
                                    <div key={`${image}-${index}`} className="rounded-[18px] overflow-hidden border border-gray-200 bg-gray-50">
                                        <img
                                            src={`${BASE_URL}/${image}`}
                                            alt={`Post ${index + 1}`}
                                            className="w-full aspect-[3/4] object-cover"
                                            loading="lazy"
                                        />
                                    </div>
                                ))}
                                {(!seminar.posts || seminar.posts.length === 0) && (
                                    <p className="text-secondary text-sm col-span-full">No posts uploaded yet.</p>
                                )}
                            </div>
                        </div>
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
                                `/users/export/event-registrations/${seminar._id || seminar.id}?eventType=Seminar`,
                                `${seminar.eventName || "Seminar"}_Registrations.csv`
                            )
                        }
                    />
                ) : activeTab === 'attendance' ? (
                    <AttendanceTabSection eventId={seminar._id || seminar.id} eventType="Seminar" eventTitle={seminar.eventName || seminar.title} organizerName={seminar.organizer} />
                ) : null}
            </section>

            <EventQRCodeModal
                isOpen={isQRModalOpen}
                onClose={() => setIsQRModalOpen(false)}
                eventData={seminar}
                eventType="Seminar"
            />

            {/* Add Post Modal */}
            {isAddPostModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/35 flex items-center justify-center p-3">
                    <div className="w-full max-w-[520px] bg-white rounded-[18px] border border-gray-200 shadow-xl p-4 sm:p-5">
                        <div className="flex items-start justify-between mb-0.5">
                            <h3 className="text-[28px] sm:text-[32px] font-semibold text-[#222831]">Add Post</h3>
                            <button onClick={closeAddPostModal} className="text-gray-500 hover:text-gray-700">
                                <X size={28} />
                            </button>
                        </div>
                        <p className="text-[14px] text-[#6B7280] mb-4">Upload posters for this seminar.</p>

                        <div
                            onDragOver={(e) => e.preventDefault()}
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
                                    className="text-[#0989D4] font-semibold"
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

                        {selectedFiles.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-2 max-h-[120px] overflow-y-auto">
                                {selectedFiles.map((file, index) => (
                                    <div key={index} className="relative group w-16 h-16 rounded-md overflow-hidden bg-gray-100 border border-gray-200">
                                        <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover" />
                                        <button
                                            onClick={() => removeSelectedFile(index)}
                                            className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X size={12} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {isSubmitting && (
                            <div className="mt-4 flex items-center justify-center gap-2 text-blue-600">
                                <Loader2 className="animate-spin" size={20} />
                                <span className="text-sm font-medium">Uploading...</span>
                            </div>
                        )}

                        <div className="mt-5 grid grid-cols-2 gap-3">
                            <button
                                onClick={closeAddPostModal}
                                disabled={isSubmitting}
                                className="h-11 rounded-[10px] border border-[#D1D5DB] text-[#4B5563] text-[15px] font-semibold hover:bg-gray-50 disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmAddPosts}
                                disabled={isSubmitting || selectedFiles.length === 0}
                                className="h-11 rounded-[10px] bg-[#0989D4] text-white text-[15px] font-semibold hover:bg-[#0770ad] disabled:opacity-50 disabled:bg-[#0989D4]/70"
                            >
                                {isSubmitting ? "Uploading..." : `Confirm ${selectedFiles.length > 0 ? `(${selectedFiles.length})` : ''}`}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SeminarProfile;
