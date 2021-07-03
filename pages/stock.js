import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useMutation } from "@apollo/client";
import { INCREMENT, DECREMENT } from "../queries";
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

  const { data: data1 } = await client.query({
    query: gql`
      query {
        getProducts {
          id
          name
          price
          img
          category
          quantity
          alc
        }
      }
    `,
  });

  return {
    props: {
      admins_db: data.getAdmins,
      products_db: data1.getProducts,
    },
  };
}

export default function Stock({ admins_db, products_db }) {
  const [keyword, setKeyword] = useState(null);

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
        <Search grabKeyword={(keyword) => setKeyword(keyword)} />
      </div>

      <br />
      <div style={{ padding: 16, paddingTop: 0 }}>
        <Products data={products_db} keyword={keyword} />
        <Footer />
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

const Search = ({ grabKeyword }) => {
  const [keyword, setKeyword] = useState(null);
  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <input
        style={{
          height: 36,
          backgroundColor: "tranparent",
          border: "none",
          outline: "none",
          padding: 0,
          margin: 0,
          fontFamily: "AdineuePRO",
          padding: "6px 0px",
          color: "black ",
          borderBottom: "1px #ed1b24 solid",
          display: "block",
          width: "90%",
        }}
        placeholder="Search"
        value={keyword}
        onChange={(e) => {
          if (e.target.value == "") {
            setKeyword(null);
            grabKeyword(null);
          } else {
            setKeyword(e.target.value);
            grabKeyword(e.target.value);
          }
        }}
      />
      <button
        style={{
          height: 40,
          width: 36,
          padding: 0,
          borderRadius: 4,
          border: "none",
          outline: "none",
          backgroundColor: "transparent",
        }}
      >
        <Image src={"/../public/search.svg"} height={16} width={16} />
      </button>
    </div>
  );
};

const Products = ({ keyword, data }) => {
  return (
    <div>
      {keyword !== null
        ? data
            .filter((product) =>
              product.name.toLowerCase().includes(keyword.toLowerCase())
            )
            .map((product) => {
              return (
                <Product
                  name={product.name}
                  price={product.price}
                  quantity={product.quantity}
                  id={product.id}
                />
              );
            })
        : data.map((product) => {
            return (
              <Product
                name={product.name}
                price={product.price}
                quantity={product.quantity}
                id={product.id}
              />
            );
          })}
    </div>
  );
};

const Product = ({ name, price, quantity, id }) => {
  const router = useRouter();
  const [_increment, { loading: _loading1, error: _error1, data: _data1 }] =
    useMutation(INCREMENT);

  const [_decrement, { loading: _loading2, error: _error2, data: _data2 }] =
    useMutation(DECREMENT);

  const increment = (id, name) => {
    _increment({
      variables: {
        id,
      },
    })
      .then(() => {
        alert(`+1 ${name}`);
      })
      .then(() => {
        router.reload();
      });
  };

  const decrement = (id, name) => {
    _decrement({
      variables: {
        id,
      },
    })
      .then(() => {
        alert(`-1 ${name}`);
      })
      .then(() => {
        router.reload();
      });
  };

  return (
    <div style={{ marginBottom: 24 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <div>
          <p style={{ fontFamily: "AdineuePRO", height: 25 }}>{name}</p>
          <p>KES {price}</p>
        </div>

        <span
          style={{
            display: "flex",
            width: 120,
            justifyContent: "space-between",
          }}
        >
          <button
            style={{ border: "none", outline: "none", width: 36, height: 36 }}
            onClick={() => decrement(id, name)}
          >
            -
          </button>
          <p
            style={{
              color: quantity < 3 ? "orange" : quantity == 0 ? "red" : "green",
              margin: "0px 12px",
              marginTop: "8px",
            }}
          >
            <strong>{quantity}</strong>
          </p>
          <button
            style={{ border: "none", outline: "none", width: 36, height: 36 }}
            onClick={() => increment(id, name)}
          >
            +
          </button>
        </span>
      </div>
    </div>
  );
};

const Footer = () => {
  const router = useRouter();
  return (
    <button
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
      onClick={() => {
        router.push("/add");
      }}
    >
      + Add product
    </button>
  );
};
