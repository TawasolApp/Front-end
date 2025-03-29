import React from "react";
import { render } from "@testing-library/react";
import LoadingPage from "../pages/LoadingScreen/LoadingPage";
import { axiosInstance } from "../apis/axios";

vi.mock("../apis/axios");
const mockedAxios = axiosInstance;

test("should render LoadingPage correctly", () => {
  const { container } = render(<LoadingPage />);
  expect(container.firstChild).toHaveClass(
    "flex justify-center items-center h-screen"
  );
});
