import { useEffect, useState } from "react";
import { ArrowForwardOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const ThemeSettings = () => {
  const [theme, setTheme] = useState("light");
  const navigate = useNavigate();

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    const initialTheme = storedTheme || "light";

    // Set DOM class
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(initialTheme);

    // Set in localStorage if not already
    if (!storedTheme) {
      localStorage.setItem("theme", initialTheme);
    }

    setTheme(initialTheme);
  }, []);

  const handleThemeChange = (value) => {
    setTheme(value);

    // Update class on html root
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(value);

    // Persist to localStorage
    localStorage.setItem("theme", value);
  };

  return (
    <div className="min-h-screen p-8 bg-mainBackground">
      <div className="max-w-2xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-header mb-2">
            Theme Preferences
          </h1>
          <p className="text-textContent opacity-90">
            Choose how Tawasol looks to you
          </p>
        </div>

        {/* Theme Options Card */}
        <div className="bg-cardBackground rounded-xl p-6 shadow-lg border border-cardBorder">
          <div className="space-y-4">
            <label
              htmlFor="light-theme"
              className="flex items-center gap-4 p-4 rounded-lg hover:bg-itemHoverBackground transition-colors cursor-pointer"
            >
              <input
                id="light-theme"
                type="radio"
                value="light"
                checked={theme === "light"}
                onChange={() => handleThemeChange("light")}
                className="w-5 h-5 accent-blue-500"
              />
              <div className="flex-1">
                <h3 className="font-medium text-textContent">Light Mode</h3>
                <p className="text-sm text-textContent opacity-75 mt-1">
                  Clean and bright interface
                </p>
              </div>
            </label>

            <label
              htmlFor="dark-theme"
              className="flex items-center gap-4 p-4 rounded-lg hover:bg-itemHoverBackground transition-colors cursor-pointer"
            >
              <input
                id="dark-theme"
                type="radio"
                value="dark"
                checked={theme === "dark"}
                onChange={() => handleThemeChange("dark")}
                className="w-5 h-5 accent-blue-500"
              />
              <div className="flex-1">
                <h3 className="font-medium text-textContent">Dark Mode</h3>
                <p className="text-sm text-textContent opacity-75 mt-1">
                  Comfortable for low light
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Delete Account Section */}
        <div className="mt-12 mb-8">
          <h2 className="text-2xl font-bold text-header mb-6">
            Account Management
          </h2>

          <div
            className="bg-cardBackground rounded-xl p-6 shadow-lg border border-cardBorder cursor-pointer"
            onClick={() => navigate("/auth/delete-account")}
          >
            <div className="flex flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-red-600">
                  Delete your account
                </h3>
              </div>
              <button type="button">
                <ArrowForwardOutlined className="text-textPlaceholder" />
              </button>
            </div>
          </div>

          <p className="text-textContent opacity-90 mt-2 px-4 py-1">
            Permanently delete your account and all of your data. This action
            cannot be undone.
          </p>
        </div>

        <p className="mt-6 text-sm text-textContent opacity-75">
          Changes will be applied immediately
        </p>
      </div>
    </div>
  );
};

export default ThemeSettings;
