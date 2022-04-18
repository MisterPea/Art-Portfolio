export default function TextInput({label, placeholder='', action, value}) {

  return (
    <div className="text-input-group">
      <label htmlFor={label}>{label}</label>
      <input tabIndex={0} id={label} placeholder={placeholder} type="text" onChange={action} value={value} />
    </div>
  );
}

