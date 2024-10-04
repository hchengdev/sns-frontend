function Footer() {
  const titles = [
    'Social Media',
    'Giới thiệu',
    'Blog',
    'Việc làm',
    'Trợ giúp',
    'API',
    'Quyền riêng tư',
    'Điều khoản',
    'Vị trí',
    'Social Lite',
    'Threads',
    'Tải thông tin người liên hệ lên & người không phải người dùng',
    'Meta đã xác minh',
  ];
  return (
    <footer className=" mx-auto px-4  bg-blue-100 flex justify-center ">
      <div className="my-5">
        <div className="container">
          <section className="mb-4">
            {titles.map((title, i) => {
              return (
                <a
                  key={i}
                  className="btn btn-link btn-floating btn-lg text-gray-800 m-1 text-sm"
                  href="#!"
                  role="button"
                >
                  {title}
                </a>
              );
            })}
          </section>
          <div className="text-center text-sm text-gray-700">
            © 2024 Social:{' '}
            <a className="text-gray-800" href="https://mdbootstrap.com/">
              Social.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
