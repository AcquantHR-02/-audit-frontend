import baseApi from "./baseapi";

// ======================================================
// FINDING
// ======================================================

export interface Finding {
  id: number;
  title: string;
  description: string;
  severity: string;
  status: string;

  audit: {
    id: number;
    title?: string;
  } | null;
}

// ======================================================
// FINDING REQUEST
// ======================================================

export interface FindingRequest {
  title: string;
  description: string;
  severity: string;
  status: string;

  audit: {
    id: number;
  } | null;
}

// ======================================================
// PAGINATION RESPONSE
// ======================================================

export interface FindingPage {
  content: Finding[];

  totalElements: number;
  totalPages: number;

  size: number;
  number: number;

  first: boolean;
  last: boolean;

  numberOfElements: number;
  empty: boolean;
}

// ======================================================
// GET ALL FINDINGS
// ======================================================

export const getAllFindings = async (
  page: number = 0,
  size: number = 10
): Promise<FindingPage> => {
  const response = await baseApi.get<FindingPage>(
    "/api/findings",
    {
      params: {
        page,
        size,
      },
    }
  );

  return response.data;
};

// ======================================================
// GET FINDING BY ID
// ======================================================

export const getFindingById = async (
  id: number
): Promise<Finding> => {
  const response = await baseApi.get<Finding>(
    `/api/findings/${id}`
  );

  return response.data;
};

// ======================================================
// CREATE FINDING
// ======================================================

export const createFinding = async (
  data: FindingRequest
): Promise<Finding> => {
  const response = await baseApi.post<Finding>(
    "/api/findings",
    data
  );

  return response.data;
};

// ======================================================
// UPDATE FINDING
// ======================================================

export const updateFinding = async (
  id: number,
  data: FindingRequest
): Promise<Finding> => {
  const response = await baseApi.put<Finding>(
    `/api/findings/${id}`,
    data
  );

  return response.data;
};

// ======================================================
// DELETE FINDING
// ======================================================

export const deleteFinding = async (
  id: number
) => {
  const response = await baseApi.delete(
    `/api/findings/${id}`
  );

  return response.data;
};

// ======================================================
// GET FINDINGS BY STATUS
// ======================================================

export const getFindingsByStatus = async (
  status: string
): Promise<Finding[]> => {
  const response = await baseApi.get<Finding[]>(
    `/api/findings/status/${status}`
  );

  return response.data;
};

// ======================================================
// GET FINDINGS BY SEVERITY
// ======================================================

export const getFindingsBySeverity = async (
  severity: string
): Promise<Finding[]> => {
  const response = await baseApi.get<Finding[]>(
    `/api/findings/severity/${severity}`
  );

  return response.data;
};