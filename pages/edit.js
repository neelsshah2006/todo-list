"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Head from "next/head";
import "./edit.css";

const Edit = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const name = searchParams.get("name");
  const description = searchParams.get("description");
  const index = searchParams.get("index");
  const [taskName, setTaskName] = useState(name || "");
  const [taskDesc, setTaskDesc] = useState(description || "");

  useEffect(() => {
    if (name) setTaskName(name);
    if (description) setTaskDesc(description);
  }, [name, description]);

  const saveHandler = (e) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      let storage = localStorage.getItem("Tasks");
      storage = JSON.parse(storage);
      let tempTask = { ...storage[index] };
      tempTask["taskName"] = taskName;
      tempTask["taskDesc"] = taskDesc;
      storage[index] = tempTask;
      localStorage.setItem("Tasks", JSON.stringify(storage));
      router.push("/");
    }
  };

  return (
    <>
      <Head>
        <title>Edit Task</title>
        <meta name="title" content="Edit Task" />
        <meta name="keywords" content="Edit, Task, TodoList" />
        <meta name="description" content="Edit your task details here" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="bgclass flex justify-center items-center w-[100vw] h-[100vh]">
        <div className="amber flex flex-col justify-center items-center absolute transition-all duration-500 ease-in-out gap-5 py-20 w-[50%] px-10 rounded-2xl">
          <div className="flex justify-center items-center gap-2 fixed top-0">
            <img src="/favicon.ico" alt="Icon" width="50" />
            <h1 className="text-4xl font-bold text-center py-5">TodoList</h1>
          </div>
          <h2 className="text-3xl font-extrabold w-[50%] align-middle text-center py-3 rounded-xl amber">
            Edit Task Details
          </h2>
          <form
            className="flex flex-col justify-center items-center gap-5 w-[100%]"
            onSubmit={saveHandler}
          >
            <div className="grid grid-cols-4 justify-center items-center gap-2 w-[100%] task">
              <label
                htmlFor="editName"
                className="text-xl font-semibold col-span-1"
              >
                Task Name:
              </label>
              <input
                id="editName"
                value={taskName}
                onChange={(e) => {
                  setTaskName(e.target.value);
                }}
                type="text"
                className="black font-semibold w-[100%] text-xl py-2 rounded col-span-3 text-black p-2"
              />
            </div>
            <div className="grid grid-cols-4 justify-center items-center gap-5 w-[100%] task">
              <label
                htmlFor="editDescription"
                className="text-xl font-semibold col-span-1"
              >
                Task Description:
              </label>
              <textarea
                id="editDescription"
                style={{ resize: "none" }}
                value={taskDesc}
                onChange={(e) => {
                  setTaskDesc(e.target.value);
                }}
                rows="2"
                className="black font-semibold w-[100%] text-xl py-2 rounded col-span-3 text-black p-2"
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-yellow-400 px-10 py-3 text-xl font-extrabold text-black rounded-xl hover:scale-110 transition-all duration-300 ease-in-out"
            >
              Edit Task
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Edit;
