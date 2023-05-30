import React from "react";
import { Link } from "react-router-dom";
import "../../styles/MainTransport.css";

const MainTransport = () => {
  return (
    <div className="container">
      <div className="image-container">
        <h2>Ground Transport</h2>
        <img
          src="https://sourcingjournal.com/wp-content/uploads/2022/09/fedex.jpg?w=910&h=511&crop=1"
          alt="Ground"
          // width="400px"
        />
      </div>
      <div className="link-container">
        <Link to="/transport/ground">Go to Ground Transport</Link>
      </div>

      <div className="image-container">
        <h2>Maritime Transport</h2>
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUvHIR3AWHvpw9yg4eFFPrD7TFXPRPyg9J53jTb3x8isCx_KRsOVpsLUGzCMARL7NPk7E&usqp=CAU"
          alt="Maritime"
          // width="400px"
        />
      </div>
      <div className="link-container">
        <Link to="/transport/maritime">Go to Maritime Transport</Link>
      </div>
    </div>
  );
};

export default MainTransport;
