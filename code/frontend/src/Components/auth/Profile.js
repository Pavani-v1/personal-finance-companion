import axios from "axios";
import React, { useState } from "react";

const Profile = () => {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const [showUpdate, setShowUpdate] = useState(true);
  const [image, setImage] = useState();
  const updateFunction=async(e) => {
    e.preventDefault();
    
const formData=new FormData(e.target);
try {
  const update = await axios.put(`http://localhost:4000/update/${user._id}`, formData );
  console.log(update);
  sessionStorage.removeItem("user")
  window.location.href="/"
} catch (error) {
  console.error(error);
}
  }
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f7f7f7",
      }}
    >
      {showUpdate ? (
        <div
          style={{
            border: "1px solid",
            padding: "20px",
            margin: "20px",
            borderRadius: "10px",
          }}
        >
          <h2>Profile</h2>
          <img
            src={`http://localhost:4000/Users/${user.image}`}
            alt=""
            style={{
              width: "150px",
              height: "150px",
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
          <p>Full Name: {user.full_name}</p>
          <p>Email: {user.email}</p>
          <p>
            <button
              onClick={() => setShowUpdate(false)}
              style={{
                height: "35px",
                borderRadius: "10px",
                backgroundColor: "#bca2f2",
                color: "white",
                fontSize: "20px",
                borderColor: "blueviolet",
              }}
            >
              Update
            </button>
          </p>
          {/* <p>Phone: {user.phone}</p>
                    <p>Address: {user.address}</p> */}
        </div>
      ) : (
        <div>
          <div>
            <div>
              <h3>Update Profile</h3>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <form onSubmit={updateFunction}>
                  <div style={{ display: "grid", gap: "10px" }}>
                    <input
                      type="text"
                      name="full_name"
                      placeholder="Full name"
                      required=""
                      style={{
                        borderRadius: "5px",
                        height: "2rem",
                        width: "30rem",
                        padding: "5px",
                        borderColor: "blueviolet",
                    }}
                    defaultValue={user?.full_name}
                    />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      required=""
                      style={{
                        borderRadius: "5px",
                        height: "2rem",
                        width: "30rem",
                        padding: "5px",
                        borderColor: "blueviolet",
                      }}
                      defaultValue={user?.email}
                    />
                    <input
                      type="file"
                      name="image"
                      placeholder="photo"
                      required=""
                      style={{
                        borderRadius: "5px",
                        height: "2rem",
                        width: "30rem",
                        padding: "5px",
                        borderColor: "blueviolet",
                      }}
                    />
                    <input
                      type="password"
                      name="password"
                      placeholder="Password"
                      required=""
                      defaultValue={user?.password}
                      style={{
                        borderRadius: "5px",
                        height: "2rem",
                        width: "30rem",
                        padding: "5px",
                        borderColor: "blueviolet",
                      }}
                    />
                    <button
                      style={{
                        height: "35px",
                        borderRadius: "10px",
                        backgroundColor: "#bca2f2",
                        color: "white",
                        fontSize: "20px",
                        borderColor: "blueviolet",
                      }}
                      type="submit"
                    >
                      Update
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <div></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
