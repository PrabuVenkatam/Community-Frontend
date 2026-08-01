
// import React from 'react';
// import { Search, Plus, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

// const DynamicTable = ({
//   columns = [],
//   dataSource = [],
//   rowKey = "id",
//   onRowClick,
//   // Search
//   showSearch = false,
//   searchPlaceholder = "Search ...",
//   onSearch,
//   // Filters
//   filters = [],
//   // Add button
//   showAddButton = false,
//   addButtonLabel = "Add",
//   addButtonIcon,
//   onAdd,
//   // State
//   loading = false,
//   // Pagination
//   showPagination = false,
//   totalItems = 0,
//   currentPage = 1,
//   pageSize = 10,
//   onPageChange
// }) => {
//   const hasActionBar = showSearch || filters.length > 0 || showAddButton;

//   // Header Typography Style
//   const headerStyle = {
//     fontFamily: "'Source Sans 3', sans-serif",
//     fontWeight: 600,
//     fontSize: '16px',
//     color: '#222426',
//     lineHeight: '100%',
//     letterSpacing: '0%'
//   };

//   // Row Typography Style
//   const rowTextStyle = {
//     fontFamily: "'Source Sans 3', sans-serif",
//     fontWeight: 400,
//     fontSize: '14px',
//     color: '#52525B',
//     lineHeight: '100%',
//     letterSpacing: '0%'
//   };

//   return (
//     <div className="w-full bg-white rounded-[20px] shadow-sm border border-gray-100 overflow-hidden">
      
//       {/* 1. Action Bar */}
//       {hasActionBar && (
//         <div className="p-6 flex flex-wrap items-center justify-between gap-4">
//           <div className="flex-1">
//             {showSearch && (
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
//                 <input
//                   type="text"
//                   placeholder={searchPlaceholder}
//                   onChange={(e) => onSearch?.(e.target.value)}
//                   className="min-w-[350px] pl-10 pr-4 py-2.5 bg-[#F9FAFB] border border-gray-200 rounded-xl focus:outline-none focus:border-[#0091D5] transition-all text-sm"
//                 />
//               </div>
//             )}
//           </div>

//           <div className="flex items-center gap-3 flex-wrap">
//             {filters.map((f) => (
//               <div key={f.key} className="relative min-w-[140px]">
//                 <select
//                   value={f.value}
//                   onChange={(e) => f.onChange(e.target.value)}
//                   className="appearance-none w-full bg-[#F9FAFB] border border-gray-200 text-gray-700 py-2.5 px-4 pr-10 rounded-xl text-sm focus:outline-none cursor-pointer"
//                 >
//                   <option value="">{f.placeholder}</option>
//                   {f.options.map((opt) => (
//                     <option key={opt.value} value={opt.value}>{opt.label}</option>
//                   ))}
//                 </select>
//                 <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
//               </div>
//             ))}

//             {showAddButton && (
//               <button
//                 onClick={onAdd}
//                 className="flex items-center gap-2 bg-[#0091D5] text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-[#007fb8] transition-all active:scale-95 text-sm"
//               >
//                 {addButtonIcon || <Plus size={18} />}
//                 {addButtonLabel}
//               </button>
//             )}
//           </div>
//         </div>
//       )}

