import API from "../../utils/api";

// Get influencer dashboard details and referred users
export const getInfluencerDashboard = async () => {
  try {
    const res = await API.get("/influencer/dashboard");
    return res.data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: error.message,
      }
    );
  }
};

// Get influencer full referral list (privacy protected)
export const getInfluencerReferrals = async () => {
  try {
    const res = await API.get("/influencer/referrals");
    return res.data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: error.message,
      }
    );
  }
};

// Get influencer profile details
export const getInfluencerProfile = async () => {
  try {
    const res = await API.get("/influencer/profile");
    return res.data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: error.message,
      }
    );
  }
};

// Get influencer subscribed referred users list
export const getInfluencerSubscribedUsers = async () => {
  try {
    const res = await API.get("/influencer/subscribed-users");
    return res.data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: error.message,
      }
    );
  }
};
