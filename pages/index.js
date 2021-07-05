import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { useState } from "react";
import { useRouter } from "next/router";
import client from "../apollo-client";
import { gql } from "@apollo/client";

export async function getStaticProps() {
  const { data } = await client.query({
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
      products_db: data.getProducts,
    },
  };
}

export default function Home({ products_db }) {
  const [keyword, setKeyword] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [filter, setFilter] = useState("");

  return (
    <div className={styles.container}>
      <Head>
        <title>drinkZ</title>
        <meta name="description" content="Let the party be-gin" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Header
          style={{
            position: "sticky",
            top: 0,
            background: "white",
            padding: 16,
            zIndex: 9,
          }}
          grabKeyword={(keyword) => {
            setKeyword(keyword);
            console.log(keyword);
          }}
          setShowSearch={(val) => {
            if (val == true) {
              setShowSearch(true);
            } else {
              setShowSearch(false);
              setKeyword(null);
            }
          }}
          showSearch={showSearch}
        />
        <div style={{ padding: 16, paddingTop: 0 }}>
          {keyword !== null && <Results keyword={keyword} data={products_db} />}
          <Filter grabFilter={(filter) => setFilter(filter)} />
          <Recommended data={products_db} />
          <Whisky filter={filter} data={products_db} />
          <Vodka filter={filter} data={products_db} />
          <Gin filter={filter} data={products_db} />
          <Beer filter={filter} data={products_db} />
          <Wine filter={filter} data={products_db} />
          <Rum filter={filter} data={products_db} />
          <Liqueur filter={filter} data={products_db} />
          <Brandy filter={filter} data={products_db} />
          <Tequila filter={filter} data={products_db} />
        </div>
      </main>
    </div>
  );
}

const Header = ({ grabKeyword, style, setShowSearch, showSearch }) => {
  const [keyword, setKeyword] = useState(null);
  return (
    <div style={{ ...style, display: "flex", justifyContent: "space-between" }}>
      <span>
        <p style={{ color: "#4d4d4d", fontSize: "1.4rem", padding: "8px 0px" }}>
          <strong
            style={{
              fontFamily: "Montserrat",
              fontWeight: 600,
              letterSpacing: -1,
              fontSize: "1.3rem",
            }}
          >
            drinkZ<span style={{ color: "#ed1b24" }}>.</span>
          </strong>
          store
        </p>
      </span>
      <div>
        <input
          style={{
            height: 36,
            backgroundColor: "tranparent",
            border: "none",
            outline: "none",
            padding: 0,
            maxWidth: "45vw",
            margin: 0,
            fontFamily: "Montserrat",
            textDecoration: "none",
            fontWeight: 300,
            padding: "6px 0px",
            color: "black ",
            borderBottom: "1px #ed1b24 solid",
            display: "inline-block",
          }}
          className={styles.inputAnimation}
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
          onClick={() => setShowSearch(!showSearch)}
        >
          <Image src={"/../public/search.svg"} height={16} width={16} />
        </button>
      </div>
    </div>
  );
};

const Filter = ({ grabFilter }) => {
  return (
    <div style={{ width: "100%", display: "block", height: 40 }}>
      <select
        style={{
          padding: 8,
          fontFamily: "Teko",
          border: "none",
          fontSize: "1rem",
          outline: "none",
          float: "right",
          backgroundColor: "transparent",
        }}
        onChange={(e) => grabFilter(e.target.value)}
      >
        <option key="1">Default</option>
        <option key="2">Cheap - Expensive</option>
        <option key="3">Expensive - Cheap</option>
      </select>
    </div>
  );
};

const Results = ({ keyword, data }) => {
  return (
    <div>
      <h3
        style={{ fontFamily: "Montserrat", fontWeight: 300, color: "#4d4d4d" }}
      >
        "{keyword}" results
      </h3>
      <br />

      {data.filter((product) =>
        product.name.toLowerCase().includes(keyword.toLowerCase())
      ).length == 0 ? (
        <div style={{ width: "100%", height: 100 }}>
          <p
            style={{
              textAlign: "center",
              marginTop: 30,
              fontFamily: "Montserrat",
              fontWeight: 500,
              fontSize: "0.9rem",
            }}
          >
            <span style={{ color: "#ed1b24" }}>Sorry! </span>, no results
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", minHeight: 325, overflowX: "scroll" }}>
          {data
            .filter((product) =>
              product.name.toLowerCase().includes(keyword.toLowerCase())
            )
            .map((product) => (
              <Product
                name={product.name}
                price={product.price}
                alc={product.alc}
                img={product.img}
              />
            ))}
        </div>
      )}
    </div>
  );
};

