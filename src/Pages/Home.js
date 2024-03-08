import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import TaskPanel from "../components/TaskPanel";

const Home = () => {
  const task = useAppContext();

  const [newViewName, setNewViewName] = useState("");
  const [isNewViewInputOpen, setIsNewViewInputOpen] = useState(false);

  const inputChangeHandler = (e) => {
    setNewViewName(e.target.value);
  };

  const handleCreateNewView = () => {
        task.addNewView(newViewName);
        setNewViewName("");
        setIsNewViewInputOpen(false);
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col px-10 pt-10 gap-16">
        <div className="text-base md:text-2xl lg:text-4xl font-semibold text-slate-600 ">
            airTribe Assignment : Design a project board like Trello or Notion. 
        </div>
        <div className="flex gap-4 flex-nowrap overflow-x-scroll h-full px-5">
        {task.viewItems && task.viewItems.map((view) => (
            <TaskPanel key={view.id} view={view} viewId={view.id} />
        ))}
        <div>
            {isNewViewInputOpen ? (
            <input
                type="text"
                value={newViewName}
                onChange={inputChangeHandler}
                className="text-slate-700 px-2 rounded-md bg-orange-300/20 focus:outline-none font-semibold text-sm"
                onKeyDown={(e) =>
                e.key === "Enter" && newViewName && handleCreateNewView()
                }
                autoFocus
                onBlur={() => setIsNewViewInputOpen(false)}
            />
            ) : (
            <button
                className="font-semibold text-gray-400 cursor-pointer min-w-[200px]"
                onClick={() => setIsNewViewInputOpen(true)}
            >
                + New View
            </button>
            )}
            <div></div>
        </div>
        </div>
    </div>
  );
}

export default Home;

