import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addMaritime,
  listMaritime,
  deleteMaritime
} from "../../redux/transport/transportAction";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../styles/TransportList.css";
import { useNavigate } from "react-router-dom";

const TransportListMaritime = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const maritimeList =
    useSelector((state) => state.transport.trasnportListMaritime) || [];

  const [maritimeForm, setMaritimeForm] = useState({
    productType: "",
    quantity: "",
    deliveryDate: null,
    port: "",
    shippingPrice: "",
    fleetNumber: "",
  });

  const handleAddMaritime = () => {
    // Validación de campos requeridos
    if (
      !maritimeForm.productType ||
      !maritimeForm.quantity ||
      !maritimeForm.deliveryDate ||
      !maritimeForm.port ||
      !maritimeForm.shippingPrice ||
      !maritimeForm.fleetNumber
    ) {
      alert("Todos los campos son requeridos");
      return;
    }

    // Validación de cantidad
    const parsedQuantity = parseInt(maritimeForm.quantity, 10);
    if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
      alert("La cantidad debe ser un número entero positivo");
      return;
    }

    // Validación de precio de envío
    const parsedShippingPrice = parseFloat(maritimeForm.shippingPrice);
    if (isNaN(parsedShippingPrice) || parsedShippingPrice <= 0) {
      alert("El precio de envío debe ser un número positivo");
      return;
    }

    // Validación de número de flota
    const fleetNumberPattern = /^[A-Z]{3}\d{4}[A-Z]$/;
    if (!fleetNumberPattern.test(maritimeForm.fleetNumber)) {
      alert(
        "El número de flota debe tener el formato de 3 letras iniciales, seguidas de 4 números y finalizando con una letra"
      );
      return;
    }

    dispatch(
      addMaritime(
        maritimeForm.productType,
        parsedQuantity,
        maritimeForm.deliveryDate,
        maritimeForm.port,
        parsedShippingPrice,
        maritimeForm.fleetNumber
      )
    );

    setMaritimeForm({
      productType: "",
      quantity: "",
      deliveryDate: null,
      port: "",
      shippingPrice: "",
      fleetNumber: "",
    });

    dispatch(listMaritime());
  };

  const handleMaritimeFormChange = (e) => {
    const { name, value } = e.target;

    // Validaciones específicas para campos
    if (name === "quantity") {
      const parsedValue = parseInt(value, 10);
      if (isNaN(parsedValue) || (value.trim() !== "" && parsedValue < 0)) {
        return; // Ignorar cambios inválidos
      }
    } else if (name === "shippingPrice") {
      const parsedValue = parseFloat(value);
      if (isNaN(parsedValue) || (value.trim() !== "" && parsedValue < 0)) {
        return; // Ignorar cambios inválidos
      }
    } else if (name === "fleetNumber") {
      const formattedValue = value.toUpperCase();
      setMaritimeForm((prevState) => ({
        ...prevState,
        [name]: formattedValue,
      }));
      return; // Evitar validación adicional
    }

    setMaritimeForm((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleDateChange = (date) => {
    setMaritimeForm({
      ...maritimeForm,
      deliveryDate: date,
    });
  };

  const handleEdit = (id) => {
    navigate(`/transport/maritime/${id}`);
  };

  const handleDelete = (id) => {
    dispatch(deleteMaritime(id));
  };

  useEffect(() => {
    dispatch(listMaritime());
  }, [dispatch,maritimeForm]);

  return (
    <div>
      <div>
        <h2>Add Maritime Transport</h2>
        <form>
          <label>Product Type:</label>
          <input
            type="text"
            name="productType"
            value={maritimeForm.productType}
            onChange={handleMaritimeFormChange}
          />

          <label>Quantity:</label>
          <input
            type="number"
            name="quantity"
            value={maritimeForm.quantity}
            onChange={handleMaritimeFormChange}
          />

          <label>Delivery Date:</label>
          <DatePicker
            selected={maritimeForm.deliveryDate}
            onChange={handleDateChange}
            name="deliveryDate"
            dateFormat="yyyy-MM-dd'T'HH:mm:ssxxx"
          />

          <label>Port:</label>
          <input
            type="text"
            name="port"
            value={maritimeForm.port}
            onChange={handleMaritimeFormChange}
          />

          <label>Shipping Price:</label>
          <input
            type="number"
            name="shippingPrice"
            value={maritimeForm.shippingPrice}
            onChange={handleMaritimeFormChange}
          />

          <label>Fleet Number:</label>
          <input
            type="text"
            name="fleetNumber"
            value={maritimeForm.fleetNumber}
            onChange={handleMaritimeFormChange}
          />
        </form>
        <button onClick={handleAddMaritime}>Add Maritime Transport</button>
      </div>
      <div>
        <h2>Maritime Transports</h2>
        {maritimeList.length > 0 ? (
          <table className="ground-list">
            <thead>
              <tr>
                <th>Product Type</th>
                <th>Quantity</th>
                <th>Registration Date</th>
                <th>Delivery Date</th>
                <th>Port</th>
                <th>Shipping Price</th>
                <th>Fleet Number</th>
                <th>Guide Number</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {maritimeList.map((transport) => (
                <tr key={transport.id}>
                  <td>{transport.productType}</td>
                  <td>{transport.quantity}</td>
                  <td>{transport.registrationDate}</td>
                  <td>{transport.deliveryDate}</td>
                  <td>{transport.port}</td>
                  <td>{transport.shippingPrice}</td>
                  <td>{transport.fleetNumber}</td>
                  <td>{transport.guideNumber}</td>
                  <td>
                    <button onClick={() => handleEdit(transport.id)}>
                      Editar
                    </button>
                  </td>
                  <td>
                    <button onClick={() => handleDelete(transport.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No maritime transports available.</p>
        )}
      </div>
    </div>
  );
};

export default TransportListMaritime;
