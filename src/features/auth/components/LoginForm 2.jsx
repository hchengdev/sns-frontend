import { login } from '../services/auth';
import Footer from '../../../components/Footer';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { object, string } from 'yup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated]);

  const loginSchema = object({
    email: string().email('Email không hợp lệ').required('Vui lòng nhập email'),
    password: string()
      .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
      .max(32, 'Mật khẩu tối đã 32 ký tự')
      .required('Vui lòng nhập mật khẩu'),
  });

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      try {
        dispatch(login(values));
      } catch (error) {
        console.log('LOGIN ERROR : ', error);
      }
    },
  });

  return (
    <>
      <div className="flex h-screen items-center justify-center bg-blue-100">
        <div className="flex w-8/12 flex-col items-center space-x-6 lg:flex-row">
          <div className="mb-8 text-center lg:mb-0 lg:text-left">
            <h1 className="text-4xl font-bold text-customGray lg:text-5xl">
              Social media
            </h1>
            <p className="mt-4 text-lg font-medium text-gray-700 lg:text-xl">
              Connect with friends and the world around you on Social.
            </p>
          </div>
          <form
            onSubmit={formik.handleSubmit}
            className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg"
          >
            <input
              type="text"
              name="email"
              placeholder="Email"
              className={`mb-4 w-full border p-3 ${
                formik.errors.email && formik.touched.email
                  ? 'border-red-500'
                  : 'border-gray-300'
              } rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.errors.email && formik.touched.email && (
              <p className="mb-2 text-sm text-red-500">{formik.errors.email}</p>
            )}

            <input
              type="password"
              name="password"
              placeholder="Mật khẩu"
              className={`mb-4 w-full border p-3 ${
                formik.errors.password && formik.touched.password
                  ? 'border-red-500'
                  : 'border-gray-300'
              } rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.errors.password && formik.touched.password && (
              <p className="mb-2 text-sm text-red-500">
                {formik.errors.password}
              </p>
            )}

            <button
              type="submit"
              className="w-full rounded-lg bg-customGray py-3 font-semibold text-white transition duration-300 hover:bg-blue-500"
            >
              Login
            </button>

            <a href="#" className="mt-4 block text-center text-blue-600">
              Forgot password?
            </a>

            <hr className="my-6 border-gray-200" />

            <Link
              to={'/register'}
              className="block w-full rounded-lg bg-green-600 py-3 text-center font-semibold text-white transition duration-300 hover:bg-green-500"
            >
              Create a new account
            </Link>
            <div className="my-6 flex items-center justify-center">
              <hr className="w-10 border-gray-300" />
              <p className="mx-4 text-center text-xs text-gray-700">
                Or Log in with
              </p>
              <hr className="w-10 border-gray-300" />
            </div>
            <div className="w-full">
              <a
                href="http://localhost:8080/v1/auth/google"
                role="button"
                className="block w-full rounded-lg bg-blue-600 py-3 text-center font-semibold text-white transition duration-300 hover:bg-blue-500"
              >
                <FontAwesomeIcon icon={faGoogle} className="mr-2" />
                Đăng Nhập bằng Google
              </a>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}
