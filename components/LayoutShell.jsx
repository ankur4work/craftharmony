import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function LayoutShell({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-cream text-stone-800">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
