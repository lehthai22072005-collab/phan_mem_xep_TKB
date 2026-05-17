import React, { useState } from "react";
import "./admin.css";

const AdminAdjust = () => {
  const [formData, setFormData] = useState({
    classCode: "",
    substituteTeacher: "",
    newRoom: "",
    newDate: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    // TODO: connect API
    alert("Đã gửi yêu cầu cập nhật lịch học!");
  };

  return (
    <div>
      <h2 className="page-title">🛠️ ĐIỀU CHỈNH LỊCH HỌC (MẪU BMCL)</h2>

      <div className="form-container">
        <div className="form-grid form-grid-2">
          <div className="form-group">
            <label className="form-label">Mã lớp học</label>
            <input
              className="form-input"
              type="text"
              name="classCode"
              placeholder="Nhập mã lớp học"
              value={formData.classCode}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Giảng viên thay thế</label>
            <input
              className="form-input"
              type="text"
              name="substituteTeacher"
              placeholder="Nhập tên giảng viên"
              value={formData.substituteTeacher}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Phòng học mới</label>
            <input
              className="form-input"
              type="text"
              name="newRoom"
              placeholder="Nhập mã phòng mới"
              value={formData.newRoom}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Ngày học mới</label>
            <input
              className="form-input"
              type="date"
              name="newDate"
              value={formData.newDate}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <button
          className="btn-submit purple"
          onClick={handleSubmit}
          style={{ marginTop: 20 }}
        >
          Cập nhật lịch học
        </button>
      </div>
    </div>
  );
};

export default AdminAdjust;