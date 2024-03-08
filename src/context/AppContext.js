import React, { createContext, useContext, useEffect, useState } from 'react';

export const AppContext = createContext();

export const useAppContext = () =>{
    return useContext(AppContext);
}

export const AppProvider = ({ children }) =>{
  const [viewItems, setViewItems ] = useState([
    {
        name: "Not started",
        id: 1,
        color: "bg-red-300/80",
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
        color: "bg-yellow-500/40",
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
        color: "bg-green-700/20",
        tasks: [
          {
            title: "Card 3",
            id: 5,
            description: "This is card no 3",
          },
        ],
    }
  ]);

    const [taskId, setTaskId] = useState(null);

    const isDataPresent = () => {
      const data = localStorage.getItem("viewItems");

      if(data){
        return true;
      }
      else{
        return false;
      }
    }

    useEffect(() => {
      const storedData = localStorage.getItem("viewItems");
      if (storedData) {
        try {
          const data = JSON.parse(storedData);
          setViewItems(data);
        } catch (error) {
          console.error("Error parsing stored data:", error);
        }
      }
    }, []);
    

    const storeData = (data) => {
      localStorage.setItem("viewItems", JSON.stringify(data));
    }

    const addNewTask = ( title, viewId ) => {
        const newTask = {
          id: Math.floor(Math.random()* 10000),
          title,
          description: "",
        };

        const newViewItem = viewItems.map((view) =>
        view.id === viewId ? { ...view, tasks: [...view.tasks, newTask] } : view
        );

        setViewItems(newViewItem);
        storeData(newViewItem);
    };

    const addNewView = (name) => {
        const newView = {
            name, 
            id: Math.floor(Math.random() * 10000),
            color: "bg-orange-300/20",
            tasks: [],
        };
        setViewItems((prevViewItems) => [...prevViewItems, newView]);
        storeData((prevViewItems) => [...prevViewItems, newView]);
    };

    const deleteTask = (taskId, viewId) =>{
        const newViewItems = viewItems.map((view) =>
                view.id === viewId ? {
                    ...view, 
                    tasks: view.tasks.filter((task) => task.id !== taskId)
                } : view
            );
        setViewItems(newViewItems);
        storeData(newViewItems);
    };

    const updateTask = (taskId, viewId, title, description) => {
      const newViewItems = viewItems.map((view) =>
            view.id === viewId
              ? {
                  ...view,
                  tasks: view.tasks.map((task) =>
                    task.id === taskId ? { ...task, title, description } : task
                  ),
                }
              : view
      );
      setViewItems(newViewItems);
      storeData(newViewItems);
    };

    const changeView = (currentTask, fromViewId, toViewId ) => {
        
        const newTask = {
          id: Math.floor(Math.random() * 10000),
          title: currentTask.title,
          description: currentTask.description,
        };

        const newViewItems = viewItems.map((view) =>
          view.id === Number(toViewId)
            ? { ...view, tasks: [...view.tasks, newTask] }
            : view
        );
        setViewItems(newViewItems);

        const newViewItem2 = newViewItems.map((view) =>
          view.id === Number(fromViewId)
            ? {
                ...view,
                tasks: view.tasks.filter((task) => task.id !== currentTask.id),
              }
            : view
        );

        setViewItems(newViewItem2);
        storeData(newViewItem2);
    };


    const value = {
        viewItems,
        taskId,
        setTaskId,
        addNewTask,
        addNewView,
        deleteTask,
        updateTask,
        changeView
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>
    
};
