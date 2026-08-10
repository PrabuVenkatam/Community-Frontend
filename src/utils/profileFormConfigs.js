
export const companyFormConfig = [
  {
    title: 'Basic Details',
    type: 'static',
    fields: [
      { label: 'Company Name', type: 'text' },
      { label: 'Company Type', type: 'select', options: [ 'Startup', 'MNC', 'Agency', 'Product Company'] },
      { label: 'Company Tag Line', type: 'text' },
      { label: 'Company Culture Tags (Multi Select)', type: 'select', options: [ 'Remote Friendly', 'Fast Paced', 'Inclusive', 'Learning Focused'] },
      { label: 'Year Founded', type: 'date', required: false },
      { label: 'Website Link', type: 'text', required: false },
      { label: 'Company Logo', type: 'file' },
    ],
  },
  {
    title: 'Contact Information',
    type: 'static',
    fields: [
      { label: 'Contact Person Name', type: 'text' },
      { label: 'Phone Number', type: 'tel' },
      { label: 'Mail Id', type: 'email' },
      { label: 'Address', type: 'text' },
      { label: 'City', type: 'text' },
      { label: 'State', type: 'text' },
      { label: 'Pincode', type: 'text' },
    ],
  },
  {
    title: 'Technologies We Use',
    type: 'dynamic',
    key: 'technologies',
    dynamicStyle: 'grid-6',
    initialRows: 6,
    fields: [{ label: 'Technology', type: 'text', colSpan: 'md:col-span-11' }],
  },
  {
    title: 'What We Do',
    type: 'dynamic',
    key: 'what_we_do',
    dynamicStyle: 'grid-6',
    initialRows: 6,
    fields: [{ label: 'What We Do', type: 'text', colSpan: 'md:col-span-11' }],
  },
  {
    title: 'Learning Benefits',
    type: 'dynamic',
    key: 'learning_benefits',
    dynamicStyle: 'grid-6',
    initialRows: 6,
    fields: [{ label: 'Learning Benefit', type: 'text', colSpan: 'md:col-span-11' }],
  },
  {
    title: 'Learning Outcomes',
    type: 'dynamic',
    key: 'learning_outcomes',
    dynamicStyle: 'grid-6',
    initialRows: 6,
    fields: [{ label: 'Learning Outcome', type: 'text', colSpan: 'md:col-span-11' }],
  },
  {
    title: 'About Us & Certificate Availability',
    type: 'static',
    fields: [
      { label: 'About Us', type: 'textarea', span: 2 },
      { label: 'Certificate Availability', type: 'textarea', span: 2 },
    ],
  },
];

export const collegeFormConfig = [
  {
    title: 'Basic Details',
    type: 'static',
    fields: [
      { label: 'College Name', type: 'text' },
      { label: 'College Type', type: 'select', options: ['Select Option', 'Government', 'Private', 'Autonomous'] },
      { label: 'Established Year', type: 'date', required: false },
      { label: 'Affiliated University', type: 'text', required: false },
      { label: 'Total Departments', type: 'number', required: false },
      { label: 'College Logo', type: 'file' },
    ],
  },
  {
    title: 'Contact Information',
    type: 'static',
    fields: [
      { label: 'Contact Person Name', type: 'text' },
      { label: 'Phone Number', type: 'text' },
      { label: 'Mail Id', type: 'text' },
      { label: 'Address', type: 'text' },
      { label: 'City', type: 'text' },
      { label: 'State', type: 'text' },
      { label: 'Pincode', type: 'text' },
    ],
  },
  {
    title: 'Departments',
    type: 'dynamic',
    key: 'departments',
    dynamicStyle: 'grid-6',
    initialRows: 6,
    fields: [{ label: 'Department', type: 'text', colSpan: 'md:col-span-11' }],
  },
  {
    title: 'Academic Details',
    type: 'static',
    fields: [
      { label: 'Courses Available', type: 'checkbox', options: ['UG', 'PG', 'Diploma'] },
      { label: 'Placement Available', type: 'radio', options: ['Yes', 'No'], required: false },
      { label: 'Total Students', type: 'number' },
    ],
  },
  {
    title: 'About Us',
    type: 'static',
    fields: [{ label: 'About Us', type: 'textarea', span: 2 }],
  },
];




