import { useEffect, useState } from "react";
import axios from "axios";
import { type TodoItem } from "./types";
import dayjs from "dayjs";
// import { SquarePen } from 'lucide-react';

function App() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [inputText, setInputText] = useState("");
  const [mode, setMode] = useState<"ADD" | "EDIT">("ADD");
  const [curTodoId, setCurTodoId] = useState("");
  const [filter, setFilter] = useState<"ALL" | "PENDING" | "COMPLETED">("ALL");

  // Fetch all todos from the server
  async function fetchData() {
    try {
      const res = await axios.get<TodoItem[]>("api/todo");
      setTodos(res.data);
    } catch (err) {
      alert("Error fetching todos: " + (err as Error).message);
    }
  }

  // Fetch todos on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Handle text input change
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputText(e.target.value);
  }

  // Submit new or edited todo
  function handleSubmit() {
    if (!inputText) return;

    const request = mode === "ADD"
      ? axios.put("/api/todo", { todoText: inputText })
      : axios.patch("/api/todo", { id: curTodoId, todoText: inputText });

    request
      .then(() => {
        setInputText("");
        setMode("ADD");
        setCurTodoId("");
        fetchData();
      })
      .catch((err) => alert("Error submitting todo: " + err.message));
  }

  // Handle todo item deletion
  function handleDelete(id: string) {
    axios
      .delete("/api/todo", { data: { id } })
      .then(() => {
        setMode("ADD");
        setInputText("");
        fetchData();
      })
      .catch((err) => alert("Error deleting todo: " + err.message));
  }

  // Cancel editing mode
  function handleCancel() {
    setMode("ADD");
    setInputText("");
    setCurTodoId("");
  }

  // Filter todos based on the selected filter
  function handleFilter(filter: "ALL" | "PENDING" | "COMPLETED") {
    setFilter(filter);
  }

  // Clear all todos
  function handleClearAll() {
      axios
        .delete("/api/todo/all")
        .then(() => {
          setTodos([]);
        })
        .catch((err) => alert("Error clearing todos: " + err.message));
  }

  // Toggle completion status of a todo item
  function handleCheckboxChange(id: string, isDone: boolean) {
    axios
      .patch("/api/todo/completed", { id, completed: !isDone })
      .then(fetchData)
      .catch((err) => {
        console.error("Error details:", err.response?.data || err.message);
        alert("An error occurred while updating the todo item.");
      });
  }

  // Filter todos based on the current filter
  function getFilteredTodos() {
    switch (filter) {
      case "PENDING":
        return todos.filter(todo => !todo.isDone);
      case "COMPLETED":
        return todos.filter(todo => todo.isDone);
      default:
        return todos;
    }
  }

  // Handle "Enter" key press in input
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      handleSubmit();
    }
  }

  return (
    <div style={{ margin: "auto", padding: "16px", maxWidth: "600px", width: "500px", height: "100%", backgroundColor: "white", marginTop: "100px", borderRadius: "20px" }}>
      <header>
        <h1 style={{ fontWeight: "bold", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", color: "black" }}>Todo App</h1>
      </header>
      <main>
        <div style={{ display: "flex", alignItems: "center", gap:"0.5rem" }}>
          {/* <SquarePen/> */}
          <input
            type="text"
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Add a New Task + Enter"
            value={inputText}
            style={{
              borderRadius: "0.25rem",
              padding: "0.5rem",
              flex: 1,
              width: "50%",
              backgroundColor: "white",
              border: "1px solid black",
              color: "black"
            }}
            data-cy="input-text"
          />
          {mode === "EDIT" && (
            <button
              onClick={handleCancel}
              style={{
                backgroundColor: "#6b7280",
                color: "white",
                padding: "0.5rem 1rem",
                borderRadius: "0.25rem",
                border: "none",
                cursor: "pointer",
                height: "60px",
                marginBottom: "1rem"
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#4b5563")}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#6b7280")}
            >
              Cancel
            </button>
          )}
        </div>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
          {["ALL", "PENDING", "COMPLETED", "CLEAR ALL"].map((label) => (
            <span
              key={label}
              onClick={() => label === "CLEAR ALL" ? handleClearAll() : handleFilter(label as "ALL" | "PENDING" | "COMPLETED")}
              style={{
                whiteSpace: "nowrap",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "6rem",
                height: "2.5rem",
                margin: "0 0.5rem",
                borderRadius: "0.25rem",
                cursor: "pointer",
                backgroundColor: filter === label ? "#3b82f6" : "#f3f4f6",
                color: filter === label ? "white" : "#374151",
                transition: "background-color 0.3s"
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = filter === label ? "#2563eb" : "#e5e7eb")}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = filter === label ? "#3b82f6" : "#f3f4f6")}
            >
              {label}
            </span>
          ))}
        </div>
        <div data-cy="todo-item-wrapper">
          {getFilteredTodos().length === 0 ? (
            <div style={{ textAlign: "center", padding: "1rem", fontStyle: "italic", color: "#6b7280" }}>
              You don't have any task here
            </div>
          ) : (
            getFilteredTodos().sort(compareDate).map((item) => {
              const { date, time } = formatDateTime(item.createdAt);
              const text = item.todoText;
              return (
                <article
                  key={item.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "0.5rem",
                    borderRadius: "0.25rem",
                    backgroundColor: "white",
                    border: "1px solid black",
                    color: "black"
                  }}
                >
                  <input
                    type="checkbox"
                    checked={item.isDone}
                    onChange={() => handleCheckboxChange(item.id, item.isDone)}
                    style={{ marginRight: "0.5rem" }}
                    data-cy={`todo-item-checkbox-${item.id}`}
                  />
                  <div>📅{date}</div>
                  <div>⏰{time}</div>
                  <div
                    data-cy="todo-item-text"
                    style={{
                      flex: 1,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      marginRight: "0.5rem",
                      maxWidth: "calc(100% - 4rem)"
                    }}
                    >
                    📰{text}
                  </div>
                  <div
                    style={{ cursor: "pointer", marginLeft: "0.5rem",flexShrink: 0, }}
                    onClick={() => {
                      setMode("EDIT");
                      setCurTodoId(item.id);
                      setInputText(item.todoText);
                    }}
                    data-cy="todo-item-update"
                  >
                    {curTodoId !== item.id ? "🖊️" : "✍🏻"}
                  </div>
                  {mode === "ADD" && (
                    <div
                      style={{
                        cursor: "pointer",
                        marginLeft: "0.5rem",
                        flexShrink: 0,
                      }}
                      onClick={() => handleDelete(item.id)}
                      data-cy="todo-item-delete"
                    >
                      🗑️
                    </div>
                  )}
                </article>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}

export default App;

// Format date and time from a date string
function formatDateTime(dateStr: string) {
  if (!dayjs(dateStr).isValid()) {
    return { date: "N/A", time: "N/A" };
  }
  const dt = dayjs(dateStr);
  const date = dt.format("D/MM/YY");
  const time = dt.format("HH:mm");
  return { date, time };
}

// Compare two todo items based on creation date
function compareDate(a: TodoItem, b: TodoItem) {
  const da = dayjs(a.createdAt);
  const db = dayjs(b.createdAt);
  return da.isBefore(db) ? -1 : 1;
}
