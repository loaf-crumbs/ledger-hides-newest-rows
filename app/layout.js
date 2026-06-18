import './globals.css'

export const metadata = {
  title: 'Ledger',
  description: 'Recent account activity',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="shell">
          <header className="topbar">
            <span className="logo">▤ Ledger</span>
            <nav>
              <a className="active" href="/">Activity</a>
              <a href="/">Statements</a>
              <a href="/">Settings</a>
            </nav>
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  )
}
