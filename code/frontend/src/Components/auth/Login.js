import axios from "axios";
import { useState, useRef } from "react";

const Login = () => {
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("signup"); 
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [otpMessage, setOtpMessage] = useState("");

  // Refs for OTP inputs to manage focus
  const otpRefs = useRef([]);

  const handleImage = (e) => setImage(e.target.files[0]);

  const registerForm = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formProps = Object.fromEntries(formData.entries());
    console.log(formProps);
    // formData.append("image", image);

    try {
      // Adjust the URL as needed
      const res = await axios.post(`http://localhost:4000/register`, formData);
      console.log(res);
      setMessage(`Registered Successfully, please login`);
      setActiveTab("login"); // Switch to login tab after successful registration
    } catch (error) {
      console.log(error);
      setMessage(error?.response?.data?.message || "Registration failed");
    }
  };

  const signIn = async (e) => {
    e.preventDefault();
    setMessage("");
    setOtpMessage("");
    try {
      const formData = new FormData(e.target);
      const formProps = Object.fromEntries(formData.entries());
      console.log(formProps);
      const res = await axios.post(`http://localhost:4000/login`, formProps);
      console.log(res);
      sessionStorage.setItem("user", JSON.stringify(res.data.User));
      setShowOtp(true);
    } catch (error) {
      console.log(error);
      setMessage(error?.response?.data?.message || "Login failed");
    }
  };

  const handleOtpChange = (index, value) => {
    if (/^\d*$/.test(value)) { // Ensure only digits are entered
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move focus to next input if current input is filled
      if (value && index < otp.length - 1) {
        otpRefs.current[index + 1].focus();
      }
    }
  };

  const user = JSON.parse(sessionStorage.getItem('user'));

  const verifyOtp = async () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length < 4) {
      setOtpMessage("Please enter all four digits of the OTP.");
      return;
    }

    try {
      // Adjust the URL and payload as per your backend API
      const res = await axios.post(`http://localhost:4000/verify-otp`, {
        email: user.email,
        otp: enteredOtp,
        // You might need to send additional data like user ID or token
      });
      console.log(res);
      setOtpMessage("OTP Verified Successfully!");
      // Redirect or perform further actions after successful OTP verification
      // For example, navigate to the dashboard:
      // window.location.href = "/dashboard";
      // Or update the UI accordingly
      window.location.reload()
      setShowOtp(false);
      // Optionally, you can reset the forms or states here
    } catch (error) {
      console.log(error);
      setOtpMessage(error?.response?.data?.message || "OTP Verification failed");
    }
  };

  return (
    <div className="container">
      <div className="tabs">
        <button
          className={activeTab === "signup" ? "active" : ""}
          onClick={() => setActiveTab("signup")}
        >
          Sign Up
        </button>
        <button
          className={activeTab === "login" ? "active" : ""}
          onClick={() => setActiveTab("login")}
        >
          Sign In
        </button>
      </div>

      {!showOtp ? (
        <div className="forms">
          {activeTab === "signup" && (
            <div className="signup">
              <form onSubmit={registerForm}>
                <p className="message">{message}</p>
                <input
                  type="text"
                  name="full_name"
                  placeholder="Full Name"
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                />
                <input
                  type="file"
                  name="image"
                  placeholder="Photo"
                  onChange={handleImage}
                  required
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  required
                />
                <button type="submit">Sign Up</button>
              </form>
            </div>
          )}

          {activeTab === "login" && (
            <div className="login">
              <form onSubmit={signIn}>
                <p className="message">{message}</p>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  required
                />
                <button type="submit">Login</button>
              </form>
            </div>
          )}
        </div>
      ) : (
        <div className="otp-section">
          <div className="otp-container">
            <h2>Enter OTP</h2>
            <div className="otp-inputs">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  value={digit}
                  ref={(el) => (otpRefs.current[index] = el)}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                />
              ))}
            </div>
            <button onClick={verifyOtp}>Verify OTP</button>
            <p className={`otp-message ${otpMessage.includes("Successfully") ? "success" : "error"}`}>
              {otpMessage}
            </p>
          </div>
        </div>
      )}

      <style>{`
        * {
          box-sizing: border-box;
        }
        body {
          margin: 0;
          padding: 0;
          font-family: "Jost", sans-serif;
          background: linear-gradient(to bottom, #0f0c29, #302b63, #24243e);
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .container {
          width: 400px;
          background: #fff;
          border-radius: 10px;
          box-shadow: 0 5px 25px rgba(0, 0, 0, 0.3);
          overflow: hidden;
          padding: 20px;
        }
        .tabs {
          display: flex;
          justify-content: space-around;
          margin-bottom: 20px;
        }
        .tabs button {
          flex: 1;
          padding: 10px;
          background: #f1f1f1;
          border: none;
          cursor: pointer;
          transition: background 0.3s;
          font-size: 16px;
        }
        .tabs button.active {
          background: #573b8a;
          color: #fff;
        }
        .tabs button:not(:last-child) {
          border-right: 1px solid #ccc;
        }
        .forms .signup,
        .forms .login {
          display: block;
        }
        .forms form {
          display: flex;
          flex-direction: column;
        }
        .forms input[type="text"],
        .forms input[type="email"],
        .forms input[type="password"],
        .forms input[type="file"] {
          padding: 10px;
          margin: 10px 0;
          border: 1px solid #ccc;
          border-radius: 5px;
        }
        .forms button {
          padding: 10px;
          background: #573b8a;
          color: #fff;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: background 0.3s;
          font-size: 16px;
          margin-top: 10px;
        }
        .forms button:hover {
          background: #6d44b8;
        }
        .message {
          text-align: center;
          color: red;
          margin-bottom: 10px;
        }
        .otp-section {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
        }
        .otp-container {
          width: 100%;
          background: #f9f9f9;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          text-align: center;
        }
        .otp-container h2 {
          margin-bottom: 20px;
          color: #333;
        }
        .otp-inputs {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin-bottom: 20px;
        }
        .otp-inputs input {
          width: 50px;
          height: 50px;
          text-align: center;
          font-size: 24px;
          border: 2px solid #ccc;
          border-radius: 5px;
        }
        .otp-container button {
          padding: 10px 20px;
          background: #4CAF50;
          color: #fff;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: background 0.3s;
          font-size: 16px;
        }
        .otp-container button:hover {
          background: #45a049;
        }
        .otp-message {
          margin-top: 15px;
          font-size: 14px;
        }
        .otp-message.success {
          color: green;
        }
        .otp-message.error {
          color: red;
        }
        @media (max-width: 500px) {
          .container {
            width: 90%;
          }
          .otp-inputs input {
            width: 40px;
            height: 40px;
            font-size: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;
