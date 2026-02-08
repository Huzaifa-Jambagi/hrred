"use client";
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from './ui/button'
import {
    SignInButton,
    SignUpButton,
    SignedIn,
    SignedOut,
    UserButton,
} from '@clerk/nextjs'
import { Briefcase, Heart, Menu, X } from 'lucide-react'

const Header = () => {
    const [open, setOpen] = useState<boolean>(false)

    return (
        <nav className="relative py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center z-50">
            <Link href={"/"}>
                <Image
                    src="/logo.png"
                    alt="Logo"
                    width={80}
                    height={40}
                    className="h-8 sm:h-10 w-auto"
                />
            </Link>

            {/* Desktop menu */}
            <div className="hidden sm:flex gap-2 items-center">
                <SignedOut>
                    <SignInButton mode="modal"
                        forceRedirectUrl="/onboarding">
                        <span className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent cursor-pointer transition-colors">
                            Login
                        </span>
                    </SignInButton>
                    <SignUpButton mode="modal"
                        forceRedirectUrl="/onboarding">

                        <span className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent cursor-pointer transition-colors">
                            Sign Up
                        </span>
                    </SignUpButton>
                </SignedOut>
                <SignedIn>
                    {/* add a condition for recruiter */}
                    {/* <Link href="/post-job">
                        <Button variant="destructive" className='rounded-full'>
                            Post a Job
                        </Button>
                    </Link> */}
                    <UserButton>
                        <UserButton.MenuItems>
                            <UserButton.Link
                                label='My Jobs'
                                labelIcon={<Briefcase size={15} />}
                                href='/my-jobs'
                            />
                            <UserButton.Link
                                label='Saved Jobs'
                                labelIcon={<Heart size={15} />}
                                href='/saved-jobs'
                            />
                        </UserButton.MenuItems>
                    </UserButton>
                </SignedIn>
            </div>

            {/* Mobile - Show UserButton when signed in, hamburger when signed out */}
            <div className="sm:hidden">
                <SignedIn>
                    <UserButton
                        appearance={{
                            elements: {
                                avatarBox: "w-10 h-10"
                            }
                        }}
                    >
                        <UserButton.MenuItems>
                            <UserButton.Link
                                label='My Jobs'
                                labelIcon={<Briefcase size={15} />}
                                href='/my-jobs'
                            />
                            <UserButton.Link
                                label='Saved Jobs'
                                labelIcon={<Heart size={15} />}
                                href='/saved-jobs'
                            />
                        </UserButton.MenuItems>
                    </UserButton>
                </SignedIn>
                <SignedOut>
                    <Button
                        onClick={() => setOpen(prev => !prev)}
                        variant="ghost"
                        size="icon"
                    >
                        {!open ? <Menu /> : <X />}
                    </Button>
                </SignedOut>
            </div>

            {/* Mobile menu - Only show when signed out */}
            <SignedOut>
                {open && (
                    <>
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 bg-black/20 sm:hidden z-40"
                            onClick={() => setOpen(false)}
                        />

                        {/* Menu panel */}
                        <div className="absolute top-full right-0 mt-2 w-56 bg-popover shadow-lg 
                        flex flex-col gap-3 p-4 border border-border rounded-lg sm:hidden z-50">
                            <SignInButton mode="modal">
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => setOpen(false)}
                                >
                                    Login
                                </Button>
                            </SignInButton>
                            <SignUpButton mode="modal">
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => setOpen(false)}
                                >
                                    Sign Up
                                </Button>
                            </SignUpButton>
                        </div>
                    </>
                )}
            </SignedOut>
        </nav>
    )
}

export default Header