import React, { useEffect, useState } from "react";
import { subjectsAPI } from "../services/api";
import toast from "react-hot-toast";
import "./admin.css";

const AdminSubjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [repair, setRepair] = useState(false);
  const [formData, setFormData] = useState({ subject_id: "", name: "", credits: 0 });

  const fetchSubjects = async () => {
    try { const r = await subjectsAPI.getAll(); setSubjects(r.data); }
    catch { toast.error("Không thể tải dữ liệu môn học"); }
  };

  useEffect(() => { fetchSubjects(); }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === "credits" ? Number(value) : value });
  };

  const validate = () => {
    if (!formData.subject_id || !formData.name || formData.credits === 0) {
      toast.error("Vui lòng điền đầy đủ thông tin."); return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await subjectsAPI.create(formData);
      setFormData({ subject_id: "", name: "", credits: 0 });
      setShowForm(false); await fetchSubjects();
      toast.success("Tạo môn học thành công!");
    } catch { toast.error("Tạo môn học thất bại!"); }
  };

  const handleSubmitUpdate = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await subjectsAPI.update(formData.subject_id, formData);
      setFormData({ subject_id: "", name: "", credits: 0 });
      setShowForm(false); setRepair(false); await fetchSubjects();
      toast.success("Cập nhật môn học thành công!");
    } catch { toast.error("Cập nhật môn học thất bại!"); }
  };

  const handleOpenFormUpdate = (subject) => {
    setFormData(subject); setRepair(true); setShowForm(true);
  };

  const handleDeleteSubject = async (id) => {
    try {
      await subjectsAPI.delete(id); await fetchSubjects();
      toast.success("Xóa môn học thành công!");
    } catch { toast.error("Không thể xóa môn học này"); }
  };

  return (
    <div>
      <h2 className="page-title">📚 QUẢN LÝ DANH MỤC MÔN HỌC</h2>

      <button className="btn-primary" onClick={() => {
        setFormData({ subject_id: "", name: "", credits: 0 });
        setRepair(false); setShowForm(!showForm);
      }}>
        {showForm ? "✖ Đóng Form" : "+ Thêm môn học mới"}
      </button>

      {showForm && (
        <form className="form-container" onSubmit={repair ? handleSubmitUpdate : handleSubmit}>
          <h3>{repair ? "Cập nhật môn học" : "Tạo môn học mới"}</h3>
          <div className="form-grid form-grid-2">
            <div className="form-group">
              <label className="form-label">Mã Môn Học</label>
              <input className="form-input" type="text" name="subject_id"
                placeholder="VD: INT1306" value={formData.subject_id}
                onChange={handleInputChange} required disabled={repair} />
            </div>
            <div className="form-group">
              <label className="form-label">Số Tín Chỉ</label>
              <input className="form-input" type="number" name="credits"
                placeholder="Nhập số tín chỉ" value={formData.credits}
                onChange={handleInputChange} required min="1" max="10" />
            </div>
            <div className="form-group" style={{ gridColumn: "1 / -1" }}>
              <label className="form-label">Tên Môn Học</label>
              <input className="form-input" type="text" name="name"
                placeholder="Nhập tên môn học" value={formData.name}
                onChange={handleInputChange} required />
            </div>
          </div>
          <button type="submit" className={`btn-submit ${repair ? "update" : "create"}`}>
            {repair ? "Cập nhật Môn Học" : "Tạo Môn Học"}
          </button>
        </form>
      )}

      <div className="table-wrapper">
        <table className="admin-table">
          <thead className="purple">
            <tr>
              <th>Mã môn</th>
              <th>Tên môn học</th>
              <th>Số tín chỉ</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((subject) => (
              <tr key={subject.subject_id}>
                <td>{subject.subject_id}</td>
                <td>{subject.name}</td>
                <td className="td-center">{subject.credits}</td>
                <td>
                  <button className="btn-action" onClick={() => handleOpenFormUpdate(subject)}>Sửa</button>
                  <button className="btn-danger" onClick={() => handleDeleteSubject(subject.subject_id)}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminSubjects;