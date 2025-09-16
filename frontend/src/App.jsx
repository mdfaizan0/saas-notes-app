import { Outlet } from "react-router-dom";
import NavBar from "./components/NavBar";

const App = () => {
  return (
    <>
      <NavBar />
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default App;