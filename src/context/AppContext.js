import React, { createContext, useContext, useState } from 'react';

export const AppContext = createContext();

export const useAppContext = () =>{
    return useContext(AppContext);
}

const useLocalStorage = (key, initalValue) => {
    const [storedValue, setStoredValue ] = useState(() =>{
        try{
            const item = localStorage.getItem(key);
            return item? JSON.parse(item) : initalValue;
        }
        catch(error){
            console.log("Error while fecthcing localStorage: ", error);
            return initalValue;
        }
    });

    const setValue = (value) => {
        try{
            setStoredValue(value);
            localStorage.setItem(key, JSON.stringify(value));
        }
        catch(error){
            console.log("error while storing in localStorage: ", error);
        }
    };

    return [storedValue, setValue];
}

export const AppProvider = ({ children }) =>{
    const [viewItems, setViewItems ] = useLocalStorage("viewitems", [
        {
            name: "Not started",
            id: 1,
            color: "bg-red-300/20",
            tasks: [
              {
                title: "Card 4",
                id: 1,
                description: "This is card no 4",
              },
              {
                title: "Card 1",
                id: 2,
                description: "This is card no 1",
              },
              {
                title: "Card 5",
                id: 3,
                description: "This is card no 5",
              },
            ],
          },
          {
            name: "In progress",
            id: 2,
            color: "bg-yellow-300/20",
            tasks: [
              {
                title: "Card 2",
                id: 4,
                description: "This is card no 2",
              },
            ],
          },
          {
            name: "Completed",
            id: 3,
            color: "bg-green-300/20",
            tasks: [
              {
                title: "Card 3",
                id: 5,
                description: "This is card no 3",
              },
            ],
        }, 
    ]);

    const [taskId, setTaskId] = useState(null);

    const addNewTask = ( newTask, viewId ) => {
        setViewItems((prevViewItems) =>{
            prevViewItems.map((view) => 
                view.id === viewId ? {...view, tasks: [...view.tasks, newTask]} : view
            )
        })
    }

    const addNewView = (name) => {
        const newView = {
            name, 
            id: Math.floor(Math.random() * 10000),
            color: "bg-orange-300/20",
            tasks: [],
        };
        setViewItems((prevViewItems) => [...prevViewItems, newView]);
    };

    const deletetask = (taskId, viewId) =>{
        setViewItems((prevViewItems) => {
            prevViewItems.map((view) =>
                view.id === viewId ? {
                    ...view, 
                    tasks: view.tasks.filter((task) => task.id !== taskId)
                } : view
            );
        });
    };

    const updateTask = (taskId, viewId, title, description) => {
        setViewItems((prevViewItems) =>
          prevViewItems.map((view) =>
            view.id === viewId
              ? {
                  ...view,
                  tasks: view.tasks.map((task) =>
                    task.id === taskId ? { ...task, title, description } : task
                  ),
                }
              : view
          )
        );
    };

    const chanegView = (currentTask, fromViewId, toViewId ) => {
        setViewItems((prevViewItems) => {
            const updatedViewitems = prevViewItems.map((view) => 
                view.id === toViewId ? {
                    ...view,
                    tasks: [...view.tasks, currentTask] 
                } : view.id === fromViewId  ? {
                    ...view,
                    tasks: view.tasks.filter((task) => task.id !== currentTask.id)
                } : view
            );
            return updatedViewitems;
        });
    };


    const value = {
        viewItems,
        taskId,
        setTaskId,
        addNewTask,
        addNewView,
        deletetask,
        updateTask,
        chanegView
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>
    
};
