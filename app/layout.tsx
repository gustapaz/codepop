import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  metadataBase: new URL("https://gustapaz.github.io"),
  title: "CodePop — um conceito de cada vez",
  description:
    "Microdesafios de HTML, CSS, JavaScript, React e acessibilidade. Aprenda em rodadas curtas, revise seus erros e acompanhe seu progresso local.",
  alternates: { canonical: "/codepop/" },
  openGraph: {
    title: "CodePop — um conceito de cada vez",
    description:
      "Uma trilha divertida de microdesafios de programação. 24 perguntas, explicações e progresso real, sem conta.",
    url: "/codepop/",
    locale: "pt_BR",
    type: "website",
    images: [{ url: "/codepop/social.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image" },
  icons: { icon: "/codepop/favicon.svg" },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
