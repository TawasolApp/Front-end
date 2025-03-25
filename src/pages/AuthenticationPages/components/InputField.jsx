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
    <div className={`mb-4 sm:mb-5 md:mb-6 ${containerClassName}`}>
      <label
        className={`block text-textContent text-lg sm:text-xl md:text-2xl font-medium sm:font-semibold mb-1 sm:mb-2 ${labelClassName}`}
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
          className={`w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-inputBorder rounded-lg hover:border-inputBorderHover hover:bg-inputBackground focus:outline-none focus:border-inputBorderFocus text-base sm:text-lg md:text-xl cursor-pointer ${inputClassName} ${
            error && "border-red-500"
          }`}
          placeholder={placeholder}
          required={required}
        />
        {showPasswordToggle && (
          <button
            type="button"
            onClick={onTogglePasswordVisibility}
            className="absolute inset-y-0 right-0 px-3 sm:px-4 flex items-center text-buttonSubmitEnable text-base sm:text-lg font-medium focus:outline-none"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        )}
      </div>
      {error && (
        <p className="text-red-500 text-sm sm:text-base md:text-lg mt-1 sm:mt-2">
          {error}
        </p>
      )}
    </div>
  );
};

export default InputField;
