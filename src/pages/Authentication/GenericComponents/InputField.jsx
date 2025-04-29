import React from "react";

const InputField = ({
  type = "text",
  id,
  name,
  labelText,
  value,
  onChange,
  onBlur,
  placeholder,
  required = false,
  showPasswordToggle = false,
  onTogglePasswordVisibility,
  showPassword,
  error,
  labelClassName = "",
  inputClassName = "",
  containerClassName = "",
}) => {
  return (
    <div className={`mb-3 sm:mb-4 ${containerClassName}`}>
      <label
        className={`block text-textContent text-base sm:text-lg font-medium sm:font-semibold mb-1 ${labelClassName}`}
        htmlFor={id}
      >
        {labelText}
      </label>
      <div className="relative">
        <input
          type={type}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className={`w-full px-2.5 sm:px-3.5 py-2 sm:py-2.5 border-2 border-itemBorder rounded-lg bg-inputBackground hover:bg-inputBackgroundHover text-textContent text-sm sm:text-base cursor-pointer ${inputClassName} ${
            error && "!border-red-500"
          }`}
          placeholder={placeholder}
          required={required}
        />
        {showPasswordToggle && (
          <button
            type="button"
            onClick={onTogglePasswordVisibility}
            className="absolute inset-y-0 right-0 px-2.5 sm:px-3 flex items-center text-buttonSubmitEnable text-sm sm:text-base font-medium focus:outline-none"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        )}
      </div>
      {error && (
        <p className="text-red-500 text-xs sm:text-sm mt-1">
          {error}
        </p>
      )}
    </div>
  );
};

export default InputField;
