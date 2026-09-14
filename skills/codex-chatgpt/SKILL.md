---
name: codex-chatgpt
description: "Sử dụng ChatGPT Web (Pro, Extra High, High, Medium, Light) hoặc Codex GPT-6-Astra thông qua codex-chatgpt-web bridge để giải quyết các bài toán suy luận, lập trình hoặc tham khảo góc nhìn từ OpenAI mà không tốn phí API token."
---

# Codex ChatGPT Web Skill

Skill này cho phép Antigravity kết nối và khai thác toàn bộ sức mạnh của tài khoản **ChatGPT Web (Pro / Plus)** và **Codex Native (GPT-6-Astra)** thông qua cầu nối `codex-chatgpt-web` đang chạy ngầm trên máy cục bộ (cổng `17841`).

## Khi Nào Nên Kích Hoạt Skill Này?
- Khi bạn cần góc nhìn phản biện hoặc giải pháp từ mô hình OpenAI tiên tiến nhất (GPT-4o, ChatGPT Pro, GPT-6-Astra) hoàn toàn miễn phí token.
- Khi cần phân tích sâu các bài toán thuật toán hóc búa, thiết kế kiến trúc hệ thống phân tán phức tạp (sử dụng tier `pro` hoặc `high`).
- Khi cần rà soát mã nguồn (code review) độc lập hoặc sinh mã chuẩn hóa từ Codex Native.
- Khi cần phản hồi nhanh gọn với tier `light` hoặc cân bằng với tier `medium`.

---

## Cách Sử Dụng Trong Antigravity Session

### Cách 1: Gọi Qua MCP Tools (Khuyên dùng)
Antigravity tự động nhận diện 2 công cụ MCP sau khi đăng ký `codex-chatgpt-web`:

1. **`ask_chatgpt_web`**:
   - `prompt`: Nội dung câu hỏi hoặc bài toán cần giải quyết.
   - `model`: Chọn một trong các model:
     - `chatgpt-web/pro` hoặc `pro`: Suy luận cấp độ cao nhất của ChatGPT Pro.
     - `chatgpt-web/extra-high` hoặc `xhigh`: Mức suy luận cực cao (Deep Reasoning).
     - `chatgpt-web/high` hoặc `high`: Suy luận chuyên sâu (High reasoning).
     - `chatgpt-web/medium` hoặc `medium`: Mặc định, cân bằng giữa tốc độ và chất lượng.
     - `chatgpt-web/light` hoặc `light`: Tốc độ phản hồi tức thì.
   - `cwd`: (Tùy chọn) Thư mục làm việc hiện tại.

2. **`ask_codex_native`**:
   - `prompt`: Tác vụ lập trình chuyên sâu gửi tới engine Codex.
   - `model`: Mặc định là `gpt-6-astra`.

---

### Cách 2: Gọi Trực Tiếp Từ CLI `codex-web`

CLI `codex-web` đã được tối ưu hóa cho phép agent hoặc người dùng chạy nhanh từ terminal:

```bash
# 1. Gọi mặc định (Medium - cân bằng)
codex-web "Giải thích nguyên lý Event Loop trong JavaScript"

# 2. Sử dụng Pro Mode cho suy luận kiến trúc phức tạp
codex-web -m pro "Thiết kế kiến trúc hệ thống Pub/Sub quy mô 1 triệu CCU"

# 3. Sử dụng Extra High / High cho bài toán thuật toán
codex-web -m xhigh "Tối ưu hóa bài toán Traveling Salesperson với ràng buộc thời gian thực"

# 4. Sử dụng Codex Native GPT-6-Astra cho code
codex-web -m astra "Viết unit test coverage 100% cho file src/auth.service.ts"

# 5. Phản hồi nhanh (Light)
codex-web -m light "Chuyển mã SQL này sang Prisma schema"

# 6. Pipe nội dung file vào CLI
cat schema.prisma | codex-web -m pro "Review và chỉ ra các rủi ro hiệu năng"
```

---

## Bảng So Sánh Các Model

| Model | Tham số CLI / Tool | Tốc độ | Độ sâu suy luận | Mục đích khuyên dùng |
| :--- | :--- | :---: | :---: | :--- |
| **ChatGPT Pro** | `pro` / `chatgpt-web/pro` | Chậm | Cực sâu (Max) | Kiến trúc phức tạp, thiết kế hệ thống lớn, debug lỗi trừu tượng |
| **ChatGPT Extra High** | `xhigh` / `chatgpt-web/extra-high` | Vừa | Rất sâu | Toán học, thuật toán, bảo mật chuyên sâu |
| **ChatGPT High** | `high` / `chatgpt-web/high` | Vừa | Sâu | Code review, tối ưu hiệu năng cơ sở dữ liệu |
| **ChatGPT Medium** | `medium` / `chatgpt-web/medium` | Nhanh | Cân bằng | Tác vụ tổng quát, giải thích code, viết docstring (Mặc định) |
| **ChatGPT Light** | `light` / `chatgpt-web/light` | Rất nhanh | Cơ bản | Format dữ liệu, sửa lỗi chính tả, convert cú pháp |
| **Codex GPT-6-Astra** | `astra` / `gpt-6-astra` | Nhanh | Chuyên coding | Refactor code phức tạp, sinh unit test, code generation |

---

## Xử Lý Sự Cố (Troubleshooting)

1. **Kiểm tra trạng thái cầu nối:**
   ```bash
   codex-web --status
   ```
2. **Nếu cổng 17841 báo OFFLINE:**
   - Đảm bảo bridge `codex-chatgpt-web` đang chạy trên máy (`lsof -i :17841`).
   - Nếu chưa khởi động, hãy khởi động bridge theo hướng dẫn của `miuuyy/codex-chatgpt-web`.
3. **Session hết hạn hoặc lỗi đăng nhập:**
   - Mở giao diện trình duyệt điều khiển của bridge để làm mới phiên ChatGPT Web.
