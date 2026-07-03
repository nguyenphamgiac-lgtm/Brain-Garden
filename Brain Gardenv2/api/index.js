// api/index.js - Bộ não Server xử lý lưu trữ tài khoản chạy trên Vercel

// Biến lưu trữ tạm thời danh sách tài khoản (Lưu trong bộ nhớ đệm của Server)
const usersDatabase = {}; 

module.exports = async (req, res) => {
  // CẤU HÌNH CORS: Cho phép mọi máy tính, mọi trình duyệt kết nối đến Server này mà không bị chặn
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*'); 
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Trả phản hồi nhanh cho các yêu cầu kiểm tra đường truyền (Preflight OPTIONS)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const url = req.url;

  // 1. Xử lý ĐĂNG KÝ HỒ SƠ CHƠI (POST /api/signup)
  if (url.includes('/api/signup') && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        const { username, password, profileData } = JSON.parse(body);
        
        if (!username || !password) {
          return res.status(400).json({ message: "Thiếu thông tin tài khoản hoặc mật khẩu!" });
        }
        if (usersDatabase[username]) {
          return res.status(400).json({ message: "Tài khoản Gmail này đã được đăng ký trước đó rồi!" });
        }
        
        // Lưu dữ liệu vào bộ nhớ server
        usersDatabase[username] = { password, profileData };
        return res.status(200).json({ message: "Khởi tạo hồ sơ Cloud thành công!" });
      } catch (err) {
        return res.status(500).json({ message: "Lỗi xử lý dữ liệu hệ thống." });
      }
    });
  }
  
  // 2. Xử lý ĐĂNG NHẬP ĐỒNG BỘ (POST /api/login)
  else if (url.includes('/api/login') && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        const { username, password } = JSON.parse(body);
        const account = usersDatabase[username];
        
        if (!account || account.password !== password) {
          return res.status(400).json({ message: "Tài khoản không tồn tại hoặc sai mật khẩu!" });
        }
        
        // Trả dữ liệu học tập về cho máy mới đăng nhập
        return res.status(200).json({ message: "Đăng nhập thành công", profileData: account.profileData });
      } catch (err) {
        return res.status(500).json({ message: "Lỗi kết nối kiểm tra mật khẩu." });
      }
    });
  }

  // 3. Xử lý TỰ ĐỘNG CẬP NHẬT TIẾN TRÌNH KHI CHƠI (POST /api/save)
  else if (url.includes('/api/save') && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        const { username, profileData } = JSON.parse(body);
        if (usersDatabase[username]) {
          usersDatabase[username].profileData = profileData; // Cập nhật đè dữ liệu mới (Xu, mạng, level cây)
          return res.status(200).json({ message: "Đồng bộ đám mây hoàn tất!" });
        }
        return res.status(404).json({ message: "Không tìm thấy dữ liệu tài khoản." });
      } catch (err) {
        return res.status(500).json({ message: "Lỗi lưu tiến trình." });
      }
    });
  }

  // 4. Xử lý TỰ ĐỘNG TẢI DỮ LIỆU KHI KHỞI ĐỘNG TRANG (GET /api/load)
  else if (url.includes('/api/load') && req.method === 'GET') {
    const queryObject = new URL(req.url, `http://${req.headers.host}`).searchParams;
    const username = queryObject.get('username');
    const account = usersDatabase[username];
    
    if (account) {
      return res.status(200).json({ profileData: account.profileData });
    }
    return res.status(404).json({ message: "Phiên làm việc trống." });
  }
  
  // Đường dẫn không hợp lệ
  else {
    res.status(404).json({ message: "API Route Not Found" });
  }
};