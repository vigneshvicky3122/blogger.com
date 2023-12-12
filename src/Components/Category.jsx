import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { url } from "../App";
import axios from "axios";
import moment from "moment";
import Navbar from "./Navbar";

function Category() {
  const navigate = useNavigate();
  const [Post, setPost] = useState([]);
  const params = useParams();
  useEffect(() => {
    getData();
  }, []);
  async function getData() {
    try {
      let request = await axios.get(`${url}/post`, {
        headers: {
          Authorization: window.localStorage.getItem("app-token"),
        },
      });

      if (request.data.statusCode === 200) {
        setPost(request.data.post);
      }
      if (request.data.statusCode === 400) {
        navigate("/login");
      }
      if (request.data.statusCode === 401) {
        console.log(request.data.message);
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
    <Navbar/>
      <div class="container">
        <h3 class="m-3 mt-5 fw-bold">{params.id}</h3>
        <div class="row row-cols-1 row-cols-md-3 g-4 m-5">
          {Post &&
            Post.filter((fill) =>
              fill.Category.toLowerCase().includes(params.id.toLowerCase())
            ).map((items, index) => (
              <div class="col" key={index}>
                <div class="card h-100">
                  <img
                    src={items.Image}
                    class="card-img-top img-thumbnail"
                    alt="Blog-img"
                    onClick={() => navigate(`/blog/${items._id}`)}
                  />
                  <div class="card-body">
                    <h5 class="card-title">{items.Tittle}</h5>
                    <p class="card-text para-overflow">{items.Content}</p>
                  </div>
                  <div className="d-flex flex-row ms-2 mb-3">
                    <p className="text-primary border border-primary fw-semibold fs-6 py-0 px-2 rounded-4">
                      {items.Category}
                    </p>
                  </div>
                  <div className="d-flex flex-row align-items-center gap-2 p-2">
                    <img
                      src={items.Author.profilePic}
                      class="rounded-circle"
                      alt="user-profile"
                      width={"25px"}
                      height={"25px"}
                    />
                    <a
                      href={`/user/${items.Author.username}`}
                      className="nav-link fw-semibold"
                    >
                      {items.Author.username}
                    </a>
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

export default Category;
