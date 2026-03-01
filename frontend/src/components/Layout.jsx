import NavbarMediPlan from "./NavbarMediPlan";

export default function Layout({ children }) {
  return (
    <>
      <NavbarMediPlan />
      {/* Espacio superior para compensar navbar fija */}
      <main className="container py-4" style={{ maxWidth: "1100px", marginTop: "80px" }}>
        {children}
      </main>
    </>
  );
}
