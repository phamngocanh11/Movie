import { render, screen } from "@testing-library/react";
import App from "./App";

jest.mock(
  "swiper/react",
  () => ({
    Swiper: ({ children }) => <div>{children}</div>,
    SwiperSlide: ({ children }) => <div>{children}</div>,
  }),
  { virtual: true },
);

jest.mock(
  "swiper/modules",
  () => ({
    Autoplay: {},
    Pagination: {},
    EffectFade: {},
    Navigation: {},
    A11y: {},
  }),
  { virtual: true },
);

jest.mock("swiper/css", () => ({}), { virtual: true });
jest.mock("swiper/css/pagination", () => ({}), { virtual: true });
jest.mock("swiper/css/effect-fade", () => ({}), { virtual: true });
jest.mock("swiper/css/navigation", () => ({}), { virtual: true });
jest.mock("swiper/css/a11y", () => ({}), { virtual: true });

test("renders the login page route", () => {
  window.history.pushState({}, "", "/login");
  render(<App />);
  expect(
    screen.getByRole("heading", { name: /đăng nhập/i }),
  ).toBeInTheDocument();
});
