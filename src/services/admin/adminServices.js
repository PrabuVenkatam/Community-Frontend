import API from "../../utils/api";


// create company
export const createCompany = async (payload) => {
  const response = await API.post("/company/create", payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};


// get company
export const getAllCpmpanies = async () => {
  const response = await API.get("/company/all")
  return response.data
}

export const getCompanyNames = async () => {
  const response = await API.get("/company/names");
  return response.data;
};


export const getCompanyById = async (id) => {
  const response = await API.get(`/company/getById/${id}`);
  return response.data;
};

export const getMyCompany = async () => {
  const response = await API.get("/company/get-mine");
  return response.data;
};


export const addCompanyPost = async (id, formData) => {
  const response = await API.post(`/company/add-post/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const setCompanyPassword = async (payload) => {
  const response = await API.post("/company/set-password", payload);
  return response.data;
};

export const toggleCompanyStatus = async (id) => {
  const response = await API.patch(`/company/toggle-status/${id}`);
  return response.data;
};




export const createCollege = async (payload) => {
  const response = await API.post("/college/create", payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const getAllColleges = async () => {
  const response = await API.get("/college/all");
  return response.data;
};

export const getCollegeById = async (id) => {
  try {
    const res = await API.get(`/college/getById/${id}`);
    return res.data;
  } catch (error) {
    throw (
      error.response?.data || {
        status: false,
        message: error.message,
      }
    );
  }
};

export const toggleCollegeStatus = async (id) => {
  const response = await API.patch(`/college/toggle-status/${id}`);
  return response.data;
};

export const setCollegePassword = async (payload) => {
  const response = await API.post("/college/set-password", payload);
  return response.data;
};


export const createEvent = async (payload) => {
  const response = await API.post("/event/create", payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const getAllEvents = async (status = "pending") => {
  const response = await API.get("/event/all", {
    params: { status },
  });
  return response.data;
};


export const getEventById = async (id) => {
  const response = await API.get(`/event/getById/${id}`);
  return response.data;
};

export const toggleEventStatus = async (id) => {
  const response = await API.patch(`/event/toggle-status/${id}`);
  return response.data;
};

export const addEventPost = async (id, formData) => {
  const response = await API.post(`/event/add-posts/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};


export const createCompetition = async (payload) => {
  const response = await API.post("/competition/create", payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const getAllCompetitions = async (status = "pending") => {
  const response = await API.get("/competition/all", {
    params: { status },
  });
  return response.data;
};

export const getCompetitionById = async (id) => {
  const response = await API.get(`/competition/getById/${id}`);
  return response.data;
};

export const toggleCompetitionStatus = async (id) => {
  const response = await API.patch(`/competition/toggle-status/${id}`);
  return response.data;
};

export const addCompetitionPost = async (id, formData) => {
  const response = await API.post(`/competition/add-posts/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};



export const createConference = async (payload) => {
  const response = await API.post("/conference/create", payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const getAllConferences = async (status = "pending") => {
  const response = await API.get("/conference/all", {
    params: { status },
  });
  return response.data;
};

export const getConferenceById = async (id) => {
  const response = await API.get(`/conference/getById/${id}`);
  return response.data;
};

export const toggleConferenceStatus = async (id) => {
  const response = await API.patch(`/conference/toggle-status/${id}`);
  return response.data;
};

export const addConferencePost = async (id, formData) => {
  const response = await API.post(`/conference/add-posts/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};


export const createSeminar = async (payload) => {
  const response = await API.post("/seminar/create", payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const getAllSeminars = async (status = "pending") => {
  const response = await API.get("/seminar/all", {
    params: { status },
  });
  return response.data;
};
export const getSeminarById = async (id) => {
  const response = await API.get(`/seminar/getById/${id}`);
  return response.data;
};

export const toggleSeminarStatus = async (id) => {
  const response = await API.patch(`/seminar/toggle-status/${id}`);
  return response.data;
};

export const addSeminarPost = async (id, formData) => {
  const response = await API.post(`/seminar/add-posts/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};






export const createInternship = async (payload) => {
  const response = await API.post("/internship/create", payload);
  return response.data;
};

export const updateInternship = async (id, data) => {
  const response = await API.put(`/internship/update/${id}`, data);
  return response.data;
};

export const getAllInternships = async (status = "pending") => {
  const response = await API.get("/internship/all", {
    params: { status },
  });
  return response.data;
};


export const getInternshipById = async (id) => {
  const response = await API.get(`/internship/getById/${id}`);
  return response.data;
};

export const toggleInternshipStatus = async (id) => {
  const response = await API.patch(`/internship/toggle-status/${id}`);
  return response.data;
};

export const getAppliedCandidateProfile = async (applicationId) => {
  const response = await API.get(`/internship/candidate-profile/${applicationId}`);
  return response.data;
};

export const updateCandidateApplicationStatus = async (applicationId, status) => {
  const response = await API.patch(`/internship/application-status/${applicationId}`, { status });
  return response.data;
};




export const createFreelance = async (payload) => {
  const response = await API.post("/freelance/create", payload);
  return response.data;
};

export const getAllFreelances = async (status = "pending") => {
  const response = await API.get("/freelance/all", {
    params: { status },
  });
  return response.data;
};

export const getFreelanceById = async (id) => {
  const response = await API.get(`/freelance/getById/${id}`);
  return response.data;
};

export const toggleFreelanceStatus = async (id) => {
  const response = await API.patch(`/freelance/toggle-status/${id}`);
  return response.data;
};




export const apiGetAdminDashboard = async () => {
  try {
    const res = await API.get("/admin/dashboard");
    return res.data;
  } catch (error) {
    throw (
      error.response?.data || {
        status: false,
        message: error.message,
      }
    );
  }
};

export const updateEventStatus = async (event_id, eventType, status, rejected_reason = null) => {
  try {
    const res = await API.patch("/admin/event/status", {
      event_id,
      eventType,
      status,
      ...(rejected_reason && { rejected_reason }),
    });
    return res.data;
  } catch (error) {
    throw (
      error.response?.data || {
        status: false,
        message: error.message,
      }
    );
  }
};

export const updateJobStatus = async (job_id, jobType, status, rejected_reason = null) => {
  try {
    const res = await API.patch("/admin/job/status", {
      job_id,
      jobType,
      status,
      ...(rejected_reason && { rejected_reason }),
    });
    return res.data;
  } catch (error) {
    throw (
      error.response?.data || {
        status: false,
        message: error.message,
      }
    );
  }
};

export const getSelectedCandidates = async (jobId) => {
  try {
    const res = await API.get(`/internship/selected-candidates/${jobId}`);
    return res.data;
  } catch (error) {
    throw (
      error.response?.data || {
        status: false,
        message: error.message,
      }
    );
  }
};

export const savePerformanceEvaluation = async (payload) => {
  try {
    const res = await API.post("/internship/performance-evaluation", payload);
    return res.data;
  } catch (error) {
    throw (
      error.response?.data || {
        status: false,
        message: error.message,
      }
    );
  }
};

export const getPerformanceEvaluation = async (applicationId) => {
  try {
    const res = await API.get(`/internship/performance-evaluation/${applicationId}`);
    return res.data;
  } catch (error) {
    throw (
      error.response?.data || {
        status: false,
        message: error.message,
      }
    );
  }
};

export const saveAttendance = async (jobId, payload) => {
  try {
    const res = await API.post(`/internship/attendance/${jobId}`, payload);
    return res.data;
  } catch (error) {
    throw (
      error.response?.data || {
        status: false,
        message: error.message,
      }
    );
  }
};

// Attendance History
export const getAttendanceHistory = async (jobId) => {
  try {
    const res = await API.get(`/internship/attendance-history/${jobId}`);
    return res.data;
  } catch (error) {
    throw (
      error.response?.data || {
        status: false,
        message: error.message,
      }
    );
  }
};

// Date wise attendance
export const getAttendanceDetails = async (jobId, date) => {
  try {
    const res = await API.get(`/internship/attendance-details/${jobId}?date=${encodeURIComponent(date)}`);
    return res.data;
  } catch (error) {
    throw (
      error.response?.data || {
        status: false,
        message: error.message,
      }
    );
  }
};

// Generate certificate
export const generateCertificate = async (payload) => {
  try {
    const res = await API.post("/certificates/generate", payload);
    return res.data;
  } catch (error) {
    throw (
      error.response?.data || {
        status: false,
        message: error.message,
      }
    );
  }
};

// Get all registered users
export const getAllRegisteredUsers = async () => {
  try {
    const res = await API.get("/users/all-registered");
    return res.data;
  } catch (error) {
    throw (
      error.response?.data || {
        status: false,
        message: error.message,
      }
    );
  }
};

// Get active subscriptions
export const getActiveSubscriptions = async () => {
  try {
    const res = await API.get("/subscriptions/active-users");
    return res.data;
  } catch (error) {
    throw (
      error.response?.data || {
        status: false,
        message: error.message,
      }
    );
  }
};
