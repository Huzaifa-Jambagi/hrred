// app/page.tsx
import Image from "next/image";
import Header from "@/components/header";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import companies from "@/data/companies.json";
import CompaniesCarousel from "@/components/companies-carousel";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="grid-background"></div>

      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8">
        <Header />
        <div className="flex flex-col py-6 gap-8 sm:py-10 sm:gap-12 md:gap-16 lg:py-20 lg:gap-20">
          <section className="text-center px-4">
            <h1 className="flex flex-col items-center justify-center gradient-title text-3xl font-extrabold 
            sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl tracking-tighter py-4">
              Find Your Dream Job
              <span className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 md:gap-6"> 
                and get{" "}
                <Image 
                  src="/logo.png" 
                  alt="Logo"
                  width={150}
                  height={150}
                  className="h-12 w-auto sm:h-20 md:h-24 lg:h-28 xl:h-32" 
                />
              </span>
            </h1>
            <p className="text-gray-300 mt-2 sm:mt-4 text-sm sm:text-base md:text-lg lg:text-xl max-w-2xl mx-auto px-4">
              Explore thousands of job listings or find the perfect candidate
            </p>
          </section>

          <div className="flex flex-col gap-6 sm:gap-8 items-center w-full">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center w-full px-4 sm:px-0">
              <Link href="/jobs" className="w-full sm:w-auto">
                <Button variant="blue" size="xl" className="w-full sm:w-auto">
                  Find Jobs
                </Button>
              </Link>
              <Link href="/post-job" className="w-full sm:w-auto">
                <Button variant="destructive" size="xl" className="w-full sm:w-auto">
                  Post a Job
                </Button>
              </Link>
            </div>

            {/* Companies Carousel */}
            <CompaniesCarousel companies={companies} />
          </div>

          <div className="px-4">
            <Image 
              src="/banner.jpeg"
              alt="Banner"
              width={1200}
              height={400}
              className="w-full h-auto"/>
          </div>

          <div className="px-4">
            {/* cards */}
          </div>

          {/* accordian */}
        </div>
      </main>
      <div className="p-4 text-center bg-gray-800 sm:p-6 md:p-8 text-sm sm:text-base">
        Helping you land the job you deserve.
      </div>
    </div>
  );
}