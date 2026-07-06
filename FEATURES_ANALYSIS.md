# 📊 Phân tích tính năng — Linkora (Rút gọn URL & Tạo QR Code)

> Tài liệu phân tích sản phẩm theo **góc nhìn người dùng**: hiện trạng, những gì
> còn thiếu, và roadmap tính năng để nâng tầm sản phẩm từ "demo đẹp" thành
> "sản phẩm thật sự dùng được".

---

## 1. Hiện trạng dự án (đã có gì?)

Sau khi đọc source code, đây là bức tranh thực tế:

| Thành phần | Trạng thái | Ghi chú |
|---|---|---|
| Giao diện rút gọn URL | ✅ Đẹp, hoàn chỉnh | Glassmorphism, animation mượt |
| Giao diện tạo QR | ✅ Đẹp, hoàn chỉnh | Đổi màu, chọn mức chống lỗi |
| Rút gọn URL thật | ❌ **Đang là mock** | `generateSlug()` tạo slug ngẫu nhiên ở client, **không lưu đâu cả** |
| Redirect link ngắn | ❌ Chưa có | Bấm vào `sho.rt/abc123` sẽ không đi đâu — chưa có backend |
| Tạo QR | ⚠️ Phụ thuộc bên thứ 3 | Gọi API công khai `goqr.me`, mất mạng là hỏng |
| Lưu trữ / Database | ❌ Chưa có | Không có DB, không có persistence |
| Tài khoản người dùng | ❌ Chưa có | |
| Thống kê / Analytics | ❌ Chưa có | |

**Kết luận:** Đây hiện là **frontend prototype**. Phần "linh hồn" của một dịch vụ
rút gọn link — *lưu link và điều hướng (redirect)* — vẫn chưa tồn tại. Đây là ưu
tiên số 1 phải làm trước khi nghĩ đến tính năng nâng cao.

---

## 2. Nền tảng bắt buộc phải có (Must-have Core)

> Không có nhóm này thì sản phẩm **chưa chạy được thật**. Đây là điều kiện cần.

### 2.1. Backend + Redirect thật ⭐ (ưu tiên cao nhất)
- API `POST /api/shorten` để tạo và **lưu** link vào database.
- Route `GET /:slug` để **điều hướng 301/302** về link gốc.
- Database (PostgreSQL / MongoDB / Redis) lưu ánh xạ `slug → originalUrl`.
- **Góc người dùng:** "Tôi rút gọn xong, gửi cho bạn, bạn bấm vào và *nó thật sự
  mở ra được*." — Đây là kỳ vọng tối thiểu.

### 2.2. Chống trùng & chống mất slug
- Kiểm tra slug đã tồn tại chưa (tránh 2 link đè nhau).
- Nếu cùng một URL gốc → có option trả về link cũ thay vì tạo mới (tiết kiệm).

### 2.3. Xử lý lỗi & trạng thái link
- Trang "Link không tồn tại / đã hết hạn" thân thiện (thay vì lỗi 404 trơ trọi).
- Validate URL chặt hơn ở server (chống nhập rác).

---

## 3. Tính năng CẦN THIẾT để cạnh tranh (High-value)

> Đây là những gì người dùng của Bitly, TinyURL, Rebrandly... **mong đợi**.

### 3.1. 📈 Thống kê lượt click (Analytics) — *tính năng "hút khách" nhất*
Người dùng rút gọn link không chỉ để cho ngắn, mà để **đo lường**:
- Tổng số lượt click, biểu đồ theo thời gian (ngày/tuần/tháng).
- **Quốc gia / thành phố** của người click (dùng IP geolocation).
- **Thiết bị / trình duyệt / hệ điều hành**.
- **Nguồn truy cập (referrer)** — click đến từ Facebook, Zalo, email...?
- **Góc người dùng:** "Tôi đăng link lên 3 nơi, muốn biết nơi nào hiệu quả nhất."

### 3.2. ✏️ Tùy chỉnh slug (Custom alias)
- Cho người dùng tự đặt: `sho.rt/khuyen-mai-tet` thay vì `sho.rt/a1B2c3`.
- **Góc người dùng:** Link có ý nghĩa → dễ nhớ, dễ tin, chuyên nghiệp hơn.

