
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TaskList from "./pages/TaskList";
import TaskDetails from "./pages/TaskDetails";
import TaskForm from "./pages/TaskForm";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <main className="container">
        <Routes>
          <Route path="/" element={<TaskList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/tasks/new" element={<TaskForm />} />
          <Route path="/tasks/:id" element={<TaskDetails />} />
          <Route path="/tasks/:id/edit" element={<TaskForm />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;






// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// import Navbar from "./components/Navbar";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import TaskList from "./pages/TaskList";
// import TaskDetails from "./pages/TaskDetails";
// import TaskForm from "./pages/TaskForm";
// import { useEffect } from "react";
// import { apiRequest } from "./services/api";

// function App() {
//   useEffect(() => {
//   apiRequest("/health")
//     .then((data) => console.log("API connected:", data))
//     .catch((error) => console.error("API connection failed:", error.message));
// }, []);
//   return (
//     <BrowserRouter>
//       <Navbar />

//       <main className="container">
//         <Routes>
//           <Route path="/" element={<TaskList />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />
//           <Route path="/tasks/new" element={<TaskForm />} />
//           <Route path="/tasks/:id" element={<TaskDetails />} />
//           <Route path="/tasks/:id/edit" element={<TaskForm />} />
//           <Route path="*" element={<Navigate to="/" replace />} />
//         </Routes>
//       </main>
//     </BrowserRouter>
//   );
// }

// export default App;
