import React, { useContext } from "react";
import { Table, Container, Modal } from "react-bootstrap";
import { IncomeTransaction } from "../datadummy/IncomeTransaction";
import NavbarAdmin from "../components/navbaradmin";
import convertRupiah from "rupiah-format";
import { Usercontext } from "../context/usercontext";
import { useState } from "react";
import Transaction from "../components/Transaction";
import { useEffect } from "react";
import { API } from "../config/api";

export default function Admin() {
  const [state, dispatch] = useContext(Usercontext);
  console.log(state);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [transaction, setTransaction] = useState([])
  useEffect(() => {
    const dataproduct = async () => {
      try {
        const response = await API.get("/transactions");
        setTransaction(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    dataproduct();
  }, [setTransaction]);
  console.log(transaction);

  return (
    <div>
      <NavbarAdmin />
      <div>
        <Container className="mt-5">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>No</th>
                <th>Name</th>
                <th>Address</th>
                <th>Post Code</th>
                <th>Income</th>
                <th>Status</th>
              </tr>
            </thead>
            {transaction.map((item, index) => {
              return (
                <tbody key={index}>
                  <tr onClick={handleShow}>
                    <td>{item.user_id}</td>
                    <td>{item.user.fullname}</td>
                    <td>{item.user.address}</td>
                    <td>{item.user.postcode}</td>
                    <td>{convertRupiah.convert(item.total)}</td>
                    <td
                      className={
                        item.status === "Success"
                          ? "success"
                          : item.status === "Cancel"
                          ? "cancel"
                          : item.status === "On The Way"
                          ? "way"
                          : item.status === "Waiting Approve"
                          ? "waiting"
                          : ""
                      }
                    >
                      {item.status}
                    </td>
                  </tr>
                </tbody>
              );
            })}
          </Table>
        </Container>
      </div>
      <Modal show={show} onHide={handleClose}>
        <Transaction />
      </Modal>
    </div>
  );
}