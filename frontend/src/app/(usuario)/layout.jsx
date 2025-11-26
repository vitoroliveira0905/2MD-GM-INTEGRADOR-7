import Navbar from "@/components/blocks/Navbar";

export default function UsuarioLayout({ children }) {
  return (
    <>
      <Navbar/>
      {children}
    </>
  );
}
