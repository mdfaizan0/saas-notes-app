import Tenant from "../models/Tenant.model.js"

export async function ensureTenantMatchesSlug(req, res, next) {
    const tenantSlug = req.params.slug

    if (!tenantSlug) {
        return res.status(400).json({ message: "Tenant slug is required" })
    }

    try {
        const tenant = await Tenant.findOne({ slug: tenantSlug })
        if (!tenant) {
            return res.status(404).json({ message: "Tenant not found" })
        }

        if (!req.user.tenantId || req.user.tenantId.toString() !== tenant._id.toString()) {
            return res.status(403).json({ message: "You are not authorized to access this tenant's resources" })
        }

        req.tenant = tenant
        next()
    } catch (error) {
        return res.status(500).json({ message: "Server error while verifying tenant", error: error.message })
    }
}