import React from "react";
import Select from "@/components/atoms/Select";
import Label from "@/components/atoms/Label";
import Input from "@/components/atoms/Input";

const FormField = ({ 
  label, 
  type = "text", 
  value, 
  onChange, 
  placeholder, 
  required = false, 
  error,
  options = [],
  className = "",
  name,
  min,
  disabled = false
}) => {
  const id = `field-${Math.random().toString(36).substr(2, 9)}`

  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={id} className={required ? "after:content-['*'] after:text-coral-500 after:ml-1" : ""}>
        {label}
      </Label>
{type === "select" ? (
<Select id={id} name={name} value={value} onChange={onChange} required={required} disabled={disabled}>
          <option value="">{placeholder}</option>
          {options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
) : type === "textarea" ? (
        <textarea
          id={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          rows={3}
          className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-coral-500/50 focus:border-coral-500 disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-200 resize-vertical"
        />
) : (
<Input
          id={id}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          min={min}
        />
      )}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}

export default FormField