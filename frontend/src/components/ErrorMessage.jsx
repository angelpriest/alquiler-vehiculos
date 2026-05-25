import "../styles/ErrorMessage.css";

function ErrorMessage({ mensaje }) {
    return (
        <div className="error-message">
            <span className="error-icon">⚠️</span>
            <p>{mensaje}</p>
        </div>
    );
}

export default ErrorMessage;