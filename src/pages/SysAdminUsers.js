import React, { useEffect, useState } from "react";
import { usersAPI } from "../services/api";
import toast from "react-hot-toast";
import { FaUserAlt } from "react-icons/fa";
import "./admin.css";

const SysAdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [repair, setRepair] = useState(false);
  const [idUpdate, setIdUpdate] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "student",
    phone: "",
    address: "",
  });

  const fetchUsers = async () => {
    try {
      const response = await usersAPI.getAll(`?_t=${Date.now()}`);
      setUsers(response.data);
    } catch (error) {
      toast.error("Không tải được dữ liệu");
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const resetForm = () => {
    setFormData({ email: "", password: "", role: "student", phone: "", address: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error("Dữ liệu không được để trống.");
      return;
    }
    try {
      await usersAPI.create(formData);
      resetForm();
      setShowForm(false);
      await fetchUsers();
      toast.success("Tạo người dùng thành công!");
    } catch (err) {
      toast.error("Tạo người dùng thất bại!");
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await usersAPI.delete(id);
      await fetchUsers();
    } catch (error) {
      toast.error("Xóa thất bại!");
    }
  };

  const handleOpenFormUpdateUser = (id) => {
    setRepair(true);
    setShowForm(true);
    setIdUpdate(id);
  };

  const handleClickCreateUser = () => {
    resetForm();
    setRepair(false);
    setShowForm(!showForm);
  };

  const handleSubmitUpdate = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error("Dữ liệu không được để trống.");
      return;
    }
    try {
      await usersAPI.update(idUpdate, formData);
      resetForm();
      setShowForm(false);
      setRepair(false);
      await fetchUsers();
      toast.success("Cập nhật người dùng thành công!");
    } catch (err) {
      toast.error("Cập nhật thất bại!");
    }
  };

  return (
    <div>
      <h2 className="page-title">
        <FaUserAlt /> QUẢN LÝ TÀI KHOẢN NGƯỜI DÙNG
      </h2>

      <button className="btn-primary" onClick={handleClickCreateUser}>
        {showForm ? "✖ Đóng Form" : "+ Thêm người dùng mới"}
      </button>

      {showForm && (
        <form
          className="form-container"
          onSubmit={repair ? handleSubmitUpdate : handleSubmit}
        >
          <h3>{repair ? "Cập nhật User" : "Tạo User Mới"}</h3>

          <div className="form-grid form-grid-2">
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                className="form-input"
                type="email"
                name="email"
                placeholder="example@gmail.com"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                className="form-input"
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Role</label>
              <select
                className="form-select"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
                <option value="sysadmin">System Admin</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Phone</label>
              <input
                className="form-input"
                type="tel"
                name="phone"
                placeholder="0123456789"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group" style={{ gridColumn: "1 / -1" }}>
              <label className="form-label">Address</label>
              <input
                className="form-input"
                type="text"
                name="address"
                placeholder="Địa chỉ"
                value={formData.address}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <button
            type="submit"
            className={`btn-submit ${repair ? "update" : "create"}`}
          >
            {repair ? "Cập nhật User" : "Tạo User"}
          </button>
        </form>
      )}

      <div className="table-wrapper">
        <table className="admin-table">
          <thead className="primary">
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Password</th>
              <th>Role</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="td-bold">{user.id}</td>
                <td>{user.email}</td>
                <td>{user.password}</td>
                <td>{user.role}</td>
                <td>{user.phone}</td>
                <td>{user.address}</td>
                <td>
                  <button
                    className="btn-action"
                    onClick={() => handleOpenFormUpdateUser(user.id)}
                  >
                    Sửa
                  </button>
                  <button
                    className="btn-danger"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SysAdminUsers;
