import './input-field.css';

export const InputField = ({label, type="text", name, value, onChange, error }) => {
    return (
    <div className="input-field">
      <label htmlFor={name}>{label}</label>
      <input
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
      />
      {error && <small className="error">{error}</small>}
    </div>
    )
}