import React from "react";
import { Tooltip } from "@nextui-org/react";
import TypingEffect from "@/components/TypingEffect";
import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [animalInput, setAnimalInput] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false); // Add loading state

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setResult("");
    setLoading(true); // Show loader

    try {
      const response = await fetch("/api/kiroGPT", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ animal: animalInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        );
      }
      setResult(data.result);
      setAnimalInput("");
    } catch (error) {
      console.error(error);
      alert((error as Error)?.message || "An error occurred");
    } finally {
      setLoading(false); // Hide loader
    }
  }

  return (
    <div>
      <Head>
        <title>KiroGPT</title>
        <link rel="icon" href="/dog.png" />
      </Head>
      <main className={styles.main}>
        <div
          style={{
            display: "block",
            height: "38px",
            marginBottom: "30px",
            textAlign: "center",
            lineHeight: 1,
          }}
        >
          <p style={{ fontSize: "24px", fontWeight: "700" }}>KiroGPT</p>
          <p style={{ fontSize: "14px" }}>AI Assistant for Kiro Beauty</p>
        </div>
        <div style={{ height: "2500px", overflow: "auto", marginTop: "70px" }}>
          {loading ? (
            <>
              <div className={styles.ldsfacebook}>
                <div></div>
                <div></div>
                <div></div>
              </div>
              <div className={styles.loader}>Generating...</div>
            </>
          ) : (
            <TypingEffect text={result} />
          )}
        </div>
        <form onSubmit={onSubmit}>
          <div className={styles.inputContainer}>
            <input
              type="text"
              name="animal"
              placeholder="Send a message"
              value={animalInput}
              onChange={(e) => setAnimalInput(e.target.value)}
            />
            <Tooltip
              content={"Send Message"}
              rounded
              color="invert"
              placement="rightStart"
            >
              <button type="submit" className={styles.submitButton}>
                <svg
                  stroke="currentColor"
                  fill="none"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ height: "25px", width: "25px" }}
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </Tooltip>
          </div>
        </form>
      </main>
    </div>
  );
}