### 3.3. 📚 Lịch sử link của tôi (History / Dashboard)
- Danh sách các link đã tạo, tìm kiếm, sao chép lại, xóa.
- Ở mức tối thiểu (chưa cần đăng nhập): lưu vào **LocalStorage** để không mất
  sau khi refresh — hiện tại kết quả **biến mất ngay khi F5**.
- **Góc người dùng:** "Cái link hồi sáng tôi tạo đâu rồi?"

### 3.4. ⏰ Link hết hạn & giới hạn lượt click
- Đặt ngày hết hạn (link tự chết sau 7 ngày).
- Giới hạn số lần click (dùng cho vé/khuyến mãi số lượng có hạn).
- **Góc người dùng:** Chia sẻ tài liệu nhạy cảm, không muốn nó sống mãi.

### 3.5. 🔒 Link có mật khẩu
- Người click phải nhập mật khẩu mới được chuyển tiếp.
- **Góc người dùng:** Gửi link tài liệu nội bộ an toàn hơn.

### 3.6. QR Code "xịn" hơn
- **Render phía client** (thư viện `qrcode` / `qr-code-styling`) → không phụ
  thuộc `goqr.me`, chạy offline, nhanh, không lộ dữ liệu ra bên thứ 3.
- Tải nhiều định dạng: **PNG, SVG (vector), PDF**.
- **Chèn logo** vào giữa QR (thương hiệu).
- QR nghệ thuật: bo góc dot, gradient, khung viền có call-to-action ("Quét tôi").
- **QR động (Dynamic QR):** QR trỏ tới link ngắn → *đổi đích đến mà không cần
  in lại QR*. Đây là tính năng bán được tiền.

---

## 4. Tính năng ĐỘC LẠ / tạo khác biệt (Wow-factor)

> Những thứ khiến người dùng nói "ồ, cái này hay đấy" và quay lại.

### 4.1. 🎯 Link đa đích theo ngữ cảnh (Smart / Deep Links)
- **Theo thiết bị:** iPhone → App Store, Android → Google Play, PC → website.
- **Theo quốc gia/ngôn ngữ:** khách VN → trang tiếng Việt, khách nước ngoài → EN.
- **Theo thời gian:** ngoài giờ làm việc → trang "để lại lời nhắn".
- **Góc người dùng:** Một link duy nhất trên card visit, phục vụ mọi đối tượng.

### 4.2. 🔗 Link-in-bio / Micro landing page
- Một trang gom nhiều link (kiểu Linktree) — `sho.rt/@tenban`.
- **Góc người dùng:** Dân bán hàng / KOL chỉ có 1 link trên Instagram/TikTok bio.

### 4.3. 🤖 A/B testing & xoay vòng link
- Một link ngắn phân phối traffic tới nhiều URL để test tỷ lệ chuyển đổi.

### 4.4. 🛡️ Trang cảnh báo an toàn (Safe redirect / Preview)
- Trước khi chuyển tiếp, hiện màn hình preview đích đến + quét malware.
- **Góc người dùng:** Người nhận thấy an tâm, giảm cảm giác "link lạ nguy hiểm"
  vốn là điểm yếu lớn nhất của mọi dịch vụ rút gọn link.

### 4.5. 📅 UTM Builder tích hợp
- Form gắn `utm_source`, `utm_medium`, `utm_campaign` ngay khi rút gọn.
- **Góc người dùng:** Dân marketing đo campaign mà không cần công cụ ngoài.

### 4.6. 🖼️ Tùy biến preview khi chia sẻ (Open Graph)
- Cho đặt tiêu đề / ảnh / mô tả riêng hiển thị khi dán link lên Facebook, Zalo.
- **Góc người dùng:** Link của tôi khi share trông "có đầu tư", tăng tỷ lệ bấm.

### 4.7. 🔔 Thông báo & webhook
- Nhận thông báo khi link đạt mốc (100, 1000 clicks) hoặc gửi webhook về hệ thống.

### 4.8. 📦 Rút gọn hàng loạt (Bulk shorten)
- Dán 50 link cùng lúc / import CSV, xuất kết quả CSV.
- **Góc người dùng:** Agency xử lý hàng trăm link mỗi chiến dịch.

---

## 5. Tài khoản, gói dịch vụ & vận hành

