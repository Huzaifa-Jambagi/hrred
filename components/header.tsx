"use client";
import Image from 'next/image'
import Link from 'next/link'
import { Button } from './ui/button'
import {
    ClerkProvider,
    SignInButton,
    SignUpButton,
    SignedIn,
    SignedOut,
    UserButton,
} from '@clerk/nextjs'

const header = () => {
    return (
        <nav className="py-2 px-6 flex justify-between items-center z-10">
            <Link href={"/"}>
                <Image src="/logo.png" alt="Logo" width={80} height={40} />
            </Link>
            <div className="flex gap-2">
                <SignedOut>
                    <SignInButton mode="modal">
                        <span className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent">
                            Login
                        </span>
                    </SignInButton>
                    <SignUpButton mode="modal">
                        <span className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent">
                            Sign Up
                        </span>
                    </SignUpButton>
                </SignedOut>
                <SignedIn>
                    <UserButton />
                </SignedIn>
            </div>
        </nav>

    )
}

export default header