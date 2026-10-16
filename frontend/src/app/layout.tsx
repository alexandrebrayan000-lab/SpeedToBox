import type { Metadata } from 'next';
import './globals.css';
import { ClientLayout } from '../components/ClientLayout';

export const metadata: Metadata = {
  title: 'SpeedToBox — Sistema de Controle de Estoque & Vendas Cyberpunk Neon',
  description: 'Controle de estoque, lotes, validades (FIFO), movimentações e vendas integrado.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="dark" />
        <meta name="darkreader-lock" content="true" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="bg-[#050816] text-[#F4F7FF] antialiased selection:bg-[#8B35FF] selection:text-white min-h-screen"
        suppressHydrationWarning
      >
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
