import React from 'react';

export default function Header({ user }) {
  return (
    <div className="header">
      <h1>User Dashboard</h1>
      <div className="header-user">
        <span>{user.first_name} {user.last_name}</span>
      </div>
    </div>
  );
}
