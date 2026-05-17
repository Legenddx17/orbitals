import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'
import { Toaster } from 'sonner'

export const metadata: Metadata = {
  title: 'Orbitals — Juega con tu comunidad',
  description: 'La plataforma de juego social para comunidades de Discord.',
  openGraph: {
    title: 'Orbitals',
    description: 'Juega con tu comunidad de Discord',
    images: ['/og-image.png'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>
        <Providers>
          {children}
          <Toaster position="bottom-right" theme="dark" richColors />
        </Providers>
      </body>
    </html>
  )
}
