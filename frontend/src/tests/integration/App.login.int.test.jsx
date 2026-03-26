import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AuthProvider } from "../../context/AuthContext";
import Login from "../../pages/Login";
import api from "../../api/axiosConfig";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  __esModule: true,
  useNavigate: () => mockedNavigate,
}), { virtual: true });

jest.mock("../../api/axiosConfig", () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
    get: jest.fn()
  }
}));

describe("Integracion login", () => {
  beforeEach(() => {
    localStorage.clear();
    api.post.mockReset();
    api.get.mockReset();
    mockedNavigate.mockReset();
  });

  test("envia formulario y guarda sesion", async () => {
    api.post.mockResolvedValue({
      data: {
        token: "token-demo",
        usuario: { id: 1, nombre: "Ana", rol: "admin", correo: "ana@test.com" }
      }
    });

    render(
      <AuthProvider>
        <Login />
      </AuthProvider>
    );

    fireEvent.change(screen.getByLabelText(/correo/i), { target: { value: "ana@test.com" } });
    fireEvent.change(screen.getByLabelText(/contrasena/i), { target: { value: "123456" } });
    fireEvent.click(screen.getByRole("button", { name: /ingresar/i }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("/auth/login", {
        correo: "ana@test.com",
        password: "123456"
      });
    });

    expect(localStorage.getItem("token")).toBe("token-demo");
    expect(mockedNavigate).toHaveBeenCalledWith("/dashboard");
  });

  test("muestra error cuando credenciales son invalidas", async () => {
    api.post.mockRejectedValue(new Error("credenciales invalidas"));

    render(
      <AuthProvider>
        <Login />
      </AuthProvider>
    );

    fireEvent.change(screen.getByLabelText(/correo/i), { target: { value: "ana@test.com" } });
    fireEvent.change(screen.getByLabelText(/contrasena/i), { target: { value: "bad" } });
    fireEvent.click(screen.getByRole("button", { name: /ingresar/i }));

    await waitFor(() => {
      expect(screen.getByText(/credenciales inv/i)).toBeInTheDocument();
    });
  });
});
