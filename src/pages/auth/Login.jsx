import React, { useState } from 'react';
import { IoCallOutline, IoLockClosedOutline } from 'react-icons/io5'; // Using Ionicons
import { assets } from '../../assets/assets';
import { useMain } from '../../context/MainContext';
import AuthBase from '../../layout/AuthBase';
import { loginUser } from '../../services/auth/authServices';
import { toast } from 'react-toastify';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const InputField = ({ label, id, type, placeholder, icon: Icon, ...props }) => (
  <div className="space-y-2">
    <label htmlFor={id} className="text-sm text-gray-300 font-light">
      {label}
    </label>
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
        {Icon && <Icon size={20} />}
      </div>
      <input
        id={id}
        type={type}
        placeholder={placeholder}

        className="w-full rounded-[14px] border border-white/20 bg-black/10 backdrop-blur-[68px] py-3 pl-12 pr-4 text-white placeholder-gray-500 transition focus:border-[#0091D5] focus:outline-none backdrop-blur-md"
        {...props}
      />
    </div>
  </div>
);
const PasswordField = ({ label, id, placeholder, ...props }) => {
  const [show, setShow] = useState(false);

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm text-gray-300 font-light">
        {label}
      </label>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
          <IoLockClosedOutline size={20} />
        </div>
        <input
          id={id}
          type={show ? 'text' : 'password'}
          placeholder={placeholder}
          className="w-full rounded-[14px] border border-white/20 bg-black/10 backdrop-blur-[68px] py-3 pl-12 pr-12 text-white placeholder-gray-500 transition focus:border-[#0091D5] focus:outline-none backdrop-blur-md"
          {...props}
        />
        {/* ✅ Eye toggle button */}
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-white transition-colors"
        >
          {show ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
    </div>
  );
};


const Login = () => {
  const { login, fetchCurrentUser } = useMain();
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false)


  const handleLogin = async (e) => {
    setLoading(true)
    e.preventDefault();
    try {
      const res = await login({
        phone: mobileNumber.trim(),
        password,
      });
      console.log(res)
      if (res?.status) {
        let role = res?.data.user.role
        if (role === "admin" || role === "college" || role === "")
          toast.success(res?.message || "Login successfully")
        await fetchCurrentUser()
      }
      else {
        toast.error(res.message || "Login Failed")
      }

    } catch (error) {
      toast.error(error.message || "Login Failed")
      console.error("Login failed", error);
    }
    finally {
      setLoading(false)
    }
  };



  return (
    <AuthBase maxWidth='max-w-[450px]'>

      <form
        onSubmit={handleLogin}
        className="w-full  space-y-8"
      >
        <div className="text-center">
          {/* Static Logo from public folder */}
          <img
            src={assets.gradEnvyLogo}
            alt="Nulinz Logo"
            className="mx-auto h-14 w-auto mb-1"
          />
          <h1 className="text-[28px] font-bold text-white tracking-tight">Login</h1>
        </div>

        <div className="space-y-5">
          <InputField
            label="Enter your Mobile Number"
            id="mobileNumber"
            type="tel"
            placeholder="Enter Mobile Number"
            maxLength={10}
            icon={IoCallOutline}
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            required
          />

          <PasswordField
            label="Enter your Password"
            id="password"

            placeholder="********"
            // icon={IoLockClosedOutline}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="space-y-5">
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center rounded-[15px] bg-[#171717] py-3.5 text-base font-bold text-white shadow-lg transition-all hover:bg-[#171717] hover:shadow-[#171717]/20 active:scale-[0.99]"
          >
            {loading ? <Loader2 className='animate-spin' /> : "Login"}
          </button>
          <div className="flex items-center justify-between text-[13px]">
            <span className="text-gray-400">Did you forget your password?</span>
            <Link to="/auth/forgot-password" className="font-semibold text-white underline underline-offset-4 hover:text-[#171717] transition-colors">
              Forgot Password
            </Link>
          </div>
        </div>
      </form>
    </AuthBase>

  );
};

export default Login;
