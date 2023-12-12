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
      <Navbar />
      <div className="container">
        <h3 className="m-3 mt-5 fw-bold">{params.id}</h3>
        <div className="row row-cols-1 row-cols-md-3 g-4 m-5">
          {Post &&
            Post.filter((fill) =>
              fill.Category.toLowerCase().includes(params.id.toLowerCase())
            ).map((items, index) => (
              <div className="col" key={index}>
                <div className="card h-100">
                  <a href={`/blog/${items._id}`}>
                    <img
                      src={items.Image}
                      className="card-img-top img-thumbnail"
                      alt="Blog-img"
                    />
                  </a>
                  <div className="card-body">
                    <h5 className="card-title">{items.Tittle}</h5>
                    <p className="card-text para-overflow">{items.Content}</p>
                  </div>
                  <div className="d-flex flex-row ms-2 mb-3">
                    <p className="text-primary border border-primary fw-semibold fs-6 py-0 px-2 rounded-4">
                      {items.Category}
                    </p>
                  </div>
                  <div className="d-flex flex-row align-items-center gap-2 p-2">
                    <a href={`/user/${items.Author.username}`}>
                      <img
                        src={items.Author.profilePic}
                        className="rounded-circle"
                        alt="user-profile"
                        width={"25px"}
                        height={"25px"}
                      />
                    </a>
                    <a
                      href={`/user/${items.Author.username}`}
                      className="nav-link fw-semibold"
                    >
                      {items.Author.username}
                    </a>
                  </div>
                  <div className="card-footer">
                    <small className="text-body-secondary">
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
