"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ChevronRight,
  File as FileIcon,
  Folder as FolderIcon,
  Home,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { getFilesApi, getRootFilesApi } from "../api/filesApi";

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

type FilesProps = {
  folders: Folder[];
  files: File[];
};

const Files = ({
  folders: initialFolders,
  files: initialFiles,
}: FilesProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const folderId = searchParams.get("folder");

  const [folders, setFolders] = useState<Folder[]>(initialFolders);
  const [files, setFiles] = useState<File[]>(initialFiles);
  const [currentFolderName, setCurrentFolderName] = useState("Home");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadFolder = async () => {
      try {
        setLoading(true);

        // ROOT
        if (!folderId) {
          const response = await getRootFilesApi();

          setFolders(response.folders ?? []);
          setFiles(response.files ?? []);
          setCurrentFolderName("Home");

          return;
        }

        // CURRENT FOLDER
        const response = await getFilesApi(folderId);

        console.log("FOLDER RESPONSE:", response);

        setFolders(response.folders ?? []);
        setFiles(response.files ?? []);
        setCurrentFolderName(response.metadata.name);
      } catch (error) {
        console.error("Failed to load folder:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFolder();
  }, [folderId]);

  // Open folder
  const handleFolderClick = (folder: Folder) => {
    if (loading) return;

    router.push(`/dashboard?folder=${folder.id}`);
  };

  // UI Back button
  const handleBack = () => {
    if (loading) return;

    router.back();
  };

  // Go directly to root
  const handleHome = () => {
    if (loading) return;

    router.push("/dashboard");
  };

  return (
    <div className="px-6 pb-10">

      {/* =========================
          NAVIGATION
      ========================== */}
      <div className="mb-6 flex items-center justify-between">

        {/* Left side */}
        <div className="flex items-center gap-2">

          {/* Back button */}
          {folderId && (
            <button
              onClick={handleBack}
              disabled={loading}
              className="flex items-center gap-2 rounded-lg border border-line bg-panel px-3 py-2 text-sm text-fog transition hover:border-signal hover:text-paper disabled:cursor-wait disabled:opacity-50"
            >
              <ArrowLeft size={17} />
              <span>Back</span>
            </button>
          )}

          {/* Home */}
          <button
            onClick={handleHome}
            disabled={loading}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${
              !folderId
                ? "bg-panel text-paper"
                : "text-fog hover:bg-panel hover:text-paper"
            }`}
          >
            <Home size={17} />
            <span>Home</span>
          </button>

          {/* Current folder */}
          {folderId && (
            <>
              <ChevronRight
                size={16}
                className="text-fog"
              />

              <span className="rounded-lg bg-panel px-3 py-2 text-sm text-paper">
                {currentFolderName}
              </span>
            </>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <span className="text-xs text-fog">
            Loading...
          </span>
        )}
      </div>

      {/* =========================
          FOLDERS
      ========================== */}
      <div>
        <h2 className="mb-3 text-lg font-semibold text-paper">
          Folders
        </h2>

        {folders.length === 0 ? (
          <p className="text-sm text-fog">
            No folders in this location.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">

            {folders.map((folder) => (
              <button
                key={folder.id}
                onClick={() => handleFolderClick(folder)}
                disabled={loading}
                className="group flex items-center gap-3 rounded-lg border border-line bg-panel p-4 text-left transition hover:border-signal hover:bg-ink disabled:cursor-wait disabled:opacity-60"
              >
                <FolderIcon
                  size={20}
                  className="shrink-0 text-signal"
                />

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-paper">
                    {folder.name}
                  </p>

                  <p className="mt-1 text-xs text-fog">
                    Folder
                  </p>
                </div>

                <ChevronRight
                  size={16}
                  className="shrink-0 text-fog transition group-hover:translate-x-1 group-hover:text-signal"
                />
              </button>
            ))}

          </div>
        )}
      </div>

      {/* =========================
          FILES
      ========================== */}
      <div className="mt-8">

        <h2 className="mb-3 text-lg font-semibold text-paper">
          Files
        </h2>

        {files.length === 0 ? (
          <p className="text-sm text-fog">
            No files in this location.
          </p>
        ) : (
          <div className="space-y-2">

            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between rounded-lg border border-line bg-panel p-4 transition hover:bg-ink"
              >
                <div className="flex min-w-0 items-center gap-3">

                  <FileIcon
                    size={20}
                    className="shrink-0 text-fog"
                  />

                  <div className="min-w-0">
                    <p className="truncate text-sm text-paper">
                      {file.name}
                    </p>

                    <p className="mt-1 text-xs text-fog">
                      {file.mine_type}
                    </p>
                  </div>

                </div>

                <div className="ml-4 shrink-0 text-xs text-fog">
                  {file.size}
                </div>
              </div>
            ))}

          </div>
        )}
      </div>

    </div>
  );
};

export default Files;