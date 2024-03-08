import { useState } from "react";
import { useAppContext } from "../context/AppContext";
import TaskSideBar from "./TaskSideBar";

const TaskPanel = ({ view, viewId }) => {
  const [isInputVisible, setIsInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const { changeView, setTaskId, addNewTask } = useAppContext();


  const handleNewTask = () => {
    if (inputValue) {
      addNewTask(inputValue, view.id);
      setInputValue("");
    }
    document.getElementById("input").focus();
  };

  
  const handleBlur = () => {
    if (!inputValue) {
      setIsInputVisible(false);
    }
    handleNewTask();
  };

  const toggleTaskSideBar = (taskId) => {
    setIsSideBarOpen(true);
    setTaskId(taskId);
  };

  const handleDrag = (event, task, fromViewId) => {
    event.dataTransfer.setData("TASK-ID", JSON.stringify({ task, fromViewId }));
  };

  const handleOnDrop = (e) => {
    const { task, fromViewId } = JSON.parse(e.dataTransfer.getData("TASK-ID"));
    changeView(task, fromViewId, viewId);
  };

  return (
    <div
      className="flex flex-col items-center gap-4 min-w-[260px]"
      onDrop={handleOnDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <div className={`flex items-center justify-between w-full font-semibold`}>
        <div className="flex gap-2  text-gray-400">
          <div className={`text-slate-700 px-2 rounded-md ${view.color}`}>
            {view.name}
          </div>
          <div>{view.tasks.length}</div>
        </div>
        <div className="flex gap-3 items-center text-xl">
            <p className="text-gray-400 mb-[6px]">...</p>
            <button
            onClick={() => setIsInputVisible(true)}
            className=" text-gray-400 cursor-pointer"
            >
            +
            </button>
        </div>
      </div>
      <div className="flex flex-col w-full gap-1.5 flex-nowrap">
        {view.tasks.map((task) => (
          <div
            key={task.id}
            draggable
            onDragStart={(e) => handleDrag(e, task, viewId)}
            onClick={() => toggleTaskSideBar(task.id)}
            className="flex px-3 hover:scale-105 hover:bg-gray-50 duration-300 py-1.5 bg-white drop-shadow-sm rounded w-full cursor-pointer border border-gray-200"
          >
            <div className="text-slate-700 font-semibold text-[20px]">
              {task.title}
            </div>
          </div>
        ))}
        {isInputVisible && (
          <div className="flex px-3 py-1.5 bg-white drop-shadow-sm rounded w-full cursor-pointer border border-gray-200">
            <input
              id="input"
              type="text"
              className="w-full text-slate-700 placeholder:font-normal font-semibold text-[20px] outline-none px-4"
              placeholder="Add Task Title..."
              autoFocus
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleNewTask();
                }
              }}
              onBlur={handleBlur}
            />
          </div>
        )}

        <button
          className="text-gray-400 text-lg text-left px-1 mt-2 cursor-pointer focus:outline-blue-400/80"
          onClick={() => setIsInputVisible(true)}
        >
          + New
        </button>
      </div>
      <TaskSideBar
        currentView={view}
        isOpen={isSideBarOpen}
        setIsOpen={setIsSideBarOpen}
      />
    </div>
  );
}

export default TaskPanel;