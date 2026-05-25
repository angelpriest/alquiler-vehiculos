import "../styles/Loader.css";

function Loader({ mensaje = "Cargando..." }) {
    return (
        <div className="loader-container">
            <div className="loader-spiner"></div>
            <p className="loader-text">{mensaje}</p>
        </div>
    );
} 

export default Loader;