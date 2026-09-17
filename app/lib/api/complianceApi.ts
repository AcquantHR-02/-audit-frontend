import baseApi from "./baseapi";

// ========================================
// COMPLIANCE
// ========================================

export interface Compliance {
  id: number;
  requirement: string;
  description: string;
  status: string;

  audit: {
    id: number;
    title?: string;
  } | null;
}

// ========================================
// COMPLIANCE REQUEST
// ========================================

export interface ComplianceRequest {
  requirement: string;
  description: string;
  status: string;

  audit?: {
    id: number;
  } | null;
}

// ========================================
// PAGINATION RESPONSE
// ========================================

export interface CompliancePage {
  content: Compliance[];

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
// GET ALL COMPLIANCE
// ========================================

export const getAllCompliance = async (
  page: number = 0,
  size: number = 10,
): Promise<CompliancePage> => {
  const response = await baseApi.get<CompliancePage>(
    "/api/compliance",
    {
      params: {
        page,
        size,
      },
    },
  );

  return response.data;
};

// ========================================
// GET COMPLIANCE BY ID
// ========================================

export const getComplianceById = async (
  id: number,
): Promise<Compliance> => {
  const response = await baseApi.get<Compliance>(
    `/api/compliance/${id}`,
  );

  return response.data;
};

// ========================================
// CREATE COMPLIANCE
// ========================================

export const createCompliance = async (
  data: ComplianceRequest,
): Promise<Compliance> => {
  const response = await baseApi.post<Compliance>(
    "/api/compliance",
    data,
  );

  return response.data;
};

// ========================================
// UPDATE COMPLIANCE
// ========================================

export const updateCompliance = async (
  id: number,
  data: ComplianceRequest,
): Promise<Compliance> => {
  const response = await baseApi.put<Compliance>(
    `/api/compliance/${id}`,
    data,
  );

  return response.data;
};

// ========================================
// DELETE COMPLIANCE
// ========================================

export const deleteCompliance = async (
  id: number,
) => {
  const response = await baseApi.delete(
    `/api/compliance/${id}`,
  );

  return response.data;
};

// ========================================
// GET COMPLIANCE BY STATUS
// ========================================

export const getComplianceByStatus = async (
  status: string,
): Promise<Compliance[]> => {
  const response = await baseApi.get<Compliance[]>(
    `/api/compliance/status/${status}`,
  );

  return response.data;
};