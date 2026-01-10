import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'
import { prisma } from './prisma'

export interface Session {
    userId: number
    username: string
    role: string
}

// Database session store
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword)
}

export async function createSession(userId: number, username: string, role: string): Promise<string> {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 1 week

    const session = await prisma.session.create({
        data: {
            userId,
            expiresAt,
        }
    })

    const cookieStore = await cookies()
    cookieStore.set('session', session.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60, // 1 week
    })

    return session.id
}

export async function getSession(): Promise<Session | null> {
    const cookieStore = await cookies()
    const sessionId = cookieStore.get('session')?.value

    if (!sessionId) return null

    const session = await prisma.session.findUnique({
        where: { id: sessionId },
        include: { user: true }
    })

    if (!session || new Date() > session.expiresAt) {
        return null
    }

    return {
        userId: session.userId,
        username: session.user.username,
        role: session.user.role
    }
}

export async function deleteSession(): Promise<void> {
    const cookieStore = await cookies()
    const sessionId = cookieStore.get('session')?.value

    if (sessionId) {
        try {
            await prisma.session.delete({ where: { id: sessionId } })
        } catch (error) {
            // Ignore if session already deleted
        }
    }

    cookieStore.delete('session')
}

export async function requireAuth(requiredRole?: string): Promise<Session> {
    const session = await getSession()

    if (!session) {
        throw new Error('Unauthorized')
    }

    if (requiredRole && session.role !== requiredRole) {
        throw new Error('Forbidden')
    }

    return session
}
