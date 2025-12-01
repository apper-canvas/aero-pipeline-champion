import { forwardRef } from 'react'
import { cn } from '@/utils/cn'

const Label = forwardRef(({ className, children, ...props }, ref) => {
  return (
    <label
      ref={ref}
      className={cn(
        "text-sm font-medium text-navy-500 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className
      )}
      {...props}
    >
      {children}
    </label>
  )
})

Label.displayName = "Label"

export default Label