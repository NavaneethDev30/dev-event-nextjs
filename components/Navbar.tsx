import Link from "next/link"
import Image from "next/image"
function NavBar(){
    return(
        <header>
            <nav>
                <Link href="/" className="logo" >
                <Image src='/icons/logo.png' alt="logo" height={24} width={24}></Image>
                <p>Dev Event</p>
                </Link>
                <ul>
                    <Link href="/">Home</Link>
                    <Link href="/">Event</Link>
                    <Link href="/">Create Event</Link>
                </ul>
            </nav>
        </header>
    )
}

export default NavBar