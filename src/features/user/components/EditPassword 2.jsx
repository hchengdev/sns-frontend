import * as Yup from 'yup';
import { ref } from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import userService from '../services/user';

const validationSchema = Yup.object({
  password: Yup.string()
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    .max(32, 'Mật khẩu chỉ tối đa 32 ký tự')
    .required('Vui lòng nhập mật khẩu'),
  newPassword: Yup.string()
    .min(6, 'Mật khẩu mới phải có ít nhất 6 ký tự')
    .max(32, 'Mật khẩu chỉ tối đa 32 ký tự')
    .required('Vui lòng nhập mật khẩu mới'),
  confirmNewPassword: Yup.string()
    .oneOf([ref('newPassword'), null], 'Mật khẩu xác nhận không khớp')
    .required('Vui lòng xác nhận mật khẩu mới'),
});

const { updatePassWord: editPassword } = userService;

const UpdatePassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (values) => {
    const { password, newPassword } = values;
    try {
      await dispatch(
        editPassword({ currentPassword: password, newPassword }),
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className="tab-pane fade m-auto h-[85vh] w-[60%] pt-40"
      id="edit-profile"
    >
      <div className="set-title mb-6">
        <h5 className="mb-1 text-4xl font-semibold">Update Password</h5>
      </div>

      <div className="stg-form-area">
        <Formik
          enableReinitialize
          initialValues={{
            password: '',
            newPassword: '',
            confirmNewPassword: '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="c-form space-y-4">
              <div>
                <label className="mb-1 block">Password</label>
                <Field
                  name="password"
                  type="password"
                  placeholder="Your Old Password"
                  className="w-full rounded-md border border-gray-300 bg-slate-200 p-2 focus:border-transparent focus:outline-none"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-600"
                />
              </div>

              <div>
                <label className="mb-1 block">New Password</label>
                <Field
                  name="newPassword"
                  type="password"
                  placeholder="Your new password"
                  className="w-full rounded-md border border-gray-300 bg-slate-200 p-2 focus:border-transparent focus:outline-none"
                />
                <ErrorMessage
                  name="newPassword"
                  component="div"
                  className="text-red-600"
                />
              </div>

              <div>
                <label className="mb-1 block">Confirm New Password</label>
                <Field
                  name="confirmNewPassword"
                  type="password"
                  placeholder="Confirm your new password"
                  className="w-full rounded-md border border-gray-300 bg-slate-200 p-2 focus:border-transparent focus:outline-none"
                />
                <ErrorMessage
                  name="confirmNewPassword"
                  component="div"
                  className="text-red-600"
                />
              </div>

              <div className="float-right flex space-x-4 pt-4">
                <button
                  className="rounded-full bg-orange-600 px-4 py-2 text-white transition duration-300 hover:bg-orange-500"
                  type="submit"
                  disabled={isSubmitting}
                >
                  Save
                </button>
                <button
                  className="rounded-full bg-gray-300 px-4 py-2 text-gray-700 transition duration-300 hover:bg-gray-400"
                  type="button"
                  onClick={() => navigate('/me')}
                >
                  Cancel
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default UpdatePassword;
