export const Alert = ({ children, variant = 'default', className = '' }) => {
    const alertStyles = {
      default: 'bg-gray-100 text-gray-900',
      destructive: 'bg-red-100 text-red-900 border border-red-400',
    };
  
    return (
      <div className={`p-4 rounded-md ${alertStyles[variant]} ${className}`}>
        {children}
      </div>
    );
  };
  
  export const AlertTitle = ({ children }) => <h4 className="font-bold">{children}</h4>;
  export const AlertDescription = ({ children }) => <p>{children}</p>;
  