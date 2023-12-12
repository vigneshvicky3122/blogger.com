import React, { useState } from "react";
import Navbar from "./Navbar";
import Card from "./Card";

function Dashboard() {
  const [Search, setSearch] = useState("");
  return (
    <>
      <Navbar />
      <div className="container w-50">
        <div class="mb-1">
          <input
            type="search"
            class="form-control rounded-4"
            id="exampleFormControlInput1"
            placeholder="Search by keywords"
            onChange={(event) => setSearch(event.target.value)}
            onBlur={() => setSearch("")}
            value={Search}
          />
        </div>
      </div>
      <div className="container w-25">
        <div class="input-group mb-5">
          <input type="datetime-local" class="form-control" />
          <input type="month" class="form-control" />
        </div>
      </div>
      <Card Search={Search} />
    </>
  );
}

export default Dashboard;
