import React, { useEffect, useState } from "react";
import { studentsAPI } from "../services/api";
import toast from "react-hot-toast";
import "./admin.css";

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [repair, setRepair] = useState(false);
  const [formData, setFormData] = useState({ user_id: 0, student_id: "", name: "" });

  const fetchStudents = async () => {
    try { const r = await studentsAPI.getAll(); setStudents(r.data); }
    catch { toast.error("Không tải được dữ liệu"); }
  };

  useEffect(() => { fetchStudents(); }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === "user_id" ? Number(value) : value });
  };

  const resetForm = () => setFormData({ user_id: 0, student_id: "", name: "" });

  const validate = () => {
    if (!formData.student_id || formData.user_id === 0 || !formData.name) {
      toast.error("Vui lòng điền đầy đủ thông tin."); return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await studentsAPI.create(formData);
      resetForm(); setShowForm(false); await fetchStudents();
      toast.success("Tạo sinh viên thành công!");
    } catch { toast.error("Tạo sinh viên thất bại!"); }
  };

  const handleSubmitUpdate = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await studentsAPI.update(formData.student_id, formData);
      resetForm(); setShowForm(false); setRepair(false); await fetchStudents();
      toast.success("Cập nhật sinh viên thành công!");
    } catch { toast.error("Cập nhật sinh viên thất bại!"); }
  };

  const handleOpenFormUpdate = (student) => {
    setFormData(student); setRepair(true); setShowForm(true);
  };

  const handleDeleteStudent = async (id) => {
    try {
      await studentsAPI.delete(id); toast.success("Xóa thành công!"); await fetchStudents();
    } catch { toast.error("Xóa thất bại!"); }
  };

  return (
    <div>
      <h2 className="page-title">🎓 QUẢN LÝ SINH VIÊN</h2>

      <button className="btn-primary" onClick={() => { resetForm(); setRepair(false); setShowForm(!showForm); }}>
        {showForm ? "✖ Đóng Form" : "+ Thêm sinh viên mới"}
      </button>

      {showForm && (
        <form className="form-container" onSubmit={repair ? handleSubmitUpdate : handleSubmit}>
          <h3>{repair ? "Cập nhật thông tin sinh viên" : "Tạo sinh viên mới"}</h3>
          <div className="form-grid form-grid-2">
            <div className="form-group">
              <label className="form-label">Mã Sinh Viên</label>
              <input className="form-input" type="text" name="student_id" placeholder="Nhập mã sinh viên"
                value={formData.student_id} onChange={handleInputChange} required disabled={repair} />
            </div>
            <div className="form-group">
              <label className="form-label">User ID</label>
              <input className="form-input" type="text" name="user_id" placeholder="Nhập User ID"
                value={formData.user_id} onChange={handleInputChange} required />
            </div>
            <div className="form-group" style={{ gridColumn: "1 / -1" }}>
              <label className="form-label">Họ tên</label>
              <input className="form-input" type="text" name="name" placeholder="Nhập họ tên sinh viên"
                value={formData.name} onChange={handleInputChange} required />
            </div>
          </div>
          <button type="submit" className={`btn-submit ${repair ? "update" : "create"}`}>
            {repair ? "Cập nhật sinh viên" : "Tạo sinh viên"}
          </button>
        </form>
      )}

      <div className="table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Mã Sinh viên</th>
              <th>Họ tên</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {students.map((t) => (
              <tr key={t.student_id}>
                <td>{t.student_id}</td>
                <td className="td-bold">{t.name}</td>
                <td>
                  <button className="btn-action" onClick={() => handleOpenFormUpdate(t)}>Sửa</button>
                  <button className="btn-danger" onClick={() => handleDeleteStudent(t.student_id)}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminStudents;