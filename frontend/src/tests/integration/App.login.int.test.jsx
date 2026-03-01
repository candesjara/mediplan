import { render, screen, fireEvent, waitFor } from "@testing-library/react";

jest.mock("react-router-dom", () => ({
  __esModule: true,
  BrowserRouter: ({ children }) => <>{children}</>,
  Routes: ({ children }) => <>{Array.isArray(children) ? children[0] : children}</>,
  Route: ({ element }) => element,
  Navigate: () => null,
  useNavigate: () => jest.fn()
}), { virtual: true });

import App from "../../App";
import api from "../../api/axiosConfig";

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
  });

  test("envia formulario y guarda sesion", async () => {
    api.post.mockResolvedValue({
      data: {
        token: "token-demo",
        usuario: { id: 1, nombre: "Ana", rol: "admin", correo: "ana@test.com" }
      }
    });

    render(<App />);

    const emailInput = document.querySelector('input[type="email"]');
    const passInput = document.querySelector('input[type="password"]');

    fireEvent.change(emailInput, { target: { value: "ana@test.com" } });
    fireEvent.change(passInput, { target: { value: "123456" } });
    fireEvent.click(screen.getByRole("button", { name: /ingresar/i }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("/auth/login", {
        correo: "ana@test.com",
        password: "123456"
      });
    });

    expect(localStorage.getItem("token")).toBe("token-demo");
  });

  test("muestra error cuando credenciales son invalidas", async () => {
    api.post.mockRejectedValue(new Error("credenciales invalidas"));

    render(<App />);

    const emailInput = document.querySelector('input[type="email"]');
    const passInput = document.querySelector('input[type="password"]');

    fireEvent.change(emailInput, { target: { value: "ana@test.com" } });
    fireEvent.change(passInput, { target: { value: "bad" } });
    fireEvent.click(screen.getByRole("button", { name: /ingresar/i }));

    await waitFor(() => {
      expect(screen.getByText(/credenciales inv/i)).toBeInTheDocument();
    });
  });
});
