
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/companyDashboard.css";

const Notifications = ({ token }) => {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/notifications/company",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNotifications(res.data.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    if (token) fetchNotifications();
  }, [token]);

  const handleNotifClick = async (n) => {

    // INSTANT UI UPDATE
    if (!n.isRead) {
      setNotifications((prev) =>
        prev.map((item) =>
          String(item._id) === String(n._id)
            ? { ...item, isRead: true }
            : item
        )
      );

      try {
        await axios.put(
          `http://localhost:5000/api/notifications/${n._id}/read`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (err) {
        console.error("Backend sync failed:", err);

        // ROLLBACK IF SERVER FAILS
        setNotifications((prev) =>
          prev.map((item) =>
            String(item._id) === String(n._id)
              ? { ...item, isRead: false }
              : item
          )
        );
      }
    }

    // NAVIGATION (DELAYED FOR ANIMATION)
    if (n.relatedApplication) {
      setTimeout(() => {
        window.location.href = "/trainer/applications";
      }, 300);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="notifications-wrapper">
      <button onClick={() => setOpen(!open)} className="notif-bell-btn">
        🔔 {unreadCount > 0 && (
          <span className="bell-badge">{unreadCount}</span>
        )}
      </button>

      {open && (
        <div className="notifications-container">
          <div className="panel-header">
            <h3>Notifications</h3>
          </div>

          <div className="notifications-list">
            {notifications.length === 0 ? (
              <div className="no-notifs">No notifications</div>
            ) : (
              notifications.map((n) => (
                <div
                  key={String(n._id)}
                  className={`notification glass ${
                    n.isRead ? "read" : "unread"
                  }`}
                  onClick={() => handleNotifClick(n)}
                >
                  <span className="notification-time">
                    {new Date(n.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>

                  <p className="notification-message">{n.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;