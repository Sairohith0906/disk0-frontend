"use client";

import {
  Folder as FolderIcon,
  File as FileIcon,
  ChevronRight,
  ArrowLeft,
  Star,
  Plus,
  FolderPlus,
  ArrowUpDown,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

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

type SortOption = "name" | "size" | "modified";

type FilesProps = {
  folders: Folder[];
  files: FileItem[];
  loading: boolean;
  handleFolderClick: (folder: Folder) => void;
  handleBack: () => void;
  canGoBack: boolean;
  currentPath?: string;
  currentFolderId: string;

  handleAddFile?: () => void;
  handleCreateFolder?: (
    parent_id: string,
    name: string
  ) => Promise<void>;
};

const Files = ({
  folders,
  files,
  loading,
  handleFolderClick,
  handleBack,
  canGoBack,
  currentPath = "/",
  currentFolderId,
  handleAddFile,
  handleCreateFolder,
}: FilesProps) => {
  const [starredFiles, setStarredFiles] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>("name");
  const [sortOpen, setSortOpen] = useState(false);

  /*
   * NEW FOLDER MODAL STATE
   *
   * Replaces window.prompt with a controlled input so we can
   * fully control submit behaviour (no native form submission,
   * no page reload on Enter).
   */
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [creatingFolder, setCreatingFolder] = useState(false);

  const formatDate = (date: string) => {
    if (!date) return "-";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "-";
    }

    return parsedDate.toLocaleDateString("en-IN", {
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

  const getSortLabel = () => {
    switch (sortOption) {
      case "size":
        return "Size";

      case "modified":
        return "Modified";

      case "name":
      default:
        return "Name";
    }
  };

  const parseSize = (size: string): number => {
    if (!size) return 0;

    const value = Number.parseFloat(size);

    if (Number.isNaN(value)) {
      return 0;
    }

    const normalized = size.toLowerCase();

    if (normalized.includes("tb")) {
      return value * 1024 * 1024 * 1024;
    }

    if (normalized.includes("gb")) {
      return value * 1024 * 1024;
    }

    if (normalized.includes("mb")) {
      return value * 1024;
    }

    if (normalized.includes("kb")) {
      return value;
    }

    if (normalized.includes("b")) {
      return value / 1024;
    }

    return value;
  };

  const sortedFolders = useMemo(() => {
    return [...folders].sort((a, b) =>
      a.name.localeCompare(b.name, undefined, {
        numeric: true,
        sensitivity: "base",
      })
    );
  }, [folders]);

  const sortedFiles = useMemo(() => {
    return [...files].sort((a, b) => {
      switch (sortOption) {
        case "size":
          return parseSize(b.size) - parseSize(a.size);

        case "modified":
          return (
            new Date(b.updated_at).getTime() -
            new Date(a.updated_at).getTime()
          );

        case "name":
        default:
          return a.name.localeCompare(b.name, undefined, {
            numeric: true,
            sensitivity: "base",
          });
      }
    });
  }, [files, sortOption]);

  const isEmpty =
    sortedFolders.length === 0 && sortedFiles.length === 0;

  /*
   * OPEN / CLOSE FOLDER MODAL
   */
  function openFolderModal() {
    setNewFolderName("");
    setIsFolderModalOpen(true);
  }

  function closeFolderModal() {
    if (creatingFolder) return; // don't let them close mid-submit
    setIsFolderModalOpen(false);
    setNewFolderName("");
  }

  /*
   * SUBMIT NEW FOLDER
   *
   * IMPORTANT: e.preventDefault() stops the native form submission
   * that the browser triggers on Enter, which is what was causing
   * the page to reload.
   */
  async function submitNewFolder(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const trimmedName = newFolderName.trim();

    if (!trimmedName || !handleCreateFolder || creatingFolder) {
      return;
    }

    try {
      setCreatingFolder(true);
      await handleCreateFolder(currentFolderId, trimmedName);
      setIsFolderModalOpen(false);
      setNewFolderName("");
    } catch (error) {
      console.error("Failed to create folder:", error);
    } finally {
      setCreatingFolder(false);
    }
  }

  return (
    <div className="w-full">
      {/* Back button */}
      {canGoBack && (
        <div className="mb-4">
          <button
            type="button"
            onClick={handleBack}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-fog transition hover:bg-ink hover:text-paper disabled:cursor-wait disabled:opacity-60"
          >
            <ArrowLeft size={18} />

            <span>Back</span>
          </button>
        </div>
      )}

      {/* Current location */}
      <div className="mb-4">
        <p className="text-sm text-fog">
          {currentPath === "/" ? "/" : `/${currentPath}`}
        </p>
      </div>

      {/* Action bar */}
      <div className="mb-6 flex items-center justify-between rounded-lg border border-line bg-panel px-3 py-2">
        {/* Left actions */}
        <div className="flex items-center gap-1">
          {/* Add File */}
          <button
            type="button"
            onClick={handleAddFile}
            disabled={loading || !handleAddFile}
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-fog transition hover:bg-ink hover:text-paper disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Plus size={17} />

            <span>Add File</span>
          </button>

          {/* Create Folder */}
          <button
            type="button"
            onClick={openFolderModal}
            disabled={loading || !handleCreateFolder}
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-fog transition hover:bg-ink hover:text-paper disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FolderPlus size={17} />
            <span>Create Folder</span>
          </button>
        </div>

        {/* Sort */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setSortOpen((prev) => !prev)}
            disabled={loading}
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-fog transition hover:bg-ink hover:text-paper disabled:cursor-wait disabled:opacity-60"
          >
            <ArrowUpDown size={17} />

            <span>Sort: {getSortLabel()}</span>
          </button>

          {sortOpen && (
            <div className="absolute right-0 top-full z-50 mt-2 w-40 overflow-hidden rounded-lg border border-line bg-panel shadow-lg">
              {/* Name */}
              <button
                type="button"
                onClick={() => {
                  setSortOption("name");
                  setSortOpen(false);
                }}
                className={`flex w-full items-center px-4 py-2.5 text-left text-sm transition hover:bg-ink ${
                  sortOption === "name" ? "text-signal" : "text-fog"
                }`}
              >
                Name
              </button>

              {/* Size */}
              <button
                type="button"
                onClick={() => {
                  setSortOption("size");
                  setSortOpen(false);
                }}
                className={`flex w-full items-center px-4 py-2.5 text-left text-sm transition hover:bg-ink ${
                  sortOption === "size" ? "text-signal" : "text-fog"
                }`}
              >
                Size
              </button>

              {/* Modified */}
              <button
                type="button"
                onClick={() => {
                  setSortOption("modified");
                  setSortOpen(false);
                }}
                className={`flex w-full items-center px-4 py-2.5 text-left text-sm transition hover:bg-ink ${
                  sortOption === "modified" ? "text-signal" : "text-fog"
                }`}
              >
                Modified
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Empty */}
      {isEmpty ? (
        <div className="flex min-h-[300px] items-center justify-center">
          <p className="text-3xl text-fog">Empty</p>
        </div>
      ) : (
        <>
          {/* Folders */}
          {sortedFolders.length > 0 && (
            <div>
              <div className="space-y-2">
                {sortedFolders.map((folder) => (
                  <button
                    key={folder.id}
                    type="button"
                    onClick={() => handleFolderClick(folder)}
                    disabled={loading}
                    className="group relative flex w-full items-center gap-3 rounded-lg border border-line bg-panel p-4 text-left transition hover:border-signal hover:bg-ink disabled:cursor-wait disabled:opacity-60"
                  >
                    {/* Folder icon */}
                    <FolderIcon size={20} className="shrink-0 text-signal" />

                    {/* Folder name */}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-paper">
                        {folder.name}
                      </p>
                    </div>

                    {/* Folder type */}
                    <div className="pointer-events-none absolute left-1/2 hidden -translate-x-1/2 text-center text-xs text-fog sm:block">
                      Folder
                    </div>

                    {/* Modified date */}
                    <div className="hidden w-32 shrink-0 text-center text-xs text-fog lg:block">
                      {formatDate(folder.updated_at)}
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

          {/* Files */}
          {sortedFiles.length > 0 && (
            <div className={sortedFolders.length > 0 ? "mt-2" : ""}>
              <div className="space-y-2">
                {sortedFiles.map((file) => (
                  <div
                    key={file.id}
                    className="relative flex w-full items-center gap-3 rounded-lg border border-line bg-panel p-4 transition hover:bg-ink"
                  >
                    {/* File icon */}
                    <FileIcon size={20} className="shrink-0 text-fog" />

                    {/* File name */}
                    <div className="flex min-w-0 flex-1 items-center gap-2">
                      <p className="truncate text-sm text-paper">
                        {file.name}
                      </p>
                    </div>

                    {/* MIME type */}
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

      {/* New Folder Modal */}
      {isFolderModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
          onClick={closeFolderModal}
        >
          <div
            className="w-full max-w-sm rounded-xl border border-line bg-panel p-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-medium text-paper">
                New Folder
              </h3>

              <button
                type="button"
                onClick={closeFolderModal}
                disabled={creatingFolder}
                className="text-fog transition hover:text-paper disabled:cursor-not-allowed disabled:opacity-60"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/*
              onSubmit + e.preventDefault() inside submitNewFolder is the
              key fix: Enter now runs our handler instead of the browser's
              native form submission (which was reloading the page).
            */}
            <form onSubmit={submitNewFolder}>
              <input
                type="text"
                autoFocus
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Folder name"
                disabled={creatingFolder}
                className="mb-4 w-full rounded-lg border border-line bg-ink px-3 py-2 text-sm text-paper outline-none focus:border-signal disabled:cursor-not-allowed disabled:opacity-60"
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeFolderModal}
                  disabled={creatingFolder}
                  className="rounded-lg px-4 py-2 text-sm text-fog transition hover:bg-ink hover:text-paper disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={creatingFolder || !newFolderName.trim()}
                  className="rounded-lg bg-signal px-4 py-2 text-sm font-medium text-ink transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {creatingFolder ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Files;