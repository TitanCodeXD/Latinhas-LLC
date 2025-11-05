import Image from 'next/image';
import Profile from '../public/generic-profile.jpg';
import Logo from '../public/Logo-SMI-group-branco.png';

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col min-h-screen">
            {/* ""Navbar""" */}
            <header className="flex items-center justify-between px-6 py-3 bg-(--preto) text-white shadow-md">
                <div className="flex items-center gap-5">
                    <button className="text-3xl cursor-pointer text-(--laranja) ">☰</button>
                    <Image src={Logo} alt="Logo" width={95} height={50} />
                </div>
                <div>
                    <Image
                        src={Profile}
                        alt="Profile"
                        width={35}
                        height={35}
                        className="rounded-full"
                    />
                </div>
            </header>

            {/* Body */}
            <main className="grow p-6 bg-(--preto-claro4)">{children}</main>

            {/* Footer */}
            <footer className="text-center py-3 bg-(--preto) text-(--laranja)">
                © SMI Engeneering 2025
            </footer>
        </div>
    );
}