//       {/* 2. Table Area */}
//       <div className="overflow-x-auto">
//         <table className="w-full text-left border-collapse">
//           <thead>
//             <tr className="bg-white border-y border-gray-100">
//               {columns.map((col) => (
//                 <th key={col.key || col.dataIndex} className="px-6 py-4 whitespace-nowrap" style={headerStyle}>
//                   {col.title}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-100">
//             {loading ? (
//               <tr><td colSpan={columns.length} className="text-center py-20 text-gray-400 animate-pulse">Loading data...</td></tr>
//             ) : dataSource.length > 0 ? (
//               dataSource.map((record, index) => (
//                 <tr
//                   key={record[rowKey] || index}
//                   onClick={() => onRowClick?.(record)}
//                   className={`transition-colors ${onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''}`}
//                 >
//                   {columns.map((col) => (
//                     <td key={col.key || col.dataIndex} className="px-6 py-5 whitespace-nowrap" style={rowTextStyle}>
//                       {col.render ? col.render(record[col.dataIndex], record, index) : record[col.dataIndex]}
//                     </td>
//                   ))}
//                 </tr>
//               ))
//             ) : (
//               <tr><td colSpan={columns.length} className="text-center py-20 text-gray-400 font-medium">No records found.</td></tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* 3. Pagination Footer */}
//       {showPagination && (
//         <div className="p-6 flex items-center justify-between border-t border-gray-100 bg-white">
//           <p className="text-[14px] text-gray-500" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
//             Showing <span className="text-gray-900 font-bold">{dataSource.length} Out of {totalItems}</span>
//           </p>
          
//           <div className="flex items-center gap-2">
//             <button 
//               onClick={() => onPageChange?.(currentPage - 1)}
//               disabled={currentPage === 1}
//               className="p-2 rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 disabled:opacity-30"
//             >
//               <ChevronLeft size={20} />
//             </button>
            
//             <button className="w-9 h-9 rounded-lg bg-[#0091D5] text-white text-sm font-bold shadow-sm">
//               1
//             </button>
//             <button className="w-9 h-9 rounded-lg border border-gray-200 text-[#52525B] text-sm font-bold hover:bg-gray-50">
//               2
//             </button>
            
//             <button 
//               onClick={() => onPageChange?.(currentPage + 1)}
//               disabled={currentPage * pageSize >= totalItems}
//               className="p-2 rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 disabled:opacity-30"
//             >
//               <ChevronRight size={20} />
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default DynamicTable;











import React from 'react';
import { Search, Plus, ChevronDown, ChevronLeft, ChevronRight, Download } from 'lucide-react';

