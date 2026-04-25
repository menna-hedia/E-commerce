"use client"

import * as React from "react"
import Link from "next/link"

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "_/components/ui/navigation-menu"

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "_/components/ui/sheet"

import { Menu, Heart, ShoppingCart } from "lucide-react"
import { useSession } from "next-auth/react";
import LogoutButton from './LogoutButton';
// import { useContext } from "react"
// import { CartContext } from "_/app/_context/cartContext"

export default function Navbar() {
  
  const session = useSession();
  const isUserAuthenticated = session.status === "authenticated"

      // const { numberOfCartItems } = useContext(CartContext)

  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        {/* Logo */}
        <div className="text-2xl font-bold text-green-600">
           FreshCart
        </div>

        {/* Desktop Menu */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList className="flex gap-2">

            <NavigationMenuItem>
              <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                <Link href="/">Home</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                <Link href="/categories">Categories</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                <Link href="/brands">Brands</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

          </NavigationMenuList>
        </NavigationMenu>

        {/* Right Icons (desktop) */}
        <div className="hidden md:flex items-center gap-4">

          
{/* 
          <Link
            href="/login"
            className="rounded-md bg-green-600 px-3 py-1 text-white text-sm"
          >
            Sign in
          </Link> */}

           {!isUserAuthenticated ? (
  <div className="flex items-center gap-2">

    <Link
      href="/login"
      className="rounded-md bg-green-600 px-3 py-1 text-white text-sm"
    >
      Sign in
    </Link>

    <Link
      href="/register"
      className="rounded-md border px-3 py-1 text-sm"
    >
      Sign up
    </Link>

  </div>
) : (
    <div className="flex items-center gap-2">
  <Link href="/wishlist">
            <Heart size={20} />
          </Link>

          <Link href="/cart" className="relative mx-3">
            <ShoppingCart size={20} />
            {/* <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs rounded-full px-1">
               {numberOfCartItems}
            </span> */}
          </Link>
 <LogoutButton/>
   </div>
)}

        </div>

        {/* Mobile Menu (Dropdown / Sheet) */}
        <div className="md:hidden">
  <Sheet>

    <SheetTrigger asChild>
      <button>
        <Menu />
      </button>
    </SheetTrigger>

    <SheetContent className="flex flex-col gap-6 p-10">

      <SheetHeader>
        <SheetTitle className="sr-only">Menu</SheetTitle>
        <SheetDescription>
          Navigate through FreshCart sections
        </SheetDescription>
      </SheetHeader>

      <Link href="/" className="text-lg">Home</Link>
      <Link href="/categories" className="text-lg">Categories</Link>
      <Link href="/brands" className="text-lg">Brands</Link>

      <hr />

      <Link href="/wishlist">Wishlist</Link>
      <Link href="/cart">Cart</Link>

           {!isUserAuthenticated ? (     
        <div className="flex flex-col gap-3 pt-4 border-t">
          <Link href="/login">Sign in</Link>
          <Link href="/register">Sign up</Link>
        </div>
      ) : (
        <LogoutButton/>
      )}

    </SheetContent>

  </Sheet>
</div>

      </div>
    </header>
  )
}