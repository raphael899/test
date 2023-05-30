import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateMaritime } from "../../redux/transport/transportAction";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../styles/TransportList.css";
import { useNavigate, useParams } from "react-router-dom";

const EditMaritimeTransport = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const maritime = useSelector((state) =>
    state.transport.trasnportListMaritime.find((t) => t.id === id)
  );

  const [maritimeForm, setMaritimeForm] = useState({
    productType: "",
    quantity: "",
    deliveryDate: null,
    port: "",
    shippingPrice: "",
    fleetNumber: "",
  });

  useEffect(() => {
    if (maritime) {
      setMaritimeForm({
        productType: maritime.productType,
        quantity: maritime.quantity.toString(),
        deliveryDate: new Date(maritime.deliveryDate),
        port: maritime.port,
        shippingPrice: maritime.shippingPrice.toString(),
        fleetNumber: maritime.fleetNumber,
      });
    }
  }, [maritime]);

  const handleUpdateMaritime = () => {
    const quantity = parseInt(maritimeForm.quantity);
    const shippingPrice = parseFloat(maritimeForm.shippingPrice);

    // Validar campos requeridos
    if (
      !maritimeForm.productType ||
      !maritimeForm.quantity ||
      !maritimeForm.deliveryDate ||
      !maritimeForm.port ||
      !maritimeForm.shippingPrice ||
      !maritimeForm.fleetNumber
    ) {
      alert("Por favor completa todos los campos.");
      return;
    }

    // Validar que quantity sea un número entero no negativo
    if (!Number.isInteger(quantity) || quantity < 0) {
      alert("Por favor ingresa una cantidad válida.");
      return;
    }
    // Validar que shippingPrice sea un número float no negativo
    if (
      isNaN(shippingPrice) ||
      shippingPrice < 0 ||
      !Number.isFinite(shippingPrice)
    ) {
      alert("Por favor ingresa un precio de envío válido.");
      return;
    }

    // Validar el formato de fleetNumber
    const fleetNumberRegex = /^[A-Z]{3}\d{4}[A-Z]$/;
    if (!fleetNumberRegex.test(maritimeForm.fleetNumber)) {
      alert(
        "Por favor ingresa un número de flota válido (ejemplo: ABC1234D)."
      );
      return;
    }

    dispatch(
      updateMaritime(
        id,
        maritimeForm.productType,
        quantity,
        maritimeForm.deliveryDate,
        maritimeForm.port,
        shippingPrice,
        maritimeForm.fleetNumber
      )
    );
    navigate("/transport/maritime");
  };

  const handleMaritimeFormChange = (e) => {
    setMaritimeForm({
      ...maritimeForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleDateChange = (date) => {
    setMaritimeForm({
      ...maritimeForm,
      deliveryDate: date,
    });
  };

  return (
    <div>
      <h2>Edit Maritime Transport</h2>
      {maritime ? (
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
            type="text"
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

          <button type="button" onClick={handleUpdateMaritime}>
            Update Maritime Transport
          </button>
        </form>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default EditMaritimeTransport;
