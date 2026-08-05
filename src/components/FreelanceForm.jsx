

import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createFreelance, createInternship } from "../services/admin/adminServices";
import { useOrganizerDisplayName } from "../utils/organizer";
import FormLayout from "../layout/FormLayout";
import { useEffect } from "react";
import { useTitle } from "../context/AdminTitle";


const freelanceFormConfig = [
  {
    title: "Basic Details",
    type: "static",
    fields: [
      { name: "jobTitle", label: "Job Title", type: "text" },
      {
        name: "companyName",
        label: "Organizer",
        type: "text",
        readOnly: true,
      },
      { name: "location", label: "Location", type: "text" },
      { name: "mode", label: "Mode", type: "select", options: ["Online", "Offline", "Hybrid"] },
      { name: "totalOpenings", label: "Total Openings", type: "number" },
      {
        name: "duration",
        label: "Duration",
        type: "select",
        options: ["No Fixed Duration", "1 Month", "3 Months", "6 Months"],
      },
      { name: "applicationDeadline", label: "Application Deadline", type: "date" },
      { name: "jobStartDate", label: "Project Start Date", type: "date" },
      { name: "jobEndDate", label: "Project End Date", type: "date" },
      { name: "salary", label: "Salary", type: "number" },
    ],
  },
  {
    title: "Project Needs",
    type: "dynamic",
    key: "project_needs",
    payloadKey: "projectNeeds",
    dynamicStyle: "grid-6",
    initialRows: 3,
    fields: [{ name: "projectNeed", label: "Project Needs", type: "text", colSpan: "md:col-span-11" }],
  },
  {
    title: "Eligibility",
    type: "dynamic",
    key: "eligibility",
    payloadKey: "eligibility",
    dynamicStyle: "grid-6",
    initialRows: 3,
    fields: [{ name: "eligibilityCriteria", label: "Eligibility ", type: "text", colSpan: "md:col-span-11" }],
  },
  {
    title: "Eligibility Criteria",
    type: "dynamic",
    key: "eligibility_criteria",
    payloadKey: "eligibility_criteria",
    dynamicStyle: "grid-6",
    initialRows: 3,
    fields: [{ name: "eligibilityCriteria", label: "Eligibility Criteria", type: "text", colSpan: "md:col-span-11" }],
  },
  {
    title: "Security",
    type: "dynamic",
    key: "security",
    payloadKey: "security",
    dynamicStyle: "grid-6",
    initialRows: 3,
    fields: [{ name: "securityInfo", label: "Security", type: "text", colSpan: "md:col-span-11" }],
  }, {
    title: "Required skill set",
    type: "dynamic",
    key: "skill_set",
    dynamicStyle: "grid-6",
    initialRows: 3,
    fields: [{ name: "skill_set", label: "Required skill set", type: "text", colSpan: "md:col-span-11" }],
  },
  {
    title: "Reference Website",
    type: "dynamic",
    key: "reference_website",
    payloadKey: "referenceWebsite",
    dynamicStyle: "grid-6",
    initialRows: 3,
    fields: [{ name: "reference", label: "Reference", type: "text", colSpan: "md:col-span-11" }],
  },
  {
    title: "Supporting Files",
    type: "dynamic",
    key: "supporting_files",
    payloadKey: "supporting_files",
    dynamicStyle: "grid-6",
    initialRows: 3,
    fields: [{ name: "supporting_files", label: "Supporting Files", type: "text", colSpan: "md:col-span-11" }],
  },
  {
    title: "Payment Structure",
    type: "dynamic",
    key: "payment_structure",
    payloadKey: "payment_structure",
    dynamicStyle: "grid-6",
    initialRows: 3,
    fields: [{ name: "payment_structure", label: "Payment Structure", type: "text", colSpan: "md:col-span-11" }],
  },
  {
    title: "Rules",
    type: "dynamic",
    key: "rules",
    payloadKey: "rules",
    dynamicStyle: "grid-6",
    initialRows: 3,
    fields: [{ name: "rules", label: "Rules", type: "text", colSpan: "md:col-span-11" }],
  },
  
  {
    title: "Benefits & Jobs Description",
    type: "static",
    dynamicStyle: "grid-6",
    fields: [
      { name: "learning", label: "Learning", type: "textarea",span:2 },
      { name: "certificateAvailability", label: "Certificate Availability", type: "textarea" ,span:2},
      { name: "description", label: "Description", type: "textarea",span:2 },
    ],
  },
];

const FreelanceForm = () => {
  const location = useLocation();
  const editData = location.state?.editData;
  const organizerName = useOrganizerDisplayName();
  const navigate =useNavigate()
  const {setTitle}=useTitle()
  useEffect(()=>{
    setTitle("Projects Form")
  },[])

const handleSubmit = async (_, payload) => {
  try {
    const res = await createFreelance(payload); // JSON payload
    
    if (res?.success) {
      toast.success("Freelance saved successfully");
      navigate(-1)
    } else {
      toast.error(res?.message || "Failed to save freelance");
    }
  } catch (error) {
    console.error("Error:", error);

    toast.error(
      error?.response?.data?.message || "Server error. Please try again"
    );
  }
};

  return (
    <FormLayout
      config={freelanceFormConfig}
      editData={editData}
      onSubmit={handleSubmit}
      staticOverrides={{ companyName: organizerName }}
      dateFields={["jobStartDate", "jobEndDate", "applicationDeadline"]}
    />
  );
};

export default FreelanceForm;