export const competitionFormConfig = [
  {
    title: 'Basic Details',
    type: 'static',
    fields: [
      { label: 'Event Name', type: 'text' },
      { label: 'Organizer', type: 'text' },
      { label: 'Mode', type: 'select', options: ['Online', 'Offline'] },
      { label: 'Event Date', type: 'date' },
      { label: 'Registration Type', type: 'radio', options: ['Free', 'Paid'] },
      { label: 'Registration Start Date', type: 'date' },
      { label: 'Registration End Date', type: 'date' },
      { label: 'Total Seats', type: 'number' },
      { label: 'Cover Image', type: 'file' },
    ],
  },
  {
    title: 'Round Details',
    type: 'dynamic',
    key: 'rounds',
    dynamicStyle: 'row-action',
    initialRows: 2,
    fields: [
      { label: 'Round Number', type: 'text' },
      { label: 'Round Name', type: 'text' },
      { label: 'Round Description', type: 'text' },
    ],
  },
  {
    title: 'Event Schedule',
    type: 'dynamic',
    key: 'schedule',
    dynamicStyle: 'row-action',
    initialRows: 2,
    fields: [
      { label: 'Name', type: 'text' },
      { label: 'Start Time', type: 'time' },
      { label: 'End Time', type: 'time' },
    ],
  },
  {
    title: 'Fees Details',
    type: 'static',
    fields: [
      { label: 'Individual Fees', type: 'number' },
      { label: 'Team Fees', type: 'number' },
      { label: 'Late Fees', type: 'number' },
    ],
  },
  {
    title: 'Opportunity',
    type: 'static',
    fields: [
      { label: 'Internship Opportunity', type: 'radio', options: ['Yes', 'No'] },
      { label: 'Placement Opportunity', type: 'radio', options: ['Yes', 'No'] },
      { label: 'Industry Exposure', type: 'radio', options: ['Yes', 'No'] },
      { label: 'Industry Partners', type: 'radio', options: ['Yes', 'No'] },
    ],
  },
  {
    title: 'Prize Details',
    type: 'static',
    fields: [
      { label: '1st Prize', type: 'text' },
      { label: '2nd Prize', type: 'text' },
      { label: '3rd Prize', type: 'text' },
      { label: 'Participation Prize', type: 'text', required: false },
    ],
  },
  {
    title: 'Venue Details',
    type: 'static',
    fields: [
      { label: 'Venue Name', type: 'text' },
      { label: 'Venue Address', type: 'text' },
      { label: 'Geo location', type: 'text', required: false },
    ],
  },
  {
    title: 'Food Details',
    type: 'static',
    fields: [
      { label: 'Food Provide', type: 'radio', options: ['Yes', 'No'] },
      { label: 'Veg / Non-Veg', type: 'radio', options: ['Veg', 'Non-veg', 'Both'] },
      { label: 'Midnight Snacks', type: 'radio', options: ['Yes', 'No'] },
    ],
  },
  {
    title: 'Accommodation',
    type: 'static',
    fields: [
      { label: 'Accommodation Provide', type: 'radio', options: ['Yes', 'No'] },
      { label: 'Separated for boys & girls', type: 'radio', options: ['Yes', 'No'] },
      { label: 'Only For Outstation Participants', type: 'radio', options: ['Yes', 'No'] },
    ],
  },
  {
    title: 'Event Incharge Details',
    type: 'dynamic',
    key: 'incharges',
    dynamicStyle: 'row-action',
    initialRows: 2,
    fields: [
      { label: 'Type', type: 'select', options: ['Select option', 'Organizer', 'Volunteer', 'Staff'] },
      { label: 'Name', type: 'text' },
      { label: 'Phone Number', type: 'text' },
      { label: 'Mail Id', type: 'text' },
    ],
  },
  {
    title: 'Eligibility & Team Details',
    type: 'static',
    fields: [
      { label: 'Eligibility Details', type: 'text' },
      { label: 'Allowed Departments', type: 'select', options: ['Select option', 'CS', 'IT', 'ECE', 'EEE'] },
      { label: 'Team Or Individual Event', type: 'radio', options: ['Team', 'Individual', 'Both'] },
      { label: 'Team Size Minimum', type: 'number' },
      { label: 'Team Size Maximum', type: 'number' },
    ],
  },
  {
    title: 'Rules',
    type: 'static',
    fields: [
      { label: 'Rule Book', type: 'file' },
      { label: 'Additional Rules', type: 'text' },
    ],
  },
  {
    title: 'Event Description',
    type: 'static',
    fields: [
      { label: 'Description', type: 'textarea', span: 2 },
    ],
  },
];






