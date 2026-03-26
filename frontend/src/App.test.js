import { render, screen } from "@testing-library/react";

jest.mock("react-router-dom", () => ({
  __esModule: true,
  BrowserRouter: ({ children }) => <>{children}</>,
  Routes: ({ children }) => <>{Array.isArray(children) ? children[0] : children}</>,
  Route: ({ element }) => element,
  Navigate: () => null,
  Link: ({ children, to }) => <a href={to}>{children}</a>
}), { virtual: true });

import App from "./App";

test("renderiza la landing publica de MediPlan", () => {
  render(<App />);
  expect(screen.getByText(/MediPlan simplifica el agendamiento/i)).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /Agendar cita/i })).toBeInTheDocument();
});
