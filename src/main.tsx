// import ReactDOM from "react-dom/client"
import App from "./App.tsx"
import "./index.css"

// ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
// )

import {render} from "react-dom"
const container = document.getElementById("root")
render(<App />, container)
