# BookStore Online — Bài tổng hợp Day 3 + Day 4

Project này gộp các nội dung chính từ `Teaching_Day3` và `Teaching_Day4` thành một ứng dụng Expo + React Native + TypeScript duy nhất.

## Nội dung đã tích hợp

- Header: Flexbox `row`, `space-between`, `alignItems: center`.
- Card sách dạng grid 2 cột, `flexWrap`, `aspectRatio`.
- Category Chips có `flexWrap` và lựa chọn danh mục.
- Badge `-x%` / `Mới` dùng `position: absolute`.
- Nút giỏ hàng nổi cố định và hiển thị số lượng.
- Màn hình Home có tìm kiếm theo tên sách/tác giả.
- Màn hình chi tiết sách có `ScrollView` và thanh "Thêm vào giỏ" cố định.
- Bottom Tab gồm Trang chủ, Danh mục, Giỏ hàng, Tài khoản.
- Giỏ hàng có tăng/giảm số lượng, xoá sản phẩm, tính tổng tiền.

## Chạy project

```bash
npm install
npx expo start
```

Hoặc:

```bash
npm run android
```

```bash
npm run web
```

## GitHub

Project này đã loại bỏ `.git` cũ của các bài mẫu để bạn tạo một repository mới.

```bash
git init
git add .
git commit -m "Complete BookStore Day3 Day4"
git branch -M main
git remote add origin https://github.com/zenngoc21/tuan4-typscript.git
git push -u origin main
```

Nếu remote đã tồn tại, bỏ qua dòng `git remote add origin ...`.

## Màn hình Tài khoản

Mục Tài khoản hiện có:
- Hồ sơ cá nhân: xem/sửa họ tên, email, số điện thoại.
- Thống kê: số đơn, số sách đã mua, tổng chi tiêu.
- Đơn hàng: xem danh sách, trạng thái và chi tiết từng đơn.
- Địa chỉ: thêm, sửa, xoá và đặt địa chỉ mặc định.
- Mã giảm giá: xem voucher và mô phỏng áp dụng.
- Thông báo: bật/tắt thông báo đơn hàng và email khuyến mãi.
- Bảo mật: đổi mật khẩu với kiểm tra mật khẩu mới và xác nhận mật khẩu.
- Đơn hàng: huỷ đơn ở trạng thái “Chờ xác nhận”.
- Hỗ trợ, điều khoản, đăng xuất và xoá tài khoản demo.
- Luồng thanh toán tạo đơn hàng và chuyển đơn vừa tạo vào lịch sử Tài khoản.

Lưu ý: đây là bản frontend demo, dữ liệu hồ sơ, địa chỉ và đơn hàng đang lưu bằng state trong ứng dụng nên sẽ reset khi app khởi động lại.
