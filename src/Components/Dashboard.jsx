import React, { useState } from "react";
import Navbar from "./Navbar";
import Card from "./Card";

function Dashboard() {
  const [Search, setSearch] = useState("");
  const [isDate, setDate] = useState("");

  return (
    <>
      <Navbar />
      <div className="container d-flex w-50 my-5">
        <div className="input-group">
          <input
            type="search"
            className="form-control rounded-start-4"
            id="exampleFormControlInput1"
            placeholder="Search by keywords"
            onChange={(event) => setSearch(event.target.value)}
            value={Search}
          />
        </div>
        <div className="input-group">
          <input
            type="month"
            min="2023-01"
            max="2024-02"
            className="form-control rounded-end-4"
            placeholder="By Month"
            onChange={(event) => setDate(event.target.value)}
            value={isDate}
          />
        </div>
      </div>

      <Card Search={Search} isDate={isDate} />
    </>
  );
}

export default Dashboard;
