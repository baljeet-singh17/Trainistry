
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/companyDashboard.css";

function NotificationPanel({ token }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================= FETCH NOTIFICATIONS =================
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/notifications/company",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setNotifications(res.data.data || []);
      } catch (err) {
        console.error("Error fetching notifications:", err.response || err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 10000);
      return () => clearInterval(interval);
    }
  }, [token]);

  // ================= MARK AS READ =================
  const markAsRead = async (id, isRead) => {
    if (isRead) return;

    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
    );

    try {
      await axios.put(
        `http://localhost:5000/api/notifications/${id}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Sync failed, rolling back:", err);

      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: false } : n))
      );
    }
  };

  if (loading) return <div className="loading-text">Loading notifications...</div>;

  if (!notifications.length) {
    return (
      <div className="empty-state glass">
        <p>No new notifications at the moment.</p>
      </div>
    );
  }

  return (
    <div className="notifications-container">
      <div className="panel-header">
        <h2 className="form-title" style={{ textAlign: "left", margin: 0 }}>
          Recent Notifications
        </h2>
        <span className="notif-count">
          {notifications.filter((n) => !n.isRead).length} Unread
        </span>
      </div>

      <div className="notifications-list">
        {notifications.map((note) => (
          <div
            key={note._id}
            className={`notification glass ${note.isRead ? "read" : "unread"}`}
            onClick={() => markAsRead(note._id, note.isRead)}
          >
            <span className="notification-time">
              {new Date(note.createdAt).toLocaleDateString()} •{" "}
              {new Date(note.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>

            <p className="notification-message">{note.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NotificationPanel;