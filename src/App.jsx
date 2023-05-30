import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Login from "./pages/Login";
import Register from "./pages/registerUser";
import TransportListMaritime from "./pages/transpot/TransportListMaritime";
import TrasportList from "./pages/transpot/TrasportList";
import Navbar from "./pages/navbar/Nav";
import MainTransport from "./pages/transpot/MainTransport";
import EditGroundTransport from "./pages/transpot/EditGroundTransport";
import EditMaritimeTransport from "./pages/transpot/EditMaritimeTransport";
import { setAuthenticated } from "./redux/user/userActions";
import { useEffect, useState } from "react";

function PrivateRoute({ path, element: Element }) {
  const isAuthenticated = useSelector(state => state.user.isAuthenticated);

  return isAuthenticated ? (
    <Element />
  ) : (
    <Navigate to="/" replace />
  );
}

function App() {
  const dispatch = useDispatch();
  const [authLoaded, setAuthLoaded] = useState(false); // Estado adicional para controlar si se ha cargado la autenticación

  useEffect(() => {
    // Verificar si hay un token almacenado en el almacenamiento local al cargar la aplicación
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      // Aquí deberías agregar la lógica para validar el token con tu backend
      // Si el token es válido, establece el estado de autenticación en la aplicación
      dispatch(setAuthenticated(true));
    }

    setAuthLoaded(true); // Indicar que la autenticación se ha cargado correctamente
  }, [dispatch]);

  if (!authLoaded) {
    // Mostrar un componente de carga mientras se verifica la autenticación
    return <div>Cargando...</div>;
  }

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/transport/ground" element={<PrivateRoute element={TrasportList} />} />
        <Route path="/transport/ground/:id" element={<PrivateRoute element={EditGroundTransport} />} />
        <Route path="/transport/maritime/:id" element={<PrivateRoute element={EditMaritimeTransport} />} />
        <Route path="/transport" element={<PrivateRoute element={MainTransport} />} />
        <Route path="/transport/maritime" element={<PrivateRoute element={TransportListMaritime} />} />
      </Routes>
    </Router>
  );
}

export default App;
