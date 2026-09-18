type File = {
  id: string;
  name: string;
  mine_type: string;
  size: string;
  created_at: string;
  updated_at: string;
};

type GetTableProps = {
  data: File[];
};

const formatFileSize = (size: string) => {
  const bytes = Number(size);

  if (isNaN(bytes) || bytes === 0) {
    return "0 B";
  }

  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(2)} KB`;
  }

  if (bytes < 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }

  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
};

const GetTable = ({ data }: GetTableProps) => {
  return (
    <div className="px-6 pb-10">
      <table className="w-full table-fixed">
        <thead>
          <tr className="border-b border-line text-left text-sm text-fog">
            <th className="w-auto py-3">Name</th>
            <th className="w-48 py-3">Date modified</th>
            <th className="w-32 py-3">File size</th>
          </tr>
        </thead>

        <tbody>
          {data.map((file) => (
            <tr
              key={file.id}
              className="border-b border-line text-black odd:bg-amber-200 even:bg-amber-400"
            >
              {/* Name */}
              <td className="truncate px-5 py-3">
                {file.name}
              </td>

              {/* Date modified */}
              <td className="py-3 text-black">
                {new Date(file.updated_at).toLocaleDateString()}
              </td>

              {/* File size */}
              <td className="py-3 text-black">
                {formatFileSize(file.size)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GetTable;