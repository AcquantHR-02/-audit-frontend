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
// PAGINATION RESPONSE
// ========================================

export interface AuditPage {
  content: Audit[];

  totalElements: number;
  totalPages: number;

  size: number;
  number: number;

  first: boolean;
  last: boolean;

  numberOfElements: number;
  empty: boolean;
}

// ========================================
// GET ALL AUDITS
// ========================================

export const getAllAudits = async (
  page: number = 0,
  size: number = 10,
): Promise<AuditPage> => {
  const response = await baseApi.get<AuditPage>("/api/audits", {
    params: {
      page,
      size,
    },
  });

  return response.data;
};

// ========================================
// GET AUDIT BY ID
// ========================================

export async function getAuditById(id: number): Promise<Audit> {
  const response = await baseApi.get<Audit>(`/api/audits/${id}`);

  return response.data;
}

// ========================================
// CREATE AUDIT
// ========================================

export const createAudit = async (data: AuditRequest): Promise<Audit> => {
  const response = await baseApi.post<Audit>("/api/audits", data);

  return response.data;
};

// ========================================
// UPDATE AUDIT
// ========================================

export const updateAudit = async (
  id: number,
  data: AuditRequest,
): Promise<Audit> => {
  const response = await baseApi.put<Audit>(`/api/audits/${id}`, data);

  return response.data;
};

// ========================================
// DELETE AUDIT
// ========================================

export const deleteAudit = async (id: number) => {
  const response = await baseApi.delete(`/api/audits/${id}`);

  return response.data;
};
