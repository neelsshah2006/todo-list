"use client";
import React, { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Page = () => {
  const [taskName, setTaskName] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [mainTask, setMainTask] = useState([]);
  const [completedTasks, setCompletedTasks] = useState(
    localStorage.getItem("complete") || 0
  );
  const [pendingTasks, setPendingTasks] = useState(mainTask.length);
  const [totalTasks, setTotalTasks] = useState(
    localStorage.getItem("total") || 0
  );
  const router = useRouter();

  useEffect(() => {
    const handleContextMenu = (event) => {
      event.preventDefault();
    };

    document.addEventListener("contextmenu", handleContextMenu);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  useEffect(() => {
    setPendingTasks(mainTask.length);
  }, [mainTask]);

  useEffect(() => {
    localStorage.setItem("total", totalTasks);
    localStorage.setItem("complete", completedTasks);
  }, [totalTasks, completedTasks]);

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("Tasks"));
    if (savedTasks) {
      setMainTask(savedTasks);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("Tasks", JSON.stringify(mainTask));
  }, [mainTask]);

  const capitalizeEachLine = (text) => {
    return text
      .split("\n")
      .map((line) => line.charAt(0).toUpperCase() + line.slice(1))
      .join("\n");
  };

  const deleteHandler = (e, i) => {
    e.preventDefault();
    let tempTask = [...mainTask];
    tempTask.splice(i, 1);
    setMainTask(tempTask);
  };

  const completeHandler = async (e, i) => {
    deleteHandler(e, i);
    setCompletedTasks(completedTasks + 1);
  };

  const editHandler = (e, i, taskName, taskDesc) => {
    e.preventDefault();
    router.push(
      `/edit?name=${encodeURIComponent(
        taskName
      )}&description=${encodeURIComponent(taskDesc)}&index=${i}`
    );
  };

  let renderTask = <h2>No Task Available</h2>;
  if (mainTask.length > 0) {
    renderTask = mainTask.map((t, i) => {
      return (
        <li
          key={i + 1}
          className="task flex w-[100vw] justify-between gap-2 bg-amber-50 rounded-xl shadow-lg text-black p-3"
        >
          <div className="taskDetails flex flex-col w-[50vw] justify-center items-start py-3 px-5">
            <div className="flex gap-2 justify-center items-center">
              <div className="tNum px-4 py-2 rounded-full bg-amber-200">
                {i + 1}
              </div>
              <h5 className="tName font-semibold text-xl">{t.taskName}</h5>
            </div>
            <h6 className="tDesc ml-[50px] max-w-[50vw] font-semibold text-sm">
              {t.taskDesc}
            </h6>
          </div>
          <div className="taskButtons flex gap-2 justify-center items-center">
            <button
              className="bg-green-400 transition duration-300 ease-in-out transform font-semibold hover:bg-green-600 hover:scale-110 px-10 py-2 text-xl rounded-lg"
              onClick={(e) => {
                completeHandler(e, i);
              }}
            >
              Completed
            </button>
            <button
              className="bg-red-400 transition duration-300 ease-in-out transform font-semibold hover:scale-110 hover:bg-red-600 px-10 py-2 text-xl rounded-lg"
              onClick={(e) => {
                deleteHandler(e, i);
                setTotalTasks(totalTasks - 1);
              }}
            >
              Delete
            </button>
            <button
              className="bg-amber-300 transition duration-300 ease-in-out transform font-semibold hover:scale-110 hover:bg-amber-600 text-xl px-10 py-2 rounded-lg"
              onClick={(e) => {
                editHandler(e, i, t.taskName, t.taskDesc);
              }}
            >
              Edit
            </button>
          </div>
        </li>
      );
    });
  }

  const submitHandler = (e) => {
    e.preventDefault();
    if (taskName === "" || taskDesc === "") {
      return;
    }
    setMainTask([...mainTask, { taskName, taskDesc }]);
    setTaskDesc("");
    setTaskName("");
    setTotalTasks(totalTasks + 1);
  };

  return (
    <>
      <div className="flex justify-center items-center gap-2">
        <img src="./favicon.ico" alt="Icon" width="50" />
        <h1 className="text-4xl font-bold text-center py-5">TodoList</h1>
      </div>
      <hr />
      <form
        className="taskCreaterForm flex justify-center items-baseline gap-10 p-10"
        onSubmit={(e) => {
          submitHandler(e);
        }}
      >
        <input
          type="text"
          value={taskName}
          onChange={(e) => {
            setTaskName(capitalizeEachLine(e.target.value));
          }}
          className="text-xl outline-0 text-black p-3 rounded-xl border-2 border-green-400"
          id="taskName"
          placeholder="Enter Task Name Here"
        />
        <textarea
          rows="2"
          cols="50"
          style={{ resize: "none" }}
          value={taskDesc}
          onChange={(e) => {
            setTaskDesc(capitalizeEachLine(e.target.value));
          }}
          className="text-xl outline-0 text-black p-3 rounded-xl border-2 border-green-400"
          id="taskDesc"
          placeholder="Enter Task Description Here"
        />
        <button
          id="addTask"
          className="px-4 py-2 text-2xl text-black bg-green-400 hover:bg-green-600 rounded-xl font-bold shadow-lg transition duration-300 ease-in-out transform hover:scale-110"
        >
          Add Task
        </button>
      </form>
      <hr />
      <div className="grid grid-flow-col gap-2 p-5">
        <div className="completedTasks bg-green-400 p-5 rounded-xl shadow-lg text-black">
          <h2 className="text-5xl font-semibold">{completedTasks}</h2>
          <h3 className="text-l font-semibold">Completed Task</h3>
        </div>
        <div className="pendingTasks bg-yellow-400 p-5 rounded-xl shadow-lg text-black">
          <h2 className="text-5xl font-semibold">{pendingTasks}</h2>
          <h3 className="text-l font-semibold">Pending Task</h3>
        </div>
        <div className="pendingTasks bg-gray-50 p-5 rounded-xl shadow-lg text-black">
          <h2 className="text-5xl font-semibold">{totalTasks}</h2>
          <h3 className="text-l font-semibold">Total Task</h3>
        </div>
      </div>
      <hr />
      <div className="flex flex-col justify-center items-center gap-5 text-xl mt-3">
        <h2 className="text-2xl font-bold">Tasks: </h2>
        <ul className="flex flex-col width-[100vw] gap-2">{renderTask}</ul>
      </div>
    </>
  );
};

export default Page;
