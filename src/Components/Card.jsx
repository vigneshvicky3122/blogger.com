import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { url } from "../App";
import axios from "axios";
import moment from "moment";
function Card({ Search, isDate }) {
  const navigate = useNavigate();
  const [Post, setPost] = useState([]);
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
      <div className="container mt-5">
        <h3 className="m-3 fw-bold">
          {isDate === ""
            ? "Recently Posted"
            : moment(isDate).format("MMMM") == "invalid"
            ? "Recently Posted"
            : `Sorting ${moment(isDate).format("MMMM")} Month Blogs`}
        </h3>
        <div className="row row-cols-1 row-cols-md-3 g-4 m-5">
          {Post &&
            Post.filter((fill) => {
              if (isDate !== "") {
                return (
                  moment(fill.CreatedAt).month() + 1 ===
                  moment(isDate).month() + 1
                );
              } else {
                return true;
              }
            })
              .filter((key) => {
                if (Search !== "") {
                  return key.Keywords.toLowerCase().includes(
                    Search.toLowerCase()
                  );
                } else {
                  return true;
                }
              })
              .map((items, index) => (
                <div className="col" key={index}>
                  <div className="card h-100">
                    <img
                      src={items.Image}
                      className="card-img-top img-thumbnail"
                      alt="Blog-img"
                      onClick={() => navigate(`/blog/${items._id}`)}
                    />
                    <div className="card-body">
                      <h5 className="card-title">{items.Tittle}</h5>
                      <p className="card-text para-overflow">{items.Content}</p>
                    </div>
                    <div className="d-flex flex-row ms-2 mb-3">
                      <a
                        href={`/blog/category/${items.Category}`}
                        className="nav-link text-primary border border-primary fw-semibold fs-6 py-0 px-2 rounded-4"
                      >
                        {items.Category}
                      </a>
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

export default Card;
