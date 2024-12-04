import { useQuery, useQueryClient } from "react-query";
import { fetchTasks, createTask } from "../api";
import Task from "./Task";
import Button from "./Button";
import TagFilter from "./TagFilter";
import FormModal from "./FormModal";
import { useState } from "react";
import { createPortal } from "react-dom";

const TaskList = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedTag, setSelectedTag] = useState(null); // Track selected tag for filtering
  const [showCompletedTasks, setShowCompletedTasks] = useState(false); // Toggle for completed tasks
  const queryClient = useQueryClient();

  const { data: tasks, isLoading, error } = useQuery("tasks", fetchTasks);

  const handleAddTask = async (newTask) => {
    try {
      await createTask(newTask);
      await queryClient.invalidateQueries("tasks");
      setShowModal(false);
    } catch (error) {
      console.error("Failed to add task:", error);
    }
  };

  const handleCloseModal = (skipWarning = false) => {
    if (skipWarning) {
      setShowModal(false);
    } else {
      const userConfirmed = window.confirm("Are you sure you want to close? Unsaved changes will be lost.");
      if (userConfirmed) {
        setShowModal(false);
      }
    }
  };

  const handleTaskUpdate = (taskId, updatedTask) => {
    queryClient.setQueryData("tasks", (oldTasks) => oldTasks.map((task) => (task.id === taskId ? updatedTask : task)));
  };

  const handleTaskComplete = (taskId, isComplete) => {
    queryClient.setQueryData("tasks", (oldTasks) => oldTasks.map((task) => (task.id === taskId ? { ...task, completed: isComplete } : task)));
  };

  const handleTaskDelete = (taskId) => {
    queryClient.setQueryData("tasks", (oldTasks) => oldTasks.filter((task) => task.id !== taskId));
  };

  // Get all unique tags from tasks
  const allTags = Array.from(new Set(tasks?.flatMap((task) => task.tags) || []));

  // Filter tasks based on selected tag and completion status
  const filteredTasks = tasks
    ? tasks.filter(
        (task) =>
          (showCompletedTasks || !task.completed) && // Show or hide completed tasks
          (!selectedTag || task.tags.includes(selectedTag)) // Filter by selected tag
      )
    : [];

  if (isLoading) return <p className="centered-div">Loading tasks...</p>;
  if (error) return <p className="centered-div">Error loading tasks.</p>;

  return (
    <div className="centered-div w-full max-w-2xl mx-auto p-4">
      <h2 className="text-3xl text-center">{selectedTag === null || !filteredTasks.length ? "All tasks" : `${selectedTag} tasks`}</h2>
      <div className="flex justify-between items-center my-6">
        {/* Add a New Task Button */}
        <Button onClick={() => setShowModal(true)}>Add a new task</Button>
        {/* Filter Dropdown */}
        <div className="flex gap-2">
          {selectedTag && filteredTasks.length > 0 && (
            <Button onClick={() => setSelectedTag(null)} buttonType="alert">
              Show all tasks
            </Button>
          )}
          <TagFilter tags={allTags} onTagSelect={(tag) => setSelectedTag(tag)} />
        </div>
      </div>
      {tasks.length === 0 ? <h3 className="text-center text-xl">Add your first Task!</h3> : <div>{filteredTasks.length > 0 ? filteredTasks.map((task) => <Task key={task.id} task={task} onTaskUpdate={handleTaskUpdate} onTaskDelete={handleTaskDelete} onComplete={handleTaskComplete} />) : tasks.map((task) => <Task key={task.id} task={task} onTaskUpdate={handleTaskUpdate} onTaskDelete={handleTaskDelete} onComplete={handleTaskComplete} />)}</div>}
      {tasks?.some((task) => task.completed) && (
        <div className="mt-4 text-center">
          <Button onClick={() => setShowCompletedTasks(!showCompletedTasks)} buttonType="alert">
            {showCompletedTasks ? "Hide completed tasks" : "Show completed tasks"}
          </Button>
        </div>
      )}
      {showModal && createPortal(<FormModal onCloseModal={handleCloseModal} onAddTask={handleAddTask} />, document.body)}
    </div>
  );
};

export default TaskList;
