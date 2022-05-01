export default function SingleOptionInput({ label, placeholder='', action, value }) {

  return (
    <div className="text-input-group">
      <label htmlFor={label}>{label}</label>
      <select id="single-option" onChange={action} value={value}>
        <option value="">Select A Gallery</option>
        <option value="monochrome">Monochrome</option>
        <option value="polychrome">Polychrome</option>
      </select>
    </div>
  );
}

