import api from "./axios";

type Metadata = {
  id: string;
  user_id: string;
  parent_id: string;
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

type File = {
  id: string;
  name: string;
  mime_type: string;
  size: string;
  created_at: string;
  updated_at: string;
};

export type FoldersResponse = {
  metadata: Metadata;
  folders: Folder[];
  files: File[];
};

export const getRootFilesApi = async (): Promise<FoldersResponse> => {
  const response = await api.get<FoldersResponse>(
    "/folders/root"
  );

  return response.data;
};

export const getFilesApi = async (
  id: string
): Promise<FoldersResponse> => {
  const response = await api.get<FoldersResponse>(
    `/folders/${id}`
  );

  return response.data;
};