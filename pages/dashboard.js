import { useRouter } from "next/router";
import React from "react";
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

export default function Dashboard({ admins_db }) {
  let truth;

  if (
    admins_db.filter((admin) => admin.id == id && admin.username == "kinuttt")
      .length == 1
  ) {
    truth = true;
  } else {
    truth = false;
  }

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
    <div style={{ padding: 16 }}>
      <Header />
      <Content super_admin={truth} />
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

const Content = ({ super_admin }) => {
  const router = useRouter();
  return (
    <div style={{ padding: 8, position: "relative" }}>
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
        Dashboard
      </h3>
      <button className={styles.btnNav} onClick={() => router.push("/stock")}>
        Stock management
      </button>

      <button className={styles.btnNav} onClick={() => router.push("/add")}>
        Add product
      </button>

      <button className={styles.btnNav}>My account</button>

      {super_admin && (
        <div>
          <button
            className={styles.btnNav}
            onClick={() => router.push("/new_admin")}
          >
            Add new admin
          </button>
        </div>
      )}

      <button
        style={{ position: "fixed", bottom: 12, width: "calc(100% - 48px)" }}
        className={styles.btnNav}
        onClick={() => {
          sessionStorage.clear();

          router.reload();
          router.push("/");
        }}
      >
        Log out
      </button>
    </div>
  );
};
