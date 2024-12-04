import { useState } from "react";
import { updateTask, deleteTask } from "../api";
import { FaTrash, FaChevronDown, FaChevronUp, FaPencilAlt, FaPlus, FaWindowClose } from "react-icons/fa";

const Task = ({ task, onTaskUpdate, onTaskDelete, onComplete }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [description, setDescription] = useState(task.description || "");
  const [newTag, setNewTag] = useState("");
  const [dueDate, setDueDate] = useState(task.due_date);

  const handleDateChange = async (e) => {
    const newDate = e.target.value;
    setDueDate(newDate);
    try {
      await updateTask(task.id, { due_date: newDate });
      onTaskUpdate(task.id, { ...task, due_date: newDate });
    } catch (error) {
      console.error("Failed to update due date", error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTask(task.id);
      onTaskDelete(task.id);
    } catch (error) {
      console.error("Failed to delete task", error);
    }
  };

  const handleDescriptionSave = async () => {
    try {
      await updateTask(task.id, { description });
      onTaskUpdate(task.id, { ...task, description });
      setIsEditingDescription(false);
    } catch (error) {
      console.error("Failed to update description", error);
    }
  };

  const handleAddTag = async () => {
    if (newTag.trim() === "") return; // Do not add empty tags
    const updatedTags = [...task.tags, newTag.trim()];
    try {
      await updateTask(task.id, { tags: updatedTags });
      onTaskUpdate(task.id, { ...task, tags: updatedTags });
      setNewTag(""); // Clear input field
      setIsAddingTag(false); // Exit adding mode
    } catch (error) {
      console.error("Failed to add tag", error);
    }
  };

  const handleTagDelete = async (tagToDelete) => {
    const updatedTags = task.tags.filter((tag) => tag !== tagToDelete);
    try {
      await updateTask(task.id, { tags: updatedTags });
      onTaskUpdate(task.id, { ...task, tags: updatedTags });
    } catch (error) {
      console.error("Failed to delete tag", error);
    }
  };

  const handleCancelTag = (e) => {
    e.stopPropagation();
    setNewTag(""); // Clear the input field
    setIsAddingTag(false); // Exit adding mode
  };

  const handleComplete = async (e) => {
    const isComplete = e.target.checked;
    try {
      await updateTask(task.id, { completed: isComplete }); // Send updated status to backend
      onComplete(task.id, isComplete); // Update the parent component's state
    } catch (error) {
      console.error("Failed to mark task as complete", error);
    }
  };

  return (
    <div className="bg-white border border-gray-300 rounded-lg shadow-sm p-2 mb-2 flex flex-col">
      <div className="flex w-full justify-between">
        <div className="flex items-center gap-2">
          <input type="checkbox" checked={task.completed} onChange={handleComplete} className="cursor-pointer" />
          {task.description !== "" || task.tags.length > 0 ? (
            <button className="text-gray-500 hover:text-gray-700" onClick={() => setShowDetails(!showDetails)}>
              {showDetails ? <FaChevronUp /> : <FaChevronDown />}
            </button>
          ) : (
            <span className="pr-4"></span>
          )}
          <span className="font-medium">{task.name}</span>
        </div>

        <div className="flex items-center gap-4">
          <input type="date" value={dueDate} onChange={handleDateChange} className="border border-gray-300 rounded-md p-1" />
          <button onClick={handleDelete} className="text-red-500 hover:text-red-700">
            <FaTrash />
          </button>
        </div>
      </div>

      {showDetails && (
        <div className="mt-2 p-2 bg-gray-50 rounded-md">
          {/* Editable Description */}
          <div className="flex items-start gap-2 p-1">
            <p className="text-sm text-gray-700 flex-1">{isEditingDescription ? <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} onBlur={handleDescriptionSave} onKeyDown={(e) => e.key === "Enter" && handleDescriptionSave()} className="border border-gray-300 rounded-md p-1 w-full" autoFocus /> : <span>{description || "No description provided"}</span>}</p>
            <button className="text-gray-500 hover:text-gray-700 place-self-center" onClick={() => setIsEditingDescription(true)}>
              <FaPencilAlt />
            </button>
          </div>
          {(task.description !== "" || task.tags.length > 0) && <hr className="m-2"></hr>}
          {/* Tags */}
          <div className="flex items-center gap-2">
            <div className="flex gap-1 flex-wrap">
              <span>Tags: </span>
              {task.tags.length === 0 && <span>Add your first tag</span>}
              {task.tags.map((tag) => (
                <span key={tag} onClick={() => handleTagDelete(tag)} className="bg-gray-200 px-2 py-1 rounded-md cursor-pointer hover:bg-red-500 hover:text-white transition">
                  {tag}
                </span>
              ))}
            </div>
            {isAddingTag ? (
              <>
                <input type="text" value={newTag} onChange={(e) => setNewTag(e.target.value)} onBlur={handleAddTag} onKeyDown={(e) => e.key === "Enter" && handleAddTag()} className="border border-gray-300 rounded-md p-1 w-32" autoFocus />
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={handleCancelTag} // Cancel adding the tag
                >
                  <FaWindowClose />
                </button>
              </>
            ) : (
              <button className="text-gray-500 hover:text-gray-700" onClick={() => setIsAddingTag(true)}>
                <FaPlus />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Task;
