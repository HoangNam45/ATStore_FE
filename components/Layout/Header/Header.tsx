"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Menu,
  User,
  LogOut,
  Home,
  ShoppingBag,
  BookOpen,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import { signOutUser } from "@/lib/firebase";
import { usePathname } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const pathname = usePathname();

  const { user, isLoggedIn, getInitials, isUserOwner, logout } = useAuthStore();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const handleLogout = async () => {
    await signOutUser();
    logout();
    setIsMobileMenuOpen(false);
  };

  const displayName = user?.displayName || "Guest";
  const email = user?.email || "";
  const avatarUrl = user?.photoURL || "";
  const initials = getInitials();
  const isGuidePage = pathname?.startsWith("/guide");
  const isHomePage = pathname === "/" || pathname === undefined;
  const isOrdersPage = pathname?.startsWith("/my-orders");
  const isOwnerPage = pathname?.startsWith("/owner");

  return (
    <>
      <header className="sticky z-99999 top-0 z-50 border-b border-border/50 bg-card/80 backdrop-blur-md">
        <div className="container mx-auto flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-lg">
                AT
              </div>
              <span className="font-bold text-lg text-foreground">Store</span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:block">
              <Link
                href="/guide"
                className={`text-base mr-3 transition-colors ${
                  isGuidePage ? "text-primary" : "text-black hover:text-primary"
                }`}
              >
                Hướng dẫn mua hàng
              </Link>
            </div>

            <div className="hidden md:block">
              <DropdownMenu
                open={isContactOpen}
                onOpenChange={setIsContactOpen}
              >
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="h-auto px-0 text-base cursor-pointer font-normal text-foreground hover:text-primary  hover:bg-transparent flex items-center gap-1 cursor-pointer"
                  >
                    Liên hệ
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-200 ${
                        isContactOpen ? "rotate-180" : ""
                      }`}
                    />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="z-99999999 w-48">
                  <DropdownMenuItem asChild>
                    <Link
                      href="https://www.facebook.com/racruoino1"
                      target="_blank"
                      rel="noreferrer noopener"
                      className="flex cursor-pointer items-center gap-2"
                    >
                      <svg
                        className="h-5 w-5 mr-2 inline-block"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <g clipPath="url(#clip0)">
                          <rect
                            width="24"
                            height="24"
                            rx="4"
                            fill="#227AEF"
                          ></rect>
                          <path
                            d="M25.3333 11.9994C25.3333 4.63555 19.3638 -1.33398 12 -1.33398C4.63619 -1.33398 -1.33334 4.63555 -1.33334 11.9994C-1.33334 18.6544 3.54246 24.1705 9.91666 25.1707V15.8535H6.53125V11.9994H9.91666V9.06186C9.91666 5.72018 11.9072 3.87436 14.9529 3.87436C16.4116 3.87436 17.9375 4.13477 17.9375 4.13477V7.41602H16.2562C14.5999 7.41602 14.0833 8.44381 14.0833 9.49825V11.9994H17.7812L17.1901 15.8535H14.0833V25.1707C20.4575 24.1705 25.3333 18.6544 25.3333 11.9994"
                            fill="#1877F2"
                          ></path>
                          <path
                            d="M17.1901 15.8537L17.7813 11.9995H14.0833V9.49838C14.0833 8.44397 14.5999 7.41617 16.2562 7.41617H17.9375V4.13492C17.9375 4.13492 16.4117 3.87451 14.9529 3.87451C11.9072 3.87451 9.91667 5.72033 9.91667 9.06201V11.9995H6.53126V15.8537H9.91667V25.1709C10.6059 25.2789 11.3024 25.333 12 25.3328C12.7088 25.3328 13.4045 25.2774 14.0833 25.1709V15.8537H17.1901Z"
                            fill="white"
                          ></path>
                        </g>
                        <defs>
                          <clipPath id="clip0">
                            <rect
                              width="24"
                              height="24"
                              rx="4"
                              fill="white"
                            ></rect>
                          </clipPath>
                        </defs>
                      </svg>
                      <span>Facebook</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="https://zalo.me/0862260250"
                      target="_blank"
                      rel="noreferrer noopener"
                      className="flex cursor-pointer items-center gap-2"
                    >
                      <svg
                        className="h-5 w-5 mr-2 inline-block"
                        xmlns="http://www.w3.org/2000/svg"
                        width="50"
                        height="50"
                        viewBox="0 0 50 50"
                        fill="none"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M22.782 0.166016H27.199C33.2653 0.166016 36.8103 1.05701 39.9572 2.74421C43.1041 4.4314 45.5875 6.89585 47.2557 10.0428C48.9429 13.1897 49.8339 16.7347 49.8339 22.801V27.1991C49.8339 33.2654 48.9429 36.8104 47.2557 39.9573C45.5685 43.1042 43.1041 45.5877 39.9572 47.2559C36.8103 48.9431 33.2653 49.8341 27.199 49.8341H22.8009C16.7346 49.8341 13.1896 48.9431 10.0427 47.2559C6.89583 45.5687 4.41243 43.1042 2.7442 39.9573C1.057 36.8104 0.166016 33.2654 0.166016 27.1991V22.801C0.166016 16.7347 1.057 13.1897 2.7442 10.0428C4.43139 6.89585 6.89583 4.41245 10.0427 2.74421C13.1707 1.05701 16.7346 0.166016 22.782 0.166016Z"
                          fill="#0068FF"
                        ></path>
                        <path
                          opacity="0.12"
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M49.8336 26.4736V27.1994C49.8336 33.2657 48.9427 36.8107 47.2555 39.9576C45.5683 43.1045 43.1038 45.5879 39.9569 47.2562C36.81 48.9434 33.265 49.8344 27.1987 49.8344H22.8007C17.8369 49.8344 14.5612 49.2378 11.8104 48.0966L7.27539 43.4267L49.8336 26.4736Z"
                          fill="#001A33"
                        ></path>
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M7.779 43.5892C10.1019 43.846 13.0061 43.1836 15.0682 42.1825C24.0225 47.1318 38.0197 46.8954 46.4923 41.4732C46.8209 40.9803 47.1279 40.4677 47.4128 39.9363C49.1062 36.7779 50.0004 33.22 50.0004 27.1316V22.7175C50.0004 16.629 49.1062 13.0711 47.4128 9.91273C45.7385 6.75436 43.2461 4.28093 40.0877 2.58758C36.9293 0.894239 33.3714 0 27.283 0H22.8499C17.6644 0 14.2982 0.652754 11.4699 1.89893C11.3153 2.03737 11.1636 2.17818 11.0151 2.32135C2.71734 10.3203 2.08658 27.6593 9.12279 37.0782C9.13064 37.0921 9.13933 37.1061 9.14889 37.1203C10.2334 38.7185 9.18694 41.5154 7.55068 43.1516C7.28431 43.399 7.37944 43.5512 7.779 43.5892Z"
                          fill="white"
                        ></path>
                        <path
                          d="M20.5632 17H10.8382V19.0853H17.5869L10.9329 27.3317C10.7244 27.635 10.5728 27.9194 10.5728 28.5639V29.0947H19.748C20.203 29.0947 20.5822 28.7156 20.5822 28.2606V27.1421H13.4922L19.748 19.2938C19.8428 19.1801 20.0134 18.9716 20.0893 18.8768L20.1272 18.8199C20.4874 18.2891 20.5632 17.8341 20.5632 17.2844V17Z"
                          fill="#0068FF"
                        ></path>
                        <path
                          d="M32.9416 29.0947H34.3255V17H32.2402V28.3933C32.2402 28.7725 32.5435 29.0947 32.9416 29.0947Z"
                          fill="#0068FF"
                        ></path>
                        <path
                          d="M25.814 19.6924C23.1979 19.6924 21.0747 21.8156 21.0747 24.4317C21.0747 27.0478 23.1979 29.171 25.814 29.171C28.4301 29.171 30.5533 27.0478 30.5533 24.4317C30.5723 21.8156 28.4491 19.6924 25.814 19.6924ZM25.814 27.2184C24.2785 27.2184 23.0273 25.9672 23.0273 24.4317C23.0273 22.8962 24.2785 21.645 25.814 21.645C27.3495 21.645 28.6007 22.8962 28.6007 24.4317C28.6007 25.9672 27.3685 27.2184 25.814 27.2184Z"
                          fill="#0068FF"
                        ></path>
                        <path
                          d="M40.4867 19.6162C37.8516 19.6162 35.7095 21.7584 35.7095 24.3934C35.7095 27.0285 37.8516 29.1707 40.4867 29.1707C43.1217 29.1707 45.2639 27.0285 45.2639 24.3934C45.2639 21.7584 43.1217 19.6162 40.4867 19.6162ZM40.4867 27.2181C38.9322 27.2181 37.681 25.9669 37.681 24.4124C37.681 22.8579 38.9322 21.6067 40.4867 21.6067C42.0412 21.6067 43.2924 22.8579 43.2924 24.4124C43.2924 25.9669 42.0412 27.2181 40.4867 27.2181Z"
                          fill="#0068FF"
                        ></path>
                        <path
                          d="M29.4562 29.0944H30.5747V19.957H28.6221V28.2793C28.6221 28.7153 29.0012 29.0944 29.4562 29.0944Z"
                          fill="#0068FF"
                        ></path>
                      </svg>
                      <span>Zalo</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {isLoggedIn ? (
              <>
                <span className="hidden md:block text-xs text-muted-foreground">
                  Xin chào, {displayName}!
                </span>

                {/* Desktop dropdown */}
                <div className="hidden md:block">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="relative h-10 w-10 rounded-full cursor-pointer"
                      >
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={avatarUrl} alt="User avatar" />
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                      className="w-56"
                      align="end"
                      forceMount
                    >
                      <div className="flex flex-col space-y-1 p-2">
                        <p className="text-sm font-medium leading-none">
                          {displayName}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {email}
                        </p>
                      </div>

                      <DropdownMenuSeparator />

                      <DropdownMenuItem asChild>
                        <Link
                          href="/"
                          className={`${isHomePage ? "text-primary" : ""} cursor-pointer`}
                        >
                          <Home
                            className={`mr-2 h-4 w-4 ${
                              isHomePage
                                ? "text-primary"
                                : "text-muted-foreground"
                            }`}
                          />
                          <span>Trang chủ</span>
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuItem asChild>
                        <Link
                          href="/my-orders"
                          className={`${isOrdersPage ? "text-primary" : ""} cursor-pointer`}
                        >
                          <ShoppingBag
                            className={`mr-2 h-4 w-4 ${
                              isOrdersPage
                                ? "text-primary"
                                : "text-muted-foreground"
                            }`}
                          />
                          <span>Đơn hàng của tôi</span>
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuItem asChild>
                        <Link
                          href="/guide"
                          className={`${isGuidePage ? "text-primary" : ""} cursor-pointer`}
                        >
                          <BookOpen
                            className={`mr-2 h-4 w-4 ${
                              isGuidePage
                                ? "text-primary"
                                : "text-muted-foreground"
                            }`}
                          />
                          <span>Hướng dẫn mua hàng</span>
                        </Link>
                      </DropdownMenuItem>

                      {isUserOwner() && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Link
                              href="/owner/dashboard"
                              className={`${isOwnerPage ? "text-primary" : ""} cursor-pointer`}
                            >
                              <span>Quản lý tài khoản</span>
                            </Link>
                          </DropdownMenuItem>
                        </>
                      )}

                      <DropdownMenuSeparator />

                      <DropdownMenuItem
                        className="text-destructive cursor-pointer"
                        onClick={handleLogout}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Đăng xuất</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Mobile avatar */}
                <div className="flex items-center gap-2 md:hidden">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={avatarUrl} alt="User avatar" />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-foreground h-8 w-8 cursor-pointer"
                    onClick={() => setIsMobileMenuOpen(true)}
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link href="/register" className="hidden md:block">
                  <Button
                    variant="outline"
                    className="text-foreground cursor-pointer"
                  >
                    Đăng ký
                  </Button>
                </Link>

                <Link href="/login" className="hidden md:block">
                  <Button className="bg-primary text-primary-foreground cursor-pointer hover:bg-primary/90">
                    <User className="mr-2 h-4 w-4" />
                    Đăng nhập
                  </Button>
                </Link>

                <Button
                  variant="ghost"
                  size="icon"
                  className="text-foreground md:hidden cursor-pointer"
                  onClick={() => setIsMobileMenuOpen(true)}
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`fixed z-999999 top-15 right-0 z-50 h-full w-80 max-w-[85vw] bg-card shadow-xl transform transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto p-5">
            {isLoggedIn ? (
              <div className="space-y-6">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/50">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={avatarUrl} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {initials}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">
                      {displayName}
                    </p>
                    <p className="text-[10px] text-muted-foreground truncate">
                      {email}
                    </p>
                  </div>
                </div>

                <nav className="space-y-2">
                  <Link
                    href="/"
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors ${
                      isHomePage ? "text-primary" : "text-foreground"
                    } cursor-pointer`}
                  >
                    <Home
                      className={`h-5 w-5 ${
                        isHomePage ? "text-primary" : "text-muted-foreground"
                      }`}
                    />
                    <span>Trang chủ</span>
                  </Link>

                  <Link
                    href="/guide"
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors ${
                      isGuidePage ? "text-primary" : "text-foreground"
                    } cursor-pointer`}
                  >
                    <BookOpen
                      className={`h-5 w-5 ${
                        isGuidePage ? "text-primary" : "text-muted-foreground"
                      }`}
                    />
                    <span>Hướng dẫn mua hàng</span>
                  </Link>

                  {/* <button className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent w-full text-left">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <span>Hồ sơ cá nhân</span>
                  </button> */}

                  <Link
                    href="/my-orders"
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent w-full text-left ${
                      isOrdersPage ? "text-primary" : "text-foreground"
                    } cursor-pointer`}
                  >
                    <ShoppingBag
                      className={`h-5 w-5 ${
                        isOrdersPage ? "text-primary" : "text-muted-foreground"
                      }`}
                    />
                    <span>Đơn hàng của tôi</span>
                  </Link>

                  {isUserOwner() && (
                    <>
                      <Link
                        href="/owner/dashboard"
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent ${
                          isOwnerPage ? "text-primary" : "text-foreground"
                        } cursor-pointer`}
                      >
                        <span>Quản lý tài khoản</span>
                      </Link>
                    </>
                  )}
                </nav>

                <div className="pt-4 border-t border-border/50">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-destructive/10 w-full text-left text-destructive"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-center py-8">
                  <div className="flex justify-center mb-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-bold text-2xl">
                      AT
                    </div>
                  </div>
                  <h3 className="text-base font-semibold mb-2">
                    Chào mừng đến AT Store
                  </h3>
                  <p className="text-xs text-muted-foreground mb-6">
                    Đăng nhập để trải nghiệm đầy đủ tính năng
                  </p>
                </div>

                <div className="space-y-3">
                  <Link href="/login" className="block">
                    <Button className="w-full bg-primary text-primary-foreground cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Đăng nhập
                    </Button>
                  </Link>

                  <Link href="/register" className="block">
                    <Button
                      variant="outline"
                      className="w-full text-foreground cursor-pointer"
                    >
                      Đăng ký
                    </Button>
                  </Link>
                </div>

                <div className="pt-4 border-t border-border/50">
                  <nav className="space-y-2">
                    <Link
                      href="/"
                      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors cursor-pointer"
                    >
                      <Home className="h-5 w-5 text-muted-foreground" />
                      <span className="text-foreground">Trang chủ</span>
                    </Link>

                    <Link
                      href="/guide"
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors ${
                        isGuidePage ? "text-primary" : "text-foreground"
                      } cursor-pointer`}
                    >
                      <BookOpen
                        className={`h-5 w-5 ${
                          isGuidePage ? "text-primary" : "text-muted-foreground"
                        }`}
                      />
                      <span>Hướng dẫn mua hàng</span>
                    </Link>
                  </nav>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
