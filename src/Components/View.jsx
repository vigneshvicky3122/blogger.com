import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { url } from "../App";
import axios from "axios";
import Navbar from "./Navbar";
import moment from "moment";
function View() {
  const params = useParams();

  const navigate = useNavigate();
  async function CommentPost(event) {
    event.preventDefault();
  }
  const [Post, setPost] = useState([]);
  useEffect(() => {
    getData();
  }, []);
  async function getData() {
    try {
      let request = await axios.get(`${url}/post/${params.id}`, {
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
        {Post &&
          Post.map((item, index) => (
            <div className="d-flex flex-column  gap-5 my-5 mx-5 " key={index}>
              <div className="">
                <h1 className="fw-bold fs-1 text-start">{item.Tittle}</h1>
              </div>
              <div className="mx-auto">
                <img src={item.Image} class="img-fluid" alt="blog-img"></img>
              </div>
              <div className="d-flex flex-row justify-content-between">
                <div className="d-flex flex-row align-items-center gap-5">
                  <img
                    src={item.Author.profilePic}
                    class="rounded-circle"
                    alt="user-profile"
                    width={"70px"}
                    height={"70px"}
                  />
                  <div className="d-flex flex-column gap-2 mt-3">
                    <a
                      href={`/user/${item.Author.username}`}
                      className="nav-link fw-semibold fs-5"
                    >
                      {item.Author.username}
                    </a>
                    <p className="text-secondary">
                      {moment(item.CreatedAt).fromNow()}
                    </p>
                  </div>
                </div>
                <div>
                  {window.localStorage.getItem("username") ===
                  item.Author.username ? (
                    <div className="mt-3">
                      <a
                        href={`/edit/blog/${params.id}`}
                        class="nav-link justify-content-center py-0 px-3 rounded-4 d-flex flex-column align-items-center mt-4"
                      >
                        <i class="bi bi-pencil-fill"></i>
                        <p className="fw-semibold">Edit</p>
                      </a>
                    </div>
                  ) : null}
                </div>
                <div className="d-flex flex-row align-items-center gap-5 mt-3">
                  <div className="d-flex gap-3 fw-bold fs-5">
                    <i class="bi bi-hand-thumbs-up"></i>
                    <p>{item.Likes.length}</p>
                  </div>
                  <div className="d-flex gap-3 fw-bold fs-5">
                    <a href="#comments" className="nav-link fw-semibold fs-5">
                      <i class="bi bi-chat-square-text"></i>
                    </a>
                    <p>{item.Comments.length}</p>
                  </div>
                </div>
              </div>
              <div className="">
                <p className="text-justify fw-normal fs-5">{item.Content}</p>
              </div>
              <div className="d-flex flex-row gap-2">
                {item.Keywords.split(",").length > 1 ? (
                  item.Keywords.split(",").map((key, index) => (
                    <p
                      class="border-primary border fs-6 py-0 px-2 rounded-4 text-primary"
                      key={index}
                    >
                      {key}
                    </p>
                  ))
                ) : (
                  <p class="border-primary border fs-6 py-0 px-2 rounded-4 text-primary">
                    {item.Keywords}
                  </p>
                )}
              </div>
            </div>
          ))}

        <div class="container">
          <h3 class="m-3 fw-bold">Recently Post</h3>
          <div class="row row-cols-1 row-cols-md-3 g-4 m-5">
            {Post &&
              Post.map((items, index) => (
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
        <div class="container">
          <h3 class="m-3 fw-bold">Recommended Post</h3>
          <div class="row row-cols-1 row-cols-md-3 g-4 m-5">
            {Post &&
              Post.map((items, index) => (
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
        <div className="container" id="comments">
          <div className="d-flex flex-row gap-2 mb-5">
            <div className="d-block flex-column h-0 w-75 overflow-y-scroll bg-light">
              {Post.map((item) =>
                item.Comments?.map((elem, index) => (
                  <div
                    class="d-flex flex-row align-items-start gap-3 p-4"
                    key={index}
                  >
                    <div class="d-flex flex-column">
                      <a
                        href={`/user/${elem.username}`}
                        className="nav-link fw-semibold fs-6"
                      >
                        {elem.username}
                      </a>

                      <p className="text-secondary">
                        {moment(elem.createdAt).fromNow()}
                      </p>
                    </div>
                    <div class="d-flex">
                      <p className="fw-semibold fs-6">{elem.text}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="d-flex flex-column w-25 ">
              <form onSubmit={CommentPost}>
                <div class="mb-1">
                  <label for="Comment-box" class="form-label fw-bold fs-5">
                    Leave Comments
                  </label>
                  <textarea
                    class="form-control"
                    id="Comment-box"
                    rows="3"
                  ></textarea>
                </div>
                <div class="">
                  <button
                    type="submit"
                    class="btn btn-primary btn-sm px-2 rounded-4 py-0"
                  >
                    Post
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default View;
