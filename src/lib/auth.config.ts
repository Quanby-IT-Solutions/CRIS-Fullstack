// src/lib/auth.config.ts
import { prisma } from '@/lib/prisma'
import { signInSchema } from '@/lib/validation'
import type { Permission, Account } from '@prisma/client'
import { compare } from 'bcryptjs'
import { NextAuthConfig, Session } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import type { UserWithRoleAndProfile } from '@/types/user'

export const authConfig: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        try {
          const parsedCredentials = signInSchema.safeParse(credentials)
          if (!parsedCredentials.success) {
            console.log('Credential validation failed');
            return null;
          }

          const user = await prisma.user.findUnique({
            where: { email: credentials.email as string },
            include: {
              accounts: true,
              profile: true,
              roles: {
                include: {
                  role: {
                    include: {
                      permissions: { select: { permission: true } }
                    }
                  }
                }
              }
            }
          }) as (UserWithRoleAndProfile & { accounts: Account[] }) | null;

          console.log('User found:', !!user);

          if (!user) {
            console.log('No user found');
            return null;
          }

          if (!user.accounts?.[0]?.password) {
            console.log('No account with password found');
            return null;
          }

          if (!user.emailVerified) {
            console.log('Email not verified');
            return null;
          }

          // Log parts of the credentials for debugging
          console.log('Email being used for login:', credentials.email);
          console.log('Password length being used for login:',
            credentials.password ? (credentials.password as string).length : 0);

          // Add additional debugging for the password comparison
          const isPasswordValid = await compare(
            credentials.password as string,
            user.accounts[0].password
          );

          console.log('Password valid:', isPasswordValid);

          if (!isPasswordValid) return null;

          const permissions = new Set<Permission>()
          user.roles.forEach((userRole) => {
            if (userRole.role?.permissions) {
              userRole.role.permissions.forEach((p) => permissions.add(p.permission))
            }
          })

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            emailVerified: user.emailVerified,
            image: user.image,
            username: user.username,
            active: user.active,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            lastLoginAt: user.lastLoginAt,
            language: user.language,
            roles: user.roles.map((ur) => ur.role.name),
            permissions: Array.from(permissions)
          }
        } catch (error) {
          console.error('Detailed auth error:', error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: '/',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isAuthPage = nextUrl.pathname.startsWith('/')
      if (isAuthPage) {
        return isLoggedIn ? Response.redirect(new URL('/', nextUrl)) : true
      }
      return isLoggedIn
    },
    jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id
        token.roles = user.roles
        token.permissions = user.permissions
      }
      if (trigger === 'update' && session) {
        return { ...token, ...session }
      }
      return token
    },
    async session({ session, token }): Promise<Session> {
      const updatedSession: Session = {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
          roles: token.roles as string[],
          permissions: token.permissions as Permission[],
          emailVerified: session.user.emailVerified,
          username: session.user.username ?? null,
          active: session.user.active ?? true,
          createdAt: session.user.createdAt ?? new Date(),
          updatedAt: session.user.updatedAt ?? new Date(),
          lastLoginAt: session.user.lastLoginAt ?? null,
          language: session.user.language ?? null,
        },
      }
      return updatedSession
    },
  },
}