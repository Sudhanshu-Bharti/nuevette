import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-10 bg-inherit">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-mono">
              Nuevette
              <span className="text-red-500">.</span>
              <span className="text-orange-500">ai</span>
            </Link>
          </div>
          {/* <div className="flex space-x-8">
            <Link href="/about" className="font-mono hover:opacity-70">
              About
            </Link>
            <Link href="/services" className="font-mono hover:opacity-70">
              Services
            </Link>
            <Link href="/contact" className="font-mono hover:opacity-70">
              Contact
            </Link>
          </div> */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
