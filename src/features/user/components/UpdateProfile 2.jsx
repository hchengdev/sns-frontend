import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import userService from '../services/user';
import { useNavigate } from 'react-router-dom';
import { AiOutlineCamera } from 'react-icons/ai';

const { updateUser, getUser } = userService;

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  phone: Yup.string()
    .trim()
    .matches(/^0\d{9}$/, 'Số điện thoại phải bắt đầu bằng 0 và có 10 chữ số')
    .required('Vui lòng nhập số điện thoại'),
  gender: Yup.string().required('Gender is required'),
  birthday: Yup.date()
    .required('Birthday is required')
    .max(new Date(), 'Ngày sinh không được lớn hơn ngày hiện tại'),
  biography: Yup.string().max(500, 'Biography must be at most 500 characters'),
  address: Yup.string().required('Address is required'),
});



const UpdateProfile = () => {
  const [user, setUser] = useState({
    profilePicture: '',
    name: '',
    gender: '',
    birthday: '',
    biography: '',
    address: '',
    phone: '',
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [profilePicture, setProfilePicture] = useState('');
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };


  const navigate = useNavigate();
  ;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getUser();
        setUser({
          profilePicture: response.profilePicture || '',
          name: response.name || '',
          gender: response.gender || '',
          birthday: response.birthday || '',
          biography: response.biography || '',
          address: response.address || '',
          phone: response.phone || '',
        });
      } catch (err) {
        console.error('Error fetching user:', err);
      }

    };
    fetchData();
  }, []);

  const handleSubmit = async (values, { setSubmitting }) => {
    const formData = new FormData();
    const fileInput = document.querySelector('input[type="file"]');
    formData.append('name', values.name);
    formData.append('phone', values.phone);
    formData.append('gender', values.gender);
    formData.append('birthday', values.birthday);
    formData.append('biography', values.biography);
    formData.append('address', values.address);
    if (fileInput.files[0]) {
      formData.append('profilePicture', fileInput.files[0]);
    }

    try {
      await updateUser(formData);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="tab-pane fade m-auto w-[60%] py-20" id="edit-profile">
      <div className="set-title mb-6">
        <h5 className="mb-1 text-4xl font-semibold">Update Profile</h5>
        <span className="text-lg text-gray-500">
          People on Social will get to know you with the info below
        </span>
      </div>

      <div className="stg-form-area">
        <Formik
          enableReinitialize
          initialValues={{
            profilePicture: user.profilePicture || '',
            name: user.name || '',
            phone: user.phone || '',
            gender: user.gender || '',
            birthday: user.birthday || '',
            biography: user.biography || '',
            address: user.address || '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="c-form space-y-4">
              <div className="flex items-center">
                {previewImage ? (
                  <img
                    src={previewImage}
                    className="h-32 w-32 rounded-full object-cover"
                    alt="Xem trước tạm thời"
                  />
                ) : (
                  <img
                    src={
                      user.profilePicture
                        ? `/apihost/image/${user.profilePicture}`
                        : ''
                    }
                    className="h-32 w-32 rounded-full object-cover"
                    alt="Ảnh đại diện đã tải lên"
                  />
                )}

                <button
                  type="button"
                  className="my-3 ml-4 h-[30px] cursor-pointer rounded-lg border bg-slate-200 p-1 text-center text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  onClick={() => {
                    document.getElementById('uploadImage').click();
                  }}
                >
                  {/* Input file ẩn */}
                  <input
                    id="uploadImage"
                    type="file"
                    accept="image/*"
                    onChange={(event) => {
                      const file = event.currentTarget.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setPreviewImage(reader.result);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="hidden"
                  />
                  Thay đổi ảnh
                </button>
              </div>

              <div>
                <label className="mb-1 block">Name</label>
                <Field
                  name="name"
                  type="text"
                  placeholder="Your name"
                  className="w-full rounded-md border border-gray-300 bg-slate-200 p-2 focus:border-transparent focus:outline-none"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-red-600"
                />
              </div>

              <div>
                <label className="mb-1 block">Phone Number</label>
                <Field
                  name="phone"
                  type="text"
                  placeholder="Your phone number"
                  className="w-full rounded-md border border-gray-300 bg-slate-200 p-2 focus:border-transparent focus:outline-none"
                />
                <ErrorMessage
                  name="phone"
                  component="div"
                  className="text-red-600"
                />
              </div>

              <div>
                <label className="mb-1 block">Gender</label>
                <div className="flex space-x-4">
                  {['Male', 'Female', 'Custom'].map((gender, index) => (
                    <div key={index} className="flex items-center">
                      <Field
                        type="radio"
                        name="gender"
                        value={gender}
                        className="mr-2"
                      />
                      <label>{gender}</label>
                    </div>
                  ))}
                </div>
                <ErrorMessage
                  name="gender"
                  component="div"
                  className="text-red-600"
                />
              </div>

              <div>
                <label className="mb-1 block">Your Birthday</label>
                <Field
                  name="birthday"
                  type="date"
                  className="w-full rounded-md border border-gray-300 bg-slate-200 p-2 focus:border-transparent focus:outline-none"
                />
                <ErrorMessage
                  name="birthday"
                  component="div"
                  className="text-red-600"
                />
              </div>

              <div>
                <label className="mb-1 block">Hobby</label>
                <Field
                  name="biography"
                  as="textarea"
                  rows="3"
                  placeholder="Write something about yourself"
                  className="w-full rounded-md border border-gray-300 bg-slate-200 p-2 focus:border-transparent focus:outline-none"
                />
                <ErrorMessage
                  name="biography"
                  component="div"
                  className="text-red-600"
                />
              </div>

              <div>
                <label className="mb-1 block">Address</label>
                <Field
                  name="address"
                  type="text"
                  placeholder="Your address"
                  className="w-full rounded-md border border-gray-300 bg-slate-200 p-2 focus:border-transparent focus:outline-none"
                />
                <ErrorMessage
                  name="address"
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

export default UpdateProfile;
