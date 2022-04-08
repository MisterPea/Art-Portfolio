export default function Button({ label, action }) {
  return (
    <button
      className="main-rect-button"
      onClick={action}
    >
      {label}
    </button>
  );
}