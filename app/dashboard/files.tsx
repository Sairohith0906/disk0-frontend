"use client";

import {
  Folder as FolderIcon,
  File as FileIcon,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";

type Folder = {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
};

type FileItem = {
  id: string;
  name: string;
  mine_type: string;
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
                    onClick={() =>
                      handleFolderClick(folder)
                    }
                    disabled={loading}
                    className="group flex w-full items-center gap-3 rounded-lg border border-line bg-panel p-4 text-left transition hover:border-signal hover:bg-ink disabled:cursor-wait disabled:opacity-60"
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


                    {/* Folder type */}
                    <div className="hidden w-32 shrink-0 text-left text-xs text-fog sm:block">
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
                    className="flex w-full items-center gap-3 rounded-lg border border-line bg-panel p-4 transition hover:bg-ink"
                  >

                    {/* Favorite */}
                    <div className="w-4 shrink-0 text-center text-sm text-fog">
                      *
                    </div>


                    {/* File icon */}
                    <FileIcon
                      size={20}
                      className="shrink-0 text-fog"
                    />


                    {/* File name */}
                    <div className="min-w-0 flex-1">

                      <p className="truncate text-sm text-paper">
                        {file.name}
                      </p>

                    </div>


                    {/* MIME type */}
                    <div className="hidden w-40 shrink-0 truncate text-xs text-fog md:block">
                      {file.mine_type}
                    </div>


                    {/* File size */}
                    <div className="w-20 shrink-0 text-right text-xs text-fog">
                      {file.size}
                    </div>

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
