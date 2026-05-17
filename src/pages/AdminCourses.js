import React, { useEffect, useState } from "react";
import { coursesAPI, subjectsAPI, teachersAPI } from "../services/api";
import toast from "react-hot-toast";
import "./admin.css";

const AdminCourses = () => {
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [courses, setCourses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [repair, setRepair] = useState(false);
  const [formData, setFormData] = useState({ subject_id: "", teacher_id: "" });

  const fetchCourses = async () => {
    try { const r = await coursesAPI.getAll(); setCourses(r.data); }
    catch { toast.error("Không thể tải dữ liệu khóa học"); }
  };
  const fetchTeachers = async () => {
    try { const r = await teachersAPI.getAll(); setTeachers(r.data); }
    catch { toast.error("Không thể tải dữ liệu giảng viên"); }
  };
  const fetchSubjects = async () => {
    try { const r = await subjectsAPI.getAll(); setSubjects(r.data); }
    catch { toast.error("Không thể tải dữ liệu môn học"); }
  };

  useEffect(() => {
    fetchCourses(); fetchSubjects(); fetchTeachers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleClickCreateCourse = () => {
    setFormData({ subject_id: "", teacher_id: "" });
    setRepair(false);
    setShowForm(!showForm);
  };

  const handleOpenFormUpdate = (course) => {
    setFormData(course);
    setRepair(true);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (repair) {
        await coursesAPI.update(formData.course_id, formData);
        toast.success("Cập nhật khóa học thành công!");
      } else {
        await coursesAPI.create(formData);
        toast.success("Thêm khóa học thành công!");
      }
      setShowForm(false);
      fetchCourses();
    } catch {
      toast.error("Thao tác thất bại. Vui lòng kiểm tra lại!");
    }
  };

  const handleDeleteCourse = async (id) => {
    try {
      await coursesAPI.delete(id);
      fetchCourses();
      toast.success("Xóa khóa học thành công!");
    } catch {
      toast.error("Không thể xóa khóa học này");
    }
  };

  return (
    <div>
      <h2 className="page-title">📚 QUẢN LÝ KHÓA HỌC</h2>

      <div className="stat-cards">
        <div className="stat-card">
          <strong>Tổng số khóa học</strong>{courses.length}
        </div>
        <div className="stat-card" style={{ borderLeftColor: "#2ecc71" }}>
          <strong>Đang mở</strong>{courses.filter(c => c.status === "Active").length}
        </div>
        <div className="stat-card" style={{ borderLeftColor: "#e74c3c" }}>
          <strong>Đã kết thúc</strong>{courses.filter(c => c.status === "Inactive").length}
        </div>
      </div>

      <button className="btn-primary" onClick={handleClickCreateCourse}>
        {showForm ? "✖ Đóng Form" : "+ Thêm khóa học mới"}
      </button>

      {showForm && (
        <form className="form-container" onSubmit={handleSubmit}>
          <h3>{repair ? "🛠 Cập nhật khóa học" : "🆕 Thêm khóa học mới"}</h3>
          <div className="form-grid form-grid-2">
            <div className="form-group">
              <label className="form-label">Mã môn học</label>
              <input
                className="form-input"
                name="subject_id"
                value={formData.subject_id}
                onChange={handleInputChange}
                required
                placeholder="VD: INT1337"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Mã giáo viên</label>
              <input
                className="form-input"
                name="teacher_id"
                value={formData.teacher_id}
                onChange={handleInputChange}
                required
                placeholder="VD: GV001"
              />
            </div>
          </div>
          <button
            type="submit"
            className={`btn-submit ${repair ? "update" : "create"}`}
          >
            {repair ? "Cập nhật dữ liệu" : "Lưu khóa học"}
          </button>
        </form>
      )}

      <div className="table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Mã khóa học</th>
              <th>Mã môn học</th>
              <th>Tên môn học</th>
              <th>Mã GV</th>
              <th>Tên giáo viên</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.course_id}>
                <td className="td-bold">{course.course_id}</td>
                <td>{course.subject_id}</td>
                <td>{subjects.find(s => s.subject_id === course.subject_id)?.name}</td>
                <td>{course.teacher_id}</td>
                <td>{teachers.find(t => t.teacher_id === course.teacher_id)?.name}</td>
                <td>
                  <button className="btn-action" onClick={() => handleOpenFormUpdate(course)}>Sửa</button>
                  <button className="btn-danger" onClick={() => handleDeleteCourse(course.course_id)}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCourses;
