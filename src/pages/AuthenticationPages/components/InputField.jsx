import React from 'react';

const InputField = ({
  type = 'text',
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
  labelClassName = '',
  inputClassName = '',
  containerClassName = '',
}) => {
  return (
    <div className={`mb-6 ${containerClassName}`}>
      <label className={`block text-gray-700 text-xl font-semibold mb-2 ${labelClassName}`} htmlFor={id}>
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
          className={`w-full px-4 py-3 border-2 border-gray-300 rounded-lg hover:border-black hover:bg-stone-100 focus:outline-none focus:border-black text-xl cursor-pointer ${inputClassName} ${error && '!border-red-500'}`}
          placeholder={placeholder}
          required={required}
        />
        {showPasswordToggle && (
          <button
            type="button"
            onClick={onTogglePasswordVisibility}
            className="absolute inset-y-0 right-0 px-4 py-3 text-blue-500 font-semibold focus:outline-none"
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        )}
      </div>
      {error && <p className="text-red-500 text-lg mt-2">{error}</p>}
    </div>
  );
};

export default InputField;