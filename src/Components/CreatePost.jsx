import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { url } from "../App";
import axios from "axios";
import Navbar from "./Navbar";

function CreatePost() {
  const List = {
    Technology: [
      "Gadgets",
      "Software",
      "Artificial Intelligence",
      "Internet of Things",
    ],
    Lifestyle: ["Health & Wellness", "Fashion", "Travel", "Food & Cooking"],
    "Business&Finance": [
      "Entrepreneurship",
      "Investing",
      "Personal Finance",
      "Marketing Strategies",
    ],
    Education: [
      "Online Learning",
      "Teaching Tips",
      "Educational Technology",
      "Study Techniques",
    ],
    "Arts&Culture": ["Music", "Literature", "Film & TV", "Visual Arts"],
    Science: ["Biology", "Physics", "Astronomy", "Environmental Science"],
  };
  const [Content, setContent] = useState("");
  const [Tittle, setTittle] = useState("");
  const [Category, setCategory] = useState("");
  const [Keywords, setKeywords] = useState([]);
  const [KeywordData, setKeywordData] = useState([]);
  const [Image, setImage] = useState("");

  const navigate = useNavigate();
  useEffect(() => {
    let arr = [];
    for (const key in List) {
      if (key === Category) {
        arr.push(List[key]);
      }
    }
    if (Category !== "") {
      setKeywordData(arr[0]);
    } else {
      setKeywordData([]);
    }
  }, [Category]);
  function CategoryList() {
    const arr = [];
    for (const key in List) {
      arr.push(key);
    }
    return arr;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData();
    formData.append("Image", Image);
    formData.append("Tittle", Tittle);
    formData.append("Content", Content);
    formData.append("Keywords", Keywords);
    formData.append("Category", Category);
    formData.append("CreatedAt", Date());
    try {
      const request = await axios.post(`${url}/post`, formData, {
        headers: {
          authorization: window.localStorage.getItem("app-token"),
          username: window.localStorage.getItem("username"),
        },
      });

      if (request.data.statusCode === 200) {
        console.log(request.data.message);
        navigate("/home");
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
        <div className="card m-5">
          <div className="row g-0">
            <div className="col-md-8">
              <form
                onSubmit={handleSubmit}
                className="d-flex flex-column gap-2 m-5"
              >
                <div className="mb-3">
                  <label for="fileLoader" className="form-label fw-semibold">
                    Blog Poster
                  </label>
                  <input
                    className="form-control"
                    type="file"
                    id="fileLoader"
                    accept="image/*"
                    required
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

                <div className="mb-3">
                  <label for="title" className="form-label fw-semibold">
                    Tittle
                  </label>
                  <input
                    id="tittle"
                    required
                    type="text"
                    className="form-control"
                    placeholder="Write blog tittle..."
                    onChange={(event) => setTittle(event.target.value)}
                    value={Tittle}
                  />
                </div>

                <div className="mb-3">
                  <label for="category" className="form-label fw-semibold">
                    Category
                  </label>
                  <select
                    id="category"
                    required
                    className="form-select"
                    defaultValue=""
                    onChange={(event) => {
                      setCategory(event.target.value);
                      setKeywords([]);
                    }}
                  >
                    <option value="">Select</option>
                    {CategoryList().map((key, index) => (
                      <option value={key} key={index}>
                        {key}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label for="keywords" className="form-label fw-semibold">
                    Keywords
                  </label>
                  <select
                    id="keyword-select"
                    required
                    className="form-select"
                    defaultValue=""
                    onChange={(event) => {
                      if (!Keywords.includes(event.target.value)) {
                        setKeywords((prev) => [...prev, event.target.value]);
                      }
                    }}
                  >
                    <option value="">
                      {Category ? "select" : "select before Category"}
                    </option>
                    {KeywordData.map((key, index) => (
                      <option value={key} key={index}>
                        {key}
                      </option>
                    ))}
                  </select>
                  <div className="d-flex flex-row mt-2 gap-1">
                    {Keywords.map((key, index) => (
                      <p
                        className="border-primary border fs-6 py-0 px-2 rounded-4 text-primary"
                        key={index}
                      >
                        {key}&nbsp;
                        <i
                          className="bi bi-x fw-bold"
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            let remove = [...Keywords];
                            remove.splice(index, 1);
                            setKeywords(remove);
                          }}
                        ></i>
                      </p>
                    ))}
                  </div>
                </div>
                <div className="mb-3">
                  <label for="keywords" className="form-label fw-semibold">
                    Content of Blog
                  </label>
                  <textarea
                    id="content"
                    required
                    type="text"
                    className="form-control"
                    placeholder="Write the content..."
                    onChange={(event) => setContent(event.target.value)}
                    value={Content}
                    rows={3}
                  />
                </div>

                <div className="mx-auto">
                  <button
                    className="btn btn-warning px-5 fw-semibold"
                    type="submit"
                  >
                    Post &nbsp;<i className="bi bi-cloud-arrow-up-fill"></i>
                  </button>
                </div>
              </form>
            </div>

            <div className="col-md-4">
              <img
                src={Image && Image}
                className="img-fluid rounded-start"
                alt="Poster Image"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreatePost;
