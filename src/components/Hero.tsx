// integrate the navbar things into this code -(      <header className="fixed top-0 w-full bg-gray-950/80 backdrop-blur-sm border-b border-gray-800 z-50">
//   <div className="container mx-auto px-4">
//     <div className="flex h-16 items-center justify-between">
//       <div className="flex items-center">
//         <Link href="/" className="text-xl font-bold text-purple-400 -ml-28">
//           VisionFlow
//         </Link>
//         <nav className="hidden md:ml-8 md:flex md:gap-6">
//           <div className="relative group">
//             <button className="flex items-center gap-1 p-2 text-sm text-gray-300 hover:text-white">
//               Products <ChevronDown className="h-4 w-4" />
//             </button>
//           </div>
//           <div className="relative group">
//             <button className="flex items-center gap-1 p-2 text-sm text-gray-300 hover:text-white">
//               Solutions <ChevronDown className="h-4 w-4" />
//             </button>
//           </div>
//           <Link href="/docs" className="p-2 text-sm text-gray-300 hover:text-white">
//             Docs
//           </Link>
//           <Link href="/blog" className="p-2 text-sm text-gray-300 hover:text-white">
//             Blog
//           </Link>
//         </nav>
//       </div>
//       <div className="flex items-center gap-4">
//         <Link href="/sign-in" className="hidden md:inline-block text-sm text-gray-300 hover:text-white">
//           Sign In
//         </Link>
//         <Button asChild variant="outline" className="hidden md:inline-flex border-gray-700 text-white hover:bg-gray-800">
//           <Link href="/demo">Book a demo</Link>
//         </Button>
//         <Button asChild className="hidden md:inline-flex bg-purple-600 hover:bg-purple-700">
//           <Link href="/get-started">Get Started</Link>
//         </Button>
//         <button className="md:hidden p-2 text-white">
//           <Menu className="h-6 w-6" />
//         </button>
//       </div>
//     </div>
//   </div>
// </header>)

// from the code -(import Link from "next/link"
// import MaxWidthWrapper from "./MaxWidthWrapper"
// import { Button, buttonVariants } from "@/components/ui/button";
// import { ArrowRight, Brain } from "lucide-react";
// // import {RegisterLink, LoginLink} from "@kinde-oss/kinde-auth-nextjs/components";
// import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
// import { string } from "zod";

// const Navbar = async()=>{
// const {getUser}=getKindeServerSession();
// const user = await getUser();
// const isAdmin = user?.email === process.env.ADMIN_EMAIL
// return (
// <nav className='sticky z-[60] h-14 inset-x-0 top-0 w-full border-b border-gray-200 bg-white/25 backdrop-blur-lg transition-all'>
//   <MaxWidthWrapper>
//       <div className='flex h-14 items-center justify-between border-b border-zinc-200'>
//           <Link href='/' className='flex z-40 font-semibold'>
//               AEGIS AI
//           </Link>
//           <div className='h-full flex items-center space-x-4'>
//               {user?(
//                   <>
//                    <p>{user?.given_name+" "+user?.family_name}</p>
//                       <Link href='/api/auth/logout' className={buttonVariants({
//                           size:'sm',
//                           variant:'ghost'
//                           })}>
//                           Sign Out
//                       </Link>
//                       {isAdmin?(
//                       <Link href='/dashboard' className={buttonVariants({
//                           size:'sm',
//                           variant:'ghost'
//                           })}>
//                           Dashboard 🌟
//                       </Link>
//                       ):null }
//                       <Link href='/configure/upload' className={buttonVariants({
//                           size:'sm',
//                           className:'hidden sm:flex items-center gap-1'
//                           })}>
//                           Get Safe Routes
//                           <ArrowRight className="ml-1.5 h-5 w-5"/>
//                       </Link>
//                   </>
//               ):(
//                   <>
//                       <Link href='/api/auth/register' className={buttonVariants({
//                           size:'sm',
//                           variant:'ghost'
//                           })}>
//                           Sign Up
//                       </Link>
//                       <Link href='/api/auth/login' className={buttonVariants({
//                           size:'sm',
//                           variant:'ghost'
//                           })}>
//                           Log in 
//                       </Link>
//                       {/* <Link href='/api/auth/login' className={buttonVariants({
//                           size:'sm',
//                           variant:'ghost'
//                           })}>
//                           Log in 
//                       </Link> */}
//                       <div className="h-8 bg-zinc-200 hidden sm:block"/>
//                       <Link href='/configure/upload' className={buttonVariants({
//                           size:'sm',
//                           className:'hidden sm:flex items-center gap-1'
//                           })}>
//                       Read Docs
//                           <ArrowRight className="ml-1.5 h-5 w-5"/>
//                       </Link> 
//                   </>
//               )}
//           </div>
//       </div>
//   </MaxWidthWrapper>
// </nav>
// )
// }
// export default Navbar)