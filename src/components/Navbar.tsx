import Link from "next/link";

const Navbar = () => {
  return (
    <nav>
      <ul>
        <li><Link href="/">Home</Link></li>
        <li><Link href="/dashboard">Dashboard</Link></li>
        <li><Link href="/practice/reading">Reading Practice</Link></li>
        <li><Link href="/practice/listening">Listening Practice</Link></li>
        <li><Link href="/practice/speaking">Speaking Practice</Link></li>
        <li><Link href="/practice/writing">Writing Practice</Link></li>
        <li><Link href="/profile">Profile</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;