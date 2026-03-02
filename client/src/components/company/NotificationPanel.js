import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/companyDashboard.css";

function NotificationPanel({ companyId }) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const res = await axios.get(`/api/notifications/${companyId}`);
      setNotifications(res.data.data);
    };
    fetchNotifications();
  }, [companyId]);

  const markAsRead = async (id) => {
    await axios.put(`/api/notifications/mark/${id}`);
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
    );
  };

  return (
    <div>
      <h2>Notifications</h2>
      {notifications.map((note) => (
        <div
          key={note._id}
          className={`notification ${note.isRead ? "read" : "unread"}`}
          onClick={() => markAsRead(note._id)}
        >
          {note.message}
        </div>
      ))}
    </div>
  );
}

export default NotificationPanel;