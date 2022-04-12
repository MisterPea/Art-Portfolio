export default function TextInput({label, placeholder=""}) {


  return (
    <div className="text-input-group">
      <label htmlFor={label}>{label}</label>
      <input id={label} placeholder={placeholder} type="text" />
    </div>
  );
}

