import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateGround } from "../../redux/transport/transportAction";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../styles/TransportList.css";
import { useNavigate, useParams } from "react-router-dom";

const EditGroundTransport = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const ground = useSelector((state) =>
    state.transport.trasnportListGround.find((t) => t.id === id)
  );

  const [groundForm, setGroundForm] = useState({
    productType: "",
    quantity: "",
    deliveryDate: null,
    warehouse: "",
    shippingPrice: "",
    vehiclePlate: "",
  });

  useEffect(() => {
    if (ground) {
      setGroundForm({
        productType: ground.productType,
        quantity: ground.quantity.toString(),
        deliveryDate: new Date(ground.deliveryDate),
        warehouse: ground.warehouse,
        shippingPrice: ground.shippingPrice.toString(),
        vehiclePlate: ground.vehiclePlate,
      });
    }
  }, [ground]);

  const handleUpdateGround = () => {
    const quantity = parseInt(groundForm.quantity);
    const shippingPrice = parseFloat(groundForm.shippingPrice);

    // Validar campos requeridos
    if (
      !groundForm.productType ||
      !groundForm.quantity ||
      !groundForm.deliveryDate ||
      !groundForm.warehouse ||
      !groundForm.shippingPrice ||
      !groundForm.vehiclePlate
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

    // Validar el formato de vehiclePlate
    const vehiclePlateRegex = /^[A-Za-z]{3}[0-9]{3}$/;
    if (!vehiclePlateRegex.test(groundForm.vehiclePlate)) {
      alert(
        "Por favor ingresa una placa de vehículo válida (ejemplo: ABC123)."
      );
      return;
    }

    dispatch(
      updateGround(
        id,
        groundForm.productType,
        quantity,
        groundForm.deliveryDate,
        groundForm.warehouse,
        shippingPrice,
        groundForm.vehiclePlate
      )
    );
    navigate("/transport/ground");
  };

  const handleGroundFormChange = (e) => {
    setGroundForm({
      ...groundForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleDateChange = (date) => {
    setGroundForm({
      ...groundForm,
      deliveryDate: date,
    });
  };

  return (
    <div>
      <h2>Edit Ground Transport</h2>
      {ground ? (
        <form>
          <label>Product Type:</label>
          <input
            type="text"
            name="productType"
            value={groundForm.productType}
            onChange={handleGroundFormChange}
          />

          <label>Quantity:</label>
          <input
            type="number"
            name="quantity"
            value={groundForm.quantity}
            onChange={handleGroundFormChange}
          />

          <label>Delivery Date:</label>
          <DatePicker
            selected={groundForm.deliveryDate}
            onChange={handleDateChange}
            name="deliveryDate"
            dateFormat="yyyy-MM-dd'T'HH:mm:ssxxx"
          />

          <label>Warehouse:</label>
          <input
            type="text"
            name="warehouse"
            value={groundForm.warehouse}
            onChange={handleGroundFormChange}
          />

          <label>Shipping Price:</label>
          <input
            type="text"
            name="shippingPrice"
            value={groundForm.shippingPrice}
            onChange={handleGroundFormChange}
          />

          <label>Vehicle Plate:</label>
          <input
            type="text"
            name="vehiclePlate"
            value={groundForm.vehiclePlate}
            onChange={handleGroundFormChange}
          />

          <button type="button" onClick={handleUpdateGround}>
            Update Ground Transport
          </button>
        </form>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default EditGroundTransport;
