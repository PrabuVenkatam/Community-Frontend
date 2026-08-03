import { useState } from "react";
import { Loader2, X } from "lucide-react";

const StatusActionButtons = ({
  isSubmitting,
  onConfirm,
  type = "Event",
}) => {
  const [openApprove, setOpenApprove] = useState(false);
  const [openReject, setOpenReject]   = useState(false);
  const [reason, setReason]           = useState("");
  const [reasonError, setReasonError] = useState("");

  const handleApprove = async () => {
    await onConfirm("approved");
    setOpenApprove(false);
  };

  const handleReject = async () => {
    if (!reason.trim()) {
      setReasonError("Rejection reason is required");
      return;
    }
    await onConfirm("rejected", reason.trim());
    setOpenReject(false);
    setReason("");
    setReasonError("");
  };

  const closeReject = () => {
    setOpenReject(false);
    setReason("");
    setReasonError("");
  };

  return (
    <>
      {/* Buttons */}
      <div className="flex font-source items-center gap-3">
        <button
          disabled={isSubmitting}
          onClick={() => setOpenApprove(true)}
          className="px-[16px] py-2.5 rounded-full text-white text-[15px] font-semibold shadow-sm transition-all active:scale-95 disabled:opacity-50 bg-[#12B76A] hover:bg-[#0E9355]"
        >
          {isSubmitting ? <Loader2 size={16} className="animate-spin inline" /> : "Approve"}
        </button>

        <button
          disabled={isSubmitting}
          onClick={() => setOpenReject(true)}
          className="px-[16px] py-2.5 rounded-full text-white text-[15px] font-semibold shadow-sm transition-all active:scale-95 disabled:opacity-50 bg-[#F04438] hover:bg-[#D92D20]"
        >
          {isSubmitting ? <Loader2 size={16} className="animate-spin inline" /> : "Reject"}
        </button>
      </div>

      {/* Approve Modal */}
      {openApprove && (
        <div
          className="fixed font-source inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={(e) => { if (e.target === e.currentTarget) setOpenApprove(false); }}
        >
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">

            {/* ✦ Close icon */}
            <button
              onClick={() => setOpenApprove(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <h2 className="text-[20px] text-center font-semibold text-gray-900">
              Ready To Approve?
            </h2>
            <p className="mt-2 text-[14px] text-center text-gray-500 leading-6">
              Once approved, this {type} will be automatically published to the app.
            </p>

            <div className="mt-6 flex items-center gap-3">
              <button
                onClick={() => setOpenApprove(false)}
                className="px-4 py-2 flex-1 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                disabled={isSubmitting}
                onClick={handleApprove}
                className="px-4 py-2 flex-1 rounded-xl text-white font-medium transition bg-[#171717] hover:bg-[#171717] disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : "Approve"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {openReject && (
        <div
          className="fixed font-source inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={(e) => { if (e.target === e.currentTarget) closeReject(); }}
        >
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">

            {/* ✦ Close icon */}
            <button
              onClick={closeReject}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <h2 className="text-[20px] font-semibold text-gray-900">
              Reject this request?
            </h2>
            <p className="text-[14px] text-gray-500 leading-6">
              Once rejected, it will be removed from your pending list.
            </p>

            <div className="mt-4">
              <label className="font-semibold text-gray-900">Remarks</label>
              <textarea
                rows={4}
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                  if (e.target.value.trim()) setReasonError("");
                }}
                placeholder="Enter rejection reason..."
                className={`w-full rounded-xl border px-4 py-3 text-[14px] text-gray-800 placeholder-gray-400 outline-none resize-none transition focus:ring-2 ${
                  reasonError
                    ? "border-red-400 focus:ring-red-200"
                    : "border-gray-300 focus:ring-blue-100 focus:border-blue-400"
                }`}
              />
              {reasonError && (
                <p className="mt-1 text-[13px] text-red-500">{reasonError}</p>
              )}
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={closeReject}
                className="px-4 flex-1 py-2 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                disabled={isSubmitting}
                onClick={handleReject}
                className="px-4 flex-1 py-2 rounded-xl text-white font-medium transition bg-blue-500 hover:bg-blue-700 disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : "Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StatusActionButtons;