const Product = ({ name, price, quantity, alc, img }) => {
  const [text, setText] = useState("order now");
  const router = useRouter();
  return (
    <div
      style={{
        minWidth: 150,
        maxWidth: 150,
        marginRight: 16,
        height: 200,
        position: "relative",
      }}
    >
      {quantity == 0 && (
        <p
          style={{
            backgroundColor: "#ed1b24",
            color: "white",
            padding: "4px 8px",
            position: "absolute",
            top: 0,
            right: 0,
          }}
        >
          OUT OF STOCK
        </p>
      )}
      <div style={{ height: 170, width: 150, backgroundColor: "white" }}>
        <img
          src={img}
          style={{ margin: "10px 0px" }}
          height={150}
          width={150}
        />
      </div>
      <p
        style={{
          fontFamily: "Montserrat",
          padding: "6px 0px",
          height: 50,
          fontWeight: 600,
          fontSize: "0.8rem",
        }}
      >
        {name}
      </p>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <p style={{ fontSize: "1.1rem", marginBottom: 12 }}>KES {price}</p>
        <p style={{ fontSize: "1.1rem", marginBottom: 12, color: "gray" }}>
          {`Alc.${alc}%`}
        </p>
      </div>

      <button
        style={{
          fontFamily: "Adihaus",
          textTransform: "uppercase",
          letterSpacing: "0.01rem",
          background: "transparent",
          border: "none",
          outline: "none",
          border: "1px #ed1b24 solid",
          padding: 8,
          color: "#ed1b24",
          width: 150,
        }}
        onClick={() => {
          setText("Ordering");
          let message = `Hey. I want a bottle of ${name}.`;
          console.log(encodeURI(message));
          router.push(`https://wa.me/254748920306/?text=${encodeURI(message)}`);
          setText("Ordering");
        }}
      >
        {text}
      </button>
    </div>
  );
};

const Recommended = ({ data }) => {
  return (
    <div>
      <h3
        style={{
          fontFamily: "Montserrat",
          fontWeight: 300,
          letterSpacing: -1,
          color: "#4d4d4d",
        }}
      >
        Recommended
      </h3>
      <br />
      <div style={{ display: "flex", overflowX: "scroll", minHeight: 325 }}>
        {data
          //.sort((a, b) => b.quantity - a.quantity)
          .map((product) => (
            <Product
              name={product.name}
              price={product.price}
              quantity={product.quantity}
              alc={product.alc}
              img={product.img}
            />
          ))}
      </div>
    </div>
  );
};

const Whisky = ({ filter, data }) => {
  return (
    <div>
      <h3
        style={{
          fontFamily: "Montserrat",
          fontWeight: 300,
          letterSpacing: -1,
          color: "#4d4d4d",
        }}
      >
        Whiskys
      </h3>
      <br />
      {data.filter((product) => product.category == "whisky").length == 0 ? (
        <div style={{ width: "100%", height: 100 }}>
          <p
            style={{
              textAlign: "center",
              marginTop: 30,
              fontFamily: "Montserrat",
              letterSpacing: -1,
              fontSize: "0.9rem",
            }}
          >
            <span style={{ color: "#ed1b24" }}>Coming soon! </span>
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", overflowX: "scroll", minHeight: 325 }}>
          {data
            .filter((product) => product.category == "whisky")
            .sort((a, b) => {
              if (filter == "Cheap - Expensive") {
                return a.price - b.price;
              } else if (filter == "Expensive - Cheap") {
                return b.price - a.price;
              } else {
                return;
              }
            })
            .map((product) => (
              <Product
                name={product.name}
                price={product.price}
                quantity={product.quantity}
                alc={product.alc}
                img={product.img}
              />
            ))}
        </div>
      )}
    </div>
  );
};

const Vodka = ({ filter, data }) => {
  return (
    <div>
      <h3
        style={{
          fontFamily: "Montserrat",
          fontWeight: 300,
          letterSpacing: -1,
          color: "#4d4d4d",
        }}
      >
        Vodkas
      </h3>
      <br />
      {data.filter((product) => product.category == "vodka").length == 0 ? (
        <div style={{ width: "100%", height: 100 }}>
          <p
            style={{
              textAlign: "center",
              marginTop: 30,
              fontFamily: "Montserrat",
              letterSpacing: -1,
              fontSize: "0.9rem",
            }}
          >
            <span style={{ color: "#ed1b24" }}>Coming soon! </span>
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", overflowX: "scroll", minHeight: 325 }}>
          {data
            .filter((product) => product.category == "vodka")
            .sort((a, b) => {
              if (filter == "Cheap - Expensive") {
                return a.price - b.price;
              } else if (filter == "Expensive - Cheap") {
                return b.price - a.price;
              } else {
                return;
              }
            })
            .map((product) => (
              <Product
                name={product.name}
                price={product.price}
                quantity={product.quantity}
                alc={product.alc}
                img={product.img}
              />
            ))}
        </div>
      )}
    </div>
  );
};

