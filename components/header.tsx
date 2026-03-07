"use client";
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
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
    const [open, setOpen] = useState(false)
    const { user, isLoaded } = useUser();
    const role = user?.unsafeMetadata?.role;
    const router = useRouter();
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isLoaded) return
        if (user && !role) {
            router.push("/onboarding")
        }
    }, [isLoaded, user, role, router])

    // Close menu on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent | TouchEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };

        if (open) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('touchstart', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [open]);

    const handleJobPost = () => {
        router.push("/post-job");
    }

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

            {/* Desktop nav */}
            <div className="hidden sm:flex gap-2 items-center">
                {role === "recruiter" && (
                    <Button className='h-5 w-18 p-2 rounded-md py-3' variant={'destructive'} onClick={handleJobPost}>
                        Post a Job
                    </Button>
                )}
                <SignedOut>
                    <SignInButton mode="modal" forceRedirectUrl="/onboarding">
                        <span className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent cursor-pointer transition-colors">
                            Login
                        </span>
                    </SignInButton>
                    <SignUpButton mode="modal" forceRedirectUrl="/onboarding">
                        <span className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent cursor-pointer transition-colors">
                            Sign Up
                        </span>
                    </SignUpButton>
                </SignedOut>
                <SignedIn>
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

            {/* Mobile: UserButton when signed in, hamburger when signed out */}
            <div className="sm:hidden">
                <SignedIn>
                    <UserButton
                        appearance={{
                            elements: { avatarBox: "w-10 h-10" }
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

                {/* 
                    FIX: Moved hamburger button OUTSIDE of <SignedOut> so it always
                    renders in the DOM. The menu panel below conditionally shows.
                    Wrapping the button in SignedOut caused Clerk to remount the
                    component on auth state changes, breaking the open/close state.
                */}
                <SignedOut>
                    <div ref={menuRef} className="relative">
                        <Button
                            onClick={() => setOpen(prev => !prev)}
                            variant="ghost"
                            size="icon"
                        >
                            {open ? <X /> : <Menu />}
                        </Button>

                        {/* Mobile dropdown menu */}
                        {open && (
                            <div className="fixed top-16 right-4 w-56 bg-popover shadow-lg 
                                flex flex-col gap-3 p-4 border border-border rounded-lg z-50">
                                <SignInButton mode="modal" forceRedirectUrl="/onboarding">
                                    <Button
                                        variant="outline"
                                        className="w-full"
                                        onClick={() => setOpen(false)}
                                    >
                                        Login
                                    </Button>
                                </SignInButton>
                                <SignUpButton mode="modal" forceRedirectUrl="/onboarding">
                                    <Button
                                        variant="outline"
                                        className="w-full"
                                        onClick={() => setOpen(false)}
                                    >
                                        Sign Up
                                    </Button>
                                </SignUpButton>
                            </div>
                        )}
                    </div>
                </SignedOut>
            </div>
        </nav>
    )
}

export default Header