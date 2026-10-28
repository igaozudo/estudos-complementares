import './globals.css';
import CadernoAnotacoes from './CadernoAnotacoes';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-black text-white antialiased">
        {children}
        {/* Caderno disponível em todas as matérias e módulos */}
        <CadernoAnotacoes />
      </body>
    </html>
  );
}