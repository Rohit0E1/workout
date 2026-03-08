import "./globals.css";

export const metadata = {
  title: "PPL Workout Tracker",
  description: "Push Pull Legs workout tracker with progress logging",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
