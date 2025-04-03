import { Routes, Route } from "react-router-dom";
import Layout from "./pages/layout";
import HeroSection from "./component/heroSection";
import CreateRoom from "./pages/createRoom";
import DashBoardPage from "./pages/dashboardPage";
import EditorPage from "./pages/EditorPage";
import { Toaster } from "react-hot-toast";
import About from "./component/about";
import Features from "./component/feature";
function App() {
  return (
    <>
      <Toaster
        position="bottom-right"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          // Define default options
          className: "",
          duration: 5000,
          removeDelay: 1000,
          style: {
            background: "#363636",
            color: "#fff",
          },

          // Default options for specific types
          success: {
            duration: 3000,
            iconTheme: {
              primary: "green",
              secondary: "black",
            },
          },
        }}
      />
      <Routes>
        {/* Wrap these routes with the Layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<HeroSection />} />
          <Route path="dashboard" element={<DashBoardPage />} />
          <Route path="room" element={<CreateRoom />} />

          <Route path="/about" element={<About />} />
          <Route path="/features" element={<Features />} />
          <Route path="editor/:roomId" element={<EditorPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
