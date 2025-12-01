import { forwardRef } from 'react'
import { cn } from '@/utils/cn'

const Button = forwardRef(({ className, variant = "primary", size = "default", children, ...props }, ref) => {
  const variants = {
    primary: "bg-gradient-to-r from-coral-500 to-red-500 text-white hover:from-coral-600 hover:to-red-600 shadow-lg hover:shadow-xl",
    secondary: "border-2 border-navy-500 text-navy-500 hover:bg-navy-500 hover:text-white bg-white",
    ghost: "text-navy-500 hover:bg-navy-50 border-transparent",
    danger: "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700",
    success: "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700"
  }
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm rounded-md",
    default: "px-4 py-2 text-base rounded-lg",
    lg: "px-6 py-3 text-lg rounded-lg"
  }

  return (
    <button
      className={cn(
        "font-medium transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-coral-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  )
})

Button.displayName = "Button"

export default Button