export const eventFormConfig = [
  {
    title: 'Basic Details',
    type: 'static',
    fields: [
      { label: 'Event Type', type: 'radio', options: ['Technical', 'Non Technical'] },
      { label: 'Event Name', type: 'text' },
      { label: 'Organizer', type: 'text' },
      { label: 'Mode', type: 'select', options: ['Online', 'Offline'] },
      { label: 'Event Date', type: 'date' },
      { label: 'Registration Type', type: 'radio', options: ['Free', 'Paid'] },
      { label: 'Registration Start Date', type: 'date' },
      { label: 'Registration End Date', type: 'date' },
      { label: 'Total Seats', type: 'number' },
      { label: 'Cover Image', type: 'file', span: 2 },
    ],
  },
  {
    title: 'Round Details',
    type: 'dynamic',
    key: 'rounds',
    fields: [
      { label: 'Round Number', type: 'text', colSpan: 'md:col-span-3' },
      { label: 'Round Name', type: 'text', colSpan: 'md:col-span-4' },
      { label: 'Round Description', type: 'text', colSpan: 'md:col-span-4' },
    ],
  },
  {
    title: 'Event Schedule',
    type: 'dynamic',
    key: 'schedule',
    fields: [
      { label: 'Name', type: 'text', colSpan: 'md:col-span-4' },
      { label: 'Start Time', type: 'time', colSpan: 'md:col-span-3' },
      { label: 'End Time', type: 'time', colSpan: 'md:col-span-4' },
    ],
  },
  {
    title: 'Fees Details',
    type: 'static',
    fields: [
      { label: 'Individual Fees', type: 'number' },
      { label: 'Team Fees', type: 'number' },
      { label: 'Late Fees', type: 'number' },
    ],
  },
  {
    title: 'Prize Details',
    type: 'static',
    fields: [
      { label: '1st Prize', type: 'text' },
      { label: '2nd Prize', type: 'text' },
      { label: '3rd Prize', type: 'text' },
      { label: 'Participation Prize', type: 'text', required: false },
    ],
  },
  {
    title: 'Opportunity',
    type: 'static',
    fields: [
      { label: 'Internship Opportunity', type: 'radio', options: ['Yes', 'No'] },
      { label: 'Placement Opportunity', type: 'radio', options: ['Yes', 'No'] },
      { label: 'Industry Exposure', type: 'radio', options: ['Yes', 'No'] },
      { label: 'Industry Partners', type: 'radio', options: ['Yes', 'No'] },
    ],
  },
  {
    title: 'Venue Details',
    type: 'static',
    fields: [
      { label: 'Venue Name', type: 'text' },
      { label: 'Venue Address', type: 'text' },
      { label: 'Geo location', type: 'text', required: false },
    ],
  },
  {
    title: 'Food Details',
    type: 'static',
    fields: [
      { label: 'Food Provide', type: 'radio', options: ['Yes', 'No'] },
      { label: 'Veg / Non-Veg', type: 'radio', options: ['Veg', 'Non-veg', 'Both'] },
      { label: 'Midnight Snacks', type: 'radio', options: ['Yes', 'No'] },
    ],
  },
  {
    title: 'Accommodation',
    type: 'static',
    fields: [
      { label: 'Accommodation Provide', type: 'radio', options: ['Yes', 'No'] },
      { label: 'Separated for boys & girls', type: 'radio', options: ['Yes', 'No'] },
      { label: 'Only For Outstation Participants', type: 'radio', options: ['Yes', 'No'] },
    ],
  },
  {
    title: 'Event Incharge Details',
    type: 'dynamic',
    key: 'incharges',
    fields: [
      { label: 'Type', type: 'select', options: ['Organizer', 'Volunteer', 'Staff'], colSpan: 'md:col-span-3' },
      { label: 'Name', type: 'text', colSpan: 'md:col-span-3' },
      { label: 'Phone Number', type: 'text', colSpan: 'md:col-span-2' },
      { label: 'Mail Id', type: 'text', colSpan: 'md:col-span-3' },
    ],
  },
  {
    title: 'Eligibility & Team Details',
    type: 'static',
    fields: [
      { label: 'Eligibility Details', type: 'text' },
      { label: 'Allowed Departments', type: 'select', options: ['CS', 'IT', 'ECE', 'EEE'] },
      { label: 'Team Or Individual Event', type: 'radio', options: ['Team', 'Individual', 'Both'] },
      { label: 'Team Size Minimum', type: 'number' },
      { label: 'Team Size Maximum', type: 'number' },
    ],
  },
];



