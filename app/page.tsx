"use client";

import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");

  async function uploadFile() {
    if (!file) {
      alert("Please select a PDF");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (response.ok) {
      setMessage("✅ PDF Uploaded Successfully");
    } else {
      setMessage(result.error);
    }

    console.log(result);
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="w-[450px] rounded-lg border p-8 shadow">

        {/* <h1 className="mb-3 text-3xl font-bold ">
       Welcome to the Chat With Your Document
        </h1> */}

        <h1
          style={{
            marginBottom: "16px",
            fontSize: "36px",
            fontWeight: "bold",
            color: "#273b66",
            textAlign: "center",
            fontFamily: "Arial, sans-serif",
            letterSpacing: "0.5px",
          }}
        >
          Welcome to the Chat With Your Document
        </h1>

        {/* <p className="mb-5 text-gray-500">
          Upload your PDF
        </p> */}

        <p
  style={{
    marginBottom: "20px",
    color: "#1e335c",
    fontSize: "18px",
    fontWeight: "500",
    textAlign: "center",
    lineHeight: "1.6",
  }}  
>
  Upload your PDF
</p>

        <input
          type="file"
          accept=".pdf"
          onChange={(e) =>
            setFile(e.target.files?.[0] || null)
          }
          className="mb-4 w-full"
        />

        <button
          onClick={uploadFile}
          className="w-full rounded bg-blue-600 py-3 text-white hover:bg-blue-700"
        >
          Upload PDF
        </button>

        {message && (
          <p className="mt-4 text-center">
            {message}
          </p>
        )}

      </div>
    </main>
  );
}