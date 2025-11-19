export default function ShapCard({ shap }) {
  return (
    <div className="card">
      <h3>Explicación SHAP</h3>
      <ul className="shap-list">
        {shap.map((v, i) => (
          <li key={i}>Feature {i}: {v.toFixed(3)}</li>
        ))}
      </ul>
    </div>
  );
}
