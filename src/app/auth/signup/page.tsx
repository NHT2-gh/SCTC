import SignUpForm from "@/components/auth/SignUpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đăng ký | Sáng Cà Tối Cồn",
  description: "Đăng ký tài khoản Sáng Cà Tối Cồn",
  // other metadata
};

export default function SignUp() {
  return <SignUpForm />;
}
