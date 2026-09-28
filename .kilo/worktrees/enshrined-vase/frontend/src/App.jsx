import React, { useState } from "react";
import UserTable from "./components/UserTable";
import ExpenseTable from "./components/ExpenseTable";

export default function App() {
  const [tab, setTab] = useState("users");

  return (
    <div className="app-container">
      <header>
        <h1>{tab === "users" ? "Users" : "Expenses"}</h1>
        <p className="subtitle">Fetched from MongoDB via GraphQL</p>
      </header>

      <div className="tabs">
        <button
          className={`tab-button ${tab === "users" ? "active" : ""}`}
          onClick={() => setTab("users")}
        >
          Users
        </button>
        <button
          className={`tab-button ${tab === "expenses" ? "active" : ""}`}
          onClick={() => setTab("expenses")}
        >
          Expenses
        </button>
      </div>

      {tab === "users" ? <UserTable /> : <ExpenseTable />}
    </div>
  );
}
