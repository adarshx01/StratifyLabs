'use client'
import Link from "next/link"
import MaxWidthWrapper from "./MaxWidthWrapper"
import {  buttonVariants } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useUser } from "@auth0/nextjs-auth0";

const Navbar =  () => {
    const session = useUser();
    const user = session?.user;
    const isAdmin = user?.email === process.env.ADMIN_EMAIL;

    return (
        <nav className='absolute z-[60] h-14 inset-x-0 top-0 w-full border-b border-gray-100 bg-white/25 backdrop-blur-lg transition-all'>
            <MaxWidthWrapper>
                <div className='flex h-14 items-center justify-between border-b border-zinc-200'>
                    <Link href='/' className='flex z-40 font-semibold'>
                        VisionFlow
                    </Link>
                    <div className='h-full flex items-center space-x-4'>
                        {user ? (
                            <>
                                <p>{user.name || user.email}</p>
                                <Link href='/auth/logout' className={buttonVariants({
                                    size: 'sm',
                                    variant: 'ghost'
                                })}>
                                    Sign Out
                                </Link>
                                {isAdmin && (
                                    <Link href='/dashboard' className={buttonVariants({
                                        size: 'sm',
                                        variant: 'ghost'
                                    })}>
                                        Dashboard 🌟
                                    </Link>
                                )}
                                <Link href='/visionlab' className={buttonVariants({
                                    size: 'sm',
                                    variant: 'ghost'
                                })}>
                                    VisionLab
                                </Link>
                                <Link href='/train' className={buttonVariants({
                                    size: 'sm',
                                    variant: 'ghost'
                                })}>
                                    Train
                                </Link>
                                <div className="h-8 bg-zinc-200 hidden sm:block" />
                                <Link href='/documentation' className={buttonVariants({
                                    size: 'sm',
                                    className: 'hidden sm:flex items-center gap-1'
                                })}>
                                    Read Docs
                                    <ArrowRight className="ml-1.5 h-5 w-5" />
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link href='/auth/login' className={buttonVariants({
                                    size: 'sm',
                                    variant: 'ghost'
                                })}>
                                    Sign In
                                </Link>
                                <Link href='/auth/login' className={buttonVariants({
                                    size: 'sm',
                                    variant: 'ghost'
                                })}>
                                    Sign Up
                                </Link>
                                <div className="h-8 bg-zinc-200 hidden sm:block" />
                                <Link href='/configure/upload' className={buttonVariants({
                                    size: 'sm',
                                    className: 'hidden sm:flex items-center gap-1'
                                })}>
                                    Read Docs
                                    <ArrowRight className="ml-1.5 h-5 w-5" />
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </MaxWidthWrapper>
        </nav>
    )
}

export default Navbar