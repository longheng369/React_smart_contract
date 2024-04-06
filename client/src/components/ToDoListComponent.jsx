import React, { useEffect, useState } from "react";
import Web3 from "web3";
import ToDoListABI from "../abis/ToDoList.json";
import { IoCheckmarkOutline } from "react-icons/io5";
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import { SlNote } from "react-icons/sl";

const ToDoListComponent = ({ contractAddress }) => {
  const [web3, setWeb3] = useState(null);
  const [todoList, setTodoList] = useState(null);
  const [tasksCount, setTasksCount] = useState(0);
  const [tasks, setTasks] = useState([]);
  const [newTaskContent, setNewTaskContent] = useState("");
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTaskContent, setEditTaskContent] = useState("");
  const [isMetaMaskConnected, setIsMetaMaskConnected] = useState(false);


  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        // await window.ethereum.request({ method: "eth_requestAccounts" });
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        if (accounts.length > 0) {
          setIsMetaMaskConnected(true);
        }
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);
        const todoListInstance = new web3Instance.eth.Contract(
          ToDoListABI.abi,
          contractAddress
        );
        setTodoList(todoListInstance);
      
      } else {
        console.error("Ethereum wallet is not connected");
      }
    };
    initWeb3();
  }, [contractAddress]);

  useEffect(() => {
    const loadTasks = async () => {
      if (todoList) {
        const count = await todoList.methods.tasksCount().call();
        setTasksCount(count.toString());
        let loadedTasks = [];
        for (let i = 1; i <= count; i++) {
          const task = await todoList.methods.tasks(i).call();
          if (!task.deleted) {
            loadedTasks.push(task);
          }
        }
        setTasks(loadedTasks);
      }
    };
    loadTasks();
  }, [todoList]);

  const ensureMetaMaskConnection = async () => {
    if (!isMetaMaskConnected) {
      if (window.ethereum) {
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          setIsMetaMaskConnected(true);
        } catch (error) {
          alert("Please connect to MetaMask to interact.");
          console.error("Error connecting to MetaMask:", error);
          return false;
        }
      } else {
        alert("MetaMask is not installed. Please install MetaMask to interact.");
        return false;
      }
    }
    return true;
  };
  

  const createTask = async () => {
    if (!(await ensureMetaMaskConnection())) return;
    try {
      const accounts = await web3.eth.getAccounts();
      if (!newTaskContent.trim()) {
        alert("Task content cannot be empty.");
        return;
      }
      await todoList.methods
        .createTask(newTaskContent)
        .send({ from: accounts[0] });
      setNewTaskContent("");
      const count = await todoList.methods.tasksCount().call();
      setTasksCount(count);
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const toggleCompleted = async (id) => {
    if (!(await ensureMetaMaskConnection())) return;
    try {
      const accounts = await web3.eth.getAccounts();
      await todoList.methods.toggleCompleted(id).send({ from: accounts[0] });
      const updatedTasks = tasks.map((task) => {
        if (task.id === id) {
          return { ...task, completed: !task.completed };
        }
        return task;
      });
      setTasks(updatedTasks);
    } catch (error) {
      console.error("Error toggling task completion:", error);
    }
  };

  const editTask = async () => {
    if (!(await ensureMetaMaskConnection())) return;
    try {
      const accounts = await web3.eth.getAccounts();
      await todoList.methods
        .editTask(editTaskId, editTaskContent)
        .send({ from: accounts[0] });
      setEditTaskId(null);
      setEditTaskContent("");
      const count = await todoList.methods.tasksCount().call();
      setTasksCount(count);
    } catch (error) {
      console.error("Error editing task:", error);
    }
  };

  const deleteTask = async (id) => {
    if (!(await ensureMetaMaskConnection())) return;
    try {
      const accounts = await web3.eth.getAccounts();
      await todoList.methods.deleteTask(id).send({ from: accounts[0] });
      const updatedTasks = tasks.filter((task) => task.id !== id);
      setTasks(updatedTasks);
      setTasksCount(updatedTasks.length);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <div className="container">
      <h2>ToDo List</h2>

      <div className="input-field">
        <input
          type="text"
          value={newTaskContent}
          onChange={(e) => setNewTaskContent(e.target.value)}
          placeholder="Enter new task content"
        />
        <button onClick={createTask}>
          <SlNote />
        </button>
      </div>
      {editTaskId && (
        <div>
          <input
            type="text"
            value={editTaskContent}
            onChange={(e) => setEditTaskContent(e.target.value)}
            placeholder="Edit task content"
          />
          <button onClick={editTask}>Save Task</button>
        </div>
      )}
      {tasks.map((task, index) => (
        <div className="task-container" key={index}>
          <span>
            {index + 1}. {task.content}
          </span>
          <div className="btns">
            <button onClick={() => toggleCompleted(task.id)}>
              {task.completed ? (
                <IoCheckmarkDoneSharp />
              ) : (
                <IoCheckmarkOutline />
              )}
            </button>
            <button onClick={() => setEditTaskId(task.id)}>Edit</button>
            <button onClick={() => deleteTask(task.id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ToDoListComponent;
