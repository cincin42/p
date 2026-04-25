import React from "react";
import InputMask from "react-input-mask";

export default function PhoneInput({
     value, onChange, id, name, className,placehoder = "(555) 555-5555", required = false
    //value is the formatted string; parent can normalize before saving
    }) {
        return (
            <InputMask
                mask="(999) 999-9999"
                value={value}
                onChange={(e) => onChange?.(e.target.value)}
                >
                    {( inputProps ) =>
                     <input
                        {...inputProps}
                        id={id}
                        name={name}
                        className={className}
                        placeholder={placehoder}
                        required={required}
                     />
                    }
                </InputMask>
        )
     }