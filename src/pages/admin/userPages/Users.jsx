import React, { useState, useEffect } from 'react';
import DynamicTable from '../../../common/DynamicTable';
import { getAllRegisteredUsers } from '../../../services/admin/adminServices';
import { useTitle } from '../../../context/AdminTitle';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const { setTitle } = useTitle();

    useEffect(() => {
        setTitle("Users");
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setIsLoading(true);
            const response = await getAllRegisteredUsers();
            if (response.success) {
                const mappedData = (response.data || []).map(item => ({
                    ...item,
                    id: item._id
                }));
                setUsers(mappedData);
            }
        } catch (error) {
            console.error("Failed to fetch registered users:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = (value) => {
        setSearch(value);
        setCurrentPage(1);
    };

    const filteredRows = users.filter((item) =>
        (item.name || '').toLowerCase().includes(search.toLowerCase()) ||
        (item.email || '').toLowerCase().includes(search.toLowerCase()) ||
        (item.phone || '').toLowerCase().includes(search.toLowerCase())
    );

    const columns = [
        { 
            title: '#', 
            dataIndex: 'index', 
            key: 'index',
            render: (_text, _record, index) => index + 1
        },
        { title: 'Name', dataIndex: 'name', key: 'name', render: (val) => val || 'N/A' },
        { title: 'Email', dataIndex: 'email', key: 'email', render: (val) => val || 'N/A' },
        { title: 'Mobile Number', dataIndex: 'phone', key: 'phone', render: (val) => val || 'N/A' },
        { title: 'Level', dataIndex: 'level', key: 'level', render: (val) => val ?? 1 },
        { title: 'XP', dataIndex: 'xp', key: 'xp', render: (val) => val ?? 0 },
        // {
        //     title: 'Status',
        //     dataIndex: 'is_active',
        //     key: 'isActive',
        //     render: (value) => {
        //         const isActive = value !== false;
        //         return (
        //             <span
        //                 className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[14px] font-semibold ${isActive ? 'bg-[#E6F8EE] text-[#23A55A]' : 'bg-[#F1F5F9] text-[#64748B]'}`}
        //             >
        //                 <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-[#23A55A]' : 'bg-[#64748B]'}`} />
        //                 {isActive ? 'Active' : 'Inactive'}
        //             </span>
        //         );
        //     },
        // },
        {
            title: 'Registered Date',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (val) => val ? new Date(val).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'
        }
    ];

    return (
        <div className="animate-in fade-in duration-500">
            <DynamicTable
                columns={columns}
                dataSource={filteredRows}
                rowKey="_id"
                isLoading={isLoading}
                showSearch={true}
                onSearch={handleSearch}
                searchPlaceholder="Search name, email, phone..."
                showAddButton={false}
                showPagination={true}
                currentPage={currentPage}
                pageSize={10}
                onPageChange={setCurrentPage}
            />
        </div>
    );
};

export default Users;
