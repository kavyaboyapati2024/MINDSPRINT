import { useState } from "react"
import "./index.css" // Tailwind styles

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold text-purple-600 mb-4">
        Hello Tailwind + React 👋
      </h1>
      <button
        onClick={() => setCount(count + 1)}
        className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-blue-600 transition"
      >
        Count is {count}
      </button>
    </div>
  )
}

export default App
