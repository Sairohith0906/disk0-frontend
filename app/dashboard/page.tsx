'use client'

import { Plus } from "lucide-react";
import Navbar from "../components/Navbar";
import GetTable from "./table";
import { useEffect, useState } from "react";


type FileData = {
  id: number;
  name: string;
  dateModified: string;
  size: number;
  type: string;
  owner: string;
  folder: string;
};

const Dashboard = () => {
  const [data, setData] = useState<FileData[]>([]);

  useEffect(() => {
    async function getData() {
      const response = await fetch("/api/files");
      const result = await response.json();

      setData(result);
    }

    getData();
  }, []);


  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Navbar data={data}/>

      {/* Dashboard area */}
      <div className="flex min-h-0 flex-1">

        {/* Sidebar */}
        <div className="w-xs shrink-0 overflow-y-auto bg-ink p-5">
          <button className="flex w-full items-center justify-center rounded-xl bg-red-600 p-3">
            <Plus />
            <span className="ml-2">Upload</span>
          </button>

          {/* Sidebar content */}
        </div>

        {/* Main content */}
        <div className="min-w-0 flex-1 overflow-y-auto hide-scrollbar bg-panel">
          <h3 className="p-6 text-3xl">
            Good morning, Alex
          </h3>

          <GetTable data={data} />
        </div>

      </div>
    </div>
  );
};

export default Dashboard;