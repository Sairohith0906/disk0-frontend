type FileData = {
  id: number;
  name: string;
  dateModified: string;
  size: number;
  type: string;
  owner: string;
  folder: string;
};

type GetTableProps = {
  data: FileData[];
};

const GetTable = ({ data }: GetTableProps) => {
  return (
    <div className="px-6">
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
              <td className="px-5 py-3">{file.name}</td>

              <td className="py-3 text-black">
                {new Date(file.dateModified).toLocaleDateString()}
              </td>

              <td className="py-3 text-black">
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GetTable;