import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { toast } from 'react-toastify';

const PerformanceEvaluationSection = ({
  candidate = {},
  onBack,
  onSave,
  isSubmitting = false,
}) => {
  const profileData = {
    name: candidate.name || candidate.fullName || 'Sridhar',
    college: candidate.college || candidate.collegeName || 'Quantum Innovators Institute',
    degree: candidate.department || candidate.degree || 'B.Sc Computer Science',
    profilePic: candidate.profile_pic || candidate.profilePic || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop',
  };

  const initialMetrics = [
    { key: 'communication', title: 'Communication' },
    { key: 'technicalSkills', title: 'Technical Skills' },
    { key: 'problemSolving', title: 'Problem Solving' },
    { key: 'teamwork', title: 'Teamwork' },
    { key: 'professionalism', title: 'Professionalism' },
    { key: 'learningAbility', title: 'Learning Ability' },
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const evaluationData = {
      candidateId: candidate.applicationId || candidate._id || candidate.id,
      ratings,
      remarks,
    };
    if (onSave) {
      onSave(evaluationData);
    } else {
      toast.success('Performance evaluation saved successfully!');
    }
  };

  return (
    <section className="bg-white rounded-[16px] md:rounded-[24px] border border-gray-200 p-6 md:p-8 shadow-sm space-y-6">
      {/* Top Candidate Header Card */}
      <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center pb-6 border-b border-gray-200">
        <img
          src={profileData.profilePic}
          alt={profileData.name}
          className="w-[110px] h-[110px] rounded-[18px] object-cover border border-gray-200 shadow-xs shrink-0"
        />
        <div className="space-y-1">
          <h2 className="text-[22px] font-bold text-[#1D2939] leading-tight">{profileData.name}</h2>
          <p className="text-[15px] font-semibold text-[#344054]">{profileData.college}</p>
          <p className="text-[14px] font-medium text-[#475467]">{profileData.degree}</p>
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
                    className="w-full h-11 px-4 bg-white border border-gray-200 rounded-[14px] text-sm text-[#344054] focus:outline-none focus:border-[#0091D5] transition-all"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-2.5 rounded-full border border-gray-300 text-[#344054] font-semibold text-[14px] hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-2.5 bg-[#0091D5] hover:bg-[#007fb8] text-white rounded-full font-semibold text-[14px] transition-all shadow-md shadow-blue-100 cursor-pointer active:scale-95"
          >
            Save Evaluation
          </button>
        </div>
      </form>
    </section>
  );
};

export default PerformanceEvaluationSection;
