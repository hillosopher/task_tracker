import { useState, useEffect, useRef } from "react";

const TagFilter = ({ tags, onTagSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  // Close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredTags = tags.filter((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleTagClick = (tag) => {
    onTagSelect(tag); // Emit the selected tag
    setIsOpen(false); // Close the dropdown
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300">
        Filter by tag
      </button>
      {isOpen && (
        <div className="absolute bg-white border border-gray-300 rounded mt-1 max-h-60 w-64 overflow-y-auto shadow-lg z-10">
          {/* Search Input */}
          <div className="p-2">
            <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search tags..." className="w-full border border-gray-300 rounded px-2 py-1" />
          </div>
          {/* Tag List */}
          <ul className="p-2">
            {filteredTags.map((tag) => (
              <li key={tag} onClick={() => handleTagClick(tag)} className="px-2 py-1 cursor-pointer hover:bg-gray-200 rounded">
                {tag}
              </li>
            ))}
            {filteredTags.length === 0 && <li className="px-2 py-1 text-gray-500">No tags found</li>}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TagFilter;
