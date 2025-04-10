import './globals.css';
import Navbar from './components/Navbar';
import { Toaster } from 'react-hot-toast'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="">{children}</main>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}