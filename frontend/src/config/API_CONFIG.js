const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const API = {
  auth: {
    register: `${BASE_URL}/auth/register`,
    login: `${BASE_URL}/auth/login`,
  },
  notes: {
    create: `${BASE_URL}/notes`,          // POST
    fetchAll: `${BASE_URL}/notes`,        // GET
    fetchOne: (id) => `${BASE_URL}/notes/${id}`, // GET
    update: (id) => `${BASE_URL}/notes/${id}`,   // PUT
    delete: (id) => `${BASE_URL}/notes/${id}`,   // DELETE
  },
  tenants: {
    register: `${BASE_URL}/tenants/register`, // POST
    getMyTenant: (slug) => `${BASE_URL}/tenants/${slug}`, // GET
    upgrade: (slug) => `${BASE_URL}/tenants/${slug}/upgrade`, // POST (Admin only)
    addMember: (slug) => `${BASE_URL}/tenants/${slug}/add-member`, // POST (Admin only)
  },
  misc: {
    health: `${BASE_URL}/health`,
  },
};