import React from "react";
import { Col, Row } from "react-bootstrap";
import { DataTransaction } from "../datadummy/datatransaction";
import Barcode from "../assets/barcode.png";
import Logo from "../assets/logo.png";
import convertRupiah from "rupiah-format";

export default function Transaction() {
  const countTotal = (items) =>
    items.reduce((acc, curr) => acc + curr.price, 0);

  const jumlah = countTotal(DataTransaction);
  return (
    <Row
      style={{
        backgroundColor: "rgb(190,190,190)",
        borderRadius: "10px",
      }}
    >
      <Col md={9}>
        {DataTransaction.map((item, index) => {
          var { harga } = item.price;
          var count = 0;
          console.log(harga);

          return (
            <Row className="p-2">
              <Col xs={4} md={4}>
                <img
                  className="bg-secondary"
                  style={{
                    width: "100%",
                    height: "auto",
                    borderRadius: "10px",
                  }}
                  src={item.image}
                />
              </Col>
              <Col xs={6} md={8}>
                <div>
                  <h4 style={{ color: "#BD0707" }}>{item.Productname}</h4>
                </div>
                <div>
                  <span>
                    <b style={{ color: "#BD0707" }}>{item.day}</b>
                  </span>
                  <span>, {item.date}</span>
                </div>
                <div className="mt-2">
                  <span>Toping :</span>
                  <span>{item.topping}</span>
                </div>
                <div className="mt-2">
                  <span>Price : </span>
                  <span>{convertRupiah.convert(item.price)} </span>
                </div>
              </Col>
            </Row>
          );
        })}
      </Col>
      <Col md={3}>
        <img
          style={{ width: "75%", height: "auto" }}
          className="ms-2"
          src={Logo}
        />
        <img
          className="mt-4"
          style={{ width: "100%", height: "auto" }}
          src={Barcode}
        />
        <p className="statusTransaction ms-2 mt-2">On the Way</p>
        <p>Sub Total:</p>
        <p>{convertRupiah.convert(jumlah)}</p>
      </Col>
    </Row>
  );
}
