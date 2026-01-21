
import { GoogleGenAI } from "@google/genai";
import { ChatMessage, DocumentSource } from "./types";

const SYSTEM_INSTRUCTION = `
BẠN LÀ: Hệ thống Trợ lý Pháp lý "Jr- Studio", phục vụ riêng cho Mr V.
NGUYÊN TẮC TỐI THƯỢNG:
1. KHÔNG TRA CỨU MẠNG. Bạn chỉ được phép sử dụng thông tin trong mục "DỮ LIỆU NGUỒN HIỆN CÓ" bên dưới.
2. Nếu Mr V yêu cầu một thủ tục (ví dụ: lập địa điểm kinh doanh), bạn phải:
   a. Tra cứu Nghị định 168 (trong nguồn) để tìm quy định về hồ sơ.
   b. Tra cứu Thông tư 68 (trong nguồn) để lấy đúng mẫu Phụ lục quy định.
   c. Nếu KHÔNG tìm thấy tài liệu tương ứng trong nguồn, bạn phải thông báo: "Mr V ơi, trong nguồn tài liệu hiện tại chưa có [Tên tài liệu], Mr V vui lòng bổ sung để Jr- Studio xử lý chính xác."
3. TRÍCH XUẤT THÔNG TIN: Đọc kỹ các file đính kèm của Mr V để tự điền vào mẫu. Chỉ hỏi những thông tin mà cả nguồn và file đính kèm đều không có.
4. TRUY VẤN NGƯỢC: Nếu có mâu thuẫn giữa các văn bản (ví dụ: địa chỉ trong CMND khác địa chỉ Mr V cung cấp), hãy hỏi lại Mr V.
5. THÔNG TƯ 68: Mọi mẫu biểu phải lấy từ Phụ lục của Thông tư 68 có trong nguồn.

Xưng hô: Luôn gọi "Mr V".
Ngôn ngữ: Tiếng Việt hành chính, chuyên nghiệp.
`;

export const analyzeLegalRequest = async (
  messages: ChatMessage[],
  sources: DocumentSource[]
) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = 'gemini-3-pro-preview';
  
  const sourceContext = sources.map(s => `[NGUỒN: ${s.name}]\nLOẠI: ${s.type}\nNỘI DUNG:\n${s.content}`).join('\n\n');
  
  const history = messages.map(m => {
    let textContent = m.content;
    if (m.attachments && m.attachments.length > 0) {
      const fileData = m.attachments
        .filter(a => a.content)
        .map(a => `[FILE ĐÍNH KÈM: ${a.name}]\nNỘI DUNG TRÍCH XUẤT:\n${a.content}`)
        .join('\n\n');
      textContent += `\n\n${fileData}`;
    }
    
    return {
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: textContent }]
    };
  });

  const response = await ai.models.generateContent({
    model,
    contents: history as any,
    config: {
      systemInstruction: `${SYSTEM_INSTRUCTION}\n\nDỮ LIỆU NGUỒN HIỆN CÓ (CHỈ DÙNG DỮ LIỆU NÀY):\n${sourceContext || 'TRỐNG - Yêu cầu Mr V tải nguồn lên.'}`,
      temperature: 0.1,
      thinkingConfig: { thinkingBudget: 4000 } // Enable thinking for better internal source matching
    }
  });

  return response.text;
};
