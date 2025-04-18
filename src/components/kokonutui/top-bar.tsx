"use client"

import { Search, ShoppingBag, X } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion";
import Link from "next/link";


interface TopBarProps {
  cartItemCount: number
  onCartClick: () => void
  onSearch: (query: string) => void
}

const categories = ["All", "Maths", "Physics", "Chemisrty", "Biology", "Computer Science", "History","Economics"]

export function TopBar({ cartItemCount, onCartClick, onSearch }: TopBarProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [isScrolled, setIsScrolled] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsSearchOpen(false)
      searchInputRef.current?.blur()
    }
  }

  return (
    <>
    <div
      className={`sticky top-0 z-40 transition-all duration-200 ${
        isScrolled ? "bg-white shadow-sm dark:bg-zinc-900" : "bg-white dark:bg-zinc-900"
      } border-b border-zinc-200 dark:border-zinc-800`}
    >
      <div className="flex items-center justify-between px-3 h-12">
      <div className="absolute top- left-4">
            <Link href="/">
              <button
                type="button"
                className="flex justify-center gap-2 items-center shadow-xl text-lg  backdrop-blur-md lg:font-semibold isolation-auto border-gray-50 
                before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-left-full before:hover:left-0 before:rounded-full 
                before:bg-emerald-500 hover:text-gray-50 before:-z-10 before:aspect-square before:hover:scale-150 before:hover:duration-700 
                relative z-10 px-4 py-2 overflow-hidden border-2 rounded-full group"
              >
                Home
                <svg
                  
                  viewBox="0 0 16 19"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7 18C7 18.5523 7.44772 19 8 19C8.55228 19 9 18.5523 9 18H7ZM8.70711 0.292893C8.31658 -0.0976311 7.68342 -0.0976311 7.29289 0.292893L0.928932 6.65685C0.538408 7.04738 0.538408 7.68054 0.928932 8.07107C1.31946 8.46159 1.95262 8.46159 2.34315 8.07107L8 2.41421L13.6569 8.07107C14.0474 8.46159 14.6805 8.46159 15.0711 8.07107C15.4616 7.68054 15.4616 7.04738 15.0711 6.65685L8.70711 0.292893ZM9 18L9 1H7L7 18H9Z"
                    className="fill-gray-800 group-hover:fill-gray-800"
                  ></path>
                </svg>
              </button>
            </Link>
          </div>
        <div className="flex-1 px-8 overflow-x-auto flex items-center justify-center gap-6 scrollbar-none">
          {categories.map((category) => (
            <button
              type="button"
              key={category}
              className={`whitespace-nowrap transition-colors ${
                selectedCategory === category
                  ? "text-zinc-900 dark:text-white text-sm font-medium"
                  : "text-zinc-600 dark:text-zinc-400 text-sm hover:text-zinc-900 dark:hover:text-white"
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <motion.div className="relative" initial={false} animate={{ width: isSearchOpen ? "auto" : 0 }}>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search products..."
              className={`w-48 sm:w-56 bg-zinc-100 dark:bg-zinc-800 rounded-md text-sm px-3 py-1.5 
                                text-zinc-800 dark:text-zinc-200
                                focus:outline-none focus:ring-1 focus:ring-zinc-300 dark:focus:ring-zinc-700
                                transition-all duration-200 ${isSearchOpen ? "opacity-100" : "opacity-0"}`}
              onChange={(e) => onSearch(e.target.value)}
              onKeyDown={handleKeyPress}
            />
            {isSearchOpen && (
              <button
                type="button"
                onClick={() => {
                  setIsSearchOpen(false)
                  onSearch("")
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 hover:bg-zinc-200 
                                    dark:hover:bg-zinc-700 rounded-full text-zinc-600 dark:text-zinc-400"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </motion.div>
          <button
            type="button"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className={`p-1.5 rounded-md transition-colors text-zinc-700 dark:text-zinc-300 ${
              isSearchOpen ? "bg-zinc-100 dark:bg-zinc-800" : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
            }`}
          >
            <Search className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onCartClick}
            className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md relative text-zinc-700 dark:text-zinc-300"
          >
            <ShoppingBag className="w-4 h-4" />
            {cartItemCount > 0 && (
              <motion.span
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 bg-zinc-900 dark:bg-white 
                                    text-white dark:text-zinc-900 text-xs font-medium w-4 h-4 
                                    flex items-center justify-center rounded-full"
              >
                {cartItemCount}
              </motion.span>
            )}
          </button>
        </div>
      </div>
    </div>
    </>
  )
}

