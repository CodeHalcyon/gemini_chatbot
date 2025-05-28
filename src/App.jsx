import { useState } from "react";
import "./App.css";
import ReactMarkdown from "react-markdown";
import axios from "axios";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

function App() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");

  const API_KEY = import.meta.env.VITE_API_KEY;
  const API_URL = import.meta.env.VITE_API_URL;

  // Fetch response from Gemini API
  const genResponse = async () => {
    setResponse("generating...");
    try {
      const answer = await axios({
        method: "post",
        url: API_URL + API_KEY,
        data: {
          contents: [
            {
              parts: [
                {
                  text: input,
                },
              ],
            },
          ],
        },
      });

      const responseText =
        answer?.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      setResponse(responseText);
    } catch (error) {
      console.error("Error generating response:", error);
      setResponse("An error occurred while generating the response.");
    }
  };

  // Format Markdown string
  const formatMarkdown = (text) =>
    text.replace(/\\n/g, "\n").replace(/\r\n/g, "\n");

  return (
    <div className="flex flex-col items-center min-h-screen py-6 text-white sm:py-12 bg-gradient-to-br from-gray-900 to-blue-900">
      <header className="mb-6 text-center sm:mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          Gemini Chatbot
        </h1>
        <p className="mt-1 text-lg text-gray-300 sm:mt-2">
          Powered by the Gemini API
        </p>
      </header>

      <div className="flex flex-col items-stretch w-full max-w-2xl px-4 sm:max-w-3xl sm:px-0">
        {/* Text input area */}
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter your prompt here..."
          rows={3}
          className="w-full p-3 mb-3 font-mono text-base text-gray-100 bg-gray-800 rounded-lg shadow-lg outline-none resize-none sm:p-4 sm:mb-4 sm:text-lg focus:ring-2 focus:ring-blue-500"
        />

        {/* Submit button */}
        <button
          onClick={genResponse}
          className="w-full px-5 py-2 text-base font-semibold text-white transition-colors duration-300 rounded-md shadow-md sm:px-6 sm:py-3 sm:text-lg bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-400 hover:to-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
        >
          Generate Response
        </button>

        {/* Markdown response output */}
        <div className="mt-6 sm:mt-8 p-4 sm:p-6 rounded-xl bg-zinc-800 text-zinc-100 font-sans overflow-y-auto h-[700px] sm:h-[500px] shadow-xl border border-zinc-700 leading-relaxed">
          <ReactMarkdown
            children={formatMarkdown(response)}
            components={{
              h1: ({ node, ...props }) => (
                <h1 className="mt-4 mb-1 text-2xl font-bold sm:mt-6 sm:mb-2 sm:text-3xl" {...props} />
              ),
              h2: ({ node, ...props }) => (
                <h2 className="mt-3 mb-1 text-xl font-semibold sm:mt-5 sm:mb-2 sm:text-2xl" {...props} />
              ),
              h3: ({ node, ...props }) => (
                <h3 className="mt-2 mb-1 text-lg font-medium sm:mt-4 sm:mb-2 sm:text-xl" {...props} />
              ),
              p: ({ node, ...props }) => (
                <p className="mb-2 leading-relaxed sm:mb-3" {...props} />
              ),
              ul: ({ node, ...props }) => (
                <ul className="mb-2 ml-5 list-disc sm:mb-3 sm:ml-6" {...props} />
              ),
              ol: ({ node, ...props }) => (
                <ol className="mb-2 ml-5 list-decimal sm:mb-3 sm:ml-6" {...props} />
              ),
              li: ({ node, ...props }) => <li className="mb-0.5 sm:mb-1" {...props} />,
              code({ node, inline, className, children, ...props }) {
                return !inline ? (
                  <SyntaxHighlighter
                    language="javascript"
                    PreTag="div"
                    className="my-2 rounded-md sm:my-4"
                    {...props}
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                ) : (
                  <code className="bg-gray-700 text-yellow-300 px-1 py-0.5 rounded" {...props}>
                    {children}
                  </code>
                );
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
