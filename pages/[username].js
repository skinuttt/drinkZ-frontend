import { useState } from "react";
import { useRouter } from "next/router";
import client from "../apollo-client";
import { gql } from "@apollo/client";

export async function getServerSideProps() {
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

export default function Login({ admins_db }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const {
    query: { username },
  } = useRouter();

  const verifyUser = (e) => {
    e.preventDefault();
    // filter admins from database
    if (
      admins_db.filter(
        (admin) => admin.username == username && admin.password === password
      ).length > 0
    ) {
      let id = admins_db.filter(
        (admin) => admin.username == username && admin.password === password
      )[0].id;
      if (typeof window !== "undefined") {
        sessionStorage.setItem("id", JSON.stringify(id));
        alert(`Welcome ${username}`);
        router.push("/dashboard");
      }
    } else {
      alert("Wrong username-password combination");
    }
  };

  return (
    <div style={{ padding: 24, position: "relative", minHeight: "100vh" }}>
      <form
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-100%)",
          width: "60%",
        }}
        onSubmit={verifyUser}
      >
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
        <br />
        <p style={{ paddingBottom: 12 }}>Enter password for '{username}' : </p>
        <input
          style={{
            fontFamily: "AdineuePRO",
            padding: 12,
            border: "none",
            border: "1px #ed1b24 solid",
            outline: "none",
            fontSize: "1.2rem",
            width: "100%",
          }}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="submit"
          value="Log in"
          style={{
            backgroundColor: "transparent",
            color: "#ed1b24",
            fontFamily: "Adihaus",
            textTransform: "uppercase",
            border: "none",
            outline: "none",
            marginTop: 12,
            width: "100%",
            textAlign: "right",
          }}
        />
      </form>
    </div>
  );
}
