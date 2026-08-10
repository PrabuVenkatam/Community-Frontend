import { useEffect, useState } from 'react';
import DynamicTable from '../../../common/DynamicTable';
import { assets } from '../../../assets/assets';

import setFileName from '../../../utils/setFileName';
import { apiGetcompanyDashboard } from '../../../services/companyServices';
import { useTitle } from '../../../context/AdminTitle';

// ─── tiny helper ────────────────────────────────────────────────────────────
const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`} />
);

// ─── Component ───────────────────────────────────────────────────────────────
const CompanyDashboard = () => {
  const [stats, setStats] = useState(null);
  const [latestApplied, setLatestApplied] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { setTitle } = useTitle()
  useEffect(() => {
    setTitle("Dashboard")
  }, [])


  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await apiGetcompanyDashboard();
        console.log(res)
        if (!res.status) throw new Error(res.message);
        setStats(res?.data?.stats);
        setLatestApplied(res?.data?.lastApplied
        );

      } catch (err) {
        console.error(err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  // ── Metric card config (maps to API stats keys) ───────────────────────────
  const metricCards = [

    { key: 'totalFollowers', title: 'Total followers', highlighted: true },
    { key: 'activeInternships', title: 'Active Internship' },
    { key: 'activeFreelances', title: 'Active Projects' },
  ];

  // ── Table columns ─────────────────────────────────────────────────────────
  const companyColumns = [
    { title: '#', dataIndex: 'index', key: 'index' },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, row) => (
        <div className="flex items-center gap-2">
          {row.companyLogo ? (
            <img
              src={setFileName(row.companyLogo)}
              alt={text}
              className="w-8 h-8 rounded-full object-cover border border-gray-100"
            />
          ) : (
            <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
              {text?.[0] ?? '?'}
            </span>
          )}
          <span className="font-medium">{text}</span>
        </div>
      ),
    },
    { title: 'Job Type', dataIndex: 'type', key: 'type' },
    { title: 'Job Title', dataIndex: 'title', key: 'title' },
    { title: 'Name ', dataIndex: 'name', key: "name" },
    { title: 'Email ', dataIndex: 'email', key: "email" },
    { title: 'Mobile', dataIndex: 'phone', key: 'phone' },
    {
      title: 'Applied',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (v) =>
        v
          ? new Date(v).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })
          : '—',
    },
  ];

  // Add a 1-based index to each row for the "#" column
  const companyRows = latestApplied.map((c, i) => ({
    ...c,
    index: `0${i + 1}`,
    id: c._id,
  }));

  // ── Error state ───────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="flex items-center justify-center h-48 text-red-500 font-medium">
        ⚠️ {error}
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-5">
      {/* ── Metric Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {metricCards.map((card) => {
          const isHighlighted = card.highlighted;
          const data = stats?.[card.key];

          return (
            <div
              key={card.key}
              className={`rounded-[24px] border p-5 flex flex-col justify-between ${isHighlighted
                ? 'bg-[linear-gradient(180deg,_#171717_0%,_#171717_100%)] border-transparent text-white'
                : 'bg-white border-[#EAECF0] text-primary'
                }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <h3
                  className={`text-[20px] font-semibold leading-[100%] ${isHighlighted ? 'text-white' : 'text-primary'
                    }`}
                >
                  {card.title}
                </h3>
                <span
                  className={`w-9 h-9 rounded-[12px] inline-flex items-center justify-center ${isHighlighted ? 'bg-white/20' : 'bg-[#F2F4F7]'
                    }`}
                >
                  <img
                    src={isHighlighted ? assets.up_i : assets.down_i}
                    alt=""
                  />
                </span>
              </div>

              {/* Value + delta */}
              <div className="mt-2">
                {loading || !data ? (
                  <>
                    <Skeleton className="h-9 w-16 mb-3" />
                    {/* <Skeleton className="h-6 w-28" /> */}
                  </>
                ) : (
                  <>
                    <p
                      className={`text-[35px] font-bold leading-[1] ${isHighlighted ? 'text-white' : 'text-[#101828]'
                        }`}
                    >
                      {data.total}
                    </p>
                    {/* <div className="mt-3 flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-[14px] font-semibold leading-none ${
                          isHighlighted
                            ? 'bg-white/20 text-white'
                            : 'bg-[#FEECEC] text-[#F04438]'
                        }`}
                      >
                        +{data.thisMonth}
                      </span>
                      <span
                        className={`text-[14px] font-medium ${
                          isHighlighted ? 'text-[#EAF6FF]' : 'text-[#667085]'
                        }`}
                      >
                        This month
                      </span>
                    </div> */}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Latest Companies Table ── */}
      <section className="rounded-[24px] border border-[#EAECF0] bg-white p-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-[20px] font-semibold text-primary">
            Latest Applied
          </h2>
          <span className="text-sm text-[#667085]">5 most recent</span>
        </div>

        {loading ? (
          <div className="space-y-3 py-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : (
          <DynamicTable
            columns={companyColumns}
            dataSource={companyRows}
            rowKey="id"
            showPagination={false}
            plain={true}
          />
        )}
      </section>
    </div>
  );
};

export default CompanyDashboard;