const Gin = ({ filter, data }) => {
  return (
    <div>
      <h3
        style={{
          fontFamily: "Montserrat",
          fontWeight: 300,
          letterSpacing: -1,
          color: "#4d4d4d",
        }}
      >
        Gins
      </h3>
      <br />
      {data.filter((product) => product.category == "gin").length == 0 ? (
        <div style={{ width: "100%", height: 100 }}>
          <p
            style={{
              textAlign: "center",
              marginTop: 30,
              fontFamily: "Montserrat",
              letterSpacing: -1,
              fontSize: "0.9rem",
            }}
          >
            <span style={{ color: "#ed1b24" }}>Coming soon! </span>
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", overflowX: "scroll", minHeight: 325 }}>
          {data
            .filter((product) => product.category == "gin")
            .sort((a, b) => {
              if (filter == "Cheap - Expensive") {
                return a.price - b.price;
              } else if (filter == "Expensive - Cheap") {
                return b.price - a.price;
              } else {
                return;
              }
            })
            .map((product) => (
              <Product
                name={product.name}
                price={product.price}
                quantity={product.quantity}
                alc={product.alc}
                img={product.img}
              />
            ))}
        </div>
      )}
    </div>
  );
};

const Beer = ({ filter, data }) => {
  return (
    <div>
      <h3
        style={{
          fontFamily: "Montserrat",
          fontWeight: 300,
          letterSpacing: -1,
          color: "#4d4d4d",
        }}
      >
        Beers
      </h3>
      <br />
      {data.filter((product) => product.category == "beer").length == 0 ? (
        <div style={{ width: "100%", height: 100 }}>
          <p
            style={{
              textAlign: "center",
              marginTop: 30,
              fontFamily: "Montserrat",
              letterSpacing: -1,
              fontSize: "0.9rem",
            }}
          >
            <span style={{ color: "#ed1b24" }}>Coming soon! </span>
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", overflowX: "scroll", minHeight: 325 }}>
          {data
            .filter((product) => product.category == "beer")
            .sort((a, b) => {
              if (filter == "Cheap - Expensive") {
                return a.price - b.price;
              } else if (filter == "Expensive - Cheap") {
                return b.price - a.price;
              } else {
                return;
              }
            })
            .map((product) => (
              <Product
                name={product.name}
                price={product.price}
                quantity={product.quantity}
                alc={product.alc}
                img={product.img}
              />
            ))}
        </div>
      )}
    </div>
  );
};

const Wine = ({ filter, data }) => {
  return (
    <div>
      <h3
        style={{
          fontFamily: "Montserrat",
          fontWeight: 300,
          letterSpacing: -1,
          color: "#4d4d4d",
        }}
      >
        Wines
      </h3>
      <br />

      {data.filter((product) => product.category == "wine").length == 0 ? (
        <div style={{ width: "100%", height: 100 }}>
          <p
            style={{
              textAlign: "center",
              marginTop: 30,
              fontFamily: "Montserrat",
              letterSpacing: -1,
              fontSize: "0.9rem",
            }}
          >
            <span style={{ color: "#ed1b24" }}>Coming soon! </span>
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", overflowX: "scroll", minHeight: 325 }}>
          {data
            .filter((product) => product.category == "wine")
            .sort((a, b) => {
              if (filter == "Cheap - Expensive") {
                return a.price - b.price;
              } else if (filter == "Expensive - Cheap") {
                return b.price - a.price;
              } else {
                return;
              }
            })
            .map((product) => (
              <Product
                name={product.name}
                price={product.price}
                quantity={product.quantity}
                alc={product.alc}
                img={product.img}
              />
            ))}
        </div>
      )}
    </div>
  );
};

