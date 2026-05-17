import React, { useEffect, useState } from "react";
import { teachersAPI } from "../services/api";
import toast from "react-hot-toast";
import "./admin.css";

const AdminTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [repair, setRepair] = useState(false);
  const [formData, setFormData] = useState({
    user_id: 0, teacher_id: "", name: "", degree: "", expertise: "",
  });

  const fetchTeachers = async () => {
    try { const r = await teachersAPI.getAll(); setTeachers(r.data); }
    catch { toast.error("Không tải được dữ liệu"); }
  };

  useEffect(() => { fetchTeachers(); }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === "user_id" ? Number(value) : value });
  };

  const resetForm = () => setFormData({ user_id: 0, teacher_id: "", name: "", degree: "", expertise: "" });

  const validate = () => {
    if (!formData.teacher_id || formData.user_id === 0 || !formData.name || !formData.degree || !formData.expertise) {
      toast.error("Vui lòng điền đầy đủ thông tin."); return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await teachersAPI.create(formData);
      resetForm(); setShowForm(false); await fetchTeachers();
      toast.success("Tạo giảng viên thành công!");
    } catch { toast.error("Tạo giảng viên thất bại!"); }
  };

  const handleSubmitUpdate = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await teachersAPI.update(formData.teacher_id, formData);
      resetForm(); setShowForm(false); setRepair(false); await fetchTeachers();
      toast.success("Cập nhật giảng viên thành công!");
    } catch { toast.error("Cập nhật giảng viên thất bại!"); }
  };

  const handleOpenFormUpdate = (teacher) => {
    setFormData(teacher); setRepair(true); setShowForm(true);
  };

  const handleDeleteTeacher = async (id) => {
    try {
      await teachersAPI.delete(id); toast.success("Xóa thành công!"); await fetchTeachers();
    } catch { toast.error("Xóa thất bại!"); }
  };

  return (
    <div>
      <h2 className="page-title">👥 QUẢN LÝ GIẢNG VIÊN</h2>

      <button className="btn-primary" onClick={() => { resetForm(); setRepair(false); setShowForm(!showForm); }}>
        {showForm ? "✖ Đóng Form" : "+ Thêm giảng viên mới"}
      </button>

      {showForm && (
        <form className="form-container" onSubmit={repair ? handleSubmitUpdate : handleSubmit}>
          <h3>{repair ? "Cập nhật thông tin giảng viên" : "Tạo giảng viên mới"}</h3>
          <div className="form-grid form-grid-2">
            <div className="form-group">
              <label className="form-label">Mã Giảng Viên</label>
              <input className="form-input" type="text" name="teacher_id" placeholder="Nhập mã giảng viên"
                value={formData.teacher_id} onChange={handleInputChange} required disabled={repair} />
            </div>
            <div className="form-group">
              <label className="form-label">User ID</label>
              <input className="form-input" type="text" name="user_id" placeholder="Nhập User ID"
                value={formData.user_id} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Họ tên</label>
              <input className="form-input" type="text" name="name" placeholder="Nhập họ tên"
                value={formData.name} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Học vị</label>
              <input className="form-input" type="text" name="degree" placeholder="VD: Thạc sĩ, Tiến sĩ"
                value={formData.degree} onChange={handleInputChange} required />
            </div>
            <div className="form-group" style={{ gridColumn: "1 / -1" }}>
              <label className="form-label">Chuyên môn</label>
              <input className="form-input" type="text" name="expertise" placeholder="VD: Toán học, Tiếng Anh"
                value={formData.expertise} onChange={handleInputChange} required />
            </div>
          </div>
          <button type="submit" className={`btn-submit ${repair ? "update" : "create"}`}>
            {repair ? "Cập nhật Giảng Viên" : "Tạo Giảng Viên"}
          </button>
        </form>
      )}

      <div className="table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Mã GV</th>
              <th>Họ tên</th>
              <th>Học vị</th>
              <th>Chuyên môn</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((t) => (
              <tr key={t.teacher_id}>
                <td>{t.teacher_id}</td>
                <td className="td-bold">{t.name}</td>
                <td>{t.degree}</td>
                <td>{t.expertise}</td>
                <td>
                  <button className="btn-action" onClick={() => handleOpenFormUpdate(t)}>Sửa</button>
                  <button className="btn-danger" onClick={() => handleDeleteTeacher(t.teacher_id)}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTeachers;
