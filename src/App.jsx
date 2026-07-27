import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminLayout from "./layout/admin/AdminLayout";
import { MainProvider, useMain } from "./context/MainContext";
import MainLayout from "./layout/MainLayout";
import CollegeLayout from "./layout/college/CollegeLayout";
import CompanyLayout from "./layout/company/CompanyLayout";
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ChangePassword from "./pages/auth/CreatePassword";
import HomeLayout from "./layout/HomeLayout";
import Company from "./pages/admin/companyPages/Company";
import Competition from "./pages/admin/events/Competition";
import Conference from "./pages/admin/events/Conference";
import Event from "./pages/admin/events/Event";
import Seminar from "./pages/admin/events/Seminar";
import ProfileForm from "./common/ProfileForm";
import Profile from "./common/Profile";
import JobsProfile from "./common/JobsProfile";
import Internship from "./pages/admin/jobsPages/Internship";
import Freelance from "./pages/admin/jobsPages/Freelance";
import College from "./pages/admin/colegePages/College";
import CollegeProfile from "./pages/admin/colegePages/CollegeProfile";
import CompanyProfile from "./pages/admin/companyPages/CompanyProfile";
import ScrollHandler from "./components/ScrollHandler";
import Dashboard from "./pages/admin/Dashboard";
import CompanyForm from "./components/CompanyForm";
import CollegeForm from "./components/CollegeForm";
import CompetitionForm from "./components/CompetitionForm";
import EventForm from "./components/EventForm";
import SeminarForm from "./components/SeminarForm";
import ConferenceForm from "./components/ConferenceForm";
import FreelanceForm from "./components/FreelanceForm";
import InternshipForm from "./components/InternshipForm";
import CompetitionProfile from "./components/CompetitionProfile";
import SeminarProfile from "./components/SeminarProfile";
import ConferenceProfile from "./components/ConferenceProfile";
import EventProfile from "./components/EventProfile";
import FreelanceProfile from "./components/FreelanceProfile";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import CompanyDashboard from "./pages/admin/companyPages/CompanyDashboard";
import CollegeDashboard from "./pages/admin/colegePages/CollegeDashboard";
import ScrollToTop from "./common/ScrollTop";
import MobileJobRedirect from "./pages/MobileJobReferel";
import MobileEventRedirect from "./pages/MobileEventRedirect";

const App = () => {
   const {fetchCurrentUser,isHomeLoading} =useMain()

  useEffect(() => {
    fetchCurrentUser();
  }, []);
  if(isHomeLoading){
    return <div className="flex flex-col items-center justify-center min-h-screen gap-3">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            <p className="text-secondary font-medium mt-2">Loading </p>
          </div>
  }
  return (

      <BrowserRouter>
      <ScrollToTop/>

        <ScrollHandler />
        <Routes>

          {/* Root redirect */}
          <Route path="/" element={<Navigate to="/auth/login" replace />} />
          <Route path="/job" element={<MobileJobRedirect />} />
          <Route path="/event" element={<MobileEventRedirect />} />
          {/* Auth routes */}
          <Route element={<MainLayout />}>
            <Route path="/auth" element={<HomeLayout />}>
              <Route index element={<Navigate to="login" replace />} />
              <Route path="login" element={<Login />} />
              <Route path="forgot-password" element={<ForgotPassword />} />
              <Route path="change-password" element={<ChangePassword />} />
            </Route>
          </Route>
            <Route element={<MainLayout />}>
            <Route path="/admin" element={
     
                <AdminLayout />
          
              }>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="company" element={<Company module="admin" />} />
              <Route path="company-form" element={<CompanyForm module="admin" />} />
              <Route path="company-profile/:id" element={<CompanyProfile module="admin" />} />
              <Route path="conference-profile/:id" element={<ConferenceProfile />} />
              <Route path="college" element={<College />} />
              <Route path="college-form" element={<CollegeForm />} />
              <Route path="profile" element={<CompanyProfile module="company" />} />
              <Route path="college-profile/:id" element={<CollegeProfile />} />
              <Route path="competition" element={<Competition />} />
              <Route path="competition-form" element={<CompetitionForm />} />
              <Route path="competition-profile/:id" element={<CompetitionProfile />} />
              <Route path="conference" element={<Conference />} />
              <Route path="conference-form" element={<ConferenceForm />} />
              <Route path="events" element={<Event />} />
              <Route path="events-form" element={<EventForm />} />
              <Route path="event-profile/:id" element={<EventProfile />} />
              <Route path="seminar" element={<Seminar />} />
              <Route path="seminar-form" element={<SeminarForm />} />
              <Route path="seminar-profile/:id" element={<SeminarProfile />} />
              <Route path="add-form" element={<ProfileForm />} />
              <Route path="jobs/add-form" element={<ProfileForm />} />
              <Route path="jobs/internship" element={<Internship />} />
              <Route path="jobs/internship-form" element={<InternshipForm />} />
              <Route path="jobs/internship-profile/:id" element={<JobsProfile />} />
              <Route path="jobs/freelance" element={<Freelance />} />
              <Route path="jobs/freelance-form" element={<FreelanceForm />} />
              <Route path="jobs/freelance-profile/:id" element={<FreelanceProfile />} />
            </Route>
      
</Route>
          {/* College routes */}
          <Route  element={<MainLayout />}>
            <Route path="/college" element={<CollegeLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<CollegeDashboard />} />
              <Route path="college" element={<College />} />
              <Route path="college-form" element={<CollegeForm />} />
              <Route path="conference" element={<Conference />} />
              <Route path="conference-profile/:id" element={<ConferenceProfile />} />
              <Route path="conference-form" element={<ConferenceForm />} />
              <Route path="competition" element={<Competition />} />
              <Route path="competition-form" element={<CompetitionForm />} />
              <Route path="competition-profile/:id" element={<CompetitionProfile />} />
              <Route path="events" element={<Event />} />
              <Route path="events-form" element={<EventForm />} />
              <Route path="event-profile/:id" element={<EventProfile />} />
              <Route path="seminar" element={<Seminar />} />
              <Route path="seminar-form" element={<SeminarForm />} />
              <Route path="seminar-profile/:id" element={<SeminarProfile />} />
              <Route path="profile" element={<CollegeProfile />} />
            </Route>
          </Route>

          {/* Company routes */}
          <Route path="/company" element={<MainLayout />}>
            <Route element={<CompanyLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<CompanyDashboard/>} />
              <Route path="company" element={<CompanyProfile module="company" />} />
              <Route path="company-form" element={<CompanyForm module="company" />} />
              <Route path="company-profile/:id" element={<CompanyProfile module="company" />} />
              <Route path="company-profile" element={<CompanyProfile module="company" />} />
              <Route path="jobs/internship" element={<Internship module="company" />} />
              <Route path="jobs/internship-form" element={<InternshipForm />} />
              <Route path="jobs/internship-profile/:id" element={<JobsProfile module="company" />} />
              <Route path="jobs/freelance" element={<Freelance module="company" />} />
              <Route path="jobs/freelance-form" element={<FreelanceForm />} />
              <Route path="jobs/freelance-profile/:id" element={<FreelanceProfile module="company" />} />
            </Route>
          </Route>

        </Routes>

        <ToastContainer
          position="top-center"
          autoClose={2500}
          hideProgressBar={true}
          newestOnTop
        />
      </BrowserRouter>

  );
};

export default App;
