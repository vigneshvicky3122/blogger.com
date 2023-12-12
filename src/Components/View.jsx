import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { url } from "../App";
import axios from "axios";
import Navbar from "./Navbar";
import moment from "moment";
function View() {
  const params = useParams();
  const navigate = useNavigate();
  const [AddComment, setAddComment] = useState("");
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
  async function DeletePost(id) {
    try {
      let request = await axios.delete(`${url}/delete-post/${id}`, {
        headers: {
          Authorization: window.localStorage.getItem("app-token"),
        },
      });

      if (request.data.statusCode === 200) {
        window.history.back();
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
  async function CommentsOnPost(event) {
    event.preventDefault();
    let data = {
      text: AddComment,
      commentedBy: window.localStorage.getItem("username"),
      createdAt: Date.now(),
    };
    let update = [...Post];
    update[0].Comments.push(data);
    setPost(update);
    try {
      let request = await axios.post(
        `${`${url}/comments`}/${params.id}`,
        data,
        {
          headers: {
            authorization: window.localStorage.getItem("app-token"),
          },
        }
      );

      if (request.data.statusCode === 200) {
        console.log(request.data.message);
      }
      if (request.data.statusCode === 404) {
        console.log(request.data.message);
      }
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
  async function Liked() {
    let data = { likedBy: window.localStorage.getItem("username") };

    let update = [...Post];
    update[0].Likes.push(data.likedBy);
    setPost(update);

    try {
      let request = await axios.put(`${`${url}/like`}/${params.id}`, data, {
        headers: {
          authorization: window.localStorage.getItem("app-token"),
        },
      });

      if (request.data.statusCode === 200) {
        console.log(request.data.message);
      }
      if (request.data.statusCode === 401) {
        console.log(request.data.message);
      }
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

  async function unLiked() {
    let data = { likedBy: window.localStorage.getItem("username") };

    let update = [...Post];
    let index = Post[0].Likes.indexOf(data.likedBy);
    update[0].Likes.splice(index, 1);
    setPost(update);

    try {
      let request = await axios.put(`${`${url}/unLike`}/${params.id}`, data, {
        headers: {
          authorization: window.localStorage.getItem("app-token"),
        },
      });

      if (request.data.statusCode === 200) {
        console.log(request.data.message);
      }
      if (request.data.statusCode === 401) {
        console.log(request.data.message);
      }
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
        {Post &&
          Post.map((item, index) => (
            <div className="d-flex flex-column gap-5 my-5 mx-5 " key={index}>
              <div className="d-flex justify-content-end">
                {window.localStorage.getItem("username") ===
                item.Author.username ? (
                  <div className="d-flex flex-row gap-3">
                    <button
                      className="btn btn-danger"
                      onClick={() => DeletePost(item._id)}
                    >
                      Delete&nbsp;
                      <i className="bi bi-trash"></i>
                    </button>
                    <a
                      href={`/edit/blog/${params.id}`}
                      className="btn btn-secondary"
                    >
                      Edit&nbsp;<i className="bi bi-pencil-fill"></i>
                    </a>
                  </div>
                ) : null}
              </div>
              <div className="">
                <h1 className="fw-bold fs-1 text-start">{item.Tittle}</h1>
              </div>
              <div className="mx-auto">
                <img
                  src={item.Image}
                  className="img-fluid"
                  alt="blog-img"
                ></img>
              </div>
              <div className="d-flex flex-row justify-content-between">
                <div className="d-flex flex-row align-items-center gap-5">
                  <a href={`/user/${item.Author.username}`}>
                    <img
                      src={item.Author.profilePic}
                      className="rounded-circle"
                      alt="user-profile"
                      width={"70px"}
                      height={"70px"}
                    />
                  </a>
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

                <div className="d-flex flex-row align-items-center gap-5 mt-3">
                  <div className="d-flex gap-3 fw-bold fs-4">
                    {item.Likes.includes(
                      window.localStorage.getItem("username")
                    ) ? (
                      <i
                        className="bi bi-hand-thumbs-up-fill text-success"
                        onClick={() => unLiked()}
                      ></i>
                    ) : (
                      <i
                        className="bi bi-hand-thumbs-up"
                        onClick={() => Liked()}
                      ></i>
                    )}
                    <p>{item.Likes.length}</p>
                  </div>
                  <div className="d-flex gap-3 fw-bold fs-5">
                    <a href="#comments" className="nav-link fw-semibold fs-5">
                      <i className="bi bi-chat-square-text"></i>
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
                      className="border-primary border fs-6 py-0 px-2 rounded-4 text-primary"
                      key={index}
                    >
                      {key}
                    </p>
                  ))
                ) : (
                  <p className="border-primary border fs-6 py-0 px-2 rounded-4 text-primary">
                    {item.Keywords}
                  </p>
                )}
              </div>
            </div>
          ))}

        <div className="container">
          <h3 className="m-3 fw-bold">Recently Post</h3>
          <div className="row row-cols-1 row-cols-md-3 g-4 m-5">
            {Post &&
              Post.map((items, index) => (
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
                      <a
                        href={`/blog/category/${items.Category}`}
                        className="nav-link text-primary border border-primary fw-semibold fs-6 py-0 px-2 rounded-4"
                      >
                        {items.Category}
                      </a>
                    </div>
                    <div className="d-flex flex-row align-items-center gap-2 p-2">
                      <img
                        src={items.Author.profilePic}
                        className="rounded-circle"
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
        <div className="container">
          <h3 className="m-3 fw-bold">Recently Post</h3>
          <div className="row row-cols-1 row-cols-md-3 g-4 m-5">
            {Post &&
              Post.map((items, index) => (
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
                      <a
                        href={`/blog/category/${items.Category}`}
                        className="nav-link text-primary border border-primary fw-semibold fs-6 py-0 px-2 rounded-4"
                      >
                        {items.Category}
                      </a>
                    </div>
                    <div className="d-flex flex-row align-items-center gap-2 p-2">
                      <img
                        src={items.Author.profilePic}
                        className="rounded-circle"
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
        <div className="container" id="comments">
          <div className="d-flex flex-row gap-2 mb-5">
            <div
              className="d-flex flex-column w-75 bg-light p-4"
              style={{ overflowY: "scroll", height: "50vh" }}
            >
              {Post &&
                Post.map((item) =>
                  item.Comments?.map((elem, index) => (
                    <div
                      className="d-flex flex-row align-items-center gap-5 ps-3"
                      key={index}
                    >
                      <div className="d-flex flex-column">
                        <a
                          href={`/user/${elem.commentedBy}`}
                          className="nav-link fw-semibold fs-6"
                        >
                          {elem.commentedBy}
                        </a>

                        <p className="text-secondary">
                          {moment(elem.createdAt).fromNow()}
                        </p>
                      </div>
                      <div className="d-flex">
                        <p className="fw-semibold fs-6">{elem.text}</p>
                      </div>
                    </div>
                  ))
                )}
            </div>

            <div className="d-flex flex-column w-25 ">
              <form onSubmit={CommentsOnPost}>
                <div className="mb-1">
                  <label for="Comment-box" className="form-label fw-bold fs-5">
                    Leave Comments
                  </label>
                  <textarea
                    className="form-control"
                    id="Comment-box"
                    rows="3"
                    onChange={(event) => setAddComment(event.target.value)}
                  ></textarea>
                </div>
                <div className="">
                  <button
                    type="submit"
                    className="btn btn-primary btn-sm px-2 rounded-4 py-0"
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