export const seminarFormConfig = [
  {
    title: 'Basic Details',
    type: 'static',
    fields: [
      { label: 'Event Type', type: 'radio', options: ['Technical', 'Non Technical'] },
      { label: 'Event Name', type: 'text' },
      { label: 'Organizer', type: 'text' },
      { label: 'Mode', type: 'select', options: ['Online', 'Offline'] },
      { label: 'Event Date', type: 'date' },
      { label: 'Registration Type', type: 'radio', options: ['Free', 'Paid'] },
      { label: 'Registration Start Date', type: 'date' },
      { label: 'Registration End Date', type: 'date' },
      { label: 'Total Seats', type: 'number' },
      { label: 'Cover Image', type: 'file', span: 2 },
    ],
  },
  {
    title: 'Round Details',
    type: 'dynamic',
    key: 'rounds',
    fields: [
      { label: 'Round Number', type: 'text', colSpan: 'md:col-span-3' },
      { label: 'Round Name', type: 'text', colSpan: 'md:col-span-4' },
      { label: 'Round Description', type: 'text', colSpan: 'md:col-span-4' },
    ],
  },
  {
    title: 'Event Schedule',
    type: 'dynamic',
    key: 'schedule',
    fields: [
      { label: 'Name', type: 'text', colSpan: 'md:col-span-4' },
      { label: 'Start Time', type: 'time', colSpan: 'md:col-span-3' },
      { label: 'End Time', type: 'time', colSpan: 'md:col-span-4' },
    ],
  },
  {
    title: 'Fees Details',
    type: 'static',
    fields: [
      { label: 'Individual Fees', type: 'number' },
      { label: 'Team Fees', type: 'number' },
      { label: 'Late Fees', type: 'number' },
    ],
  },
  {
    title: 'Prize Details',
    type: 'static',
    fields: [
      { label: '1st Prize', type: 'text' },
      { label: '2nd Prize', type: 'text' },
      { label: '3rd Prize', type: 'text' },
      { label: 'Participation Prize', type: 'text', required: false },
    ],
  },
  {
    title: 'Opportunity',
    type: 'static',
    fields: [
      { label: 'Internship Opportunity', type: 'radio', options: ['Yes', 'No'] },
      { label: 'Placement Opportunity', type: 'radio', options: ['Yes', 'No'] },
      { label: 'Industry Exposure', type: 'radio', options: ['Yes', 'No'] },
      { label: 'Industry Partners', type: 'radio', options: ['Yes', 'No'] },
    ],
  },
  {
    title: 'Venue Details',
    type: 'static',
    fields: [
      { label: 'Venue Name', type: 'text' },
      { label: 'Venue Address', type: 'text' },
      { label: 'Geo location', type: 'text', required: false },
    ],
  },
  {
    title: 'Food Details',
    type: 'static',
    fields: [
      { label: 'Food Provide', type: 'radio', options: ['Yes', 'No'] },
      { label: 'Veg / Non-Veg', type: 'radio', options: ['Veg', 'Non-veg', 'Both'] },
      { label: 'Midnight Snacks', type: 'radio', options: ['Yes', 'No'] },
    ],
  },
  {
    title: 'Accommodation',
    type: 'static',
    fields: [
      { label: 'Accommodation Provide', type: 'radio', options: ['Yes', 'No'] },
      { label: 'Separated for boys & girls', type: 'radio', options: ['Yes', 'No'] },
      { label: 'Only For Outstation Participants', type: 'radio', options: ['Yes', 'No'] },
    ],
  },
  {
    title: 'Event Incharge Details',
    type: 'dynamic',
    key: 'incharges',
    fields: [
      { label: 'Type', type: 'select', options: ['Organizer', 'Volunteer', 'Staff'], colSpan: 'md:col-span-3' },
      { label: 'Name', type: 'text', colSpan: 'md:col-span-3' },
      { label: 'Phone Number', type: 'text', colSpan: 'md:col-span-2' },
      { label: 'Mail Id', type: 'text', colSpan: 'md:col-span-3' },
    ],
  },
  {
    title: 'Eligibility & Team Details',
    type: 'static',
    fields: [
      { label: 'Eligibility Details', type: 'text' },
      { label: 'Allowed Departments', type: 'select', options: ['CS', 'IT', 'ECE', 'EEE'] },
      { label: 'Team Or Individual Event', type: 'radio', options: ['Team', 'Individual', 'Both'] },
      { label: 'Team Size Minimum', type: 'number' },
      { label: 'Team Size Maximum', type: 'number' },
    ],
  },
];



