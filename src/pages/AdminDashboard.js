import React, { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import AdminSchedule from "./AdminSchedule";
import AdminRooms from "./AdminRooms";
import AdminTeachers from "./AdminTeachers";
import AdminSubjectsAndCourses from "./AdminSubjectsAndCourses";
import AdminStudents from "./AdminStudent";
import "./admin.css";

const HomeContent = () => (
  <div>
    <h1 className="page-title" style={{ fontSize: "1.4rem" }}>
      ĐIỀU HÀNH ĐÀO TẠO
    </h1>
    <div className="home-stat-cards">
      <div className="home-stat-card">
        <h2>120</h2>
        <p>Môn học hiện có</p>
      </div>
      <div className="home-stat-card">
        <h2>45</h2>
        <p>Phòng học sẵn sàng</p>
      </div>
      <div className="home-stat-card">
        <h2>3</h2>
        <p>Lịch cần duyệt</p>
      </div>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="admin-layout">
      {/* Mobile menu button */}
      <button
        className="menu-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle menu"
      >
        {sidebarOpen ? "✕" : "☰"}
      </button>

      {/* Overlay for mobile */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? "open" : ""}`}
        onClick={closeSidebar}
      />

      {/* Sidebar */}
      <div className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
        <h2>QUẢN TRỊ VIÊN</h2>
        <hr style={{ borderColor: "#2d3436", margin: "0 0 16px" }} />
        <ul className="sidebar-nav">
          {[
            { to: "/admin/subjects", label: "📚 Quản lý môn học" },
            { to: "/admin/schedule", label: "📅 Quản lý lịch học" },
            { to: "/admin/rooms", label: "🏢 Quản lý phòng học" },
            { to: "/admin/teachers", label: "👥 Quản lý giảng viên" },
            { to: "/admin/students", label: "🎓 Quản lý sinh viên" },
          ].map((item) => (
            <li key={item.to}>
              <Link to={item.to} onClick={closeSidebar}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <button
          className="sidebar-logout"
          onClick={() => (window.location.href = "/login")}
        >
          Đăng xuất
        </button>
      </div>

      {/* Main content */}
      <div className="admin-content">
        <Routes>
          <Route path="/" element={<HomeContent />} />
          <Route path="dashboard" element={<HomeContent />} />
          <Route path="subjects" element={<AdminSubjectsAndCourses />} />
          <Route path="schedule" element={<AdminSchedule />} />
          <Route path="rooms" element={<AdminRooms />} />
          <Route path="teachers" element={<AdminTeachers />} />
          <Route path="students" element={<AdminStudents />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;
