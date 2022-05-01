export default function SingleOptionInput({label, placeholder='', action, value}) {

  return (
    <div className="text-input-group">
      <label htmlFor={label}>{label}</label>
      <select id="single-option" onChange={action} value={value}>
        <option value="monochrome">Monochrome</option>
        <option value="polychrome">Polychrome</option>
      </select>
      {/* <input tabIndex={0} id={label} placeholder={placeholder} type="text" onChange={action} value={value} /> */}
    </div>
  );
}