export const internshipFormConfig = [
  {
    title: 'Basic Details',
    type: 'static',
    fields: [
      { label: 'Internship Type', type: 'radio', options: ['Paid', 'Unpaid'] },
      { label: 'Job Title', type: 'text' },
      { label: 'Company Name', type: 'select', options: ['Select Option', 'Company A', 'Company B', 'Company C'] },
      { label: 'Location', type: 'text' },
      { label: 'Mode', type: 'select', options: ['Online', 'Offline', 'Hybrid'] },
      { label: 'Total Openings', type: 'number' },
      { label: 'Duration', type: 'select', options: ['No Fixed Duration', '1 Month', '3 Months', '6 Months'] },
      { label: 'Intern Start Date', type: 'date' },
      { label: 'Application Deadline', type: 'date' },
      { label: 'Salary', type: 'number' },
    ],
  },
  {
    title: 'Responsibilities',
    type: 'dynamic',
    key: 'responsibilities',
    dynamicStyle: 'grid-6',
    initialRows: 6,
    fields: [{ label: 'Responsibility', type: 'text', colSpan: 'md:col-span-11' }],
  },
  {
    title: 'Eligibility Criteria',
    type: 'dynamic',
    key: 'eligibility',
    dynamicStyle: 'grid-6',
    initialRows: 6,
    fields: [{ label: 'Eligibility Criteria', type: 'text', colSpan: 'md:col-span-11' }],
  },
  {
    title: 'Project Description',
    type: 'static',
    fields: [{ label: 'Description', type: 'textarea', span: 2 }],
  },
];

export const jobFormConfig = [
  {
    title: 'Basic Details',
    type: 'static',
    fields: [
      { label: 'Job Type', type: 'radio', options: ['Full Time', 'Part Time', 'Contract'] },
      { label: 'Job Title', type: 'text' },
      { label: 'Company Name', type: 'select', options: ['Select Option', 'Company A', 'Company B', 'Company C'] },
      { label: 'Location', type: 'text' },
      { label: 'Mode', type: 'select', options: ['Online', 'Offline', 'Hybrid'] },
      { label: 'Total Openings', type: 'number' },
      { label: 'Duration', type: 'select', options: ['No Fixed Duration', '1 Year', '2 Years', 'Permanent'] },
      { label: 'Job Start Date', type: 'date' },
      { label: 'Application Deadline', type: 'date' },
      { label: 'Salary', type: 'number' },
    ],
  },
  {
    title: 'Responsibilities',
    type: 'dynamic',
    key: 'responsibilities',
    dynamicStyle: 'grid-6',
    initialRows: 6,
    fields: [{ label: 'Responsibility', type: 'text', colSpan: 'md:col-span-11' }],
  },
  {
    title: 'Eligibility Criteria',
    type: 'dynamic',
    key: 'eligibility',
    dynamicStyle: 'grid-6',
    initialRows: 6,
    fields: [{ label: 'Eligibility Criteria', type: 'text', colSpan: 'md:col-span-11' }],
  },
  {
    title: 'Project Description',
    type: 'static',
    fields: [{ label: 'Description', type: 'textarea', span: 2 }],
  },
];



