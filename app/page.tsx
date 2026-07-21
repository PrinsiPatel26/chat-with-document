// "use client";

// import { useState } from "react";

// export default function Home() {
//   const [file, setFile] = useState<File | null>(null);
//   // const [message, setMessage] = useState("");
//   const [message, setMessage] = useState("");

//   const [uploadedFiles, setUploadedFiles] = useState<
//     {
//       fileName: string;
//       text: string;
//     }[]
//   >([]);

//   async function uploadFile() {
//     if (!file) {
//       alert("Please select a PDF");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("file", file);

//     const response = await fetch("/api/upload", {
//       method: "POST",
//       body: formData,
//     });

//     const result = await response.json();

//     //   if (response.ok) {
//     //     setMessage("✅ PDF Uploaded Successfully");
//     //   } else {
//     //     setMessage(result.error);
//     //   }

//     //   console.log(result);
//   }
//   if (response.ok) {
//     setMessage("✅ PDF Uploaded Successfully");

//     setUploadedFiles((prev) => [
//       ...prev,
//       {
//         fileName: file.name,
//         text: result.text,
//       },
//     ]);

//     // Optional: clear selected file
//     setFile(null);
//   } else {
//     setMessage(result.error);
//   }

//   console.log(result);

//   return (
//     <main className="flex min-h-screen items-center justify-center">
//       <div className="w-[450px] rounded-lg border p-8 shadow">

//         {/* <h1 className="mb-3 text-3xl font-bold ">
//        Welcome to the Chat With Your Document
//         </h1> */}

//         <h1
//           style={{
//             marginBottom: "16px",
//             fontSize: "36px",
//             fontWeight: "bold",
//             color: "#273b66",
//             textAlign: "center",
//             fontFamily: "Arial, sans-serif",
//             letterSpacing: "0.5px",
//           }}
//         >
//           Welcome to the Chat With Your Document
//         </h1>

//         {/* <p className="mb-5 text-gray-500">
//           Upload your PDF
//         </p> */}

//         <p
//           style={{
//             marginBottom: "20px",
//             color: "#1e335c",
//             fontSize: "18px",
//             fontWeight: "500",
//             textAlign: "center",
//             lineHeight: "1.6",
//           }}
//         >
//           Upload your PDF
//         </p>

//         {/* <input
//           type="file"
//           accept=".pdf"
//           onChange={(e) =>
//             setFile(e.target.files?.[0] || null)
//           }
//           className="mb-4 w-full"
//         /> */}
//         <input
//   type="file"
//   accept=".pdf"
//   onChange={(e) => setFile(e.target.files?.[0] || null)}
//   className="mb-2 w-full"
// />

// {file && (
//   <p className="mb-4 text-sm text-blue-600 font-medium">
//     Selected File: {file.name}
//   </p>
// )}

//         <button
//           onClick={uploadFile}
//           className="w-full rounded bg-blue-600 py-3 text-white hover:bg-blue-700"
//         >
//           Upload PDF
//         </button>

//         {message && (
//           <p className="mt-4 text-center">
//             {message}
//           </p>
//         )}
// {uploadedFiles.length > 0 && (
//   <div className="mt-8">
//     <h2 className="text-2xl font-bold mb-4 text-center">
//       Uploaded PDFs
//     </h2>

//     {uploadedFiles.map((pdf, index) => (
//       <div
//         key={index}
//         className="mb-8 rounded-md border border-gray-300 p-4"
//       >
//         <h3 className="text-lg font-bold text-blue-700">
//           📄 {pdf.fileName}
//         </h3>

//         <hr className="my-3 border-gray-400" />

//         <div className="whitespace-pre-wrap text-gray-700">
//           {pdf.text}
//         </div>

//         <hr className="mt-5 border-2 border-gray-500" />
//       </div>
//     ))}
//   </div>
// )}
//       </div>
//     </main>
//   );
// }

"use client";

import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");

  const [uploadedFiles, setUploadedFiles] = useState<
    {
      fileName: string;
      text: string;
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
        },
      ]);

      setFile(null);
    } else {
      setMessage(result.error);
    }

    console.log(result);
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
          onClick={uploadFile}
          className="w-full rounded bg-blue-600 py-3 text-white hover:bg-blue-700"
        >
          Upload PDF
        </button>

        {message && (
          <p className="mt-4 text-center font-semibold text-green-600">
            {message}
          </p>
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
                {/* PDF Name */}
                <h3 className="text-xl font-bold text-blue-700">
                  📄 PDF Name: {pdf.fileName}
                </h3>

                <hr className="my-4 border-gray-400" />

                {/* Extracted Text */}
                <h4 className="mb-2 font-semibold text-gray-800">
                  Extracted Text:
                </h4>

                <div className="max-h-80 overflow-y-auto whitespace-pre-wrap rounded border bg-white p-4 text-gray-700">
                  {pdf.text}
                </div>

                <hr className="mt-6 border-2 border-blue-400" />
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}