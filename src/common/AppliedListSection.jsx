import React, { useMemo, useState } from 'react';
import DynamicTable from './DynamicTable';

const AppliedListSection = ({ data = [], heading = [], showFilters, onRowClick, showExportButton = false, onExport }) => {
    const [search, setSearch] = useState('');
    const [yearFilter, setYearFilter] = useState('');
    const [secondaryFilter, setSecondaryFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const isLocationFilter = useMemo(() => {
        return data.some((item) => item.location);
    }, [data]);

    const yearOptions = useMemo(() => {
        const years = [...new Set(data.map((item) => item.year).filter(Boolean))];
        return years.map((year) => ({ label: year, value: year }));
    }, [data]);

    const secondaryOptions = useMemo(() => {
        const filterKey = isLocationFilter ? 'location' : 'department';
        const values = [...new Set(data.map((item) => item[filterKey]).filter(Boolean))];
        return values.map((val) => ({ label: val, value: val }));
    }, [data, isLocationFilter]);

    const filteredAppliedList = useMemo(() => {
        return data.filter((item) => {
            const query = search.toLowerCase();
            const matchesSearch =
                (item?.name || item?.fullName)?.toLowerCase().includes(query) ||
                item?.college?.toLowerCase().includes(query) ||
                item?.department?.toLowerCase().includes(query) ||
                (item?.contact || item?.phoneNumber)?.toLowerCase().includes(query) ||
                (item?.mail || item?.mailId)?.toLowerCase().includes(query) ||
                item?.location?.toLowerCase().includes(query);

            const matchesYear = yearFilter ? String(item.year) === yearFilter : true;
            const targetVal = isLocationFilter ? item.location : item.department;
            const matchesSecondary = secondaryFilter ? targetVal === secondaryFilter : true;

            return matchesSearch && matchesYear && matchesSecondary;
        });
    }, [data, search, yearFilter, secondaryFilter, isLocationFilter]);

    return (
        <div className="bg-white rounded-[20px] border border-gray-100 ">
            <DynamicTable
                columns={heading}
                dataSource={filteredAppliedList}
                rowKey="sNo"
                onRowClick={onRowClick}
                showSearch={true}
                searchPlaceholder="Search ..."
                showExportButton={showExportButton}
                onExport={onExport}
                onSearch={(value) => {
                    setSearch(value);
                    setCurrentPage(1);
                }}
                filters={[
                    {
                        key: 'year',
                        placeholder: 'All Year',
                        value: yearFilter,
                        options: yearOptions,
                        onChange: (value) => {
                            setYearFilter(value);
                            setCurrentPage(1);
                        },
                    },
                    {
                        key: isLocationFilter ? 'location' : 'department',
                        placeholder: isLocationFilter ? 'All Location' : 'All Department',
                        value: secondaryFilter,
                        options: secondaryOptions,
                        onChange: (value) => {
                            setSecondaryFilter(value);
                            setCurrentPage(1);
                        },
                    },
                ]}
                showPagination={true}
                currentPage={currentPage}
                pageSize={10}
                onPageChange={setCurrentPage}
            />
        </div>
    );
};

export default AppliedListSection;
