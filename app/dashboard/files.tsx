"use client";

import {
  Folder as FolderIcon,
  File as FileIcon,
  ChevronRight,
  ArrowLeft,
  Star
} from "lucide-react";
import { useState } from "react";

type Folder = {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
};

type FileItem = {
  id: string;
  name: string;
  mime_type: string;
  size: string;
  created_at: string;
  updated_at: string;
};

type FilesProps = {
  folders: Folder[];
  files: FileItem[];
  loading: boolean;
  handleFolderClick: (folder: Folder) => void;
  handleBack: () => void;
  canGoBack: boolean;
  currentPath?: string;
};

const Files = ({
  folders,
  files,
  loading,
  handleFolderClick,
  handleBack,
  canGoBack,
  currentPath = "/",
}: FilesProps) => {
  const isEmpty = folders.length === 0 && files.length === 0;
  const [isStared, setIsStared] = useState(false);
  const [starredFiles, setStarredFiles] = useState<string[]>([]);
  const formatDate = (date: string) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const toggleStar = (fileId: string) => {
    setStarredFiles((prev) =>
      prev.includes(fileId)
        ? prev.filter((id) => id !== fileId)
        : [...prev, fileId]
    );
  };

  return (
    <div className="w-full">

      {/* =====================================================
          BACK BUTTON
      ===================================================== */}

      {canGoBack && (
        <div className="mb-4">
          <button
            type="button"
            onClick={handleBack}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-fog transition hover:bg-ink hover:text-paper disabled:cursor-wait disabled:opacity-60"
          >
            <ArrowLeft size={18} />

            <span>
              Back
            </span>
          </button>
        </div>
      )}

      {/* =====================================================
          CURRENT LOCATION
      ===================================================== */}

      <div className="mb-6">
        <p className="text-sm text-fog">
          {currentPath === "/" ? "/" : `/ ${currentPath}`}
        </p>
      </div>

      {/* =====================================================
          EMPTY
      ===================================================== */}

      {isEmpty ? (

        <div className="flex min-h-[300px] items-center justify-center">
          <p className="text-3xl text-fog">
            Empty
          </p>
        </div>

      ) : (

        <>

          {/* =================================================
              FOLDERS
          ================================================= */}

          {folders.length > 0 && (
            <div>

              <div className="space-y-2">

                {folders.map((folder) => (

                  <button
                    key={folder.id}
                    type="button"
                    onClick={() => handleFolderClick(folder)}
                    disabled={loading}
                    className="group relative flex w-full items-center gap-3 rounded-lg border border-line bg-panel p-4 text-left transition hover:border-signal hover:bg-ink disabled:cursor-wait disabled:opacity-60"
                  >

                    {/* Folder icon */}
                    <FolderIcon
                      size={20}
                      className="shrink-0 text-signal"
                    />

                    {/* Folder name */}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-paper">
                        {folder.name}
                      </p>
                    </div>

                    {/* Folder type - exact center of box */}
                    <div className="pointer-events-none absolute left-1/2 hidden -translate-x-1/2 text-center text-xs text-fog sm:block">
                      Folder
                    </div>

                    {/* Arrow */}
                    <ChevronRight
                      size={16}
                      className="shrink-0 text-fog transition group-hover:translate-x-1 group-hover:text-signal"
                    />

                  </button>

                ))}

              </div>

            </div>
          )}

          {/* =================================================
              FILES
          ================================================= */}

          {files.length > 0 && (
            <div className={folders.length > 0 ? "mt-2" : ""}>

              <div className="space-y-2">

                {files.map((file) => (

                  <div
                    key={file.id}
                    className="relative flex w-full items-center gap-3 rounded-lg border border-line bg-panel p-4 transition hover:bg-ink"
                  >

                    {/* File icon */}
                    <FileIcon
                      size={20}
                      className="shrink-0 text-fog"
                    />

                    {/* File name */}
                    <div className="flex min-w-0 flex-1 items-center gap-2">
                      <p className="truncate text-sm text-paper">
                        {file.name}
                      </p>
                    </div>

                    {/* MIME type - exact center of box */}
                    <div className="pointer-events-none absolute left-1/2 hidden max-w-40 -translate-x-1/2 truncate text-center text-xs text-fog md:block">
                      {file.mime_type}
                    </div>

                    {/* Modified date */}
                    <div className="hidden w-32 shrink-0 text-center text-xs text-fog lg:block">
                      {formatDate(file.updated_at)}
                    </div>

                    {/* File size */}
                    <div className="w-20 shrink-0 text-right text-xs text-fog">
                      {file.size}
                    </div>

                    {/* Favorite */}
                    <button
                      type="button"
                      className="flex w-8 shrink-0 items-center justify-center text-fog transition hover:text-signal"
                      aria-label={`Favorite ${file.name}`}
                      onClick={() => toggleStar(file.id)}
                    >
                      <Star
                        size={17}
                        className={`transition ${
                          starredFiles.includes(file.id)
                            ? "fill-amber-300 text-amber-300"
                            : "fill-transparent text-fog"
                        }`}
                      />
                    </button>

                  </div>

                ))}

              </div>

            </div>
          )}

        </>

      )}

    </div>
  );
};

export default Files;