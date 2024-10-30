import * as Yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate } from 'react-router-dom';
import userService from '../services/user';
import { Spin } from 'antd'; // Import Spin từ Ant Design
import { useState } from 'react';

const { resetPassword } = userService;

const validationSchema = Yup.object({
  code: Yup.string()
      .length(4, 'Mã xác nhận chỉ 4 chữ số')
      .required('Vui lòng nhập mã xác nhận'),
  newPassword: Yup.string()
      .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
      .max(32, 'Mật khẩu tối đa 32 ký tự')
      .required('Vui lòng nhập mật khẩu'),
  confirmPassword: Yup.string()
      .oneOf([Yup.ref('newPassword'), null], 'Mật khẩu xác nhận không khớp')
      .required('Vui lòng xác nhận mật khẩu'),
});

const ResetPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // Thêm state loading

  const handleSubmit = async (values) => {
    const { code, newPassword } = values;
    setLoading(true); // Bắt đầu loading
    try {
      await resetPassword({ code, newPassword });
      navigate('/login', { replace: true });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false); // Kết thúc loading
    }
  };

  return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        {loading ? ( // Hiển thị Spin khi loading
            <div className='flex-col'>
              <div>
                <h2 className="text-2xl font-bold">vui lòng chờ trong giây lát</h2>
              </div>
              <div className="flex justify-center mt-5">
                <Spin size="large" />
              </div>
            </div>
        ) : (
            <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
              <div className="mb-6 text-center">
                <h2 className="text-2xl font-bold text-blue-700">Nhập mã bảo mật</h2>
                <p className="mt-2 text-gray-600">
                  Vui lòng kiểm tra mã trong email của bạn. Mã này gồm 4 số.
                </p>
              </div>

              <Formik
                  initialValues={{ code: '', newPassword: '', confirmPassword: '' }}
                  validationSchema={validationSchema}
                  onSubmit={handleSubmit}
              >
                {({ isSubmitting }) => (
                    <Form className="space-y-6">
                      <div>
                        <Field
                            name="code"
                            type="text"
                            placeholder="Nhập mã xác nhận"className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <ErrorMessage
                            name="code"
                            component="div"
                            className="mt-1 text-sm text-red-500"
                        />
                      </div>

                      <div>
                        <Field
                            name="newPassword"
                            type="password"
                            placeholder="Nhập mật khẩu mới của bạn"
                            className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <ErrorMessage
                            name="newPassword"
                            component="div"
                            className="mt-1 text-sm text-red-500"
                        />
                      </div>

                      <div>
                        <Field
                            name="confirmPassword"
                            type="password"
                            placeholder="Xác nhận mật khẩu mới của bạn"
                            className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <ErrorMessage
                            name="confirmPassword"
                            component="div"
                            className="mt-1 text-sm text-red-500"
                        />
                      </div>

                      <div className="flex justify-end space-x-4 pt-4">
                        <button
                            type="button"
                            className="rounded-lg bg-gray-300 px-4 py-2 text-gray-700 transition hover:bg-gray-400"
                            onClick={() => navigate('/login')}
                        >
                          Quay lại
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || loading} // Disable khi loading
                            className="rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
                        >
                          Xác nhận</button>
                      </div>
                    </Form>
                )}
              </Formik>
            </div>)}
      </div>
  );
};

export default ResetPassword;