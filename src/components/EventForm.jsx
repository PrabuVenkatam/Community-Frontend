

import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createEvent } from "../services/admin/adminServices";
import FormLayout from "../layout/FormLayout";
import { useOrganizerDisplayName } from "../utils/organizer";
import { useTitle } from "../context/AdminTitle";
import { useEffect } from "react";


const eventFormConfig = [
  {
    title: "Basic Details",
    type: "static",
    fields: [
      { name: "eventType", label: "Event Type", type: "radio", options: ["Technical", "Non Technical"] },
      {
        name: "eventCategory",
        label: "Event Category",
        type: "select",
        options: [
          "Technical",
          "Non-Technical",
          "Workshop",
          "Hackathon",
          "Conference",
          "Seminar",
          "Webinar",
          "Guest Lecture",
          "Symposium",
          "Cultural",
          "Sports",
        ],
      },
      { name: "eventName", label: "Event Name", type: "text" },
      { name: "organizer", label: "Organizer", type: "text" },
      { name: "mode", label: "Mode", type: "select", options: ["Online", "Offline"] },
      { name: "eventDate", label: "Event Date", type: "date" },
      { name: "eventStartTime", label: "Event Start Time", type: "time" },
      { name: "registrationType", label: "Registration Type", type: "radio", options: ["Free", "Paid"] },
      { name: "registrationStartDate", label: "Registration Start Date", type: "date" },
      { name: "registrationEndDate", label: "Registration End Date", type: "date" },
      { name: "totalSeats", label: "Total Seats", type: "number" },
      { name: "coverImage", label: "Cover Image", type: "file",},
    ],
  },
  {
    title: "Round Details",
    type: "dynamic",
    key: "rounds",
    fields: [
      { name: "roundNumber", label: "Round Number", type: "text", colSpan: "md:col-span-3" },
      { name: "roundName", label: "Round Name", type: "text", colSpan: "md:col-span-4" },
      { name: "roundDescription", label: "Round Description", type: "text", colSpan: "md:col-span-4" },
    ],
  },
  {
    title: "Event Schedule",
    type: "dynamic",
    key: "schedule",
    fields: [
      { name: "name", label: "Name", type: "text", colSpan: "md:col-span-4" },
      { name: "startTime", label: "Start Time", type: "time", colSpan: "md:col-span-3" },
      { name: "endTime", label: "End Time", type: "time", colSpan: "md:col-span-4" },
    ],
  },
  // {
  //   title: "Fees Details",
  //   type: "static",
  //    showWhen: { field: "registrationType", value: "Paid" },
  //   fields: [
  //     { name: "individualFees", label: "Individual Fees", type: "number" },
  //     { name: "teamFees", label: "Team Fees", type: "number" },
  //     { name: "lateFees", label: "Late Fees", type: "number" },
  //   ],
  // },
  {
    title: "Prize Details",
    type: "static",
    fields: [
      { name: "firstPrize", label: "1st Prize", type: "text" },
      { name: "secondPrize", label: "2nd Prize", type: "text" },
      { name: "thirdPrize", label: "3rd Prize", type: "text" },
      { name: "participationPrize", label: "Participation Prize", type: "text", required: false },
    ],
  },
  {
    title: "Opportunity",
    type: "static",
    fields: [
      { name: "internshipOpportunity", label: "Internship Opportunity", type: "radio", options: ["Yes", "No"] },
      { name: "placementOpportunity", label: "Placement Opportunity", type: "radio", options: ["Yes", "No"] },
      { name: "industryExposure", label: "Industry Exposure", type: "radio", options: ["Yes", "No"] },
      { name: "industryPartners", label: "Industry Partners", type: "radio", options: ["Yes", "No"] },
    ],
  },
  {
    title: "Venue Details",
    type: "static",
    showWhen: { field: "mode", value: "Offline" },
    fields: [
      { name: "venueName", label: "Venue Name", type: "text" },
      { name: "address", label: "Address", type: "text" },
      { name: "city", label: "City", type: "text" },
      { name: "state", label: "State", type: "text" },
      { name: "pincode", label: "Pincode", type: "text", sanitize: "noExtraNum"},
      { name: "geoLocation", label: "Geo location", type: "text", required: false },
    ],
  },
  {
    title: "Food Details",
    type: "static",
    showWhen: { field: "mode", value: "Offline" },
    fields: [
      { name: "foodProvide", label: "Food Provide", type: "radio", options: ["Yes", "No"] },
      {  showWhen: { field: "foodProvide", value: "Yes" } ,name: "vegNonVeg", label: "Veg / Non-Veg", type: "radio", options: ["Veg", "Non-veg", "Both"] },
      { showWhen: { field: "foodProvide", value: "Yes" },name: "midnightSnacks", label: "Midnight Snacks", type: "radio", options: ["Yes", "No"] },
    ],
  },
  {
    title: "Accommodation",
    type: "static",
    showWhen: { field: "mode", value: "Offline" },
    fields: [
      { name: "accommodationProvide", label: "Accommodation Provide", type: "radio", options: ["Yes", "No"] },
      { showWhen: { field: "accommodationProvide", value: "Yes" },name: "separatedForBoysGirls", label: "Separated for boys & girls", type: "radio", options: ["Yes", "No"] },
      { showWhen: { field: "accommodationProvide", value: "Yes" },name: "onlyForOutstationParticipants", label: "Only For Outstation Participants", type: "radio", options: ["Yes", "No"] },
    ],
  },
  {
    title: "Event Incharge Details",
    type: "dynamic",
    key: "incharges",
    dynamicStyle: "row-action",
    fields: [
      { name: "type", label: "Type", type: "select", options: ["Organizer", "Volunteer", "Staff"], colSpan: "md:col-span-3" },
      { name: "name", label: "Name", type: "text", colSpan: "md:col-span-3" },
      { name: "phoneNumber", label: "Phone Number", type: "tel", colSpan: "md:col-span-2" },
      { name: "mailId", label: "Mail Id", type: "text", colSpan: "md:col-span-3" },
    ],
  },

  
  {
    title: "Eligibility & Team Details",
    type: "static",
    fields: [
      { name: "eligibilityDetails", label: "Eligibility Details", type: "text" },
             { name: "allowedDepartments", label: "Allowed Departments",  type: "multiselect", options: [ "CS", "IT", "ECE", "EEE"] },
      { name: "teamOrIndividualEvent", label: "Team Or Individual Event", type: "radio", options: ["Team", "Individual", "Both"] },
      { 
  name: "teamSizeMinimum", 
  label: "Team Size Minimum", 
  type: "number",
  showWhen: { field: "teamOrIndividualEvent", value: ["Team", "Both"] }  // ← array of values
},
{ 
  name: "teamSizeMaximum", 
  label: "Team Size Maximum", 
  type: "number",
  showWhen: { field: "teamOrIndividualEvent", value: ["Team", "Both"] }  // ← array of values
},
    ],
  },
  {
    title: "Fees Details",
    type: "static",
    showWhen: { field: "registrationType", value: "Paid" },
    fields: [
      { name: "individualFees", label: "Individual Fees", type: "number" },
      { showWhen: { field: "teamOrIndividualEvent", value: ["Team", "Both"] }, name: "teamFees", label: "Team Fees", type: "number" },
      { name: "lateFees", label: "Late Fees", type: "number" },
    ],
  },
  {
    title: "Event Description",
    type: "static",
    fields: [
      { name: "description", label: "Description", type: "textarea", span: 2 },
      { name: "certificateAvailability", label: "Certificate Availability", type: "textarea", span: 2  },
    ],
  },
];

const EventForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const editData = location.state?.editData;


    const {setTitle}=useTitle()
    useEffect(()=>{
  setTitle("Event Form")
    },[])
const handleSubmit = async (formData) => {
  try {
    const res = await createEvent(formData);

    if (res?.success) {
      toast.success(
        editData
          ? "Event updated successfully"
          : "Event saved successfully"
      );


        navigate(-1);

    } else {
      toast.error(res?.message || "Failed to save event");
    }
  } catch (error) {
    console.error("Error:", error);

    toast.error(
      error?.response?.data?.message || "Server error. Please try again"
    );
  }
};
  const organizerName = useOrganizerDisplayName();
  return (
    <FormLayout
      config={eventFormConfig}
      editData={editData}
      onSubmit={handleSubmit}
       staticOverrides={{organizer : organizerName }}
      dateFields={["eventDate", "registrationStartDate", "registrationEndDate"]}
    />
  );
};

export default EventForm;