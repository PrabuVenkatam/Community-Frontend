import React, { useState, useEffect } from 'react';
import DynamicTable from '../../../common/DynamicTable';
import { getActiveSubscriptions } from '../../../services/admin/adminServices';
import { useTitle } from '../../../context/AdminTitle';

const Subscriptions = () => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const { setTitle } = useTitle();

    useEffect(() => {
        setTitle("Subscriptions");
        fetchSubscriptions();
    }, []);

    const fetchSubscriptions = async () => {
        try {
            setIsLoading(true);
            const response = await getActiveSubscriptions();
            if (response.success) {
                const mappedData = (response.data || []).map(item => ({
                    ...item,
                    id: item._id
                }));
                setSubscriptions(mappedData);
            }
        } catch (error) {
            console.error("Failed to fetch active subscriptions:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = (value) => {
        setSearch(value);
        setCurrentPage(1);
    };

    const filteredRows = subscriptions.filter((item) =>
        (item.name || '').toLowerCase().includes(search.toLowerCase()) ||
        (item.email || '').toLowerCase().includes(search.toLowerCase()) ||
        (item.phone || '').toLowerCase().includes(search.toLowerCase()) ||
        (item.subscription?.planName || '').toLowerCase().includes(search.toLowerCase())
    );

    const columns = [
        { 
            title: '#', 
            dataIndex: 'index', 
            key: 'index',
            render: (_text, _record, index) => index + 1
        },
        { title: 'User Name', dataIndex: 'name', key: 'name', render: (val) => val || 'N/A' },
        { title: 'Email', dataIndex: 'email', key: 'email', render: (val) => val || 'N/A' },
        { title: 'Mobile Number', dataIndex: 'phone', key: 'phone', render: (val) => val || 'N/A' },
        { 
            title: 'Plan Name', 
            dataIndex: ['subscription', 'planName'], 
            key: 'planName',
            render: (_val, record) => record.subscription?.planName || 'Free'
        },
        { 
            title: 'Amount', 
            dataIndex: ['subscription', 'amount'], 
            key: 'amount',
            render: (_val, record) => `₹${record.subscription?.amount || 0}`
        },
        { 
            title: 'Duration', 
            dataIndex: ['subscription', 'durationDays'], 
            key: 'durationDays',
            render: (_val, record) => `${record.subscription?.durationDays || 0} Days`
        },
        // { 
        //     title: 'Remaining', 
        //     dataIndex: ['subscription', 'remainingDays'], 
        //     key: 'remainingDays',
        //     render: (_val, record) => (
        //         <span className="font-semibold text-blue-600">
        //             {`${record.subscription?.remainingDays || 0} Days`}
        //         </span>
        //     )
        // },
        {
            title: 'Start Date',
            dataIndex: ['subscription', 'startDate'],
            key: 'startDate',
            render: (_val, record) => record.subscription?.startDate 
                ? new Date(record.subscription.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) 
                : 'N/A'
        },
        {
            title: 'Expiry Date',
            dataIndex: ['subscription', 'expiryDate'],
            key: 'expiryDate',
            render: (_val, record) => record.subscription?.expiryDate 
                ? new Date(record.subscription.expiryDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) 
                : 'N/A'
        },
        // {
        //     title: 'Status',
        //     dataIndex: ['subscription', 'isPlanActive'],
        //     key: 'isPlanActive',
        //     render: (_val, record) => {
        //         const isActive = record.subscription?.isPlanActive === true;
        //         return (
        //             <span
        //                 className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[14px] font-semibold ${isActive ? 'bg-[#E6F8EE] text-[#23A55A]' : 'bg-[#F1F5F9] text-[#64748B]'}`}
        //             >
        //                 <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-[#23A55A]' : 'bg-[#64748B]'}`} />
        //                 {isActive ? 'Active' : 'Inactive'}
        //             </span>
        //         );
        //     },
        // }
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
                searchPlaceholder="Search name, email, plan..."
                showAddButton={false}
                showPagination={true}
                currentPage={currentPage}
                pageSize={10}
                onPageChange={setCurrentPage}
            />
        </div>
    );
};

export default Subscriptions;
