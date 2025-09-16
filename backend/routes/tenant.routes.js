import { Router } from "express";
import { addMember, createTenant, getMyTenant, upgradeTenant } from "../controllers/tenant.controller.js";
import { authorizeRoles, protect } from "../middlewares/auth.middleware.js";
import { ensureTenantMatchesSlug } from "../middlewares/tenant.middleware.js";

const tenantRouter = Router()

tenantRouter.post("/register", createTenant)
tenantRouter.get("/:slug", protect, ensureTenantMatchesSlug, getMyTenant)
tenantRouter.post("/:slug/upgrade", protect, authorizeRoles("Admin"), ensureTenantMatchesSlug, upgradeTenant)
tenantRouter.post("/:slug/add-member", protect, authorizeRoles("Admin"), ensureTenantMatchesSlug, addMember)

export default tenantRouter