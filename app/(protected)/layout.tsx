import NavBar from "@/components/nav-bar";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <NavBar />
      {children}
    </section>
  );
}
