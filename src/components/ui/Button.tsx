import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', ...props }) => {
  const baseStyle = "px-4 py-2 rounded-2xl transition-all duration-200 active:scale-95";
  const variants = {
    primary: "bg-softGreen text-white shadow-md hover:bg-green-600",
    secondary: "bg-paleYellow text-gray-700 shadow-sm hover:bg-yellow-200"
  };
  return (
    <button className={`${baseStyle} ${variants[variant]}`} {...props}>
      {children}
    </button>
  );
};
