import { Inter } from "next/font/google";
import styles from "./layout.module.css"; // Import the CSS module

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className={styles.container}>{children}</div>
      </body>
    </html>
  );
}
