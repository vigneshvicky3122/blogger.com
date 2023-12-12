import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { url } from "../App";
import axios from "axios";
import Navbar from "./Navbar";
import moment from "moment";
function Account() {
  const navigate = useNavigate();

  useEffect(() => {
    getMyData();
  }, []);

  const [PostData, setPostData] = useState([]);
  const [View, setView] = useState(true);
  const [Bio, setBio] = useState("");
  const [Name, setName] = useState("");
  const [Email, setEmail] = useState("");
  const [Username, setUsername] = useState("");
  const [Image, setImage] = useState("");

  async function getMyData() {
    try {
      let request = await axios.get(
        `${`${url}/myData`}/${window.localStorage.getItem("username")}`,
        {
          headers: {
            authorization: window.localStorage.getItem("app-token"),
          },
        }
      );
      setName(request.data.user[0].name);
      setUsername(request.data.user[0].username);
      setEmail(request.data.user[0].email);
      setBio(request.data.user[0].bio);
      setImage(request.data.user[0].profile);
      setPostData(request.data.post);

      if (request.data.statusCode === 400) {
        console.log(request.data.message);
        navigate("/accounts/login");
      }
      if (request.data.statusCode === 500) {
        console.log(request.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  }
  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData();
    formData.append("Image", Image);
    formData.append("Name", Name);
    formData.append("Bio", Bio);
    try {
      const request = await axios.put(
        `${url}/edit/profile/${window.localStorage.getItem("username")}`,
        formData,
        {
          headers: {
            authorization: window.localStorage.getItem("app-token"),
          },
        }
      );

      if (request.data.statusCode === 200) {
        getMyData();
        setView(true);
      }
      if (request.data.statusCode === 404) {
        console.log(request.data.message);
      }
      if (request.data.statusCode === 400) {
        console.log(request.data.message);
        navigate("/login");
      }
      if (request.data.statusCode === 500) {
        console.log(request.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <>
      <Navbar />
      <div className="container">
        <div class="card m-5">
          <div class="row g-0">
            <div class="col-md-8">
              <form
                onSubmit={handleSubmit}
                class="d-flex flex-column gap-2 m-5"
              >
                {!View ? (
                  <div class="mb-3">
                    <label for="fileLoader" class="form-label fw-semibold">
                      Profile
                    </label>
                    <input
                      className="form-control"
                      type="file"
                      id="fileLoader"
                      accept="image/*"
                      onChange={(e) => {
                        let file = e.target.files[0];
                        const reader = new FileReader();
                        reader.addEventListener("load", (event) => {
                          setImage(event.target.result);
                        });
                        reader.readAsDataURL(file);
                      }}
                    />
                  </div>
                ) : null}

                <div class="mb-3">
                  <label for="title" class="form-label fw-semibold">
                    Name
                  </label>
                  <input
                    id="Name"
                    type="text"
                    className="form-control"
                    disabled={View}
                    onChange={(event) => setName(event.target.value)}
                    value={Name}
                  />
                </div>

                {View ? (
                  <>
                    <div class="mb-3">
                      <label for="Email" class="form-label fw-semibold">
                        Email address
                      </label>
                      <input
                        id="Email"
                        type="text"
                        className="form-control"
                        disabled={View}
                        value={Email}
                      />
                    </div>
                    <div class="mb-3">
                      <label for="Username" class="form-label fw-semibold">
                        Username
                      </label>

                      <input
                        id="Username"
                        type="text"
                        className="form-control"
                        disabled={View}
                        value={Username}
                      />
                    </div>
                  </>
                ) : null}
                <div class="mb-3">
                  <label for="Bio" class="form-label fw-semibold">
                    Bio
                  </label>
                  <textarea
                    id="Bio"
                    type="text"
                    className="form-control"
                    disabled={View}
                    onChange={(event) => setBio(event.target.value)}
                    value={Bio}
                    rows={3}
                  />
                </div>

                <div class="mx-auto d-flex flex-row gap-3">
                  {View ? (
                    <button
                      className="btn btn-secondary px-5 fw-semibold"
                      type="button"
                      onClick={() => setView(false)}
                    >
                      Edit &nbsp;<i class="bi bi-pencil-fill"></i>
                    </button>
                  ) : (
                    <>
                      <button
                        className="btn btn-primary px-5 fw-semibold"
                        type="button"
                        onClick={() => setView(true)}
                      >
                        Cancel
                      </button>
                      <button
                        className="btn btn-warning px-5 fw-semibold"
                        type="submit"
                      >
                        Update &nbsp;<i class="bi bi-cloud-arrow-up-fill"></i>
                      </button>
                    </>
                  )}
                </div>
              </form>
            </div>

            <div class="col-md-4">
              <img
                src={Image && Image}
                class="img-fluid rounded-start"
                alt="Profile"
              />
              <div className="mt-5">
                <h5>Post : {PostData.length}</h5>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="container">
        <h3 class="m-3 fw-bold">Recently Post</h3>
        <div class="row row-cols-1 row-cols-md-3 g-4 m-5">
          {PostData &&
            PostData.map((items, index) => (
              <div
                class="col"
                key={index}
                onClick={() => navigate(`/blog/${items._id}`)}
              >
                <div class="card h-100">
                  <img
                    src={items.Image}
                    class="card-img-top img-thumbnail"
                    alt="Blog-img"
                  />
                  <div class="card-body">
                    <h5 class="card-title">{items.Tittle}</h5>
                    <p class="card-text para-overflow">{items.Content}</p>
                  </div>
                  <div class="card-footer">
                    <small class="text-body-secondary">
                      {moment(items.CreatedAt).fromNow()}
                    </small>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}
export default Account;
