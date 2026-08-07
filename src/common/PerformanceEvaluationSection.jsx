import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { toast } from 'react-toastify';
import { savePerformanceEvaluation, getPerformanceEvaluation } from '../services/admin/adminServices';

const PerformanceEvaluationSection = ({
  candidate = {},
  onBack,
  onSave,
  isSubmitting = false,
}) => {
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");

  const getFullUrl = (rawUrl) => {
    if (!rawUrl || rawUrl === '#') return '';
    if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) {
      return rawUrl;
    }
    const cleanPath = rawUrl.startsWith('/') ? rawUrl : `/${rawUrl}`;
    return `${BASE_URL}${cleanPath}`;
  };

  const rawPic = candidate.profile_pic || candidate.profilePic;

  const profileData = {
    name: candidate.name || candidate.fullName || candidate.user?.name || '',
    college: candidate.college || candidate.collegeName || candidate.user?.collegeName || '',
    degree: candidate.department || candidate.degree || candidate.ugDegree || candidate.pgDegree || '',
    profilePic: rawPic ? getFullUrl(rawPic) : '',
  };

  const initialMetrics = [
    { key: 'communication', title: 'Communication' },
    { key: 'technicalSkills', title: 'Technical Skills' },
    { key: 'problemSolving', title: 'Problem Solving' },
    // { key: 'teamwork', title: 'Teamwork' },
    // { key: 'professionalism', title: 'Professionalism' },
    // { key: 'learningAbility', title: 'Learning Ability' },
  ];

  const [ratings, setRatings] = useState({
    communication: 0,
    technicalSkills: 0,
    problemSolving: 0,
    teamwork: 0,
    professionalism: 0,
    learningAbility: 0,
  });

  const [remarks, setRemarks] = useState({
    communication: '',
    technicalSkills: '',
    problemSolving: '',
    teamwork: '',
    professionalism: '',
    learningAbility: '',
  });

  // Fetch existing performance evaluation on mount
  useEffect(() => {
    const fetchExistingEvaluation = async () => {
      const appId = candidate.applicationId || candidate._id || candidate.id;
      if (!appId) return;

      try {
        setLoading(true);
        const res = await getPerformanceEvaluation(appId);
        if (res.success && res.data) {
          if (res.data.ratings) {
            setRatings((prev) => ({ ...prev, ...res.data.ratings }));
          }
          if (res.data.remarks) {
            setRemarks((prev) => ({ ...prev, ...res.data.remarks }));
          }
        }
      } catch (err) {
        console.warn('Could not fetch existing evaluation:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchExistingEvaluation();
  }, [candidate]);

  const handleStarClick = (metricKey, starValue) => {
    setRatings((prev) => ({
      ...prev,
      [metricKey]: prev[metricKey] === starValue ? 0 : starValue,
    }));
  };

  const handleRemarkChange = (metricKey, value) => {
    setRemarks((prev) => ({
      ...prev,
      [metricKey]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const appId = candidate.applicationId || candidate._id || candidate.id;
    const jobId = candidate.jobId;

    const payload = {
      applicationId: appId,
      jobId,
      ratings,
      remarks,
    };

    try {
      setSubmitting(true);
      if (appId) {
        const response = await savePerformanceEvaluation(payload);
        if (response.success) {
          toast.success(response.message || 'Performance evaluation saved successfully!');
        }
      } else {
        toast.success('Performance evaluation saved successfully!');
      }

      if (onSave) {
        onSave(payload);
      }
    } catch (err) {
      toast.error(err?.message || 'Failed to save performance evaluation');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="bg-white rounded-[16px] md:rounded-[24px] border border-gray-200 p-6 md:p-8 shadow-sm space-y-6">
      {/* Top Candidate Header Card */}
      <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center pb-6 border-b border-gray-200">
        {profileData.profilePic && (
          <img
            src={profileData.profilePic}
            alt={profileData.name}
            className="w-[110px] h-[110px] rounded-[18px] object-cover border border-gray-200 shadow-xs shrink-0"
          />
        )}
        <div className="space-y-1">
          <h2 className="text-[22px] font-bold text-[#1D2939] leading-tight">{profileData.name}</h2>
          {profileData.college && <p className="text-[15px] font-semibold text-[#344054]">{profileData.college}</p>}
          {profileData.degree && <p className="text-[14px] font-medium text-[#475467]">{profileData.degree}</p>}
        </div>
      </div>

      {/* Performance Evaluation Form Grid */}
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {initialMetrics.map((metric) => {
            const currentRating = ratings[metric.key];
            const currentRemark = remarks[metric.key];

            return (
              <div key={metric.key} className="space-y-2">
                <h3 className="text-[15px] font-bold text-[#1D2939]">{metric.title}</h3>

                {/* 5-Star Rating */}
                <div className="flex items-center gap-1.5 pt-1 pb-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={`${metric.key}-star-${star}`}
                      type="button"
                      onClick={() => handleStarClick(metric.key, star)}
                      className="p-0.5 hover:scale-110 transition-transform cursor-pointer focus:outline-none"
                    >
                      <Star
                        size={22}
                        className={
                          star <= currentRating
                            ? 'text-[#F59E0B] fill-[#F59E0B]'
                            : 'text-gray-300 fill-gray-200'
                        }
                      />
                    </button>
                  ))}
                </div>

                {/* Remark Box */}
                <div className="space-y-1">
                  <label className="block text-[13px] font-bold text-[#344054]">Remark</label>
                  <input
                    type="text"
                    value={currentRemark}
                    onChange={(e) => handleRemarkChange(metric.key, e.target.value)}
                    className="w-full h-11 px-4 bg-white border border-gray-200 rounded-[14px] text-sm text-[#344054] focus:outline-none focus:border-[#171717] transition-all"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
          <button
            type="submit"
            disabled={isSubmitting || submitting}
            className="px-8 py-2.5 bg-[#171717] hover:bg-[#171717] text-white rounded-full font-semibold text-[14px] transition-all shadow-md shadow-blue-100 cursor-pointer active:scale-95 disabled:opacity-50"
          >
            {submitting ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default PerformanceEvaluationSection;
