import baseApi from "./baseapi";

// ========================================
// AUDITOR
// ========================================

export interface Auditor {
  id: number;
  name: string;
  email: string;

  role?: {
    id: number;
    name: string;
  };
}

// ========================================
// AUDIT
// ========================================

export interface Audit {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  auditor: Auditor | null;
}

// ========================================
// AUDIT REQUEST
// ========================================

export interface AuditRequest {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;

  auditor?: {
    id: number;
  } | null;
}

// ========================================
// GET ALL AUDITS
// ========================================

export const getAllAudits = async (): Promise<Audit[]> => {
  const response = await baseApi.get<Audit[]>(
    "/api/audits",
  );

  return response.data;
};

// ========================================
// GET AUDIT BY ID
// ========================================

export const getAuditById = async (
  id: number,
): Promise<Audit> => {
  const response = await baseApi.get<Audit>(
    `/api/audits/${id}`,
  );

  return response.data;
};

// ========================================
// CREATE AUDIT
// ========================================

export const createAudit = async (
  data: AuditRequest,
): Promise<Audit> => {
  const response = await baseApi.post<Audit>(
    "/api/audits",
    data,
  );

  return response.data;
};

// ========================================
// UPDATE AUDIT
// ========================================

export const updateAudit = async (
  id: number,
  data: AuditRequest,
): Promise<Audit> => {
  const response = await baseApi.put<Audit>(
    `/api/audits/${id}`,
    data,
  );

  return response.data;
};

// ========================================
// DELETE AUDIT
// ========================================

export const deleteAudit = async (
  id: number,
) => {
  const response = await baseApi.delete(
    `/api/audits/${id}`,
  );

  return response.data;
};

