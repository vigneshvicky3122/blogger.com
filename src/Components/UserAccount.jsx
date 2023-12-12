import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { url } from "../App";
import axios from "axios";
import Navbar from "./Navbar";
import moment from "moment";
function Account() {
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    getMyData();
  }, []);

  const [PostData, setPostData] = useState([]);
  const [View] = useState(true);
  const [Bio, setBio] = useState("");
  const [Name, setName] = useState("");
  const [Email, setEmail] = useState("");
  const [Username, setUsername] = useState("");
  const [Image, setImage] = useState("");

  async function getMyData() {
    try {
      let request = await axios.get(`${url}/user/${params.username}`, {
        headers: {
          authorization: window.localStorage.getItem("app-token"),
        },
      });
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
  return (
    <>
      <Navbar />
      <div className="container">
        <div class="card m-5">
          <div class="row g-0">
            <div class="col-md-8">
              <div class="d-flex flex-column gap-2 m-5">
                <div class="mb-3">
                  <label for="title" class="form-label fw-semibold">
                    Name
                  </label>
                  <input
                    id="Name"
                    type="text"
                    className="form-control"
                    disabled={View}
                    value={Name}
                  />
                </div>

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
                <div class="mb-3">
                  <label for="Bio" class="form-label fw-semibold">
                    Bio
                  </label>
                  <textarea
                    id="Bio"
                    type="text"
                    className="form-control"
                    disabled={View}
                    value={Bio}
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <div class="col-md-4">
              <img
                src={Image && Image}
                class="img-fluid rounded-start"
                alt="Profile"
              />
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
