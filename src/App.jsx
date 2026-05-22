  import './App.css';
  import { Label, Textarea } from 'flowbite-react';
  import logo from './assets/logo_2026_R.png';
  import bgImage from './assets/da-nang-cach-ly-them-mot-trung-tam-y-te-ff2-5136635.jpg';
import { useRef, useState, useEffect } from 'react';
  import Swal from 'sweetalert2';
  function App() {
    const textareaRef = useRef(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);

    const [isLoading, setIsLoading] = useState(false);

    const departments = [
      'Phòng Kế hoạch nghiệp vụ',
      'Phòng Tổ chức hành chính',
      'Phòng Điều dưỡng',
      'Phòng Tài chính Kế toán',
      'Khoa Khám bệnh',
      'Khoa Y học cổ truyền - Phục hồi chức năng',
      'Khoa Xét Nghiệm',
      'Khoa Chuẩn đoán hình ảnh',
      'Khoa Hồi sức cấp cứu',
      'Khoa Răng hàm mặt - Mắt',
      'Khoa Tai mũi họng',
      'Khoa Nội - Truyền nhiễm',
      'Khoa Ngoại',
      'Khoa Phẫu thuật - Gây mê hồi sức',
      'Khoa Nhi',
      'Khoa Sản',
      'Khoa Dược',
      'Khoa Kiểm soát nhiễm khuẩn',
    ];

    useEffect(() => {
      const roomInput = document.getElementById('input-room-name');
      if (roomInput && searchTerm.trim() !== '') {
        roomInput.setCustomValidity(''); 
      }
    }, [searchTerm]);

    const filteredDepts = departments.filter((dept) => dept.toLowerCase().includes(searchTerm.toLowerCase()));

    const handleKeyDown = (e) => {
      if (!showDropdown) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((prev) => (prev < filteredDepts.length - 1 ? prev + 1 : prev));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : prev));
      } else if (e.key === 'Enter') {
        if (activeIndex >= 0 && activeIndex < filteredDepts.length) {
          e.preventDefault();
          setSearchTerm(filteredDepts[activeIndex]);
          setShowDropdown(false);
          setActiveIndex(-1);
        }
      }
    };

    const handleAutoResize = (e) => {
      const textarea = e.target;
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsLoading(true); // Bật hiệu ứng chờ

      const formElement = e.target; // Lưu lại form để reset sau
      const formData = new FormData(formElement);
      const timeStamp = new Date().toLocaleString('vi-VN');

      // Đóng gói bưu kiện dữ liệu
      const dataToSubmit = {
        time: timeStamp,
        room: searchTerm.trim(),
        device: formData.get('deviceName').trim(),
        problem: formData.get('problemName').trim(),
      };

      try {
        await fetch(import.meta.env.VITE_GOOGLE_APP_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'text/plain;charset=utf-8',
          },
          body: JSON.stringify(dataToSubmit),
        });

        // HIỆN THÔNG BÁO THÀNH CÔNG VỚI TÔNG MÀU TÍM
        Swal.fire({
          title: 'Thành công!',
          text: `Đã gửi yêu cầu hỗ trợ lúc ${timeStamp}. Tổ IT sẽ tiếp nhận ngay!`,
          icon: 'success',
          iconColor: '#c084fc', // Đổi icon thành màu tím
          confirmButtonText: 'Đóng',
          confirmButtonColor: '#c084fc', // Đổi nút bấm thành màu tím
        });

        // Làm sạch form sau khi gửi
        formElement.reset();
        setSearchTerm('');

        if (textareaRef.current) {
          textareaRef.current.style.height = 'auto';
        }
      } catch (error) {
        console.error('Lỗi kết nối mạng:', error);

        // HIỆN THÔNG BÁO LỖI BẰNG MÀU ĐỎ ĐỂ DỄ NHẬN DIỆN
        Swal.fire({
          title: 'Lỗi mạng!',
          text: 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại wifi/mạng LAN!',
          icon: 'error',
          confirmButtonText: 'Đã hiểu',
          confirmButtonColor: '#d33', // Giữ màu đỏ cho thông báo lỗi
        });
      } finally {
        setIsLoading(false); // Tắt hiệu ứng chờ
      }
    };
    return (
      <div
        className='min-h-screen w-full bg-repeat bg-[length:100%] bg-center text-white flex justify-center items-center p-4'
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className='flex flex-col gap-1 w-full bg-[#101115d3] max-w-3xl p-3 rounded-xl shadow-2xl border border-gray-800'>
          <div className='flex flex-col items-center text-center'>
            <div className='text-3xl font-bold tracking-wide w-full text-white m-2.5'>
              Hệ thống tiếp nhận sự cố kỹ thuật
            </div>
            <img src={logo} className='w-28 sm:w-32 h-auto mb-4' alt='Logo' />
            <h2 className='text-2xl sm:text-3xl font-bold mt-1 text-white uppercase'>Trung tâm y tế phường Hải Châu</h2>
          </div>

          <form onSubmit={handleSubmit} className='flex flex-col gap-5 w-full mt-4'>
            {/* Ô Khoa Phòng */}
            <div className='relative'>
              <div className='mb-2 block'>
                <Label className='text-gray-300 font-semibold'>Tên khoa phòng cần hỗ trợ</Label>
              </div>
              <input
                type='text'
                name='roomName'
                id='input-room-name' // Phải có ID này để useEffect tìm thấy
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowDropdown(true);
                  setActiveIndex(-1);
                  e.target.setCustomValidity(''); // Xóa lỗi ngay khi gõ
                }}
                onFocus={() => setShowDropdown(true)}
                onKeyDown={handleKeyDown}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                placeholder='Nhấn để chọn hoặc gõ tìm khoa...'
                required
                autoComplete='off'
                // Khi nhấn nút Gửi mà trống thì mới hiện thông báo này
                onInvalid={(e) => {
                  if (searchTerm.trim() === '') {
                    e.target.setCustomValidity('Vui lòng chọn hoặc nhập tên Khoa/Phòng!');
                  }
                }}
                className='block w-full border border-gray-600 bg-[#24262d] text-white focus:border-purple-500 focus:ring-purple-500 p-2.5 text-sm rounded-lg placeholder-gray-400'
              />
              {showDropdown && filteredDepts.length > 0 && (
                <ul className='absolute z-50 w-full mt-1 max-h-60 overflow-y-auto bg-[#1a1c23] border border-gray-700 rounded-lg shadow-xl'>
                  {filteredDepts.map((dept, index) => (
                    <li
                      key={index}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setSearchTerm(dept);
                        setShowDropdown(false);
                      }}
                      onMouseMove={() => setActiveIndex(index)}
                      className={`px-4 py-2 text-sm text-gray-200 cursor-pointer ${index === activeIndex ? 'bg-purple-600' : 'hover:bg-purple-700'}`}
                    >
                      {dept}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Ô Thiết Bị */}
            <div>
              <div className='mb-2 block'>
                <Label className='text-gray-300 font-semibold'>Thiết bị cần hỗ trợ</Label>
              </div>
              <input
                name='deviceName'
                required
                onInvalid={(e) => e.target.setCustomValidity('Vui lòng nhập tên thiết bị!')}
                onInput={(e) => e.target.setCustomValidity('')}
                className='block w-full border border-gray-600 bg-[#24262d] text-white focus:border-purple-500 focus:ring-purple-500 p-2.5 text-sm rounded-lg placeholder-gray-400'
                placeholder='Ví dụ: Máy tính, Máy in...'
              />
            </div>

            {/* Ô Sự Cố */}
            <div>
              <div className='mb-2 block'>
                <Label className='text-gray-300 font-semibold'>Sự cố của bạn đang gặp phải</Label>
              </div>
              <Textarea
                name='problemName'
                ref={textareaRef}
                onChange={handleAutoResize}
                rows={2}
                required
                onInvalid={(e) => e.target.setCustomValidity('Vui lòng mô tả sự cố!')}
                onInput={(e) => {
                  e.target.setCustomValidity('');
                  handleAutoResize(e);
                }}
                style={{ resize: 'none', overflow: 'hidden', backgroundColor: '#24262d', color: 'white' }}
                className='block w-full border border-gray-600 focus:border-purple-500 focus:ring-purple-500 p-2.5 text-sm rounded-lg placeholder-gray-400'
                placeholder='Mô tả ngắn gọn lỗi đang gặp phải...'
              />
            </div>

            <div className='w-full mt-4 flex justify-center'>
              <button
                type='submit'
                disabled={isLoading} // Khóa nút khi đang load
                className={`flex items-center justify-center w-1/2 sm:w-1/3 text-white font-bold py-3 rounded-lg shadow-lg transition duration-200 ${
                  isLoading ? 'bg-purple-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'
                }`}
              >
                {isLoading ? (
                  <>
                    <svg
                      className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                    >
                      <circle
                        className='opacity-25'
                        cx='12'
                        cy='12'
                        r='10'
                        stroke='currentColor'
                        strokeWidth='4'
                      ></circle>
                      <path
                        className='opacity-75'
                        fill='currentColor'
                        d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                      ></path>
                    </svg>
                    Đang gửi...
                  </>
                ) : (
                  'Gửi'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  export default App;
