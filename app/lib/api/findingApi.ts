import baseApi from "./baseapi";

// =========================
// Finding
// =========================

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

// =========================
// Finding Request
// =========================

export interface FindingRequest {
  title: string;
  description: string;
  severity: string;
  status: string;
  audit: {
    id: number;
  } | null;
}

// =========================
// Get All Findings
// =========================

export const getAllFindings = async (): Promise<Finding[]> => {
  const response = await baseApi.get<Finding[]>(
    "/api/findings"
  );

  return response.data;
};

// =========================
// Get Finding By ID
// =========================

export const getFindingById = async (
  id: number
): Promise<Finding> => {
  const response = await baseApi.get<Finding>(
    `/api/findings/${id}`
  );

  return response.data;
};

// =========================
// Create Finding
// =========================

export const createFinding = async (
  data: FindingRequest
): Promise<Finding> => {
  const response = await baseApi.post<Finding>(
    "/api/findings",
    data
  );

  return response.data;
};

// =========================
// Update Finding
// =========================

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

// =========================
// Delete Finding
// =========================

export const deleteFinding = async (
  id: number
) => {
  const response = await baseApi.delete(
    `/api/findings/${id}`
  );

  return response.data;
};

// =========================
// Get Findings By Status
// =========================

export const getFindingsByStatus = async (
  status: string
): Promise<Finding[]> => {
  const response = await baseApi.get<Finding[]>(
    `/api/findings/status/${status}`
  );

  return response.data;
};

// =========================
// Get Findings By Severity
// =========================

export const getFindingsBySeverity = async (
  severity: string
): Promise<Finding[]> => {
  const response = await baseApi.get<Finding[]>(
    `/api/findings/severity/${severity}`
  );

  return response.data;
};