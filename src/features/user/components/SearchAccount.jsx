import * as Yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import userService from '../services/user';

const { emailConfirmation } = userService;

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Email không hợp lệ')
    .required('Vui lòng nhập email'),
});

const EmailConfirmation = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (values) => {
    const { email } = values;
    try {
      await dispatch(emailConfirmation({ email }));
      navigate('/reset-password', { replace: true });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-blue-700">Quên mật khẩu</h2>
          <p className="mt-2 text-gray-600">
            Vui lòng nhập email để nhận mã xác nhận.
          </p>
        </div>

        <Formik
          initialValues={{ email: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-6">
              <div>
                <Field
                  name="email"
                  type="email"
                  placeholder="Nhập email của bạn"
                  className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage
                  name="email"
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

export default EmailConfirmation;