> Nhóm này biến sản phẩm thành **dịch vụ có thể kiếm tiền và duy trì**.

- **Đăng ký / Đăng nhập** (Email, Google, GitHub OAuth) — để link gắn với người
  dùng, đồng bộ đa thiết bị.
- **Gói Free / Pro** — miễn phí giới hạn, trả phí mở khóa analytics chi tiết,
  custom domain, QR không watermark.
- **Custom domain** — người dùng dùng tên miền riêng: `link.congty.com/abc`
  thay vì `sho.rt`. Đây là tính năng Pro bán chạy nhất.
- **API key cho lập trình viên** — cho phép tích hợp vào hệ thống khác.
- **Team / workspace** — nhiều người cùng quản lý link trong một tổ chức.

---

## 6. An toàn, chất lượng & trải nghiệm (Quan trọng nhưng dễ bỏ quên)

### Bảo mật (phải có ngay khi lên backend)
- **Rate limiting** — chống spam tạo link / brute-force slug.
- **Chống lạm dụng** — quét URL độc hại (Google Safe Browsing API), chặn
  phishing/malware → nếu không, tên miền của bạn sẽ bị Google/Facebook block.
- **Chống open redirect** — validate và giới hạn domain đích khi cần.
- CAPTCHA nhẹ cho người dùng ẩn danh.

### Trải nghiệm người dùng (UX)
- **Bàn phím & tốc độ:** Enter để rút gọn, tự động focus, auto-select kết quả.
- **Chế độ sáng/tối (Light/Dark):** hiện đang chỉ có nền tối.
- **Đa ngôn ngữ (i18n):** VN + EN để mở rộng thị trường.
- **PWA / cài đặt như app** trên điện thoại, dùng offline cho QR.
- **Accessibility (a11y):** đủ contrast, đọc được bằng screen reader.
- **SEO & Open Graph** cho trang chủ để được tìm thấy.
- **Chia sẻ nhanh:** nút share tới Zalo/Messenger/Email, tải QR về ngay.

### Chất lượng kỹ thuật
- **Kiểm thử** (unit test cho `isValidUrl`, `generateSlug`; e2e cho luồng chính).
- **Xử lý lỗi mạng** khi tạo QR (hiện chưa có fallback nếu API lỗi).
- **Trạng thái loading/empty/error** đầy đủ cho mọi màn hình.

---

## 7. Roadmap đề xuất (làm theo thứ tự này)

### 🟥 Giai đoạn 1 — Cho nó chạy thật (1–2 tuần)
1. Backend + database + **redirect thật** (mục 2.1).
2. Lưu lịch sử vào LocalStorage (mục 3.3) — thắng nhanh, không cần backend.
3. QR render phía client, tải PNG/SVG (mục 3.6).
4. Validate + xử lý lỗi + trang 404 link (mục 2.3).

### 🟧 Giai đoạn 2 — Cạnh tranh được (2–4 tuần)
5. Custom slug (mục 3.2).
6. Analytics cơ bản: đếm click + biểu đồ (mục 3.1).
7. Đăng nhập + Dashboard "link của tôi" (mục 5).
8. Link hết hạn / mật khẩu (mục 3.4, 3.5).

### 🟩 Giai đoạn 3 — Nổi bật & kiếm tiền (sau đó)
9. Dynamic QR + QR có logo (mục 3.6, 4).
10. Smart links theo thiết bị/quốc gia (mục 4.1).
11. Link-in-bio (mục 4.2).
12. Custom domain + gói Pro + API (mục 5).

---

## 8. Tóm tắt 1 dòng

> **Ưu tiên trước mắt:** biến phần rút gọn từ *mock* thành *redirect thật có lưu
> trữ*, thêm *lịch sử LocalStorage* và *QR render client-side*. Ba việc này biến
> demo thành sản phẩm dùng được. Sau đó, **analytics + custom slug + đăng nhập**
> là bộ ba đưa sản phẩm ngang tầm các dịch vụ phổ biến; còn **Dynamic QR, Smart
> links và Link-in-bio** là những "chiêu độc" tạo khác biệt và bán được tiền.

---

*Tài liệu tạo tự động dựa trên phân tích source code Linkora — cập nhật 2026-07-06.*
