"use client";

import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import Navbar from "../components/Navbar";
import Files from "./files";

import { useAuthStore } from "../store/authStore";
import {
  getRootFilesApi,
  getFilesApi,
} from "../api/filesApi";

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

type Metadata = {
  id: string;
  user_id: string;
  parent_id: string | null;
  name: string;
  created_at: string;
  updated_at: string;
};

const Dashboard = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  /*
   * Folder ID from URL
   *
   * /dashboard
   * /dashboard?folder=123
   */
  const folderId = searchParams.get("folder");

  const [folders, setFolders] = useState<Folder[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);

  /*
   * Current folder name
   *
   * Home      -> "/"
   * Documents -> "Documents"
   */
  const [currentPath, setCurrentPath] = useState("/");

  /*
   * Parent folder ID of current folder
   */
  const [parentFolderId, setParentFolderId] =
    useState<string | null>(null);

  const user = useAuthStore((state) => state.user);

  /* =========================================================
     LOAD ROOT OR CURRENT FOLDER
  ========================================================= */

  useEffect(() => {
    async function loadFiles() {
      try {
        setLoading(true);

        if (folderId) {
          /*
           * ================================================
           * LOAD CURRENT FOLDER
           * ================================================
           */

          const response = await getFilesApi(folderId);

          console.log(
            "CURRENT FOLDER RESPONSE:",
            response
          );

          console.log(
            "METADATA:",
            response.metadata
          );

          console.log(
            "CURRENT FOLDER:",
            response.metadata?.name
          );

          console.log(
            "PARENT FOLDER:",
            response.metadata?.parent_id
          );

          setFolders(response.folders ?? []);
          setFiles(response.files ?? []);

          /*
           * Show folder name
           */
          setCurrentPath(
            response.metadata?.name || "/"
          );

          /*
           * Save parent folder ID
           */
          setParentFolderId(
            response.metadata?.parent_id || null
          );

        } else {
          /*
           * ================================================
           * LOAD ROOT
           * ================================================
           */

          const response = await getRootFilesApi();

          console.log(
            "ROOT RESPONSE:",
            response
          );

          console.log(
            "METADATA:",
            response.metadata
          );

          console.log(
            "FOLDERS:",
            response.folders
          );

          console.log(
            "FILES:",
            response.files
          );

          setFolders(response.folders ?? []);
          setFiles(response.files ?? []);

          /*
           * Root path
           */
          setCurrentPath("/");

          /*
           * Root has no parent
           */
          setParentFolderId(null);
        }

      } catch (error) {
        console.error(
          "Failed to fetch files:",
          error
        );

        setFolders([]);
        setFiles([]);
        setCurrentPath("/");
        setParentFolderId(null);

      } finally {
        setLoading(false);
      }
    }

    loadFiles();
  }, [folderId]);


  /* =========================================================
     OPEN FOLDER
  ========================================================= */

  function handleFolderClick(folder: Folder) {
    console.log(
      "Opening folder:",
      folder
    );

    /*
     * Use push when opening a folder.
     *
     * This changes:
     *
     * /dashboard
     *      ↓
     * /dashboard?folder=A
     *
     * or
     *
     * /dashboard?folder=A
     *      ↓
     * /dashboard?folder=B
     */
    router.push(
      `/dashboard?folder=${folder.id}`
    );
  }


  /* =========================================================
     GO BACK TO PARENT FOLDER
  ========================================================= */

  function handleBack() {
    /*
     * Already at root
     */
    if (!folderId) {
      return;
    }

    /*
     * Current folder has a parent.
     *
     * Example:
     *
     * Current = Folder B
     * Parent  = Folder A
     *
     * Go directly to Folder A.
     */
    if (parentFolderId) {
      router.replace(
        `/dashboard?folder=${parentFolderId}`
      );

      return;
    }

    /*
     * No parent means this is a root-level folder.
     *
     * Go to root.
     */
    router.replace("/dashboard");
  }


  /* =========================================================
     GO HOME
  ========================================================= */

  function handleHomeClick() {
    router.replace("/dashboard");
  }


  /* =========================================================
     UI
  ========================================================= */

  return (
    <div className="flex h-screen flex-col overflow-hidden">

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <Navbar data={files} />


      {/* =====================================================
          DASHBOARD AREA
      ===================================================== */}

      <div className="flex min-h-0 flex-1">


        {/* ===================================================
            SIDEBAR
        =================================================== */}

        <aside className="flex w-64 shrink-0 flex-col border-r border-line bg-ink">

          {/* Upload */}
          <div className="p-5">

            <button
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-signal px-4 py-3 font-medium text-ink transition hover:opacity-90"
            >
              <Plus size={20} />

              <span>
                Upload
              </span>
            </button>

          </div>


          {/* Navigation */}
          <nav className="flex-1 px-3">

            {/* Home */}
            <button
              type="button"
              onClick={handleHomeClick}
              className={`mb-1 flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
                !folderId
                  ? "bg-panel text-paper"
                  : "text-fog hover:bg-panel hover:text-paper"
              }`}
            >

              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>

              <span>
                Home
              </span>

            </button>


            {/* Starred */}
            <button
              type="button"
              className="mb-1 flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm text-fog transition hover:bg-panel hover:text-paper"
            >

              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>

              <span>
                Starred
              </span>

            </button>


            {/* Recent */}
            <button
              type="button"
              className="mb-1 flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm text-fog transition hover:bg-panel hover:text-paper"
            >

              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="9" />
                <polyline points="12 7 12 12 15 14" />
              </svg>

              <span>
                Recent
              </span>

            </button>


            {/* Divider */}
            <div className="my-5 border-t border-line" />


            {/* Storage */}
            <div className="px-4">

              <p className="mb-3 text-xs font-medium uppercase tracking-wider text-fog">
                Storage
              </p>


              {/* My Storage */}
              <button
                type="button"
                onClick={handleHomeClick}
                className="flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-sm text-fog transition hover:bg-panel hover:text-paper"
              >

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="19"
                  height="19"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />

                  <polyline points="3.27 6.96 12 12.01 20.73 6.96" />

                  <line
                    x1="12"
                    y1="22.08"
                    x2="12"
                    y2="12"
                  />
                </svg>

                <span>
                  My Storage
                </span>

              </button>


              {/* Storage Usage */}
              <button
                type="button"
                className="mt-1 flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-sm text-fog transition hover:bg-panel hover:text-paper"
              >

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="19"
                  height="19"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2v20" />
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>

                <span>
                  Storage Usage
                </span>

              </button>

            </div>

          </nav>


          {/* Bottom */}
          <div className="border-t border-line p-4">

            <button
              type="button"
              className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm text-fog transition hover:bg-panel hover:text-paper"
            >

              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="3"
                />

                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0-1.51-1V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9c.14.6.66 1 1.27 1H21a2 2 0 1 1 0 4h-.09c-.61 0-1.13.4-1.27 1z" />
              </svg>

              <span>
                Settings
              </span>

            </button>

          </div>

        </aside>


        {/* ===================================================
            MAIN CONTENT
        =================================================== */}

        <main className="hide-scrollbar min-w-0 flex-1 overflow-y-auto bg-panel">

          <div className="w-full px-6 py-6">

            {/* Welcome */}
            <h3 className="mb-8 text-3xl text-paper">
              Welcome, {user?.username}
            </h3>


            {/* Files */}
            {loading ? (
              <div className="py-10 text-fog">
                Loading files...
              </div>
            ) : (
              <Files
                folders={folders}
                files={files}
                loading={loading}
                handleFolderClick={handleFolderClick}
                handleBack={handleBack}
                canGoBack={!!folderId}
                currentPath={currentPath}
              />
            )}

          </div>

        </main>

      </div>

    </div>
  );
};

export default Dashboard;
