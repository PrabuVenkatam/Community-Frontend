import React, { useRef, useState } from 'react';
import {
    MapPin, Briefcase, CalendarDays, Download, Plus, X, Upload,
} from 'lucide-react';
import { assets } from '../assets/assets';
import AppliedListSection from './AppliedListSection';

const GlobalAISummit = () => {
    // Reusable InfoCard
    const InfoCard = ({ title, children, className = "" }) => (
        <div className={`bg-white p-5 sm:p-6 lg:p-7 rounded-[20px] md:rounded-[24px] shadow-sm border border-gray-100 ${className}`}>
            <h3 className="text-[18px] sm:text-[20px] font-bold text-[#1a1a1a] mb-5 sm:mb-7">{title}</h3>
            {children}
        </div>
    );

    // DataItem: Label is Source Sans 3 (top), Value is Plus Jakarta Sans (bottom)
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
    const [activeTab, setActiveTab] = useState('overview');
    const [isAddPostModalOpen, setIsAddPostModalOpen] = useState(false);
    const [uploadedPosts, setUploadedPosts] = useState([]);
    const fileInputRef = useRef(null);
    const appliedListData = [
        { id: '01', name: 'Nala', college: 'Quantum Innovators Institute', department: 'Robotics', year: '2025', contact: '9876543210', mail: 'nala@example.com', location: 'Salem' },
        { id: '02', name: 'Rishi', college: 'Stellaris Academy', department: 'AI Engineering', year: '2024', contact: '8765432109', mail: 'rishi@sample.com', location: 'Salem' },
        { id: '03', name: 'Priya', college: 'Zenith Institute', department: 'Data Analytics', year: '2026', contact: '7654321098', mail: 'priya@domain.com', location: 'Salem' },
        { id: '04', name: 'Veer', college: 'Nova College', department: 'Cybersecurity', year: '2027', contact: '6543210987', mail: 'veer@institution.com', location: 'Salem' },
        { id: '05', name: 'Leela', college: 'Apex University', department: 'Cloud Computing', year: '2025', contact: '5432109876', mail: 'leela@university.com', location: 'Salem' },
        { id: '06', name: 'Kiran', college: 'Pinnacle Institute', department: 'Software Development', year: '2024', contact: '4321098765', mail: 'kiran@academy.com', location: 'Salem' },
        { id: '07', name: 'Diya', college: 'Horizon College', department: 'UX Design', year: '2026', contact: '3210987654', mail: 'diya@institute.com', location: 'Salem' },
        { id: '08', name: 'Aryan', college: 'Summit Academy', department: 'Mobile Development', year: '2027', contact: '2109876543', mail: 'aryan@college.com', location: 'Salem' },
        { id: '09', name: 'Neha', college: 'Vanguard Institute', department: 'Network Engineering', year: '2025', contact: '1098765432', mail: 'neha@summit.com', location: 'Salem' },
        { id: '10', name: 'Rohan', college: 'Everest College', department: 'Game Development', year: '2024', contact: '0987654321', mail: 'rohan@vanguard.com', location: 'Salem' },
        { id: '11', name: 'Ishaan', college: 'Future Minds College', department: 'Machine Learning', year: '2026', contact: '9876501234', mail: 'ishaan@future.com', location: 'Coimbatore' },
        { id: '12', name: 'Meera', college: 'Tech Valley University', department: 'AI Research', year: '2025', contact: '8765401234', mail: 'meera@techvalley.com', location: 'Chennai' },
    ];

    const appliedListColumns = [
        { title: '#', dataIndex: 'id', key: 'id' },
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'College', dataIndex: 'college', key: 'college' },
        { title: 'Department', dataIndex: 'department', key: 'department' },
        { title: 'Year', dataIndex: 'year', key: 'year' },
        { title: 'Contact Number', dataIndex: 'contact', key: 'contact' },
        { title: 'Mail id', dataIndex: 'mail', key: 'mail' },
        { title: 'Location', dataIndex: 'location', key: 'location' },
    ];


    const postImages = [
        'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80',
    ];
    const samplePostPreviews = postImages.slice(0, 3).map((src, index) => ({ id: `sample-${index}`, src }));

    const addFilesToPosts = (files) => {
        const next = Array.from(files || [])
            .filter((file) => file.type.startsWith('image/'))
            .map((file, index) => ({
                id: `${Date.now()}-${index}-${file.name}`,
                src: URL.createObjectURL(file),
            }));

        if (!next.length) return;
        setUploadedPosts((prev) => [...prev, ...next]);
    };

    const onUploadInputChange = (event) => {
        addFilesToPosts(event.target.files);
        event.target.value = '';
    };

    const onUploadDrop = (event) => {
        event.preventDefault();
        addFilesToPosts(event.dataTransfer.files);
    };

    const removePostImage = (id) => {
        setUploadedPosts((prev) => prev.filter((item) => item.id !== id));
    };

    return (
        <div className="bg-[#f8f9fa] min-h-screen font-sans ">
            <section className="bg-white rounded-[16px] md:rounded-[24px] border border-gray-200 p-4 md:p-6 shadow-sm">
                <div
                    className="relative overflow-hidden rounded-[20px] md:rounded-[22px] xl:rounded-[24px] text-white p-5 pt-8 pb-6 sm:p-6 md:p-7 lg:p-8 xl:p-10 xl:pt-16 xl:pb-10 min-h-[320px] md:min-h-[360px] lg:min-h-[380px] xl:min-h-[400px] flex flex-col xl:flex-row justify-between xl:items-end gap-6 md:gap-7 xl:gap-8 mb-6 md:mb-7 xl:mb-8"
                    style={{
                        backgroundColor: '#0a0f26',
                        backgroundImage: `linear-gradient(to right, rgba(10, 15, 38, 0.95), rgba(10, 15, 38, 0.4)), url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=2000')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                >
                    {/* Left Side Content */}
                    <div className="z-10"> {/* Added some bottom padding to lift the text */}
                        <h1 className="text-[24px] sm:text-[30px] md:text-[34px] lg:text-[38px] xl:text-[48px] font-extrabold leading-[32px] sm:leading-[38px] md:leading-[44px] lg:leading-[48px] xl:leading-[60px] tracking-[0px] align-middle mb-4 md:mb-6 xl:mb-8">Global AI Summit 2027</h1>
                        <div className="grid grid-cols-1 gap-y-2 font-source text-[13px] sm:text-[14px] md:text-[15px] xl:text-[16px] font-normal leading-[18px] sm:leading-[19px] md:leading-[20px] tracking-[0px] align-middle text-[#FFFFFF]">
                            <span className="flex items-center gap-2 "><MapPin size={16} className="" /> Techville University</span>
                            <span className="flex items-center gap-2 "><MapPin size={16} className="" /> Grand Ballroom & Digital Arena</span>
                            <span className="flex items-center gap-2 "><Briefcase size={16} className="" /> Hybrid - Advanced</span>
                            <span className="flex items-center gap-2 "><CalendarDays size={16} className="" /> 22/07/2027</span>
                        </div>
                    </div>

                    {/* Right Side Stats Widgets */}
                    <div className="z-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:flex gap-3 md:gap-4 xl:gap-4 items-stretch xl:items-end w-full xl:w-auto">
                        <div className="bg-[linear-gradient(119.97deg,_#171717_0%,_#171717_100%)] p-3 sm:p-3.5 md:p-4 xl:p-6 rounded-[14px] sm:rounded-[16px] xl:rounded-[24px] min-w-0 xl:min-w-[180px] flex flex-col justify-center shadow-lg w-full xl:w-auto">
                            <p className="font-source text-[8px] sm:text-[9px] md:text-[10px] xl:text-[10px] font-semibold leading-[13px] sm:leading-[14px] tracking-[0.5px] align-middle uppercase text-[#FFFFFF] mb-1">Total Participants</p>
                            <div className='flex gap-1 items-end'>
                                <p className="text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px] xl:text-[30px] font-bold leading-[24px] sm:leading-[26px] md:leading-[28px] lg:leading-[30px] xl:leading-[36px] tracking-[0px] align-middle text-[#ffffff] text-source">450 </p>
                                <p className="text-[11px] sm:text-[12px] md:text-[13px] xl:text-[16px] font-normal text-[#ffffff]">/800</p>
                            </div>

                        </div>
                        <div className="bg-white p-3 sm:p-3.5 md:p-4 xl:p-6 rounded-[14px] sm:rounded-[16px] xl:rounded-[24px] min-w-0 xl:min-w-[180px] flex flex-col justify-center text-gray-900 shadow-xl w-full xl:w-auto">
                            <p className="font-source text-[8px] sm:text-[9px] md:text-[10px] xl:text-[10px] font-semibold leading-[13px] sm:leading-[14px] tracking-[0.5px] align-middle uppercase text-[#64748B] mb-1">Funds Raised</p>
                            <p className="text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px] xl:text-[30px] font-bold leading-[24px] sm:leading-[26px] md:leading-[28px] lg:leading-[30px] xl:leading-[36px] tracking-[0px] align-middle text-[#171717] text-source">₹25,500</p>
                        </div>
                        <div className="bg-white p-3 sm:p-3.5 md:p-4 xl:p-6 rounded-[14px] sm:rounded-[16px] xl:rounded-[24px] min-w-0 xl:min-w-[180px] flex flex-col justify-center items-start shadow-xl w-full xl:w-auto">
                            <p className="font-source text-[8px] sm:text-[9px] md:text-[10px] xl:text-[10px] font-semibold leading-[13px] sm:leading-[14px] tracking-[0.5px] align-middle uppercase text-[#64748B] mb-1">Time Left</p>
                            <p className="text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px] xl:text-[30px] font-bold leading-[24px] sm:leading-[26px] md:leading-[28px] lg:leading-[30px] xl:leading-[36px] tracking-[0px] align-middle text-[#171717] text-source">12</p>
                        </div>
                    </div>
                </div>


                {/* Bottom Buttons Row */}
                <div className="flex flex-col lg:flex-row justify-between lg:items-center xl:items-center gap-4 xl:gap-0">
                    <div className="flex flex-wrap xl:flex-nowrap gap-3 pb-4">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`px-[16px] py-[10px] rounded-full font-source text-[16px] font-medium leading-none tracking-normal transition-colors ${activeTab === 'overview'
                                ? 'bg-[#171717] text-[#ffffff]'
                                : 'text-[#344054] border border-gray-400 bg-white'
                                }`}
                        >
                            Overview
                        </button>
                        <button
                            onClick={() => setActiveTab('applied')}
                            className={`px-[16px] py-[10px] rounded-full font-source text-[16px] font-medium leading-none tracking-normal transition-colors ${activeTab === 'applied'
                                ? 'bg-[#171717] text-[#ffffff]'
                                : 'text-[#344054] border border-gray-400 bg-white'
                                }`}
                        >
                            Applied List
                        </button>
                    </div>
                    <div className="flex flex-wrap xl:flex-nowrap gap-3 md:gap-4 items-center">
                        <span className="flex items-center gap-2 bg-[#e6fcf5] text-[#0ca678] px-4 py-2 rounded-full text-[12px] font-bold border border-[#c3fae8]">
                            <div className="w-2 h-2 bg-[#0ca678] rounded-full"></div> Active
                        </span>
                        <button className="bg-[#ff6b2b] text-white px-8 py-2.5 rounded-full text-sm font-bold shadow-sm">Inactive</button>
                        <button
                            onClick={() => {
                                setUploadedPosts(samplePostPreviews);
                                setIsAddPostModalOpen(true);
                            }}
                            className="flex gap-2 items-center bg-white border border-[#D0D5DD] text-gray-700 px-6 py-2.5 rounded-full text-sm font-bold hover:bg-gray-50 transition-all shadow-sm"
                        >
                            <Plus size={18} /> Add Post
                        </button>
                        <button className="flex gap-2 items-center bg-white border border-[#D0D5DD] text-gray-700 px-6 py-2.5 rounded-full text-sm font-bold hover:bg-gray-50 transition-all shadow-sm">
                            <img src={assets.edit} alt="Edit" className="w-4 h-4 object-contain" /> Edit Details
                        </button>
                    </div>
                </div>


                {activeTab === 'overview' ? (
                    <>
                        {/* --- ORIGINAL CONTENT CARDS --- */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InfoCard title="Basic Details">
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-y-8">
                                    <DataItem label="Registration Type" value="Paid" />
                                    <DataItem label="Reg Start Date" value="01/04/2026" />
                                    <DataItem label="Total Seats" value="500" />
                                    <DataItem label="Reg End Date" value="13/04/2026" />
                                </div>
                            </InfoCard>

                            <InfoCard title="Fees Details">
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                    <DataItem label="Individual Fees" value="₹500" />
                                    <DataItem label="Team Fees" value="₹1200" />
                                    <DataItem label="Late Fees" value="₹200" />
                                </div>
                            </InfoCard>

                            <InfoCard title="Prize Details">
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-y-8">
                                    <DataItem label="1st Prize" value="₹500" />
                                    <DataItem label="2nd Prize" value="₹1200" />
                                    <DataItem label="3rd Prize" value="₹200" />
                                    <DataItem label="Participation Prize" value="₹500" />
                                </div>
                            </InfoCard>

                            <InfoCard title="Opportunity">
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-y-8">
                                    <DataItem label="Internship Opportunity" value="Yes" />
                                    <DataItem label="Placement Opportunity" value="Yes" />
                                    <DataItem label="Industry Exposure" value="No" />
                                    <DataItem label="Industry Partners" value="No" />
                                </div>
                            </InfoCard>
                        </div>

                        {/* --- NEW SECTIONS FROM UPLOADED IMAGE --- */}
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-4">




                            <InfoCard title="Food Details">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <DataItem label="Food Provide" value="Yes" />
                                    <DataItem label="Veg / Non-Veg" value="Both" />
                                    <DataItem label="Midnight Snacks" value="Yes" />
                                </div>
                            </InfoCard>

                            <InfoCard title="Team Details">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <DataItem label="Team Or Individual" value="Both" />
                                    <DataItem label="Team Min Size" value="2" />
                                    <DataItem label="Team Max Size" value="10" />
                                </div>
                            </InfoCard>

                            <InfoCard title="Venue Details">
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-4">
                                    <p className="text-[13px] sm:text-[14px] font-medium text-secondary">Venue Name: <span className="">nulinz@gmail.com</span></p>
                                    <p className="text-[13px] sm:text-[14px] font-medium text-secondary">Geo Location: <span className="">+91 8438298692</span></p>
                                    <div className="text-[13px] sm:text-[14px] font-medium text-secondary sm:col-span-2 xl:col-span-1">
                                        1st Floor, NV Arcade Building, Near 5Roads, Salem - 636004
                                    </div>
                                </div>
                            </InfoCard>






                            {/* --- ROUND DETAILS --- */}
                            <InfoCard title="Round Details">
                                <div className="grid grid-cols-1 gap-5 md:gap-6">
                                    <DataItem
                                        label="Round 1 – Idea Screening (Online Submission)"
                                        value="Teams submit problem statement and solution idea."
                                    />
                                    <DataItem
                                        label="Round 2 – Prototype Development (On-Campus)"
                                        value="Selected teams build a working prototype in 24 hours."
                                    />
                                    <DataItem
                                        label="Round 3 – Final Pitch & Demo"
                                        value="Presentation before industry judges."
                                    />
                                </div>
                            </InfoCard>

                            {/* --- CONTACT INFO --- */}
                            <InfoCard title="Contact Info">
                                <div className="grid grid-cols-1   gap-6">
                                    <div className="space-y-3">
                                        <DataItem label="Lead: Ms. Priya Sharma" value="Call: +91 9876543210" />
                                        <p className=" text-[13px] sm:text-[14px] font-medium leading-snug text-secondary -mt-1">
                                            Mail: innovate@futuremail.com
                                        </p>
                                    </div>
                                    <div className="space-y-3">
                                        <DataItem label="Assistant: Mr. Rohan Patel" value="Call: +91 8765432109" />
                                        <p className="text-[13px] sm:text-[14px] font-medium leading-snug text-secondary -mt-1">
                                            Mail: assist@futuremail.com
                                        </p>
                                    </div>
                                </div>
                            </InfoCard>

                            {/* --- SCHEDULE --- */}
                            <InfoCard title="Schedule">
                                <div className="grid grid-cols-1 gap-5 md:gap-6">
                                    <DataItem
                                        label="Concept Review (Online)"
                                        value="09:00 AM - 11:00 AM"
                                    />
                                    <DataItem
                                        label="Model Building (On-Site)"
                                        value="11:30 AM - 01:30 PM"
                                    />
                                    <DataItem
                                        label="Final Presentation"
                                        value="02:10 PM - 04:30 PM"
                                    />
                                </div>
                            </InfoCard>





                            <InfoCard title="Allowed Departments">
                                <ul className="grid grid-cols-1 gap-y-3 list-disc list-inside text-[14px] sm:text-[15px] font-medium text-[#2d2e2f]">
                                    <li>AI Engineering</li>
                                    <li>Data Management</li>
                                    <li>Machine Learning</li>
                                    <li>Robotics</li>
                                    <li>Cloud Computing</li>
                                </ul>
                            </InfoCard>

                            <InfoCard title="Description">
                                <p className="text-[13px] sm:text-[14px] font-medium leading-relaxed tracking-normal text-secondary mt-2">
                                    Dr. Anya Sharma, a renowned AI researcher, holds a Ph.D. from MIT and has led several cutting-edge projects at FutureTech Labs. Her work focuses on ethical AI and its impact on society.
                                </p>
                            </InfoCard>

                            <InfoCard title="Eligibility Details">
                                <p className="text-[13px] sm:text-[14px] font-medium leading-relaxed tracking-normal text-secondary mt-2">
                                    The Global AI Summit is the premier event for AI enthusiasts, researchers, and industry leaders. This year's summit will explore the latest advancements in AI, including machine learning and deep learning.
                                </p>
                            </InfoCard>




                            <div className="md:col-span-2 xl:col-span-3 bg-white p-5 sm:p-6 lg:p-7 rounded-[20px] md:rounded-[24px] shadow-sm border border-gray-100">
                                <h3 className="text-[18px] sm:text-[20px] font-bold text-[#1a1a1a] mb-5 sm:mb-6">Post</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                                    {postImages.map((image, index) => (
                                        <div key={`${image}-${index}`} className="rounded-[18px] overflow-hidden border border-gray-200 bg-gray-50">
                                            <img
                                                src={image}
                                                alt={`Post ${index + 1}`}
                                                className="w-full aspect-[3/4] object-cover"
                                                loading="lazy"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <InfoCard title="Rule Book">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border-2 border-gray-200 rounded-[14px]">
                                    <div className="flex items-center gap-4 sm:gap-6">
                                        <div className="w-7 h-7 flex items-center justify-center">
                                            <img src={assets.doc} alt="" />
                                        </div>
                                        <p className="text-[16px] font-semibold text-[#1a1a1a]">Event Rule Book.pdf</p>
                                    </div>
                                    <button className="text-secondary hover:text-blue-500 transition-colors">
                                        <Download size={24} />
                                    </button>
                                </div>
                            </InfoCard>
                        </div>
                    </>
                ) : (
                    <AppliedListSection data={appliedListData} heading={appliedListColumns} />
                )}
            </section>

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
                        <p className="text-[14px] text-[#6B7280] mb-4">Upload Poster to this Event.</p>

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

                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {uploadedPosts.slice(0, 3).map((item) => (
                                <div key={item.id} className="relative rounded-[12px] overflow-hidden border border-gray-200 bg-[#F9FAFB]">
                                    <img src={item.src} alt="Post preview" className="w-full h-[120px] object-cover" />
                                    <button
                                        onClick={() => removePostImage(item.id)}
                                        className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-white text-red-500 border border-red-200 flex items-center justify-center"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>

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
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GlobalAISummit;






