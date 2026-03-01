import { render, screen, fireEvent } from "@testing-library/react";
import { useContext } from "react";
import { AuthProvider, AuthContext } from "../../context/AuthContext";

function Probe() {
  const { user, login, logout } = useContext(AuthContext);

  return (
    <div>
      <span data-testid="user">{user ? user.nombre : "sin-usuario"}</span>
      <button onClick={() => login({ token: "token-demo", usuario: { nombre: "Ana", rol: "admin" } })}>
        login
      </button>
      <button onClick={logout}>logout</button>
    </div>
  );
}

describe("AuthContext", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("guarda y limpia la sesión", () => {
    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>
    );

    fireEvent.click(screen.getByText("login"));
    expect(screen.getByTestId("user")).toHaveTextContent("Ana");
    expect(localStorage.getItem("token")).toBe("token-demo");

    fireEvent.click(screen.getByText("logout"));
    expect(screen.getByTestId("user")).toHaveTextContent("sin-usuario");
    expect(localStorage.getItem("token")).toBeNull();
  });
});
