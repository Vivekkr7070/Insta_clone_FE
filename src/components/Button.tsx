import React from 'react';

// interface ButtonProps {
//   onClick: () => void;
//   children: React.ReactNode;
//   className?: string;
// }


// const Button: React.FC<ButtonProps> = ({ onClick, children, className }) => (
//   <button className={`btn ${className}`} onClick={onClick}>
//     {children}
//   </button>
// );

// export default Button;

// In Button.tsx or where your Button component is defined

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';  // Add variant prop
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className, ...props }) => {
  return (
    <button className={className} {...props}>
      {children}
    </button>
  );
};

export default Button;