import Image from "next/image";
import Link from "next/link";

function Logo() {
  return (
    <Link href="/">
      <Image src="/logo.png" alt="Логотип" width={400} height={100} />
    </Link>
  );
}

export default Logo;
