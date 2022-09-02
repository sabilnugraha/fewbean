import React,{useContext} from "react";
import NavbarUser from "../components/navbar";
import { Container, Row, Col, Modal, Form, Button } from "react-bootstrap";
import { DataTransaction } from "../datadummy/datatransaction";
import Icon from "../assets/TrashIcon.png";
import convertRupiah from "rupiah-format";
import { useState } from "react";
import { API } from "../config/api";
import { Link, useNavigate } from "react-router-dom";
import { Usercontext } from "../context/usercontext";
import { useEffect } from "react";
import { useMutation } from "react-query";
import ModalCart from "../components/Trans";

export default function Cart() {
  const [state, dispatch] = useContext(Usercontext);
  const [carts, setCarts] = useState([])
  const [transaction, setTransaction] = useState([])
  // modal
  const [showTrans, setShowTrans] = useState(false);
  const [showAddress, setShowAddress] = useState(false)
  const [qty, setQty] = useState(1)
  const [checkAddress, setCheckAddress] = useState(true)
  
  

  const handleClose = () => setShowTrans(false);
  const handleCloceAddress = () => setShowAddress(false)
  let navigate = useNavigate();

  const idUser = state.user.id
  console.log(idUser);
  const dataUser = state.user
  console.log(dataUser);

  const [address, setAddress] = useState({
    Address : '',
    Phone: '',
    PostCode : '',
    City : ''
  })

  const { Address, Phone, PostCode, City } = address;
  useEffect(() => {
    if (dataUser) {
      console.log(dataUser);
      setAddress({ 
        Address: dataUser.Address,
        Phone: dataUser.Phone,
        PostCode: dataUser.PostCode,
        City: dataUser.City
      });
    }
  }, [dataUser]);

  const handleChange = (e) => {
    setAddress({
      ...address,
      [e.target.name]: e.target.value,
    });
  };
  console.log(address);
  
  const getCart = async () => {
    try {
      const response = await API.get("/carts-id");
      const cartfilter = response.data.data.filter((item) => {
        return item.transactiom_id === null
      })
      setCarts(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  console.log(carts);

  useEffect(() => {
    getCart();
  }, []);

  
  let resultTotal = carts?.reduce((a, b) => {
    return a + b.subtotal;
  }, 0);
  console.log(resultTotal)

  let qtyTotal = carts?.reduce((a, b) => {
    return a + b.qty;
  }, 0);
  console.log(resultTotal)
  


  

  

  const form = {
    status: "pending",

  };

  const handleShowAddress = () => setShowAddress(true);

  const handleDecrement = async(id, qty, subtotal, price) => {
     const config = {
      headers: {
        "Content-type": "application/json",
      },
    }
    console.log(id);
    console.log(qty);
    console.log(price);
    if(qty === 0){
      return;  
    }
    const newQty = qty - 1
    
    const newTotal = subtotal - price * newQty
    console.log(newTotal);
    console.log(subtotal);
    const body = JSON.stringify({
        Qty : newQty,
        SubTotal : newTotal * newQty
      })
    await API.patch(`/cart/${id}`, body, config)
    const response = await API.get("/carts-id");
    setCarts(response.data.data)

    
  }
console.log(carts);
  

  const handleIncrement = async(id, qty, subtotal, price) => {
     const config = {
      headers: {
        "Content-type": "application/json",
      },
    }
    console.log(id);
    console.log(qty);
    const newQty = qty + 1
    const newTotal = price * newQty
    const body = JSON.stringify({
        Qty : newQty,
        SubTotal : newTotal
      })
    await API.patch(`/cart/${id}`, body, config)
    const response = await API.get("/carts-id");
    setCarts(response.data.data)

    
  }


  const handleSubmitAddress = useMutation(async (e) => {
    try {
      e.preventDefault();

      const config = {
        headers: {
          'Content-type': 'application/json',
        },
      };

      const body = JSON.stringify(address);

      await API.patch('/user/' + idUser, body, config);
      setCheckAddress(true)

    } catch (error) {
      console.log(error);
    }
  });


  const handleSubmit = useMutation(async (e) => {
    try {
       const config = {
      headers: {
        "Content-type": "application/json",
      },
    };
    // Insert transaction data
    const body = JSON.stringify({
        Total : resultTotal
      })
      const respons = await API.post("/transaction", body, config);
    const idTrans = respons.data.data.id
    console.log(idTrans);

    for (let i = 0; i < carts.length; i++) {
        await API.patch(`/carttrans/${carts[i].id}`, { "transaction_id": idTrans }, config)
      }

      const snap = await API.get(`/snap/${idTrans}`)
      const token = snap.data.data.token;

      window.snap.pay(token, {
      onSuccess: function (result) {
        /* You may add your own implementation here */
        console.log(result);
        navigate("/profile");
      },
      onPending: function (result) {
        /* You may add your own implementation here */
        console.log(result);
        navigate("/profile");
      },
      onError: function (result) {
        /* You may add your own implementation here */
        console.log(result);
      },
      onClose: function () {
        /* You may add your own implementation here */
        alert("you closed the popup without finishing the payment");
      },
    });
      
    } catch (error) {
      
    }
  });
  

  useEffect(() => {
    //change this to the script source you want to load, for example this is snap.js sandbox env
    const midtransScriptUrl = "https://app.sandbox.midtrans.com/snap/snap.js";
    //change this according to your client-key
    const myMidtransClientKey = "Client key here ...";

    let scriptTag = document.createElement("script");
    scriptTag.src = midtransScriptUrl;
    // optional if you want to set script attribute
    // for example snap.js have data-client-key attribute
    scriptTag.setAttribute("data-client-key", myMidtransClientKey);

    document.body.appendChild(scriptTag);
    return () => {
      document.body.removeChild(scriptTag);
    };
  }, []);

  return (
    <div>
      <NavbarUser />
      <div>
        <Container>
          <div className="ms-5 mt-3">
            <h1 style={{ color: "#BD0707" }}>My Cart</h1>
            <Row>
              <p style={{ color: "#BD0707" }}>Review Your Order</p>
              <Col md={8}>
                <hr />

                {carts.map((item, index) => {
                  return (
                    <div className="mb-2">
                      <Row>
                        <Col key={index} md={2}>
                          <img
                            src={`http://localhost:5000/uploads/${item?.product?.image}`}
                            alt=""
                            style={{ width: "100%" }}
                          />
                        </Col>
                        <Col md={10}>
                          <Col className="d-flex justify-content-between">
                            <p>
                              <strong style={{ color: "#BD0707" }}>
                                {item?.product?.name}
                              </strong>
                            </p>
                            <p>{convertRupiah.convert(item?.product?.price * item?.qty)}</p>
                          </Col>
                          <Col className="d-flex justify-content-between">
                            
                              <button onClick={() => handleDecrement(item.id, item.qty, item.subtotal, item.product.price)}>-</button>
                              <div>{item?.qty}</div>
                              <button onClick={(id, qty) => handleIncrement(item.id, item.qty, item.subtotal, item.product.price)}>+</button>
                              
                            <img
                              src={Icon}
                              alt=""
                              style={{ width: "20px", height: "20px" }}
                            />
                          </Col>
                        </Col>
                      </Row>
                      <hr />
                    </div>
                    
                  
                  );
                })}
              
              </Col>
              <Col md={4}>
                
                
                    <>
                <Col className="d-flex justify-content-between">
                  <p>SubTotal</p>
                  <p>{convertRupiah.convert(resultTotal)}</p>
                </Col>
                <Col className="d-flex justify-content-between">
                  <p>Qty</p>
                  {qtyTotal}
                </Col>
                <hr />
                
                </>
                  

                <Col className="d-flex justify-content-between">
                  <p>Total</p>
                  {/* <p>{convertRupiah.convert(resultTotal)}</p> */}
                </Col>
                <button
                  type="button"
                  className="pt-2 pb-2"
                  style={{
                    width: "100%",
                    color: "white",
                    backgroundColor: "brown",
                    borderColor: "red",
                    borderRadius: "5px",
                  }}
                  //  onClick={(e) => handleSubmit.mutate(e)}
                  onClick={handleShowAddress}
                >
                  Checkout
                </button>
              </Col>
            </Row>
          </div>
        </Container>
      </div>
      <div
        className="modal fade"
        id="thanks-for-order"
        tabindex="-1"
        role="dialog"
        aria-labelledby="exampleModalCenterTitle"
        aria-hidden="true"
      ></div>
      <ModalCart showTrans={showTrans} close={handleClose} />
      <Modal 
      show={showAddress} 
      onHide={handleCloceAddress}
      className="modal-centered"
      >
        <div className="address p-3">
        <h3 className="TextHeader">Set Your Address</h3>
                  {checkAddress? <div>
            
                    <p className="textTitle mt-1">Address</p>
                    {address.Address}
                    <p className="textTitle mt-3">City</p>
                    {address.City}
                    <p className="textTitle mt-3">Postal Code</p>
                    {address.PostCode}
                    <p className="textTitle mt-3">Phone</p>
                    {address.Phone}
                    <Button className="mt-4" onClick={() => setCheckAddress(false)} style={{ width: "100%", backgroundColor: "#D4B996FF", borderBlockColor: "#D4B996FF"  }}>
          Edit
        </Button>
        <button
                  type="button"
                  className="pt-2 pb-2 mt-2"
                  style={{
                    width: "100%",
                    color: "white",
                    backgroundColor: "brown",
                    borderColor: "red",
                    borderRadius: "5px",
                  }}
                  onClick={(e) => handleSubmit.mutate(e)}
                
                >
                  PAY
                </button>

                  </div> : <Form onSubmit={(e) => handleSubmitAddress.mutate(e)}>
        <Form.Group className="mb-3">
          <Form.Control
            type="text"
            id="street-address" 
            name="Address" 
            placeholder="Address"
            onChange={handleChange}
            style={{ borderColor: "brown" }}
            value={address.Address}
            
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Control 
          value={address.PostCode}
          className="postal-code" 
          id="postal-code" 
          placeholder="Postal Code" 
          name="PostCode" 
          onChange={handleChange}
          style={{ borderColor: "brown" }}/>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Control
            type="text"
            id="street-address" 
            name="City" 
            placeholder="City"
            value={address.City}
             onChange={handleChange}
            style={{ borderColor: "brown" }}
            
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <label className="TextHeader">Phone</label>
          <Form.Control
            type="text"
            id="street-address" 
            name="Phone" 
        
            value={address.Phone}
            placeholder="Phone"
            onChange={handleChange}
            style={{ borderColor: "brown" }}
            
          />
        </Form.Group>

        <Button type="submit" style={{ width: "100%", backgroundColor: "brown" }}>
          SAVE
        </Button>
      </Form> }
        
        </div>
        <div>
      
    </div>

      </Modal>
    </div>
  );
}
