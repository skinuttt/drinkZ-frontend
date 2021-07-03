import { useState, useRef } from "react";
import { useMutation } from "@apollo/client";
import { ADD_PRODUCT } from "../queries";
import styles from "../styles/Home.module.css";
import client from "../apollo-client";
import { gql } from "@apollo/client";

let id;

if (typeof window !== "undefined") {
  id = JSON.parse(sessionStorage.getItem("id"));
}

export async function getStaticProps() {
  const { data } = await client.query({
    query: gql`
      query {
        getAdmins {
          id
          username
          password
        }
      }
    `,
  });

  return {
    props: {
      admins_db: data.getAdmins,
    },
  };
}

export default function Add({ admins_db }) {
  console.log(
    admins_db.filter((admin) => {
      console.log(admin.id, id);
      admin.id == id;
    }).length
  );

  if (admins_db.filter((admin) => admin.id == id).length < 1) {
    return (
      <div style={{ padding: 24 }}>
        <span>
          <p
            style={{ color: "#4d4d4d", fontSize: "1.4rem", padding: "8px 0px" }}
          >
            <strong style={{ fontFamily: "AdineuePRO" }}>
              drinkZ<span style={{ color: "#ed1b24" }}>.</span>
            </strong>
            store
          </p>
        </span>
        <h3>Unauthorized</h3>
      </div>
    );
  }

  return (
    <div>
      <div
        style={{
          position: "sticky",
          top: 0,
          backgroundColor: "white",
          padding: 16,
        }}
      >
        <Header />
      </div>

      <br />
      <div style={{ padding: 16, paddingTop: 0 }}>
        <Form />
      </div>
    </div>
  );
}

const Header = () => {
  return (
    <span>
      <p style={{ color: "#4d4d4d", fontSize: "1.4rem", padding: "8px 0px" }}>
        <strong style={{ fontFamily: "AdineuePRO" }}>
          drinkZ<span style={{ color: "#ed1b24" }}>.</span>
        </strong>
        store
      </p>
    </span>
  );
};

const Form = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState(null);
  const [category, setCategory] = useState("vodka");
  const [alc, setAlc] = useState(null);
  const [quantity, setQuantity] = useState(null);
  const [img, setImg] = useState(null);
  const [_img, setImage] = useState("");
  const [loading, setLoading] = useState(false);

  const imgInputRef = useRef(null);

  const [_addProduct, { loading: _loading, error, data }] =
    useMutation(ADD_PRODUCT);

  const push2db = (e) => {
    setLoading(true);
    e.preventDefault();

    uploadImage()
      .then((res) => {
        let p = {
          name: typeof name,
          price: typeof price,
          category: typeof category,
          quantity: typeof quantity,
          alc: typeof alc,
          img: typeof img,
        };
        console.log(p);
        _addProduct({
          variables: {
            name,
            price: parseInt(price),
            category,
            quantity: parseInt(price),
            alc: parseFloat(alc),
            img: res,
          },
        });
      })
      .then(() => {
        setLoading(false);
        setName("");
        setPrice(null);
        setCategory("vodka");
        setQuantity(null);
        setImg("");
        setImage("");
        setAlc(null);
        alert("Product added successfully");
      })
      .catch((err) => {
        alert("Failed to add product");
      });
  };

  const uploadImage = () =>
    new Promise((resolve, reject) => {
      const data = new FormData();

      data.append("file", _img);
      data.append("upload_preset", "drinkZ");
      data.append("cloud_name", "kinuttt");

      fetch("https://api.cloudinary.com/v1_1/kinuttt/image/upload", {
        method: "post",
        body: data,
      })
        .then((resp) => resp.json())
        .then((data) => {
          resolve(data.url);
        })
        .catch((err) => reject(err));
    });

  const handleImgs = async (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
      if (typeof window !== "undefined") {
        setImg(await toBase64(e.target.files[0]));
      }
    }
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleOnClick = () => {
    if (imgInputRef.current) {
      imgInputRef.current.click();
    }
  };

  return (
    <div>
      <h3
        style={{
          fontSize: "1.0    rem",
          fontWeight: 600,
          color: "#ed1b24",
          width: "100%",
          textAlign: "right",
          marginBottom: 8,
          marginTop: -8,
          textTransform: "uppercase",
        }}
      >
        Add product
      </h3>

      <form onSubmit={push2db}>
        <input
          type="text"
          className={styles.input}
          value={name}
          placeholder="Name"
          required
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="number"
          className={styles.input}
          value={price}
          required
          placeholder="Price"
          onChange={(e) => setPrice(e.target.value)}
        />

        <select
          className={styles.input}
          required
          onChange={(e) => setCategory(e.target.value)}
          style={{ display: "block" }}
        >
          <option value="vodka">vodka</option>
          <option value="gin">gin</option>
          <option value="beer">beer</option>
          <option value="wine">wine</option>
          <option value="whisky">whisky</option>
          <option value="brandy">brandy</option>
          <option value="rum">rum</option>
          <option value="tequila">tequila</option>
          <option value="liqueur">liqueur</option>
        </select>

        <input
          type="number"
          className={styles.input}
          value={alc}
          required
          placeholder="Alcohol %"
          onChange={(e) => setAlc(e.target.value)}
        />
        <input
          type="number"
          className={styles.input}
          value={quantity}
          required
          placeholder="Quantity"
          onChange={(e) => setQuantity(e.target.value)}
        />
        <button
          style={{
            background: "transparent",
            outline: "none",
            padding: 8,
            fontFamily: "Adihaus",
            border: "none",
            border: "1px gray dashed",
            marginBottom: 12,
          }}
          onClick={handleOnClick}
        >
          + Add image
        </button>
        <input
          type="file"
          className={styles.input}
          ref={imgInputRef}
          required
          style={{ display: "none" }}
          onChange={(e) => handleImgs(e)}
        />
        {img && <img src={img} style={{ width: "100%" }} />}
        <input
          type="submit"
          style={{
            backgroundColor: "white",
            color: "#ed1b24",
            fontFamily: "Adihaus",
            textTransform: "uppercase",
            border: "none",
            outline: "none",
            width: "100%",
            padding: "8px 0px",
            textAlign: "center",
            position: "sticky",
            bottom: "0.5rem",
            fontWeight: 600,
            border: "1px #ed1b24 solid",
            marginTop: 24,
          }}
          value={loading ? "Adding ..." : "+ Add product"}
        />
      </form>
    </div>
  );
};
