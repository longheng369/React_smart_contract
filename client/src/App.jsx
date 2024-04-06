import React from "react";
import ToDoListComponent from "./components/ToDoListComponent";


const App = () => {
  return (
    <div>
      <ToDoListComponent contractAddress={import.meta.env.VITE_CONTRACT_ADDRESS} />
    </div>
  );
};

export default App;
