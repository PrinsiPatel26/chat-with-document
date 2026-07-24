"use client";

import { useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<
    {
      fileName: string;
      text: string;
      chunks: string[];
    }[]
  >([]);

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

      setUploadedFiles((prev) => [
        ...prev,
        {
          fileName: file.name,
          text: result.text,
          chunks: result.chunks ?? [],
        },
      ]);

      setFile(null);
    } else {
      setMessage(result.error);
    }

    console.log(result);
  }

  async function askQuestion() {
    if (!question.trim()) {
      alert("Please enter a question");
      return;
    }

    if (uploadedFiles.length === 0) {
      alert("Please upload a PDF before asking a question");
      return;
    }

    const userQuestion = question.trim();

    setMessages((prev) => [...prev, { role: "user", content: userQuestion }]);
    setQuestion("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: userQuestion,
        }),
      });

      const result = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: response.ok
            ? result.answer || "No answer generated."
            : result.error || "Something went wrong",
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Failed to connect to server" },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function clearChat() {
    setQuestion("");
    setLoading(false);
    setMessages([]);
  }

  function newDocument() {
    setFile(null);
    setMessage("");
    setQuestion("");
    setLoading(false);
    setMessages([]);
    setUploadedFiles([]);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-[850px] rounded-lg border bg-white p-8 shadow-lg">
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
          key={uploadedFiles.length}
          type="file"
          accept=".pdf"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="mb-2 w-full"
        />

        {file && (
          <p className="mb-4 text-sm font-medium text-blue-600">
            Selected File: {file.name}
          </p>
        )}

        <button
          type="button"
          onClick={uploadFile}
          className="w-full rounded bg-blue-600 py-3 text-white hover:bg-blue-700"
        >
          Upload PDF
        </button>

        {message && (
          <div className="mt-5 rounded-xl border border-green-200 bg-green-50 p-4 shadow-sm">
            <p className="text-sm text-gray-500">Uploaded Document</p>

            <h3 className="mt-1 text-lg font-semibold text-blue-700">
               {uploadedFiles[uploadedFiles.length - 1]?.fileName}
            </h3>

            <p className="mt-2 font-medium text-green-600">
              ✅ Uploaded Successfully
            </p>
          </div>
        )}

        {uploadedFiles.length > 0 && (
          <div className="mt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={clearChat}
              className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
               Clear Chat
            </button>

            <button
              type="button"
              onClick={newDocument}
              className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
            >
              New Document
            </button>
          </div>
        )}

        {uploadedFiles.length > 0 && (
          <div className="mt-8">
            <h2 className="mb-6 text-center text-2xl font-bold">
              Uploaded PDFs
            </h2>

            {uploadedFiles.map((pdf, index) => (
              <div
                key={index}
                className="mb-8 rounded-lg border border-gray-300 bg-gray-50 p-5 shadow-sm"
              >
                <h3 className="text-xl font-bold text-blue-700">
                  📄 PDF Name: {pdf.fileName}
                </h3>

                <hr className="my-4 border-gray-400" />

                <h4 className="mb-2 font-semibold text-gray-800">
                  Extracted Text:
                </h4>

                <div className="max-h-80 overflow-y-auto whitespace-pre-wrap rounded border bg-white p-4 text-gray-700">
                  {pdf.text}
                </div>

                {pdf.chunks.length > 0 && (
                  <div className="mt-5">
                    <h4 className="mb-3 font-semibold text-gray-800">
                      Chunks ({pdf.chunks.length}):
                    </h4>

                    <div className="space-y-3">
                      {pdf.chunks.map((chunk, chunkIndex) => (
                        <div
                          key={chunkIndex}
                          className="rounded border border-blue-200 bg-blue-50 p-3 text-sm text-gray-700"
                        >
                          <p className="mb-1 font-semibold text-blue-700">
                            Chunk {chunkIndex + 1}
                          </p>
                          <p className="whitespace-pre-wrap">{chunk}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <hr className="mt-6 border-2 border-blue-400" />
              </div>
            ))}
          </div>
        )}

        <div className="mt-10 border-t pt-8">
          <h2 className="mb-5 text-center text-2xl font-bold">
            Chat With Your PDF
          </h2>

          <div className="mb-4 max-h-96 space-y-4 overflow-y-auto rounded-lg border bg-gray-50 p-4">
            {messages.length === 0 ? (
              <p className="text-sm text-gray-500">
                Start asking questions about your uploaded PDF.
              </p>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow ${
                      msg.role === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-900"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))
            )}

            {loading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-3 rounded-2xl bg-gray-200 px-4 py-3 text-sm text-gray-900 shadow">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
                  <span>AI is analyzing your document...</span>
                </div>
              </div>
            )}
          </div>

          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask any question about the uploaded PDF..."
            className="w-full rounded-lg border p-3"
            rows={4}
          />

          {uploadedFiles.length === 0 && (
            <p className="mt-2 text-sm text-red-500">
              Please upload a PDF before asking a question.
            </p>
          )}

          <button
            type="button"
            onClick={askQuestion}
            disabled={loading}
            className="mt-4 w-full rounded bg-green-600 py-3 text-white hover:bg-green-700 disabled:bg-gray-400"
          >
            {loading ? "Thinking..." : "Ask Question"}
          </button>
        </div>
      </div>
    </main>
  );
}