import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đăng nhập | Sáng Cà Tối Cồn",
  description: "Đăng nhập vào hệ thống quản lý",
};

export default function SignIn() {
  return <SignInForm />;
}
