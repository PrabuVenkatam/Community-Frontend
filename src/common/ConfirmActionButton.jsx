import { useState } from "react";
import { Loader2, X } from "lucide-react";

const ConfirmActionButton = ({
  isActive,
  isSubmitting,
  onConfirm,
  activateText = "Activate",
  deactivateText = "Deactivate",
  type = "Event",
  apply = "register",
}) => {
  const [open, setOpen] = useState(false);

  const handleConfirm = async () => {
    await onConfirm();
    setOpen(false);
  };

  return (
    <>
      {/* Action Button */}
      <button
        disabled={isSubmitting}
        onClick={() => setOpen(true)}
        className={`px-[16px] py-2.5 rounded-full text-white text-[15px] font-semibold shadow-sm transition-all active:scale-95 disabled:opacity-50 ${isActive
            ? "bg-[#F04438] hover:bg-[#D92D20]"
            : "bg-[#12B76A] hover:bg-[#0E9355]"
          }`}
      >
        {isSubmitting ? (
          <Loader2 size={16} className="animate-spin inline" />
        ) : isActive ? (
          deactivateText
        ) : (
          activateText
        )}
      </button>

      {/* Confirm Modal */}
      {open && (
        <div
          className="fixed font-source inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">

            {/* ✦ Close icon */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            {/* Title */}
            <h2 className="text-[24px] text-center font-semibold text-gray-900">
              Make {type} {isActive ? "Inactive" : "Active"}?
            </h2>

            {/* Description */}
            <p className="mt-2 text-[16px] text-center text-gray-500 leading-6">
              {isActive
                ? `Once you deactivate this ${type}, it will be hidden from the platform and users won't be able to view or ${apply} for it.`
                : `Once activated, this ${type} will be published on the platform and participants can view and ${apply} for it.`}
            </p>

            {/* Actions */}
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 flex-1 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition"
              >
                Cancel
              </button>

              <button
                disabled={isSubmitting}
                onClick={handleConfirm}
                className="px-4 py-2 rounded-xl flex-1 text-white font-medium transition bg-blue-500 hover:171717 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : isActive ? (
                  deactivateText
                ) : (
                  activateText
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ConfirmActionButton;