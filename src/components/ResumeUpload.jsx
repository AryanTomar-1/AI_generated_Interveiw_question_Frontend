import React, { useState } from "react";
import { Upload, Button, message, Card } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { parseResume } from "../services/resumeParser";

const ResumeUpload = ({ onResumeParsed }) => {
  const [fields, setFields] = useState(null);

  const handleUpload = async (info) => {
    const file = info.fileList?.[0]?.originFileObj;
    if (!file) {
      console.warn("No file detected in Upload component");
      return;
    }
    try {
      const data = await parseResume(file);
      setFields(data);
      onResumeParsed(data);
      message.success("Resume parsed successfully!");
    } catch (error) {
      console.error(error);
      message.error("Failed to parse resume.");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "20px auto" }}>
      <Upload
        beforeUpload={() => false}
        onChange={handleUpload}
        accept=".pdf,.docx"
        showUploadList={false}
      >
        <Button icon={<UploadOutlined />}>Upload Resume (PDF/DOCX)</Button>
      </Upload>

      {fields && (
        <Card style={{ marginTop: 20 }}>
          <p><strong>Name:</strong> {fields.name || "❌ Missing"}</p>
          <p><strong>Email:</strong> {fields.email || "❌ Missing"}</p>
          <p><strong>Phone:</strong> {fields.phone || "❌ Missing"}</p>
        </Card>
      )}
    </div>
  );
};

export default ResumeUpload;
