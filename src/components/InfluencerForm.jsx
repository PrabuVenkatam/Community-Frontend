import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createInfluencer } from "../services/admin/adminServices";
import FormLayout from "../layout/FormLayout";
import { useTitle } from "../context/AdminTitle";
import { useEffect } from "react";

const influencerFormConfig = [
  {
    title: "Basic Details",
    type: "static",
    fields: [
      { name: "name", label: "Full Name", type: "text" },
      { name: "mailId", label: "Mail Id", type: "text", sanitize: "validMail" },
      { name: "phoneNumber", label: "Phone Number", type: "tel", required: false },
      {
        name: "profileImage",
        label: "Profile Photo",
        type: "file",
        required: false,
      },
    ],
  },
  {
    title: "Social Media Links",
    type: "static",
    fields: [
      {
        name: "instagram",
        label: "Instagram Profile URL",
        type: "text",
        required: false,
        placeholder: "https://instagram.com/username",
      },
      {
        name: "youtube",
        label: "YouTube Channel URL",
        type: "text",
        required: false,
        placeholder: "https://youtube.com/@channel",
      },
      {
        name: "linkedin",
        label: "LinkedIn Profile URL",
        type: "text",
        required: false,
        placeholder: "https://linkedin.com/in/username",
      },
      {
        name: "twitter",
        label: "Twitter / X Profile URL",
        type: "text",
        required: false,
        placeholder: "https://x.com/username",
      },
    ],
  },
];

const InfluencerForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setTitle } = useTitle();

  const editData = location.state?.editData;

  useEffect(() => {
    setTitle("Influencer Form");
  }, []);

  // Remap email/phone aliases from editData before passing to FormLayout
  const normalizedEditData = editData
    ? {
        ...editData,
        id: editData._id || editData.id,
        mailId: editData.mailId || editData.email || "",
        phoneNumber: editData.phoneNumber || editData.phone || "",
      }
    : undefined;

  const handleSubmit = async (formData, rawPayload) => {
    try {
      const influencerId = rawPayload?.id || rawPayload?._id || editData?._id || editData?.id;
      if (influencerId && !formData.has("id")) {
        formData.append("id", influencerId);
      }

      if (rawPayload?.mailId && !formData.has("email")) {
        formData.append("email", rawPayload.mailId);
      }
      if (rawPayload?.phoneNumber && !formData.has("phone")) {
        formData.append("phone", rawPayload.phoneNumber);
      }

      if (rawPayload?.profileImage instanceof File) {
        formData.set("profileImage", rawPayload.profileImage);
      } else if (typeof rawPayload?.profileImage === "string" && rawPayload.profileImage) {
        formData.set("profileImage", rawPayload.profileImage);
      }

      const res = await createInfluencer(formData);

      if (res?.success) {
        toast.success(res?.message || "Influencer saved successfully");
        navigate(-1);
      } else {
        toast.error(res?.message || "Failed to save influencer");
      }
    } catch (error) {
      console.error("Error saving influencer:", error);
      toast.error(
        error?.message || error?.response?.data?.message || "Server error. Please try again"
      );
    }
  };

  return (
    <FormLayout
      config={influencerFormConfig}
      editData={normalizedEditData}
      onSubmit={handleSubmit}
      submitLabel="Save"
    />
  );
};

export default InfluencerForm;
