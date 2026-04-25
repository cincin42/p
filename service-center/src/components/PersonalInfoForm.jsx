import { useEffect, useState } from "react";
import StateSelect from "./StateSelect";
import PhoneInput from "./PhoneInput";  

/** Validation helpers (kept local to the component) */
const PHONE_DIGITS_RE = /^\d{10}$/;
const ZIP_RE = /^\d{5}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const STATE_RE = /^[A-Z]{2}$/;
const US_STATES = new Set([
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY",
  "LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND",
  "OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY","DC"
]);

function normalizePhone(raw) {
   return (raw || "").replace(/\D/g, "");
  
}
function isValidPhone(raw) {
  return PHONE_DIGITS_RE.test(normalizePhone(raw));
}
function isValidZip(zip) {
  return ZIP_RE.test((zip || "").trim());
}
function isValidEmail(email) {
  return EMAIL_RE.test((email || "").trim());
}
function isValidState(state) {
  const up = (state || "").toUpperCase();
  return STATE_RE.test(up) && US_STATES.has(up);
}

export default function PersonalInfoForm({ initialProfile = {}, onSave }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    ...initialProfile,
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState({});
  useEffect(() => {
    setForm((f) => ({ ...f, ...initialProfile }));
  }, [initialProfile]);

  const setField = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
    setServerError("");
  };

 // Validate and return an errors object (do not rely on state immediately)
  const buildValidationErrors = (values) => {
    const e = {};
    if (!values.name?.trim()) e.name = "Name is required.";
    if (!isValidEmail(values.email)) e.email = "Enter a valid email.";
    if (!isValidZip(values.zip)) e.zip = "Enter a 5-digit ZIP code.";
    if (!isValidPhone(values.phone)) e.phone = "Enter a 10-digit phone number.";
    if (!isValidState(values.state)) e.state = "Enter a valid 2-letter state abbreviation.";
    return e;
  };


   const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    const normalizedForm = {
      ...form,
      phone: normalizePhone(form.phone),
      state: (form.state || "").toUpperCase(),
    };

    const newErrors = buildValidationErrors(normalizedForm);
    setErrors(newErrors);
    if (Object.keys(newErrors).length) {
      focusFirstError(newErrors);
      return;
    }

    try {
      setSaving(true);
      await onSave(normalizedForm);
      // optional: show success toast or clear errors
    } catch (err) {
      // Expect either { field, message } or a generic Error
      if (err?.field) {
        setErrors((prev) => ({ ...prev, [err.field]: err.message }));
        const el = document.querySelector(`[name="${err.field}"]`);
        if (el && typeof el.focus === "function") el.focus();
      } else {
        setServerError(err?.message || "Save failed. Try again.");
      }
    } finally {
      setSaving(false);
    }
  };




//const handleChange = (k,v) => {
//  setForm(f => ({ ...f, [k]: v }));
//  setErrors(e => ({ ...e, [k]: undefined }));
//  setServerError("");
//};

  const focusFirstError = (errObj) => {
    const first = Object.keys(errObj).find((k) => errObj[k]);
    if (first) {
      const el = document.querySelector(`[name="${first}"]`);
      if (el && typeof el.focus === "function") el.focus();
    }
  };





  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-6 bg-gray-900 rounded text-white space-y-4">
     {serverError && (
        <div role="alert" className="bg-red-600 text-white p-2 rounded">
            {serverError}
        </div>
     )}

     
     
     
     
      <div>
        <label className="block text-sm text-gray-400">Name</label>
        <input
          name="name"
          value={form.name || ""}
          onChange={(e) => setField("name", e.target.value)}
          className="mt-1 p-2 bg-gray-800 rounded w-full"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
        />
        {errors.name && <div id="name-error" className="text-red-500 text-sm">{errors.name}</div>}
      </div>

      <div>
        <label className="block text-sm text-gray-400">Email</label>
        <input
          name="email"
          type="email"
          value={form.email || ""}
          onChange={(e) => setField("email", e.target.value)}
          className="mt-1 p-2 bg-gray-800 rounded w-full"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
        />
        {errors.email && <div id="email-error" className="text-red-500 text-sm">{errors.email}</div>}
      </div>

      <div>
        <label className="block text-sm text-gray-400">Phone</label>
        <PhoneInput
          value={form.phone || ""}
          onChange={(val) => setField("phone", val)}   /* PhoneInput passes value, not event */
          className="mt-1 p-2 bg-gray-800 rounded w-full"
        />
        {errors.phone && <div className="text-red-500 text-sm">{errors.phone}</div>}
      </div>

      <div>
        <label className="block text-sm text-gray-400">Address</label>
        <input
          name="address"
          value={form.address || ""}
          onChange={(e) => setField("address", e.target.value)}
          className="mt-1 p-2 bg-gray-800 rounded w-full"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm text-gray-400">City</label>
          <input
            name="city"
            value={form.city || ""}
            onChange={(e) => setField("city", e.target.value)}
            className="mt-1 p-2 bg-gray-800 rounded w-full"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400">State</label>
          <StateSelect
            value={form.state || ""}
            onChange={(val) => setField("state", val)}
            className="mt-1 p-2 bg-gray-800 rounded w-full"
            name="state"
          />
          {errors.state && <div className="text-red-400 text-sm mt-1">{errors.state}</div>}
        </div>

        <div>
          <label className="block text-sm text-gray-400">ZIP</label>
          <input
            name="zip"
            value={form.zip || ""}
            onChange={(e) => setField("zip", e.target.value)}
            onBlur={() => { if (!isValidZip(form.zip)) setErrors((s) => ({ ...s, zip: "Enter a 5-digit ZIP code." })); }}
            placeholder="44203"
            className="mt-1 p-2 bg-gray-800 rounded w-full"
            aria-invalid={!!errors.zip}
            aria-describedby={errors.zip ? "zip-error" : undefined}
          />
          {errors.zip && <div id="zip-error" className="text-red-400 text-sm mt-1">{errors.zip}</div>}
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={saving}
          className="bg-green-600 px-4 py-2 rounded hover:bg-green-500 disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save"}
        </button>

        <button
          type="button"
          onClick={() => { setForm({ ...initialProfile }); setErrors({}); setServerError(""); }}
          className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-500"
        >
          Reset
        </button>
      </div>
    </form>
  );
}