export const freelanceFormConfig = [
  {
    title: 'Basic Details',
    type: 'static',
    fields: [
      { label: 'Job Title', type: 'text' },
      { label: 'Mode', type: 'select', options: ['Online', 'Offline', 'Hybrid'] },
      { label: 'Total Openings', type: 'number' },
      { label: 'Duration', type: 'select', options: ['No Fixed Duration', '1 Month', '3 Months', '6 Months'] },
      { label: 'Total Openings', type: 'number' },
      { label: 'Application Deadline', type: 'date' },
      { label: 'Job Start Date', type: 'date' },
      { label: 'Salary', type: 'number' },
    ],
  },
  {
    title: 'Project Needs',
    type: 'dynamic',
    key: 'project_needs',
    dynamicStyle: 'grid-6',
    initialRows: 6,
    fields: [{ label: 'Project Needs', type: 'text', colSpan: 'md:col-span-11' }],
  },
  {
    title: 'Eligibility',
    type: 'dynamic',
    key: 'eligibility',
    dynamicStyle: 'grid-6',
    initialRows: 6,
    fields: [{ label: 'Eligibility Criteria', type: 'text', colSpan: 'md:col-span-11' }],
  },
  {
    title: 'Security',
    type: 'dynamic',
    key: 'security',
    dynamicStyle: 'grid-6',
    initialRows: 6,
    fields: [{ label: 'Security', type: 'text', colSpan: 'md:col-span-11' }],
  },
  {
    title: 'Reference Website',
    type: 'dynamic',
    key: 'reference_website',
    dynamicStyle: 'grid-6',
    initialRows: 6,
    fields: [{ label: 'Reference', type: 'text', colSpan: 'md:col-span-11' }],
  },
  {
    title: 'Benefits & Jobs Description',
    type: 'static',
    fields: [
      { label: 'Learning', type: 'textarea' },
      { label: 'Certificate Availability', type: 'textarea' },
      { label: 'Description', type: 'textarea' },
    ],
  },
];


