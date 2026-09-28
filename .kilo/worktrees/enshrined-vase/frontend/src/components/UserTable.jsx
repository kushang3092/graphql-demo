import React from "react";
import { useQuery } from "@apollo/client";
import { GET_USERS } from "../graphql/queries";

function formatDate(dateString) {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString();
}

export default function UserTable() {
  const { loading, error, data } = useQuery(GET_USERS);

  if (loading) return <p className="status">Loading users...</p>;
  if (error) return <p className="status error">Error: {error.message}</p>;

  const users = data?.users ?? [];

  if (users.length === 0) {
    return <p className="status">No users found.</p>;
  }

  return (
    <table className="user-table">
      <thead>
        <tr>
          <th>Avatar</th>
          <th>Name</th>
          <th>Email</th>
          <th>Provider</th>
          <th>Created At</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <td>
              {user.avatar ? (
                <img className="avatar" src={user.avatar} alt={user.name} />
              ) : (
                "-"
              )}
            </td>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>
              <span className={`role-badge role-${user.provider}`}>
                {user.provider ?? "-"}
              </span>
            </td>
            <td>{formatDate(user.createdAt)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
