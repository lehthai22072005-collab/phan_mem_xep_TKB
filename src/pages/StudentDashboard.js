import React, { useEffect, useMemo, useState } from "react";
import { Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import StudentTimetable from "./StudentTimetable";
import StudentRegister from "./StudentRegister";
import StudentNotifications from "./StudentNotifications";
import StudentDetails from "./StudentDetails";
import { availableCourses, defaultRegisteredIds, MAX_CREDITS, notifications, STUDENT_ID } from "./studentData";
import "./StudentDashboard.css";

const storageKey = `student_registered_${STUDENT_ID}`;

const StudentDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [registeredIds, setRegisteredIds] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : defaultRegisteredIds;
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(registeredIds));
  }, [registeredIds]);

  // Đóng sidebar khi chuyển trang (trên mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const registeredCourses = useMemo(
    () => availableCourses.filter((course) => registeredIds.includes(course.id)),
    [registeredIds],
  );

  const totalCredits = registeredCourses.reduce((sum, course) => sum + course.credits, 0);
  const relevantNotifications = notifications.filter(
    (item) => item.type === "system" || registeredIds.includes(item.courseId),
  );

  const isActive = (path) => location.pathname.includes(path);

  const HomeContent = (
    <div>
      <h1 style={{ color: "#2c3e50", fontSize: "28px", marginBottom: "10px" }}>
        BẢNG ĐIỀU KHIỂN SINH VIÊN
      </h1>
      <p style={{ color: "#7f8c8d", marginBottom: "30px" }}>
        Mã sinh viên: <strong>{STUDENT_ID}</strong>
      </p>

      <div className="stat-cards">
        <div className="stat-card">
          <h2>{registeredCourses.length}</h2>
          <p>Môn đã đăng ký</p>
        </div>
        <div className="stat-card">
          <h2>{totalCredits}/{MAX_CREDITS}</h2>
          <p>Tín chỉ học kỳ</p>
        </div>
        <div className="stat-card">
          <h2>{relevantNotifications.length}</h2>
          <p>Thông báo liên quan</p>
        </div>
      </div>

      <div style={{
        background: "#fff",
        padding: "25px",
        borderRadius: "12px",
        borderLeft: "8px solid #00d2ff",
        boxShadow: "0 4px 15px rgba(0,0,0,0.05)"
      }}>
        <h4 style={{ margin: "0 0 10px 0" }}>📌 Quy định sinh viên</h4>
        <p style={{ margin: 0, color: "#34495e", lineHeight: 1.7 }}>
          Sinh viên chỉ được xem thời khóa biểu cá nhân, đăng ký môn trong thời gian mở đăng ký,
          không đăng ký trùng giờ và không vượt quá số tín chỉ tối đa.
        </p>
      </div>
    </div>
  );

  return (
    <div className="dashboard-wrapper">

      {/* Nút hamburger - chỉ hiện trên mobile */}
      <button
        className="hamburger-btn"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Mở menu"
      >
        {sidebarOpen ? "✕" : "☰"}
      </button>

      {/* Overlay mờ khi sidebar mở trên mobile */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? "active" : ""}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <h2>SINH VIÊN</h2>
        <p className="student-id">{STUDENT_ID}</p>
        <hr />
        <nav>
          <ul>
            <li className={`nav-item ${isActive("timetable") ? "active" : ""}`}>
              <Link to="/student/timetable">📅 Thời khóa biểu</Link>
            </li>
            <li className={`nav-item ${isActive("register") ? "active" : ""}`}>
              <Link to="/student/register">📝 Đăng ký môn học</Link>
            </li>
            <li className={`nav-item ${isActive("details") ? "active" : ""}`}>
              <Link to="/student/details">🔍 Chi tiết môn học</Link>
            </li>
            <li className={`nav-item ${isActive("notifications") ? "active" : ""}`}>
              <Link to="/student/notifications">🔔 Thông báo</Link>
            </li>
          </ul>
        </nav>
        <div className="logout-btn">
          <button onClick={() => navigate("/login")}>Đăng xuất</button>
        </div>
      </div>

      {/* Main content */}
      <div className="main-content">
        <Routes>
          <Route path="/" element={HomeContent} />
          <Route path="dashboard" element={HomeContent} />
          <Route path="timetable" element={<StudentTimetable registeredCourses={registeredCourses} />} />
          <Route path="register" element={<StudentRegister registeredIds={registeredIds} setRegisteredIds={setRegisteredIds} />} />
          <Route path="details" element={<StudentDetails registeredCourses={registeredCourses} />} />
          <Route path="notifications" element={<StudentNotifications registeredIds={registeredIds} />} />
        </Routes>
      </div>
    </div>
  );
};

export default StudentDashboard;