import AdminNavbar from "@/components/blocks/AdminNavbar";

export default function AdminLayout({ children }) {
  return (
    <>
      <AdminNavbar/>
      {children}
    </>
  );
}
