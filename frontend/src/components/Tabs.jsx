import "../styles/Tabs.css";

function Tabs({ pestanas, activa, onCambiar }) {
    return (
        <div className="tabs">
            {pestanas.map((p) => (
                <button
                    key={p.id}
                    className={`tab ${activa === p.id ? "tab-activa" : ""}`}
                    onClick={() => onCambiar(p.id)}
                >
                    {p.label}
                </button>
            ))}
        </div>
    );
}

export default Tabs;