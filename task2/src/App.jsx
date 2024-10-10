import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { z } from 'zod';

function App() {
  const pumpOptions = ['', ...Array.from({ length: 10 }, (_, i) => (i + 1).toString())];

  const formSchema = z.object({
    birthdaytime: z.string().min(1, "Vui lòng chọn ngày giờ"),
    soluong: z
      .string()
      .min(1, "Số lượng không được để trống")
      .refine((val) => !isNaN(val), {
        message: "Số lượng phải là con số",
      }),
    tru: z.string().min(1, "Vui lòng chọn trụ"),
    doanhthu: z
      .string()
      .min(1, "Doanh thu không được để trống")
      .refine((val) => !isNaN(val), {
        message: "Doanh thu phải là con số",
      }),
    dongia: z
      .string()
      .min(1, "Đơn giá không được để trống")
      .refine((val) => !isNaN(val), {
        message: "Đơn giá phải là con số",
      }),
  });

  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const [formData, setFormData] = useState({
    birthdaytime: getCurrentDateTime(),
    soluong: '',
    tru: '',
    doanhthu: '',
    dongia: ''
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { id, value } = e.target;

    setErrors((prevErrors) => ({
      ...prevErrors,
      [id]: undefined,
    }));

    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage('');

    try {
      formSchema.parse(formData);
      setSuccessMessage('Cập nhật thành công!');
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors = {};
        err.errors.forEach((error) => {
          fieldErrors[error.path[0]] = error.message;
        });
        setErrors(fieldErrors);
      }
    }
  };

  return (
    <>
      <div className="container">
        <div className="title">
          <button className="btn-close">
            <FontAwesomeIcon icon={faArrowLeft} /> Đóng
          </button>
          <h1>Nhập giao dịch</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="birthdaytime">Thời gian</label>
            <input
              type="datetime-local"
              id="birthdaytime"
              name="birthdaytime"
              value={formData.birthdaytime}
              onChange={handleChange}
            />
            {errors.birthdaytime && <span className="error-message">{errors.birthdaytime}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="soluong">Số lượng</label>
            <input
              type="text"
              id="soluong"
              value={formData.soluong}
              onChange={handleChange}
            />
            {errors.soluong && <span className="error-message">{errors.soluong}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="tru">Trụ</label>
            <select id="tru" value={formData.tru} onChange={handleChange}>
              {pumpOptions.map((pump) => (
                <option key={pump} value={pump}>{pump}</option>
              ))}
            </select>
            {errors.tru && <span className="error-message">{errors.tru}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="doanhthu">Doanh thu</label>
            <input
              type="text"
              id="doanhthu"
              value={formData.doanhthu}
              onChange={handleChange}
            />
            {errors.doanhthu && <span className="error-message">{errors.doanhthu}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="dongia">Đơn giá</label>
            <input
              type="text"
              id="dongia"
              value={formData.dongia}
              onChange={handleChange}
            />
            {errors.dongia && <span className="error-message">{errors.dongia}</span>}
          </div>

          <button className="submit-btn">Cập nhật</button>
        </form>

        {successMessage && <p className="success-message">{successMessage}</p>}
      </div>
    </>
  );
}

export default App;