export const conferenceFormConfig = [
  {
    title: 'Basic Details',
    type: 'static',
    fields: [
      { label: 'Event Type', type: 'radio', options: ['Technical', 'Non Technical'] },
      { label: 'Event Name', type: 'text' },
      { label: 'Organizer', type: 'text' },
      { label: 'Mode', type: 'select', options: ['Online', 'Offline'] },
      { label: 'Event Date', type: 'date' },
      { label: 'Registration Type', type: 'radio', options: ['Free', 'Paid'] },
      { label: 'Registration Start Date', type: 'date' },
      { label: 'Registration End Date', type: 'date' },
      { label: 'Total Seats', type: 'number' },
      { label: 'Cover Image', type: 'file', span: 2 },
    ],
  },
  {
    title: 'Round Details',
    type: 'dynamic',
    key: 'rounds',
    fields: [
      { label: 'Round Number', type: 'text', colSpan: 'md:col-span-3' },
      { label: 'Round Name', type: 'text', colSpan: 'md:col-span-4' },
      { label: 'Round Description', type: 'text', colSpan: 'md:col-span-4' },
    ],
  },
  {
    title: 'Event Schedule',
    type: 'dynamic',
    key: 'schedule',
    fields: [
      { label: 'Name', type: 'text', colSpan: 'md:col-span-4' },
      { label: 'Start Time', type: 'time', colSpan: 'md:col-span-3' },
      { label: 'End Time', type: 'time', colSpan: 'md:col-span-4' },
    ],
  },
  {
    title: 'Fees Details',
    type: 'static',
    fields: [
      { label: 'Individual Fees', type: 'number' },
      { label: 'Team Fees', type: 'number' },
      { label: 'Late Fees', type: 'number' },
    ],
  },
  {
    title: 'Prize Details',
    type: 'static',
    fields: [
      { label: '1st Prize', type: 'text' },
      { label: '2nd Prize', type: 'text' },
      { label: '3rd Prize', type: 'text' },
      { label: 'Participation Prize', type: 'text', required: false },
    ],
  },
  {
    title: 'Opportunity',
    type: 'static',
    fields: [
      { label: 'Internship Opportunity', type: 'radio', options: ['Yes', 'No'] },
      { label: 'Placement Opportunity', type: 'radio', options: ['Yes', 'No'] },
      { label: 'Industry Exposure', type: 'radio', options: ['Yes', 'No'] },
      { label: 'Industry Partners', type: 'radio', options: ['Yes', 'No'] },
    ],
  },
  {
    title: 'Venue Details',
    type: 'static',
    fields: [
      { label: 'Venue Name', type: 'text' },
      { label: 'Venue Address', type: 'text' },
      { label: 'Geo location', type: 'text', required: false },
    ],
  },
  {
    title: 'Food Details',
    type: 'static',
    fields: [
      { label: 'Food Provide', type: 'radio', options: ['Yes', 'No'] },
      { label: 'Veg / Non-Veg', type: 'radio', options: ['Veg', 'Non-veg', 'Both'] },
      { label: 'Midnight Snacks', type: 'radio', options: ['Yes', 'No'] },
    ],
  },
  {
    title: 'Accommodation',
    type: 'static',
    fields: [
      { label: 'Accommodation Provide', type: 'radio', options: ['Yes', 'No'] },
      { label: 'Separated for boys & girls', type: 'radio', options: ['Yes', 'No'] },
      { label: 'Only For Outstation Participants', type: 'radio', options: ['Yes', 'No'] },
    ],
  },
  {
    title: 'Event Incharge Details',
    type: 'dynamic',
    key: 'incharges',
    fields: [
      { label: 'Type', type: 'select', options: ['Organizer', 'Volunteer', 'Staff'], colSpan: 'md:col-span-3' },
      { label: 'Name', type: 'text', colSpan: 'md:col-span-3' },
      { label: 'Phone Number', type: 'text', colSpan: 'md:col-span-2' },
      { label: 'Mail Id', type: 'text', colSpan: 'md:col-span-3' },
    ],
  },
  {
    title: 'Eligibility & Team Details',
    type: 'static',
    fields: [
      { label: 'Eligibility Details', type: 'text' },
      { label: 'Allowed Departments', type: 'select', options: ['CS', 'IT', 'ECE', 'EEE'] },
      { label: 'Team Or Individual Event', type: 'radio', options: ['Team', 'Individual', 'Both'] },
      { label: 'Team Size Minimum', type: 'number' },
      { label: 'Team Size Maximum', type: 'number' },
    ],
  },
];






export const eventFormVariant = {
  title: 'Event Form',
  descriptionLabel: '',
  formConfig: eventFormConfig,
};

export const competitionFormVariant = {
  title: 'Competition Form',
  descriptionLabel: '',
  formConfig: competitionFormConfig,
};

export const internshipFormVariant = {
  title: 'Internship Form',
  descriptionLabel: '',
  formConfig: internshipFormConfig,
};

export const jobFormVariant = {
  title: 'Job Form',
  descriptionLabel: '',
  formConfig: jobFormConfig,
};

export const seminarFormVariant = {
  title: 'Seminar Form',
  descriptionLabel: '',
  formConfig: seminarFormConfig,
};
export const conferenceFormVariant = {
  title: 'Conference Form',
  descriptionLabel: '',
  formConfig: conferenceFormConfig,
};


export const freelanceFormVariant = {
  title: 'Freelance Form',
  descriptionLabel: '',
  formConfig: freelanceFormConfig,
};

export const companyFormVariant = {
  title: 'Add Company',
  descriptionLabel: '',
  formConfig: companyFormConfig,
};

export const collegeFormVariant = {
  title: 'Add College',
  descriptionLabel: '',
  formConfig: collegeFormConfig,
};

export const formVariants = {
  event: eventFormVariant,
  competition: competitionFormVariant,
  seminar: seminarFormVariant,
  internship: internshipFormVariant,
  job: jobFormVariant,
  freelance: freelanceFormVariant,
  company: companyFormVariant,
  college: collegeFormVariant,
  conference:conferenceFormVariant
};
