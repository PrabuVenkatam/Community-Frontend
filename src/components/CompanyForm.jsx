import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createCompany } from "../services/admin/adminServices";
import FormLayout from "../layout/FormLayout";
import { useTitle } from "../context/AdminTitle";
import { useEffect } from "react";


const companyFormConfig = [
  {
    title: "Basic Details",
    type: "static",
    fields: [
      { name: "companyName", label: "Company Name", type: "text", sanitize: "noSpecialChars" },
      {
        name: "companyType",
        label: "Company Type",
        type: "select",
        options: ["Startup", "MNC", "Agency", "Product Company"],
      },
      { name: "companyTagLine", label: "Company Tag Line", type: "text" },
      {
        name: "companyCultureTags",
        label: "Company Culture Tags",
        type: "multiselect",
        options: ["Remote Friendly", "Fast Paced", "Inclusive", "Learning Focused"],
      },
      { name: "yearFounded", label: "Year Founded", type: "date", required: false,  max: new Date().toISOString().split("T")[0] },
      { name: "websiteLink", label: "Website Link", type: "text", required: false },
      { name: "companyLogo", label: "Company Logo", type: "file" },
      { name: "coverImage", label: "Cover Image", type: "file" },
      {
  name: "employees",
  label: "Employees",
  type: "select",
  options: ["1-10", "11-50", "51-100", "101-500", "500+"],
}
    ],
  },
  {
    title: "Contact Information",
    type: "static",
    fields: [
      { name: "contactPersonName", label: "Contact Person Name", type: "text" },
      { name: "phoneNumber", label: "Phone Number", type: "tel" },
      { name: "mailId", label: "Mail Id", type: "text", sanitize: "validMail" },
      { name: "address", label: "Address", type: "text" },
      { name: "city", label: "City", type: "text" },
      { name: "state", label: "State", type: "text" },
      { name: "pincode", label: "Pincode", type: "text", sanitize: "noExtraNum" },
    ],
  },
  {
  title: "Account Details",
  type: "static",
  fields: [
    {
      name: "accountHolderName",
      label: "Account Holder Name",
      type: "text",
    },
    {
      name: "bankName",
      label: "Bank Name",
      type: "text",
    },
    {
      name: "branchName",
      label: "Branch Name",
      type: "text",
    },
    {
      name: "accountNumber",
      label: "Account Number",
      type: "text",
      sanitize: "noAlphabets"
    },
    {
      name: "ifscCode",
      label: "IFSC Code",
      type: "text",
      sanitize: "ifsc"
    },
  ],
},
  {
    title: "Technologies We Use",
    type: "dynamic",
    key: "technologies",
    payloadKey: "technologies",
    dynamicStyle: "grid-6",
    initialRows: 3,
    fields: [{ name: "technology", label: "Technology", type: "text", colSpan: "md:col-span-11" }],
  },
  {
    title: "What We Do",
    type: "dynamic",
    key: "what_we_do",
    payloadKey: "whatWeDo",
    dynamicStyle: "grid-6",
    initialRows: 3,
    fields: [{ name: "whatWeDo", label: "What We Do", type: "text", colSpan: "md:col-span-11" }],
  },
  {
    title: "Learning Benefits",
    type: "dynamic",
    key: "learning_benefits",
    payloadKey: "learningBenefits",
    dynamicStyle: "grid-6",
    initialRows: 3,
    fields: [{ name: "learningBenefit", label: "Learning Benefit", type: "text", colSpan: "md:col-span-11" }],
  },
  {
    title: "Learning Outcomes",
    type: "dynamic",
    key: "learning_outcomes",
    payloadKey: "learningOutcomes",
    dynamicStyle: "grid-6",
    initialRows: 3,
    fields: [{ name: "learningOutcome", label: "Learning Outcome", type: "text", colSpan: "md:col-span-11" }],
  },
  {
    title: "About Us & Certificate Settings",
    type: "static",
    fields: [
      { name: "aboutUs", label: "About Us", type: "textarea", span: 2 },
      { name: "certificateAvailability", label: "Certificate Availability", type: "textarea", span: 2 },
      { name: "signatoryName", label: "Authorized Signatory Name", type: "text" },
      { name: "signatoryDesignation", label: "Authorized Signatory Designation", type: "text" },
      { name: "signatureUrl", label: "Authorized Signature Image", type: "file", span: 2 },
      { name: "certificateContentBody", label: "Custom Certificate Body Text", type: "textarea", span: 2, placeholder: "e.g., has successfully completed the internship program in..." },
    ],
  },
];

const CompanyForm = ({ module }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const editData = location.state?.editData;
  const {setTitle}=useTitle()
  useEffect(()=>{
setTitle("Company Form")
  },[])
  // ✅ Remap email/phone aliases from editData before passing to FormLayout
  const normalizedEditData = editData
    ? {
        ...editData,
        mailId: editData.mailId || editData.email || "",
        phoneNumber: editData.phoneNumber || editData.phone || "",
      }
    : undefined;

const handleSubmit = async (formData) => {
  try {
    const res = await createCompany(formData);

    // Check API success flag
    if (res?.success) {
      toast.success(res.message || "Company updated successfully");

      if (window.history.length > 2 && document.referrer.includes(window.location.host)) {
        navigate(-1);
      } else {
        navigate(module === "company" ? "/company/dashboard" : "/admin/company");
      }
    } else {
      // API responded but failed
      toast.error(res?.message || "Something went wrong");
    }
  } catch (error) {
    // Network / server error
    console.error("Error:", error);

    toast.error(
      error?.response?.data?.message || "Server error. Please try again"
    );
  }
};

  return (
    <FormLayout
      config={companyFormConfig}
      editData={normalizedEditData}
      onSubmit={handleSubmit}
    />
  );
};

export default CompanyForm;