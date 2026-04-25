import React from "react";

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY",
  "LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND",
  "OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY","DC"
];

export default function StateSelect({ value = "", onChange, id, name, className, required = false }) {
  return (
    <select
      id={id}
      name={name}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      className={className}
      required={required}
    >
      <option value="">Select state</option>
      {US_STATES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}