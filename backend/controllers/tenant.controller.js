import Tenant from "../models/Tenant.model.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import User from "../models/User.model.js"
import slug from "slug"

export async function createTenant(req, res) {
    const { companyName, name, email, password } = req.body

    try {
        const userExist = await User.findOne({ email })
        if (userExist) return res.status(409).json({ message: "Tenant already exists, please login with admin instead." })

        const hashedPassword = await bcrypt.hash(password, 12)
        let compSlug = slug(companyName)
        const existingTenant = await Tenant.findOne({ slug: compSlug })
        if (existingTenant) {
            compSlug = `${compSlug}-${Date.now()}`
        }
        const tenant = await Tenant.create({ companyName, slug: compSlug })
        const user = await User.create({ name, email, password: hashedPassword, role: "Admin", tenantId: tenant._id })

        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
                role: user.role,
                tenantId: user.tenantId || null
            },
            process.env.JWT_SECRET,
            { expiresIn: "5d" }
        )

        return res.status(201).json({ message: "Tenant Registered", tenant, user: await User.findById(user._id).populate("tenantId"), token })
    } catch (error) {
        return res.status(500).json({ message: "Server error while registering the tenant", error: error.message })
    }
}

export async function upgradeTenant(req, res) {
    const tenant = req.tenant

    try {
        const tenantToUpdate = await Tenant.findById(tenant._id)
        if (!tenantToUpdate) {
            return res.status(404).json({ message: "Tenant not found" })
        }

        tenantToUpdate.subscription = "Pro"
        await tenantToUpdate.save()
        return res.status(200).json({ message: "Tenant upgraded to Pro", tenant: tenantToUpdate })
    } catch (error) {
        return res.status(500).json({ message: "Server error while upgrading the tenant's subscription plan", error: error.message })
    }
}

export async function addMember(req, res) {
    const { email } = req.body
    const admin = req.user

    try {
        const user = await User.findOne({ email })
        if (!user) return res.status(404).json({ message: "User not found" })
        if (user.tenantId) return res.status(400).json({ message: "User already belongs to a tenant" })

        user.tenantId = admin.tenantId
        user.role = "Member"
        await user.save()

        return res.status(200).json({ message: "User added to tenant successfully", user })
    } catch (error) {
        return res.status(500).json({ message: "Server error while adding user", error: error.message })
    }
}

export async function getMyTenant(req, res) {
    const { slug } = req.params

    try {
        const tenant = await Tenant.findOne({ slug })
        if (!tenant) return res.status(404).json({ message: "Tenant not found" })

        return res.status(200).json({ tenant })
    } catch (error) {
        return res.status(500).json({ message: "Server error while searching for tenant", error: error.message })
    }
}