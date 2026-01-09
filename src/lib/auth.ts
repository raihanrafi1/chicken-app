import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'
import { prisma } from './prisma'

export interface Session {
    userId: number
    username: string
    role: string
}

// Simple in-memory session store (for demo purposes)
const sessions = new Map<string, Session>()

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword)
}

export async function createSession(userId: number, username: string, role: string): Promise<string> {
    const sessionId = crypto.randomUUID()
    sessions.set(sessionId, { userId, username, role })

    const cookieStore = await cookies()
    cookieStore.set('session', sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 1 week
    })

    return sessionId
}

export async function getSession(): Promise<Session | null> {
    const cookieStore = await cookies()
    const sessionId = cookieStore.get('session')?.value

    if (!sessionId) return null

    const session = sessions.get(sessionId)
    return session || null
}

export async function deleteSession(): Promise<void> {
    const cookieStore = await cookies()
    const sessionId = cookieStore.get('session')?.value

    if (sessionId) {
        sessions.delete(sessionId)
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
