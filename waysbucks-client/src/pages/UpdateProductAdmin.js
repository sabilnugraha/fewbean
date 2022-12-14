import React, { useEffect } from "react";
import { Container, Col, Row } from "react-bootstrap";
import NavbarAdmin from "../components/navbaradmin";
import Pin from "../assets/pin.png";
import { useState } from "react";
import { API } from "../config/api";
import { useMutation, useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";

function UpdateProduct() {
  const [preview, setPreview] = useState(null); //For image preview
  const [product, setProduct] = useState({}); //Store product data
  const [dataproduct, setDataproduct] = useState([]);
  let navigate = useNavigate();

  const { id } = useParams();

  console.log(dataproduct);
  const [form, setForm] = useState({
    image: "",
    name: "",
    price: "",
    stock: "",
    desc: ""

  }); //Store product data

  //   let { productRefetch } = useQuery("productCache", async () => {
  //     const response = await API.get("/product/" + id);
  //     setForm({
  //       title: response.data.title,
  //       price: response.data.price,
  //       image: response.data.image,
  //     });
  //     setProduct(response.data);
  //   });

  useEffect(() => {
    const dataproduct = async () => {
      try {
        const response = await API.get("/product/" + id);
        setForm({
          name: response.data.data.name,

          price: response.data.data.price,

          image: response.data.data.image,

          stock: response.data.data.stock,

          desc: response.data.data.desc,
        });

        setDataproduct(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    dataproduct();
  }, [setProduct]);
  useEffect(() => {
    const dataproduct = async () => {
      try {
        const response = await API.get("/productimage/" + id);
        

        setProduct(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    dataproduct();
  }, [setProduct]);

  console.log(id);
  console.log(product);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.type === "file" ? e.target.files : e.target.value,
    });

    console.log(form);
    // Create image url for preview
    if (e.target.type === "file") {
      let url = URL.createObjectURL(e.target.files[0]);
      setPreview(url);
    }
  };

  const handleSubmit = useMutation(async (e) => {
    try {
      e.preventDefault();

      const config = {
        headers: {
          'Content-type': 'multipart/form-data',
        },
      };

      // Store data with FormData as object
      const formData = new FormData();

      if (form.image) {
        formData.set("image", form?.image[0], form?.image[0]?.name);
      }

      //  formData.set("image", form.image[0], form.image[0].name);
      formData.set("name", form.name);
      formData.set("price", form.price);
      formData.set("stock", form.stock);
      formData.set("desc", form.desc);

      // Configuration

      // Insert product data
      const response = await API.patch("/product/" + dataproduct.id, formData, config);
      console.log(response.data);
      navigate("/productadmin");
    } catch (error) {
      console.log(error);
    }
  });

  return (
    <div>
      <div>
        <NavbarAdmin />
      </div>
      <div>
        <Container className="mt-5 mb-5">
          <Row>
            <Col md={7} className="">
              <h1 className="mb-5" style={{ color: "brown" }}>
                Product
              </h1>
              <form onSubmit={(e) => handleSubmit.mutate(e)}>
                <Col>
                  <input
                    className="mb-5 pt-2 pb-2 ps-1"
                    type="text"
                    name="name"
                    id="title"
                    value={form.name}
                    placeholder="Name Product"
                    onChange={handleChange}
                    style={{
                      width: "100%",
                      borderRadius: "5px",
                      borderColor: "#BD0707",
                      backgroundColor: "#DCDCDC",
                    }}
                  />
                </Col>
                <Col>
                  <input
                    className="mb-5 pt-2 pb-2 ps-1"
                    type="text"
                    placeholder="Stock"
                    name="stock"
                    value={form.stock}
                    onChange={handleChange}
                    id="price"
                    style={{
                      width: "100%",
                      borderRadius: "5px",
                      borderColor: "#BD0707",
                      backgroundColor: "#DCDCDC",
                    }}
                  />
                </Col>
                <Col>
                  <input
                    className="mb-5 pt-2 pb-2 ps-1"
                    type="text"
                    placeholder="Price"
                    name="price"
                    onChange={handleChange}
                    value={form.price}
                    id="price"
                    style={{
                      width: "100%",
                      borderRadius: "5px",
                      borderColor: "#BD0707",
                      backgroundColor: "#DCDCDC",
                    }}
                  />
                </Col>
                <Col>
                  <textarea
                    className="mb-5 pt-2 pb-2 ps-1"
                    type="text"
                    placeholder="Description"
                    name="desc"
                    value={form.desc}
                    onChange={handleChange}
                    id="desc"
                    style={{
                      width: "100%",
                      borderRadius: "5px",
                      borderColor: "#BD0707",
                      backgroundColor: "#DCDCDC",
                    }}
                  />
                </Col>
                <Col>
                  <label
                    className="mb-5 pt-2 pb-2 ps-1 pe-1 d-flex justify-content-between align-item-center"
                    htmlFor="image"
                    style={{
                      width: "100%",
                      borderRadius: "5px",
                      border: "2px solid #BD0707",
                      color: "#757575",
                      backgroundColor: "#DCDCDC",
                    }}
                  >
                    File
                    <img src={Pin} alt="" />
                  </label>
                  <input
                    className="mb-5 pt-2 pb-2 ps-1"
                    type="file"
                    id="image"
                    onChange={handleChange}
                    placeholder="Photo Product"
                    name="image"
                    hidden
                  />
                </Col>
                <Col className="d-flex justify-content-center">
                  <button
                    className="mb-5 pt-2 pb-2"
                    type="submit"
                    style={{
                      width: "90%",
                      borderRadius: "5px",
                      backgroundColor: "brown",
                      color: "white",
                      borderColor: "brown",
                    }}
                  >
                    Update
                  </button>
                </Col>
              </form>
            </Col>
            <Col md={5}>
              {!preview ? (
                <div>
                  <img
                    src={form.image}
                    style={{ width: "100%", borderRadius: "5px" }}
                  />
                </div>
              ) : (
                <div>
                  <img
                    src={preview}
                    style={{ width: "100%", borderRadius: "5px" }}
                  />
                </div>
              )}
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}

export default UpdateProduct;
