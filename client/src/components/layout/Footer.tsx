import { Link } from "wouter";
import { FacebookIcon, InstagramIcon, TwitterIcon, YoutubeIcon } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
        <nav className="-mx-5 -my-2 flex flex-wrap justify-center" aria-label="Footer">
          <div className="px-5 py-2">
            <Link href="/">
              <a className="text-base text-gray-500 hover:text-gray-900">Home</a>
            </Link>
          </div>
          <div className="px-5 py-2">
            <Link href="/about">
              <a className="text-base text-gray-500 hover:text-gray-900">About</a>
            </Link>
          </div>
          <div className="px-5 py-2">
            <Link href="/campaigns">
              <a className="text-base text-gray-500 hover:text-gray-900">Campaigns</a>
            </Link>
          </div>
          <div className="px-5 py-2">
            <Link href="/organizations">
              <a className="text-base text-gray-500 hover:text-gray-900">Organizations</a>
            </Link>
          </div>
          <div className="px-5 py-2">
            <Link href="/contact">
              <a className="text-base text-gray-500 hover:text-gray-900">Contact</a>
            </Link>
          </div>
          <div className="px-5 py-2">
            <Link href="/policy">
              <a className="text-base text-gray-500 hover:text-gray-900">Policy</a>
            </Link>
          </div>
        </nav>
        <div className="mt-8 flex justify-center space-x-6">
          <a href="#" className="text-gray-400 hover:text-gray-500">
            <span className="sr-only">Facebook</span>
            <FacebookIcon className="h-6 w-6" />
          </a>
          <a href="#" className="text-gray-400 hover:text-gray-500">
            <span className="sr-only">Instagram</span>
            <InstagramIcon className="h-6 w-6" />
          </a>
          <a href="#" className="text-gray-400 hover:text-gray-500">
            <span className="sr-only">Twitter</span>
            <TwitterIcon className="h-6 w-6" />
          </a>
          <a href="#" className="text-gray-400 hover:text-gray-500">
            <span className="sr-only">YouTube</span>
            <YoutubeIcon className="h-6 w-6" />
          </a>
        </div>
        <p className="mt-8 text-center text-base text-gray-400">
          &copy; 2023 GiveHope. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
