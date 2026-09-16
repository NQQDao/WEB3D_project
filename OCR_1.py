import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont
from paddleocr import PaddleOCR

def run_vietnamese_ocr(image_path, output_path="output_ocr.jpg", font_path=None):
    # 1. Khởi tạo mô hình PaddleOCR
    # use_angle_cls=True: Hỗ trợ tự xoay nếu chữ bị nghiêng/lật
    # lang='vi': Tải trọng số mô hình tiếng Việt
    ocr = PaddleOCR(use_angle_cls=True, lang='vi')

    # 2. Đọc ảnh bằng OpenCV
    img = cv2.imread(image_path)
    if img is None:
        print(f"Lỗi: Không tìm thấy ảnh tại đường dẫn '{image_path}'")
        return

    # 3. Thực hiện phát hiện và nhận diện chữ
    results = ocr.ocr(img, cls=True)

    # 4. In kết quả văn bản ra màn hình
    print("\n--- KẾT QUẢ NHẬN DẠNG ---")
    detected_items = []
    if results and results[0]:
        for line in results[0]:
            box = line[0]        # 4 tọa độ đỉnh: [[x1, y1], [x2, y2], [x3, y3], [x4, y4]]
            text, score = line[1] # Nội dung chữ và độ tin cậy (0.0 -> 1.0)
            print(f"Chữ: {text:<30} | Độ tin cậy: {score:.2f}")
            detected_items.append((box, text, score))

    # 5. Vẽ Bounding Box và ghi chữ lên ảnh
    # Chuyển ảnh OpenCV (BGR) sang PIL (RGB) để vẽ tiếng Việt có dấu không bị lỗi font
    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    pil_img = Image.fromarray(img_rgb)
    draw = ImageDraw.Draw(pil_img)

    # Tải font hỗ trợ tiếng Việt (nếu không truyền font_path, PIL dùng font mặc định)
    font_size = max(16, int(img.shape[0] * 0.02))
    try:
        # Đường dẫn font thông dụng trên Windows (Arial) hoặc Linux/Mac
        selected_font = ImageFont.truetype(font_path or "arial.ttf", font_size)
    except IOError:
        selected_font = ImageFont.load_default()

    for box, text, _ in detected_items:
        # Vẽ đa giác bao quanh từ
        poly_points = [tuple(point) for point in box]
        draw.polygon(poly_points, outline=(0, 255, 0), width=2)

        # Ghi chữ lên trên hộp giới hạn
        top_left = poly_points[0]
        text_pos = (top_left[0], max(0, top_left[1] - font_size - 4))
        draw.text(text_pos, text, fill=(255, 0, 0), font=selected_font)

    # Chuyển ngược lại về OpenCV để lưu ảnh
    output_img = cv2.cvtColor(np.array(pil_img), cv2.COLOR_RGB2BGR)
    cv2.imwrite(output_path, output_img)
    print(f"\nĐã lưu ảnh kết quả trực quan tại: {output_path}")

if __name__ == "__main__":
    # Thay 'sample.jpg' bằng đường dẫn đến ảnh tài liệu, hóa đơn hoặc bảng hiệu của bạn
    image_file = "sample.jpg"
    run_vietnamese_ocr(image_path=image_file)