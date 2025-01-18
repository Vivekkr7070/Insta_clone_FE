// import React from 'react';

// interface InputProps {
//   value: string;
//   onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   placeholder?: string;
//   type?: string;
//   className?: string;
// }

// const Input: React.FC<InputProps> = ({ value, onChange, placeholder, type = 'text', className }) => (
//   <input
//     type={type}
//     value={value}
//     onChange={onChange}
//     placeholder={placeholder}
//     className={`form-control ${className}`}
//   />
// );

// export default Input;

import React from 'react';

interface InputProps {
  name: string; // Ensure 'name' is included
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  type?: string;
}

const Input: React.FC<InputProps> = ({ name, value, onChange, placeholder, type = 'text' }) => {
  return (
    <input
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      type={type}
      className="form-control"
    />
  );
};

export default Input;
