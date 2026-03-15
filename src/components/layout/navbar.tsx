import { auth } from "@/auth";
import ClientNavbar from "./client-navbar";

export default async function Navbar() {
    const session = await auth();

    return <ClientNavbar session={session} />;
}
