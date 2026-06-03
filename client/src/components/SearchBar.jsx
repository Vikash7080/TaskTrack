function SearchBar({
  searchTerm,
  setSearchTerm,
}) {
  return (
    <div className="mt-8 mb-4">
      <input
        type="text"
        placeholder="Search tasks..."
        value={searchTerm}
        onChange={(e) =>
          setSearchTerm(e.target.value)
        }
        className="w-full bg-white border rounded-lg p-3"
      />
    </div>
  );
}

export default SearchBar;