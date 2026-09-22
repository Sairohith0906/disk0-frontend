import api from "./axios";

type Metadata = {
  id: string;
  user_id: string;
  parent_id: string | null;
  name: string;
  created_at: string;
  updated_at: string;
};

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

type createFolderResponse = {
  success : boolean,
  result : Metadata
}


export type FoldersResponse = {
  metadata: Metadata | null;
  folders: Folder[];
  files: FileItem[];
};

export const getRootFilesApi =
  async (): Promise<FoldersResponse> => {
    const response = await api.get<FoldersResponse>(
      "/folders/root"
    );

    return response.data;
  };

export const getFilesApi = async (
  id: string
): Promise<FoldersResponse> => {
  const response = await api.get<FoldersResponse>(
    `/folders/${encodeURIComponent(id)}`
  );

  return response.data;
};


export const createFolder = async(
  parent_id : string,
  name : string
):Promise<createFolderResponse> =>{
  const response = await api.post<createFolderResponse>(
    "/folders",
    {parent_id,name}
  );
  return response.data;
};