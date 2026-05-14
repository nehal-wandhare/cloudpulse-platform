import './globals.css'

export const metadata = {
  title: 'CloudPulse Enterprise Dashboard',
  description: 'Enterprise Kubernetes Monitoring Platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en">

      <body>

        {children}

      </body>

    </html>
  )
}
