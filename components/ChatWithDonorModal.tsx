"use client";

import { useState } from "react";
import { Modal, Button, Form, Input, Avatar, message } from "antd";
import { UserOutlined } from "@ant-design/icons";
import axios from "axios";
import Image from "next/image";

interface ChatWithDonorModalProps {
  visible: boolean;
  onCancel: () => void;
  donorId: string;
  donorName: string;
  donorEmail: string;
  donorImage: string;
  bookTitle: string;
  bookImage: string;
  userId: string;
}

const ChatWithDonorModal = ({
  visible,
  onCancel,
  donorName,
  donorEmail,
  donorImage,
  bookTitle,
  bookImage,
  userId,
}: ChatWithDonorModalProps) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: { message: string }) => {
    try {
      setLoading(true);
      
      const response = await axios.post("/api/send-donor-message", {
        donorEmail,
        bookTitle,
        bookImage,
        message: values.message,
      }, {
        headers: {
          userid: userId
        }
      });

      if (response.data.success) {
        message.success("Message sent to donor successfully!");
        form.resetFields();
        onCancel();
      } else {
        message.error(response.data.message || "Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      if (axios.isAxiosError(error)) {
        message.error(
          error.response?.data?.message || "Failed to send message. Please try again."
        );
      } else {
        message.error("Failed to send message. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Send Message to Donor"
      open={visible}
      onCancel={onCancel}
      footer={null}
      centered
      width={700}
    >
      <div className="flex flex-col md:flex-row gap-6 mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-6">
            <Avatar
              src={donorImage}
              size={64}
              icon={<UserOutlined />}
            />
            <div>
              <h3 className="text-lg font-semibold">{donorName}</h3>
              <p className="text-gray-500">{donorEmail}</p>
            </div>
          </div>

          <div className="mb-4">
            <h4 className="font-medium mb-2">About the Book:</h4>
            <div className="flex items-center gap-3">
              <div className="relative w-16 h-20">
                <Image
                  src={bookImage}
                  alt={bookTitle}
                  fill
                  className="object-cover rounded"
                />
              </div>
              <p className="font-medium">{bookTitle}</p>
            </div>
          </div>
        </div>

        <div className="flex-1 border-l pl-6">
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Form.Item
              name="message"
              label="Your Message"
              rules={[
                { required: true, message: "Please enter your message" },
                { max: 500, message: "Message cannot exceed 500 characters" },
              ]}
            >
              <Input.TextArea
                rows={6}
                placeholder={`Hi ${donorName}, I'm interested in your book "${bookTitle}". Could you tell me more about it?`}
                maxLength={500}
                showCount
              />
            </Form.Item>

            <div className="flex justify-end gap-3">
              <Button onClick={onCancel}>Cancel</Button>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                disabled={!donorEmail}
              >
                {donorEmail ? "Send Message" : "Donor email not available"}
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </Modal>
  );
};

export default ChatWithDonorModal;