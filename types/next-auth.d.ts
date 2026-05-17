import 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      discord_id?: string
      orbit_id?: string
      guilds?: any[]
    }
  }
}
