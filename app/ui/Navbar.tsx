import Link from "next/link";

interface NavbarProps {
  links: { label: string; href: string }[];
  about: { href: string };
}

const Navbar: React.FC<NavbarProps> = ({ links, about }) => {
  return (
    <nav className="bg-slate-900 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-16 max-w-7xl mx-auto">
        <div className="flex items-center w-full">
          <div className="flex-shrink-0">{/* Your logo here */}</div>
          <div className="hidden md:flex items-baseline w-full">
            <div className="flex space-x-4 flex-grow">
              {links.map(({ label, href }) => (
                <Link
                  key={`${href}${label}`}
                  href={href}
                  className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  {label}
                </Link>
              ))}
            </div>
            <div className="flex justify-end">
              <Link
                href={about.href}
                className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium ml-auto"
              >
                About
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
