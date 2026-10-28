import type { Metadata } from 'next';
import './globals.css';
import { StoreProvider } from '../context/StoreContext';
import { Shell } from '../components/layout/Shell';

export const metadata: Metadata = {
  title: 'SpeedToBox — Sistema Integrado de Estoque, Lotes & Vendas',
  description: 'Controle de estoque com gestão de lotes, datas de validade (FIFO), movimentações e vendas.',
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
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Outfit:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#060919] text-[#f4f7ff] antialiased min-h-screen">
        <StoreProvider>
          <Shell>{children}</Shell>
        </StoreProvider>
      </body>
    </html>
  );
}