const Rum = ({ filter, data }) => {
  return (
    <div>
      <h3
        style={{
          fontFamily: "Montserrat",
          fontWeight: 300,
          letterSpacing: -1,
          color: "#4d4d4d",
        }}
      >
        Rums
      </h3>
      <br />
      {data.filter((product) => product.category == "rum").length == 0 ? (
        <div style={{ width: "100%", height: 100 }}>
          <p
            style={{
              textAlign: "center",
              marginTop: 30,
              fontFamily: "Montserrat",
              letterSpacing: -1,
              fontSize: "0.9rem",
            }}
          >
            <span style={{ color: "#ed1b24" }}>Coming soon! </span>
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", overflowX: "scroll", minHeight: 325 }}>
          {data
            .filter((product) => product.category == "rum")
            .sort((a, b) => {
              if (filter == "Cheap - Expensive") {
                return a.price - b.price;
              } else if (filter == "Expensive - Cheap") {
                return b.price - a.price;
              } else {
                return;
              }
            })
            .map((product) => (
              <Product
                name={product.name}
                price={product.price}
                quantity={product.quantity}
                alc={product.alc}
                img={product.img}
              />
            ))}
        </div>
      )}
    </div>
  );
};

const Brandy = ({ filter, data }) => {
  return (
    <div>
      <h3
        style={{
          fontFamily: "Montserrat",
          fontWeight: 300,
          letterSpacing: -1,
          color: "#4d4d4d",
        }}
      >
        Brandys
      </h3>
      <br />
      {data.filter((product) => product.category == "brandy").length == 0 ? (
        <div style={{ width: "100%", height: 100 }}>
          <p
            style={{
              textAlign: "center",
              marginTop: 30,
              fontFamily: "Montserrat",
              letterSpacing: -1,
              fontSize: "0.9rem",
            }}
          >
            <span style={{ color: "#ed1b24" }}>Coming soon! </span>
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", overflowX: "scroll", minHeight: 325 }}>
          {data
            .filter((product) => product.category == "brandy")
            .sort((a, b) => {
              if (filter == "Cheap - Expensive") {
                return a.price - b.price;
              } else if (filter == "Expensive - Cheap") {
                return b.price - a.price;
              } else {
                return;
              }
            })
            .map((product) => (
              <Product
                name={product.name}
                price={product.price}
                quantity={product.quantity}
                alc={product.alc}
                img={product.img}
              />
            ))}
        </div>
      )}
    </div>
  );
};

const Liqueur = ({ filter, data }) => {
  return (
    <div>
      <h3
        style={{
          fontFamily: "Montserrat",
          fontWeight: 300,
          letterSpacing: -1,
          color: "#4d4d4d",
        }}
      >
        Liqueurs
      </h3>
      <br />
      {data.filter((product) => product.category == "liqueur").length == 0 ? (
        <div style={{ width: "100%", height: 100 }}>
          <p
            style={{
              textAlign: "center",
              marginTop: 30,
              fontFamily: "Montserrat",
              letterSpacing: -1,
              fontSize: "0.9rem",
            }}
          >
            <span style={{ color: "#ed1b24" }}>Coming soon! </span>
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", overflowX: "scroll", minHeight: 325 }}>
          {data
            .filter((product) => product.category == "liquer")
            .sort((a, b) => {
              if (filter == "Cheap - Expensive") {
                return a.price - b.price;
              } else if (filter == "Expensive - Cheap") {
                return b.price - a.price;
              } else {
                return;
              }
            })
            .map((product) => (
              <Product
                name={product.name}
                price={product.price}
                quantity={product.quantity}
                alc={product.alc}
                img={product.img}
              />
            ))}
        </div>
      )}
    </div>
  );
};

const Tequila = ({ filter, data }) => {
  return (
    <div>
      <h3
        style={{
          fontFamily: "Montserrat",
          fontWeight: 300,
          letterSpacing: -1,
          color: "#4d4d4d",
        }}
      >
        Tequila
      </h3>
      <br />
      {data.filter((product) => product.category == "tequila").length == 0 ? (
        <div style={{ width: "100%", height: 100 }}>
          <p
            style={{
              textAlign: "center",
              marginTop: 30,
              fontFamily: "Montserrat",
              letterSpacing: -1,
              fontSize: "0.9rem",
            }}
          >
            <span style={{ color: "#ed1b24" }}>Coming soon! </span>
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", overflowX: "scroll", minHeight: 325 }}>
          {data
            .filter((product) => product.category == "liquer")
            .sort((a, b) => {
              if (filter == "Cheap - Expensive") {
                return a.price - b.price;
              } else if (filter == "Expensive - Cheap") {
                return b.price - a.price;
              } else {
                return;
              }
            })
            .map((product) => (
              <Product
                name={product.name}
                price={product.price}
                quantity={product.quantity}
                alc={product.alc}
                img={product.img}
              />
            ))}
        </div>
      )}
    </div>
  );
};
