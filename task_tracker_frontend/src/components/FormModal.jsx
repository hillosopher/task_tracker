import { useState } from "react";
import Button from "./Button";

function FormModal({ onCloseModal, onAddTask }) {
  const [taskName, setTaskName] = useState("");
  const [taskDueDate, setTaskDueDate] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!taskName || !taskDueDate) {
      setError("Task Name and Due Date are required.");
      return;
    }

    try {
      const newTask = {
        name: taskName,
        due_date: taskDueDate,
        description,
        tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
      };

      await onAddTask(newTask);
      setError("");
      onCloseModal(true);
    } catch (err) {
      setError("Failed to add task.");
      console.error(err);
    }
  };

  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="h-screen w-screen absolute bg-slate-900 bg-opacity-90 flex justify-center items-center" onClick={() => onCloseModal(false)}>
      <div className="bg-white p-6 rounded-lg shadow-lg" onClick={stopPropagation}>
        <h2 className="text-xl mb-4">Add a New Task</h2>
        <form className="flex flex-col gap-4 w-[400px]" onSubmit={handleSubmit}>
          <input type="text" placeholder="Task Name" value={taskName} onChange={(e) => setTaskName(e.target.value)} className="input-field" />
          <div>
            <label className="text-xs font-medium text-gray-400">Due Date</label>
            <input type="date" placeholder="Due Date" value={taskDueDate} onChange={(e) => setTaskDueDate(e.target.value)} className="input-field" />
          </div>
          <textarea placeholder="Description (Optional)" value={description} onChange={(e) => setDescription(e.target.value)} className="input-field" />
          <input type="text" placeholder="Tags (comma-separated)" value={tags} onChange={(e) => setTags(e.target.value)} className="input-field" />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex justify-between">
            <Button type="submit">Add Task</Button>
            <Button type="button" buttonType="alert" onClick={() => onCloseModal(false)}>
              Close
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FormModal;
