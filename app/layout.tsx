import './globals.css';

export const metadata = {
  title: 'NW Daily Checklist',
  description: 'A daily checklist for New World',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="bg-black">
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
