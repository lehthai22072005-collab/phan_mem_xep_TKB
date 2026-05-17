import React, { useEffect, useState } from "react";
import { roomsAPI } from "../services/api";
import toast from "react-hot-toast";
import "./admin.css";

const AdminRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [repair, setRepair] = useState(false);
  const [formData, setFormData] = useState({
    classroom_id: "", capacity: 0, type: "", description: "", status: "",
  });

  const fetchRooms = async () => {
    try { const r = await roomsAPI.getAll(); setRooms(r.data); }
    catch { toast.error("Không thể tải dữ liệu phòng học"); }
  };

  useEffect(() => { fetchRooms(); }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === "capacity" ? Number(value) : value });
  };

  const handleClickCreateRoom = () => {
    setFormData({ classroom_id: "", capacity: 0, type: "", description: "", status: "" });
    setRepair(false);
    setShowForm(!showForm);
  };

  const handleOpenFormUpdate = (room) => {
    setFormData(room); setRepair(true); setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (repair) {
        await roomsAPI.update(formData.classroom_id, formData);
        toast.success("Cập nhật phòng thành công!");
      } else {
        await roomsAPI.create(formData);
        toast.success("Thêm phòng mới thành công!");
      }
      setShowForm(false); fetchRooms();
    } catch { toast.error("Thao tác thất bại. Vui lòng kiểm tra lại!"); }
  };

  const handleDeleteRoom = async (id) => {
    try {
      await roomsAPI.delete(id); fetchRooms();
      toast.success("Xóa phòng thành công!");
    } catch { toast.error("Không thể xóa phòng này"); }
  };

  return (
    <div>
      <h2 className="page-title">🏢 QUẢN LÝ PHÒNG HỌC</h2>

      <div className="stat-cards">
        <div className="stat-card"><strong>Tổng số phòng</strong>{rooms.length}</div>
        <div className="stat-card" style={{ borderLeftColor: "#2ecc71" }}>
          <strong>Sẵn sàng</strong>{rooms.filter(r => r.status === "Ready").length}
        </div>
        <div className="stat-card" style={{ borderLeftColor: "#e74c3c" }}>
          <strong>Đang sử dụng</strong>{rooms.filter(r => r.status !== "Ready").length}
        </div>
      </div>

      <button className="btn-primary" onClick={handleClickCreateRoom}>
        {showForm ? "✖ Đóng Form" : "+ Thêm phòng học mới"}
      </button>

      {showForm && (
        <form className="form-container" onSubmit={handleSubmit}>
          <h3>{repair ? "🛠 Cập nhật phòng" : "🆕 Thêm phòng mới"}</h3>
          <div className="form-grid form-grid-3">
            <div className="form-group">
              <label className="form-label">Mã Phòng</label>
              <input
                className="form-input"
                name="classroom_id"
                value={formData.classroom_id}
                onChange={handleInputChange}
                disabled={repair}
                required
                placeholder="VD: A2-301"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Sức chứa</label>
              <input
                className="form-input"
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Loại phòng</label>
              <select className="form-select" name="type" value={formData.type} onChange={handleInputChange} required>
                <option value="" disabled>-- Chọn loại --</option>
                <option value="Theory">Lý thuyết</option>
                <option value="Practice">Thực hành</option>
              </select>
            </div>
          </div>
          <div className="form-grid form-grid-2" style={{ marginTop: 10 }}>
            <div className="form-group">
              <label className="form-label">Trang thiết bị</label>
              <input
                className="form-input"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Máy chiếu, Điều hòa..."
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Trạng thái</label>
              <select className="form-select" name="status" value={formData.status} onChange={handleInputChange} required>
                <option value="" disabled>-- Chọn trạng thái --</option>
                <option value="Ready">Sẵn sàng</option>
                <option value="Used">Đang sử dụng</option>
                <option value="Maintaince">Bảo trì</option>
              </select>
            </div>
          </div>
          <button type="submit" className={`btn-submit ${repair ? "update" : "create"}`}>
            {repair ? "Cập nhật dữ liệu" : "Lưu phòng học"}
          </button>
        </form>
      )}

      <div className="table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Mã phòng</th>
              <th>Sức chứa</th>
              <th>Loại phòng</th>
              <th>Thiết bị</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <tr key={room.classroom_id}>
                <td className="td-bold">{room.classroom_id}</td>
                <td>{room.capacity} chỗ</td>
                <td>{room.type}</td>
                <td>{room.description}</td>
                <td style={{ color: room.status === "Ready" ? "#27ae60" : "#e67e22", fontWeight: 700 }}>
                  {room.status}
                </td>
                <td>
                  <button className="btn-action" onClick={() => handleOpenFormUpdate(room)}>Sửa</button>
                  <button className="btn-danger" onClick={() => handleDeleteRoom(room.classroom_id)}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminRooms;
