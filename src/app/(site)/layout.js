import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getUser } from "@/lib/session";

// Public site shell: header, the page for the current route, footer.
export default async function SiteLayout({ children }) {
  const user = await getUser();
  const initialUser = user ? { name: user.name, email: user.email, image: user.image, role: user.role } : null;

  return (
    <>
      <Navbar initialUser={initialUser} />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
