import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addGround,
  listGround,
  deleteGround,
} from "../../redux/transport/transportAction";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../styles/TransportList.css";
import { useNavigate } from "react-router-dom";

const TransportList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [groundForm, setGroundForm] = useState({
    productType: "",
    quantity: "",
    deliveryDate: null,
    warehouse: "",
    shippingPrice: "",
    vehiclePlate: "",
  });

  const handleAddGround = () => {
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
      addGround(
        groundForm.productType,
        quantity,
        groundForm.deliveryDate,
        groundForm.warehouse,
        shippingPrice,
        groundForm.vehiclePlate
      )
    );
    setGroundForm({
      productType: "",
      quantity: "",
      deliveryDate: null,
      warehouse: "",
      shippingPrice: "",
      vehiclePlate: "",
    });
    dispatch(listGround());
  };

  const handleGroundFormChange = (e) => {
    setGroundForm({
      ...groundForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleDelete = (id) => {
    dispatch(deleteGround(id));
  };

  const handleDateChange = (date) => {
    setGroundForm({
      ...groundForm,
      deliveryDate: date,
    });
  };

  const handleEdit = (id) => {
    navigate(`/transport/ground/${id}`);
  };

  const groundList =
    useSelector((state) => state.transport.trasnportListGround) || [];
  useEffect(() => {
    dispatch(listGround());
  }, [dispatch, groundForm]);

  return (
    <div>
      <div>
        <h2>Add Ground Transport</h2>
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

          <button type="button" onClick={handleAddGround}>
            Add Ground Transport
          </button>
        </form>
      </div>
      <div>
        <h2>Ground Transports</h2>
        {groundList.length > 0 ? (
          <table className="ground-list">
            <thead>
              <tr>
                <th>Product Type</th>
                <th>Quantity</th>
                <th>Registration Date</th>
                <th>Delivery Date</th>
                <th>Warehouse</th>
                <th>Shipping Price</th>
                <th>Vehicle Plate</th>
                <th>Guide Number</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {groundList.map((transport) => (
                <tr key={transport.id}>
                  <td>{transport.productType}</td>
                  <td>{transport.quantity}</td>
                  <td>{transport.registrationDate}</td>
                  <td>{transport.deliveryDate}</td>
                  <td>{transport.warehouse}</td>
                  <td>{transport.shippingPrice}</td>
                  <td>{transport.vehiclePlate}</td>
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
          <p>No ground transports available.</p>
        )}
      </div>
    </div>
  );
};

export default TransportList;
