import { NextAuthOptions } from 'next-auth'
import DiscordProvider from 'next-auth/providers/discord'
import { createServerClient } from './supabase'

export const authOptions: NextAuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'identify email guilds',
        },
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider !== 'discord') return false

      const db = createServerClient()
      const discordProfile = profile as any

      // Upsert user in Supabase
      const { error } = await db.from('users').upsert({
        discord_id: discordProfile.id,
        username: discordProfile.username,
        avatar: discordProfile.avatar,
        email: user.email,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'discord_id' })

      if (error) console.error('[Auth] upsert error:', error)
      return true
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.discord_id = token.discord_id as string
        session.user.id = token.sub as string
        session.user.guilds = token.guilds as any[]
      }
      return session
    },

    async jwt({ token, account, profile }) {
      if (account?.provider === 'discord') {
        token.discord_id = (profile as any)?.id
        // Fetch guilds from Discord API
        if (account.access_token) {
          try {
            const res = await fetch('https://discord.com/api/users/@me/guilds', {
              headers: { Authorization: `Bearer ${account.access_token}` },
            })
            token.guilds = await res.json()
          } catch (e) {
            token.guilds = []
          }
        }
      }
      return token
    },
  },
  pages: {
    signIn: '/',
    error: '/',
  },
}
