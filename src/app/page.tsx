import { redirect } from "next/navigation";

export default function Home() {
  // Redirect to login page by default
  // In a real app, this would check auth state first
  redirect("/login");
}
