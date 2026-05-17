import React from "react";
import { days, slots } from "./studentData";

const StudentTimetable = ({ registeredCourses = [] }) => {
  const getCourseAt = (day, slotNumber) =>
    registeredCourses.find(
      (course) => course.day === day && slotNumber >= course.startSlot && slotNumber <= course.endSlot,
    );

  return (
    <div>
      <h2 style={{ color: "#2c3e50", marginBottom: "8px" }}>SV_BM 1 - XEM THỜI KHÓA BIỂU</h2>
      <p style={{ color: "#7f8c8d", marginBottom: "20px" }}>
        Chỉ hiển thị các môn học sinh viên đã đăng ký, không cho phép chỉnh sửa dữ liệu.
      </p>

      {/* Gợi ý scroll trên mobile */}
      <p style={{ color: "#aaa", fontSize: "12px", marginBottom: "8px", display: "none" }}
        className="scroll-hint">
        ← Vuốt ngang để xem đầy đủ →
      </p>

      <div className="timetable-wrapper">
        <table>
          <thead>
            <tr style={{ background: "#3498db", color: "white" }}>
              <th style={{ padding: "12px 10px", fontSize: "14px" }}>TIẾT</th>
              {days.map((day) => (
                <th key={day} style={{ padding: "12px 10px", fontSize: "14px" }}>
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {slots.map((slot, index) => {
              const slotNumber = index + 1;
              return (
                <tr key={slot}>
                  <td style={{
                    padding: "10px 8px",
                    fontWeight: "bold",
                    background: "#ecf0f1",
                    border: "1px solid #e5e8eb",
                    whiteSpace: "nowrap",
                    fontSize: "13px",
                  }}>
                    {slot}
                  </td>
                  {days.map((day) => {
                    const course = getCourseAt(day, slotNumber);
                    const isFirstSlot = course && course.startSlot === slotNumber;
                    return (
                      <td
                        key={`${day}-${slot}`}
                        style={{
                          height: "52px",
                          border: "1px solid #eef2f4",
                          background: course ? "#e8f8ff" : "white",
                          color: "#2c3e50",
                          verticalAlign: "top",
                          padding: "6px 8px",
                          minWidth: "80px",
                        }}
                      >
                        {isFirstSlot && (
                          <div style={{ fontSize: "12px", lineHeight: 1.5 }}>
                            <strong>{course.name}</strong><br />
                            Phòng: {course.room}<br />
                            GV: {course.teacher}
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .scroll-hint { display: block !important; }
        }
      `}</style>
    </div>
  );
};

export default StudentTimetable;
