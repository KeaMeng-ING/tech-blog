import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tech Blog Admin",
  description: "Tech Blog Admin Control Panel",
};

export default function RootAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, fontFamily: "system-ui, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}