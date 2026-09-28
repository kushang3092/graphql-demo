import React from "react";
import { useQuery } from "@apollo/client";
import { GET_EXPENSES } from "../graphql/expenseQueries";

function formatDate(dateString) {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString();
}

function formatAmount(amount) {
  if (amount == null) return "-";
  return `₹${amount.toLocaleString("en-IN")}`;
}

export default function ExpenseTable() {
  const { loading, error, data } = useQuery(GET_EXPENSES);

  if (loading) return <p className="status">Loading expenses...</p>;
  if (error) return <p className="status error">Error: {error.message}</p>;

  const expenses = data?.expenses ?? [];

  if (expenses.length === 0) {
    return <p className="status">No expenses found.</p>;
  }

  return (
    <table className="user-table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Category</th>
          <th>Description</th>
          <th>Amount</th>
          <th>User</th>
        </tr>
      </thead>
      <tbody>
        {expenses.map((expense) => (
          <tr key={expense.id}>
            <td>{formatDate(expense.date)}</td>
            <td>
              <span className="role-badge role-category">
                {expense.category ?? "-"}
              </span>
            </td>
            <td>{expense.description ?? "-"}</td>
            <td>{formatAmount(expense.amount)}</td>
            <td>{expense.user?.name ?? "-"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
