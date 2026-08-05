import API from "../utils/api";
export const apiGetcompanyDashboard = async () => {
  try {
    const res = await API.get("/company/dashboard");
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

export const apiGetAllCompanies = async () => {
  try {
    const res = await API.get("/company/all");
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
