import { useState } from "react";
import { useRouter } from "next/router";
import { useMutation } from "@apollo/client";
import { ADD_ADMIN } from "../queries";
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

export default function new_admin({ admins_db }) {
  if (
    admins_db.filter((admin) => admin.username == "kinuttt" && admin.id == id)
      .length != 1
  ) {
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
  const [username, setUsername] = useState("");
  const router = useRouter();

  const [_addAdmin, { loading: _loading, error, data }] =
    useMutation(ADD_ADMIN);

  const push2db = (e) => {
    e.preventDefault();
    _addAdmin({
      variables: {
        username,
        password: "drinkzjuja",
      },
    });
    setUsername("");
    router.reload();
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
        Add admin
      </h3>

      <form onSubmit={push2db}>
        <input
          type="text"
          className={styles.input}
          value={username}
          placeholder="Username"
          required
          onChange={(e) => setUsername(e.target.value)}
        />
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
          value={_loading ? "Adding ..." : "+ Add admin"}
        />
        {data && (
          <p style={{ margin: "12px 0px" }}>
            {data.addAdmin.username} added successfully
          </p>
        )}
      </form>
    </div>
  );
};
