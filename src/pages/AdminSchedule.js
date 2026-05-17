import React, { useEffect, useState } from "react";
import { schedulesAPI, coursesAPI, roomsAPI } from "../services/api";
import toast from "react-hot-toast";
import "./admin.css";

const SLOTS = Array.from({ length: 18 }, (_, i) => i + 1);

const AdminSchedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [courses, setCourses] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [repair, setRepair] = useState(false);
  const [formData, setFormData] = useState({
    course_id: "", classroom_id: "", dayOfWeek: "", start_slot: "", end_slot: "",
  });

  const fetchData = async () => {
    try {
      const [resSchedules, resCourses, resRooms] = await Promise.all([
        schedulesAPI.getAll(), coursesAPI.getAll(), roomsAPI.getAll(),
      ]);
      setSchedules(resSchedules.data);
      setCourses(resCourses.data);
      setRooms(resRooms.data);
    } catch { toast.error("Không thể tải dữ liệu lịch học"); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleClickCreate = () => {
    setFormData({ course_id: "", classroom_id: "", dayOfWeek: "", start_slot: "", end_slot: "" });
    setRepair(false);
    setShowForm(!showForm);
  };

  const handleOpenUpdate = (item) => {
    setFormData(item); setRepair(true); setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (repair) {
        await schedulesAPI.update(formData.schedule_id, formData);
        toast.success("Cập nhật lịch học thành công!");
      } else {
        await schedulesAPI.create(formData);
        toast.success("Sắp xếp lịch học mới thành công!");
      }
      setShowForm(false); fetchData();
    } catch { toast.error("Thao tác thất bại. Lịch học có thể bị trùng!"); }
  };

  const handleDelete = async (id) => {
    try {
      await schedulesAPI.delete(id); fetchData();
      toast.success("Đã hủy lịch học!");
    } catch { toast.error("Không thể xóa lịch này"); }
  };

  return (
    <div>
      <h2 className="page-title">📅 ĐIỀU PHỐI LỊCH HỌC</h2>

      <div className="stat-cards">
        <div className="stat-card"><strong>Tổng số lịch</strong>{schedules.length}</div>
        <div className="stat-card" style={{ borderLeftColor: "#8e44ad" }}>
          <strong>Khóa học</strong>{new Set(schedules.map(s => s.course_id)).size}
        </div>
        <div className="stat-card" style={{ borderLeftColor: "#f39c12" }}>
          <strong>Phòng đang dùng</strong>{new Set(schedules.map(s => s.classroom_id)).size}
        </div>
      </div>

      <button className="btn-primary" style={{ background: "#8e44ad" }} onClick={handleClickCreate}>
        {showForm ? "✖ Đóng Form" : "+ Thêm lịch học mới"}
      </button>

      {showForm && (
        <form className="form-container" onSubmit={handleSubmit}>
          <h3>{repair ? "🛠 Cập nhật lịch học" : "🆕 Sắp xếp lịch mới"}</h3>
          <div className="form-grid form-grid-3">
            <div className="form-group">
              <label className="form-label">Khóa học</label>
              <select className="form-select" name="course_id" value={formData.course_id} onChange={handleInputChange} required>
                <option value="">-- Chọn khóa học --</option>
                {courses.map(c => (
                  <option key={c.course_id} value={c.course_id}>{`${c.course_id} : ${c.subject_id}`}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Phòng học</label>
              <select className="form-select" name="classroom_id" value={formData.classroom_id} onChange={handleInputChange} required>
                <option value="">-- Chọn phòng --</option>
                {rooms.map(r => (
                  <option key={r.classroom_id} value={r.classroom_id}>{r.classroom_id}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Thứ học</label>
              <select className="form-select" name="dayOfWeek" value={formData.dayOfWeek} onChange={handleInputChange} required>
                <option value="">-- Chọn thứ --</option>
                {[2,3,4,5,6,7].map(d => <option key={d} value={d}>Thứ {d}</option>)}
                <option value="8">Chủ Nhật</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Tiết bắt đầu</label>
              <select className="form-select" name="start_slot" value={formData.start_slot} onChange={handleInputChange} required>
                <option value="">-- Chọn tiết --</option>
                {SLOTS.map(s => <option key={s} value={s}>Tiết {s}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Tiết kết thúc</label>
              <select className="form-select" name="end_slot" value={formData.end_slot} onChange={handleInputChange} required>
                <option value="">-- Chọn tiết --</option>
                {SLOTS.map(s => <option key={s} value={s}>Tiết {s}</option>)}
              </select>
            </div>
          </div>
          <button type="submit" className={`btn-submit ${repair ? "update" : "purple"}`}>
            {repair ? "Xác nhận cập nhật" : "Lưu lịch học"}
          </button>
        </form>
      )}

      <div className="table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Mã lịch</th>
              <th>Mã khóa học</th>
              <th>Phòng</th>
              <th>Thứ</th>
              <th>Tiết đầu</th>
              <th>Tiết cuối</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {schedules.map((s) => (
              <tr key={s.schedule_id}>
                <td className="td-bold">{s.schedule_id}</td>
                <td>{s.course_id}</td>
                <td>{s.classroom_id}</td>
                <td>{s.dayOfWeek}</td>
                <td>{s.start_slot}</td>
                <td>{s.end_slot}</td>
                <td>
                  <button className="btn-action" onClick={() => handleOpenUpdate(s)}>Sửa</button>
                  <button className="btn-danger" onClick={() => handleDelete(s.schedule_id)}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminSchedule;
