import React from 'react';

const InputComponent = ({
  name,
  type,
  id,
  value,
  placeholder,
  onChange,
  icon,
  disable,
  defaultValue,
}) => {
  return (
    <div className={`relative w-[100%] mb-4 flex items-center justify-center gap-4`}>
      {icon && <span className="">{icon}</span>}
      <input
        type={type}
        id={id}
        name={name}
        disabled={disable}
        defaultValue={defaultValue}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        className={`w-full p-4 pl-6 pr-12 md:pr-6 rounded-lg placeholder:text-black bg-gray-100`}
      />
    </div>
  );
};

export default InputComponent;
