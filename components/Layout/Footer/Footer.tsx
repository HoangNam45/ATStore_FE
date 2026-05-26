import Image from "next/image";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-border bg-card/50 backdrop-blur-none">
      <div className="container mx-auto px-4 py-2">
        <div className="flex justify-center">
          <div className="space-y-4">
            <div className="flex flex-col items-center gap-2">
              <Image
                src="/header_img.png"
                alt="Raven sito logo"
                width={40}
                height={40}
                className="rounded-xl"
              />
              <span className="font-bold text-xl text-foreground">
                Raven sito
              </span>
            </div>

            <div className="flex gap-6">
              <a
                href="https://www.facebook.com/racruoino1"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="https://x.com/Flykra3"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
