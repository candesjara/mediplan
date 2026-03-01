import { render, screen } from "@testing-library/react";

jest.mock("react-router-dom", () => ({
  __esModule: true,
  BrowserRouter: ({ children }) => <>{children}</>,
  Routes: ({ children }) => <>{Array.isArray(children) ? children[0] : children}</>,
  Route: ({ element }) => element,
  Navigate: () => null,
  useNavigate: () => jest.fn()
}), { virtual: true });

import App from "./App";

test("renderiza pantalla de inicio de sesión", () => {
  render(<App />);
  expect(screen.getByText(/iniciar sesi/i)).toBeInTheDocument();
});
