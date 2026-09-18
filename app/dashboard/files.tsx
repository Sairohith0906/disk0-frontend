"use client";

import { useEffect, useState } from "react";
import { getRootFilesApi } from "../api/filesApi";

type Folder = {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
};

type File = {
  id: string;
  name: string;
  mine_type: string;
  size: string;
  created_at: string;
  updated_at: string;
};

const Files = () => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    const fetchRootFiles = async () => {
      try {
        const response = await getRootFilesApi();

        console.log("ROOT RESPONSE:", response);
        console.log("FILES:", response.files);
        console.log("FOLDERS:", response.folders);

        setFolders(response.folders);
        setFiles(response.files);
      } catch (error) {
        console.error("Failed to fetch root files:", error);
      }
    };

    fetchRootFiles();
  }, []);

  return (
    <div>
      {/* Folders */}
      <div>
        <h2 className="mb-3 text-lg font-semibold">Folders</h2>

        <div className="grid grid-cols-2 gap-3">
          {folders.map((folder) => (
            <div
              key={folder.id}
              className="rounded-lg border border-line bg-panel p-4"
            >
              <p className="text-sm text-paper">
                {folder.name}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Files */}
      <div className="mt-8">
        <h2 className="mb-3 text-lg font-semibold">Files</h2>

        <div className="space-y-2">
          {files.map((file) => (
            <div
              key={file.id}
              className="rounded-lg border border-line bg-panel p-4"
            >
              <p className="text-sm text-paper">
                {file.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Files;