const DynamicTable = ({
  columns = [],
  dataSource = [],
  rowKey = "id",
  onRowClick,
  showSearch = false,
  searchPlaceholder = "Search ...",
  onSearch,
  filters = [],
  showAddButton = false,
  addButtonLabel = "Add",
  addButtonIcon,
  onAdd,
  showExportButton = false,
  exportButtonLabel = "Export CSV",
  onExport,
  loading = false,
  showPagination = false,
  currentPage = 1,
  pageSize = 10,
  onPageChange,
  plain = false
}) => {
  const hasActionBar = showSearch || filters.length > 0 || showAddButton || showExportButton;

  // Internal Pagination Logic: Automatically slices to 10 rows per page if showPagination is true
  const totalItems = dataSource.length;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const displayData = showPagination ? dataSource.slice(startIndex, endIndex) : dataSource;
  const totalPages = Math.ceil(totalItems / pageSize);

  // Table Heading Style
  const headerStyle = {
    fontFamily: "'Source Sans 3', sans-serif",
    fontWeight: 600,
    fontSize: '16px',
    lineHeight: '100%',
  };

  // Table Body Text Style
  const rowTextStyle = {
    fontFamily: "'Source Sans 3', sans-serif", // Matches Source Sans Pro fallback
    fontWeight: 400,
    fontSize: '14px',
    lineHeight: '100%',
  };

  return (
    <div className={`w-full overflow-hidden ${plain ? '' : 'bg-white rounded-[10px] shadow-sm border border-gray-100'}`}>
      
      {/* 1. Action Bar */}
      {hasActionBar && (
        <div className="p-4 sm:p-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex-1 min-w-[220px]">
            {showSearch && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  onChange={(e) => onSearch?.(e.target.value)}
                  className="w-full sm:max-w-[200px] pl-10 pr-4 py-2.5 bg-[#F9FAFB] border border-gray-200 rounded-xl focus:outline-none focus:border-[#0091D5] transition-all text-sm"
                />
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {filters.map((f) => (
              <div key={f.key} className="relative min-w-[160px]">
                <select
                  value={f.value}
                  onChange={(e) => f.onChange?.(e.target.value)}
                  className="appearance-none w-full bg-[#F9FAFB] border border-gray-200 text-gray-700 py-2.5 px-4 pr-10 rounded-xl text-sm focus:outline-none cursor-pointer"
                >
                  <option value="">{f.placeholder}</option>
                  {f.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>
            ))}

            {showAddButton && (
              <button
                onClick={onAdd}
                className="flex items-center gap-2 bg-[#0091D5] text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-[#007fb8] transition-all active:scale-95 text-sm shadow-md shadow-blue-100"
              >
                {addButtonIcon || <Plus size={18} />}
                {addButtonLabel}
              </button>
            )}

            {showExportButton && (
              <button
                onClick={onExport}
                className="flex items-center gap-2 bg-[#12B76A] hover:bg-[#0E9F5B] text-white px-4 py-2.5 rounded-xl font-semibold transition-all active:scale-95 text-sm shadow-sm"
              >
                <Download size={16} />
                {exportButtonLabel}
              </button>
            )}
          </div>
        </div>
      )}

      {/* 2. Table Area */}
      <div className="overflow-x-auto md:px-6 ">
        <table className="w-full text-left border-collapse">
          <thead>
          <tr className="bg-white border-y border-gray-100">
            {columns.map((col, index) => (
              <th
                key={col.key || col.dataIndex}
                className={`
                  px-6 py-4 whitespace-nowrap bg-gray-50 text-primary border-y border-gray-200
                  ${index !== 0 ? "border-l" : ""}
                  ${index !== columns.length - 1 ? "border-r" : ""}
                `}
                style={headerStyle}
              >
                {col.title}
              </th>
            ))}
          </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={columns.length} className="text-center py-20 text-gray-400">Loading...</td></tr>
            ) : displayData.length > 0 ? (
              displayData.map((record, index) => (
                <tr
                  key={record[rowKey] || index}
                  onClick={() => onRowClick?.(record)}
                  className={`transition-colors  ${onRowClick ? 'hover:bg-gray-50/50 cursor-pointer' : ''}`}
                >
                {columns.map((col, colIndex) => (
  <td
    key={col.key || col.dataIndex}
    className={`
      px-6 py-3 whitespace-nowrap text-secondary border-y border-gray-200
      ${colIndex !== 0 ? "border-l" : ""}
      ${colIndex !== columns.length - 1 ? "border-r" : ""}
    `}
    style={rowTextStyle}
  >
    {col.render
      ? col.render(record[col.dataIndex], record, index)
      : record[col.dataIndex]}
  </td>
))}
                </tr>
              ))
            ) : (
              <tr><td colSpan={columns.length} className="text-center py-20 text-gray-400">No records found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 3. Pagination Footer */}
      {showPagination && (
        <div className="p-6 flex items-center justify-between border-t border-gray-100 bg-white">
          <p className="text-[20px] text-gray-500 font-medium">
            Showing <span className="text-gray-900 text-[22px] font-bold">{displayData.length} Out of {totalItems}</span>
          </p>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => onPageChange?.(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 disabled:opacity-30"
            >
              <ChevronLeft size={20} />
            </button>
            
            {[...Array(totalPages)].map((_, i) => (
              <button 
                key={i + 1}
                onClick={() => onPageChange?.(i + 1)}
                className={`w-9 h-9 rounded-lg text-sm font-bold transition-all ${
                  currentPage === i + 1 
                  ? 'bg-[#0091D5] text-white shadow-md' 
                  : 'border border-gray-200 text-secondary hover:bg-gray-50'
                }`}
              >
                {i + 1}
              </button>
            ))}
            
            <button 
              onClick={() => onPageChange?.(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="p-2 rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 disabled:opacity-30"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DynamicTable;
