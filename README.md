<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1ZYIZ3PyRme-BOpGefv4nsO37Tj1Gb-dG

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`


PROMPT 1:
Hãy đóng vai một Senior Frontend Developer. Dựa trên cấu trúc JSON mô tả UI/UX dưới đây, hãy viết code (sử dụng ReactJS/VueJS + TailwindCSS hoặc framework bạn muốn) để tạo ra giao diện ứng dụng phục chế ảnh.
Yêu cầu quan trọng:
Giữ đúng tông màu Dark Mode và màu tím như trong JSON.
Sidebar bên trái phải chứa đầy đủ các checkbox tùy chọn như: "Vẽ lại tóc rối", "Người Châu Á", v.v.
Phần hiển thị ảnh phải có chức năng so sánh Before/After (thanh trượt).
File JSON UI Specification:
{
  "app_specification": {
    "app_name": "AI Photo Restoration Tool",
    "platform": "Web/Desktop App",
    "design_system": {
      "theme": "Dark Mode",
      "colors": {
        "background_primary": "#121212",
        "background_secondary": "#1E1E1E",
        "background_tertiary": "#2C2C2C",
        "text_primary": "#FFFFFF",
        "text_secondary": "#B3B3B3",
        "accent_primary": "#7C4DFF",
        "accent_hover": "#651FFF",
        "danger": "#CF6679",
        "success": "#03DAC6"
      },
      "typography": {
        "font_family": "Roboto, sans-serif",
        "sizes": {
          "header": "18px",
          "body": "14px",
          "small": "12px"
        }
      }
    },
    "layout_structure": {
      "type": "Grid Layout",
      "areas": [
        "thumbnails thumbnails",
        "sidebar workspace"
      ],
      "columns": "300px 1fr",
      "rows": "100px 1fr"
    }
  },
  "ui_components": [
    {
      "id": "thumbnail_gallery_strip",
      "region": "top",
      "type": "Horizontal Scroll View",
      "description": "Danh sách các ảnh đã upload, hiển thị dạng thumbnail nhỏ. Ảnh đang chọn sẽ có border sáng.",
      "elements": [
        {
          "type": "ImageThumbnail",
          "state": "active/inactive",
          "action": "Select image to edit"
        },
        {
          "type": "UploadButton",
          "icon": "plus",
          "label": "Thêm ảnh"
        }
      ]
    },
    {
      "id": "control_sidebar",
      "region": "left",
      "type": "Form Panel",
      "background_color": "#1E1E1E",
      "sections": [
        {
          "group_id": "restoration_mode",
          "title": "Chế độ phục chế",
          "elements": [
            {
              "type": "Button",
              "style": "Primary (Purple)",
              "label": "Phục chế chất lượng cao",
              "width": "100%",
              "action": "Trigger AI processing"
            },
            {
              "type": "Button",
              "style": "Secondary (Outlined)",
              "label": "Phục chế 5-10 màu",
              "width": "100%"
            }
          ]
        },
        {
          "group_id": "subject_info",
          "title": "Thông tin chủ thể",
          "elements": [
            {
              "id": "gender_selector",
              "label": "Giới tính",
              "type": "SegmentedControl",
              "options": ["Nam", "Nữ"],
              "default": "Nam"
            },
            {
              "id": "age_input",
              "label": "Độ tuổi",
              "type": "NumberInput",
              "placeholder": "Ví dụ: 65",
              "description": "Nhập tuổi ước lượng để AI tái tạo da phù hợp"
            }
          ]
        },
        {
          "group_id": "advanced_options",
          "title": "Tùy chọn thêm (Checkbox)",
          "type": "VerticalList",
          "elements": [
            { "id": "opt_hair", "label": "Vẽ lại tóc rối chi tiết", "checked": true },
            { "id": "opt_asian", "label": "Người Châu Á (Tóc đen)", "checked": true },
            { "id": "opt_background", "label": "Làm rõ và hậu cảnh", "checked": true },
            { "id": "opt_fidelity", "label": "Bám theo chi tiết khuôn mặt ảnh gốc", "checked": true }
          ]
        },
        {
          "group_id": "main_actions",
          "elements": [
            {
              "type": "Button",
              "id": "btn_process",
              "label": "Phục Chế Ảnh",
              "style": "Gradient Purple",
              "size": "Large",
              "icon": "magic-wand"
            },
            {
              "type": "Button",
              "id": "btn_reset",
              "label": "Làm Lại Ảnh Mới",
              "style": "Danger (Red text)",
              "size": "Medium"
            }
          ]
        }
      ]
    },
    {
      "id": "workspace_viewer",
      "region": "center",
      "type": "ImageViewer",
      "background_color": "#121212",
      "features": [
        {
          "state": "empty",
          "content": "Nhấn để tải ảnh lên (Hỗ trợ JPG, PNG, WEBP)"
        },
        {
          "state": "processing",
          "content": {
            "type": "CircularProgress",
            "label": "AI đang phục chế ảnh của bạn...",
            "timer_estimate": "20-25s"
          }
        },
        {
          "state": "result",
          "layout": "SplitView or SideBySide",
          "features": [
            {
              "type": "ImageComparison",
              "mode": "Slider (Before/After)",
              "zoom_capability": "High (Mouse wheel scroll)"
            },
            {
              "type": "FloatingActionButton",
              "label": "Tải Xuống",
              "position": "bottom-right",
              "style": "Primary"
            }
          ]
        }
      ]
    }
  ],
  "user_interactions": {
    "upload_flow": {
      "trigger": "Click workspace or Drag & Drop",
      "action": "Open File Dialog -> Add to Thumbnail Strip -> Select Image"
    },
    "restoration_flow": {
      "step_1": "Select Image from Strip",
      "step_2": "Adjust Gender/Age in Sidebar",
      "step_3": "Check Advanced Options",
      "step_4": "Click 'Phục Chế Ảnh'",
      "step_5": "Show Loading Spinner (approx 20s)",
      "step_6": "Display Result with Zoom/Compare functionality"
    }
  }
}

PROMPT 2:
After uploading the image, please integrate AI Nano Banana to restore the old photo for me.
