import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { url } from "../App";
import axios from "axios";
import { useFormik } from "formik";
import * as yup from "yup";

function SignUp() {
  let navigate = useNavigate();
  const [Messages, setMessages] = useState("");
  const [ActiveResponse, setActiveResponse] = useState(false);
  const [isColor, setColor] = useState("red");
  const [isData, setData] = useState([]);
  const [Disabled, setDisabled] = useState(false);
  useEffect(() => {
    getData();
  }, []);
  async function getData() {
    try {
      let request = await axios.get(`${url}/username`, {});

      if (request.data.statusCode === 200) {
        setData(request.data.user);
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
  let handleSubmit = async (data) => {
    try {
      let rest = await axios.post(`${url}/signup`, data);
      if (rest.data.statusCode === 200) {
        window.alert(rest.data.message);
        navigate("/login");
      }
      if (rest.data.statusCode === 401) {
        window.confirm(rest.data.message);
        navigate("/login");
      }
      if (rest.data.statusCode === 404) {
        window.alert(rest.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      username: "",
      password: "",
    },
    validationSchema: yup.object({
      name: yup.string().required("* Required"),
      username: yup.string().required("* Required"),
      email: yup.string().email("Enter a valid email").required("* Required"),
      password: yup
        .string()
        .max(8, "Min & Max character allowed is 2-8")
        .min(5, "Enter a secure password")
        .required("* Required"),
    }),
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });
  const checkUsername = (params) => {
    console.log(params);
    let arr = [];
    isData.forEach((x) => {
      arr.push(x.username);
    });
    if (arr.includes(params)) {
      setDisabled(true);
      setActiveResponse(true);
      setColor("red");
      setMessages(
        "This username was already exist, Enter the Different Username"
      );
    } else {
      setDisabled(false);
      setActiveResponse(false);
    }
  };

  return (
    <>
      <div className="form">
        <form className="login-form" onSubmit={formik.handleSubmit}>
          <br />
          <h2>REGISTER HERE!</h2>
          <br />
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              className="form-control"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
            />
            {formik.touched.name && formik.errors.name ? (
              <div style={{ color: "red" }}>{formik.errors.name}</div>
            ) : null}
          </div>

          <div className="form-group">
            <label htmlFor="name">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              className="form-control"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
            />
            {formik.touched.email && formik.errors.email ? (
              <div style={{ color: "red" }}>{formik.errors.email}</div>
            ) : null}
          </div>

          <div className="form-group">
            <label htmlFor="name">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              className="form-control"
              onChange={formik.handleChange}
              onBlur={() => checkUsername(formik.values.username)}
              value={formik.values.username}
            />
            {formik.touched.username && formik.errors.username ? (
              <div style={{ color: "red" }}>{formik.errors.username}</div>
            ) : null}
          </div>

          <div className="form-group">
            <label htmlFor="name">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              className="form-control"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
            />
            {formik.touched.password && formik.errors.password ? (
              <div style={{ color: "red" }}>{formik.errors.password}</div>
            ) : null}
          </div>
          {ActiveResponse ? (
            <div style={{ color: isColor }}>{Messages}</div>
          ) : null}
          <div className="form-group">
            <button type="submit" className="submit-btn" disabled={Disabled}>
              Sign up
            </button>
          </div>
          <div>
            <p>
              Have an account?{" "}
              <a href="/login" className="sign-container">
                Login
              </a>
            </p>
          </div>
        </form>
      </div>
    </>
  );
}

export default SignUp;
