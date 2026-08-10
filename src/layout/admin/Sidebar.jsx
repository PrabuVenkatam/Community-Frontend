// import React from 'react';
// import { NavLink } from 'react-router-dom';
// import {
//     LayoutGrid,
//     Building2,
//     CalendarDays,
//     Briefcase,
//     UserRound
// } from 'lucide-react';
// import { assets } from '../../assets/assets';

// const Sidebar = () => {
//     const menuItems = [
//         { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutGrid },
//         { name: 'Company', path: '/admin/company', icon: Building2 },
//         { name: 'Events', path: '/admin/events', icon: CalendarDays },
//         { name: 'Jobs', path: '/admin/jobs', icon: Briefcase },
//         { name: 'Users', path: '/admin/users', icon: UserRound },
//     ];

//     return (
//         <aside className="w-[260px] min-h-screen bg-white border-r border-gray-100 flex flex-col py-6">
//             {/* Logo Section */}
//             <div className="px-6 mb-10">
//                 <img
//                     src={assets.logo}
//                     alt="Nulinz Community"
//                     className="h-12 w-auto object-contain"
//                 />
//             </div>

//             {/* Navigation Links */}
//             <nav className="flex-1 space-y-1 px-3">
//                 {menuItems.map((item) => (
//                     <NavLink
//                         key={item.name}
//                         to={item.path}
//                         className={({ isActive }) => `
//         flex items-center gap-3 px-4 py-3 rounded-lg text-[15px] font-medium transition-all duration-200
//         ${isActive
//                                 ? 'bg-blue-50 text-[#171717]'
//                                 : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}
//       `}
//                     >

//                         {({ isActive }) => (
//                             <>
//                                 <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
//                                 <span>{item.name}</span>
//                             </>
//                         )}
//                     </NavLink>
//                 ))}
//             </nav>
//         </aside>
//     );
// };

// export default Sidebar;






















import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
    ChevronDown
} from 'lucide-react';
import { assets } from '../../assets/assets';

const Sidebar = () => {
    const { pathname } = useLocation();

    // State to track expanded menus (Events/Jobs)
    const [expandedMenus, setExpandedMenus] = useState({
        Events: pathname.includes('/admin/events'),
        Jobs: pathname.includes('/admin/jobs')
    });

    const toggleMenu = (name) => {
        setExpandedMenus(prev => ({ ...prev, [name]: !prev[name] }));
    };

    const menuItems = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: assets.dash_i },
        { name: 'Company', path: '/admin/company', icon: assets.comp_i },
        { name: 'College', path: '/admin/college', icon: assets.book_i },
        { name: 'Competition', path: '/admin/competition', icon: assets.competition_i },
        { name: 'Conference', path: '/admin/conference', icon: assets.conf_i },
        { name: 'Events', path: '/admin/events', icon: assets.event_i },
        { name: 'Seminar', path: '/admin/seminar', icon: assets.sem_i },
        {
            name: 'Jobs',
            icon: assets.jobs_i,
            subItems: [
                { name: "Jobs", path: "/admin/jobs/job" },
                { name: "Internship", path: "/admin/jobs/internship" },
                { name: "Projects", path: "/admin/jobs/freelance" },
            ]
        },
        { name: 'Users', path: '/admin/users', icon: assets.book_i },
        { name: 'Subscriptions', path: '/admin/subscriptions', icon: assets.comp_i },
    ];


    return (
        <aside className="w-[260px] h-screen sticky top-0 bg-white border-r-2 border-[#E5E7EB] flex flex-col py-6 overflow-y-auto">
            {/* Logo Section */}
            <div className="px-6 mb-10 flex justify-center">
                <img
                    src={assets.gradEnvyLogo}
                    alt="Nulinz Community"
                    className="h-11 w-auto object-contain"
                />
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 space-y-1 px-3">
                {menuItems.map((item) => {
                    const hasSubItems = !!item.subItems;
                    const isExpanded = expandedMenus[item.name];
                    // Check if current path belongs to this category
                    const isCategoryActive = hasSubItems && pathname.includes(item.name.toLowerCase());

                    return (
                        <div key={item.name} className="relative">
                            {hasSubItems ? (
                                /* Parent Item Toggle */
                                <button
                                    onClick={() => toggleMenu(item.name)}
                                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-[15px] font-medium transition-all duration-200 relative group
                                    ${isCategoryActive ? 'text-primary' : 'text-primary hover:bg-gray-50'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <img src={item.icon} alt={item.name} className="w-5 h-5 object-contain" />
                                        <span>{item.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <ChevronDown
                                            size={16}
                                            className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                                        />
                                        {/* Blue indicator bar on the right side */}
                                        {isCategoryActive && (
                                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[4px] h-8 bg-[#171717] rounded-l-full" />
                                        )}
                                    </div>
                                </button>
                            ) : (
                                /* Standard NavLink for items without sub-menus */
                                <NavLink
                                    to={item.path}
                                    className={({ isActive }) => `
                                        flex items-center gap-3 px-4 py-3 rounded-lg text-[15px] font-medium transition-all duration-200
                                        ${isActive ? 'bg-blue-50 text-primary' : 'text-primary hover:bg-gray-50 hover:text-primary'}
                                    `}
                                >
                                    {({ isActive }) => (
                                        <>
                                            <img src={item.icon} alt={item.name} className="w-5 h-5 object-contain" />
                                            <span>{item.name}</span>
                                        </>
                                    )}
                                </NavLink>
                            )}

                            {/* Sub-menu rendering with curved connector line logic */}
                            {hasSubItems && isExpanded && (
                                <div className="ml-9 mt-1 space-y-1 border-l border-gray-200 relative">
                                    {item.subItems.map((sub) => (
                                        <NavLink
                                            key={sub.name}
                                            to={sub.path}
                                            className={({ isActive }) => `
                                                flex items-center px-6 py-2.5 text-[14px] font-medium transition-colors relative
                                                ${isActive ? 'text-primary' : 'text-primary hover:text-primary'}
                                            `}
                                        >
                                            {({ isActive }) => (
                                                <>
                                                    {/* The curved line connector */}
                                                    <div className={`absolute -left-[1px] top-0 bottom-0 w-[1px] ${isActive ? 'bg-[#171717]' : 'bg-transparent'}`}>
                                                        <div className="absolute top-1/2 -left-[12px] w-3 h-[1px] bg-gray-200" />
                                                    </div>
                                                    <span>{sub.name}</span>
                                                </>
                                            )}
                                        </NavLink>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </nav>
        </aside>
    );
};

export default Sidebar;
