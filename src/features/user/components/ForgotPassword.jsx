import * as Yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import userService from '../services/user';

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
  const dispatch = useDispatch();

  const handleSubmit = async (values) => {
    const { code, newPassword } = values;
    try {
      await dispatch(resetPassword({ code, newPassword }));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
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
                  placeholder="Nhập mã xác nhận"
                  className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  disabled={isSubmitting}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
                >
                  Xác nhận
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ResetPassword;
