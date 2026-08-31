type FileData = {
  id: number;
  name: string;
  dateModified: string;
  size: number;
  type: string;
  owner: string;
  folder: string;
};


const searchSuggestions = (search: string, data: FileData[]) => {
  const suggestions = data.filter((file) =>
    file.name.toLowerCase().includes(search.toLowerCase())
  );

  return suggestions;
};

export default searchSuggestions;