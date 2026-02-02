import Image from "next/image";
import Header from "@/components/header";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="h-screen flex flex-col">
      <div className="grid-background"></div>

      <main className="flex-1 container">
        <Header />
        <div className="flex flex-col py-10 gap-10 sm:gap-20 sm:py20">
          <section className="text-center">
            <h1 className="flex flex-col items-center justify-center gradient-title text-4xl font-extrabold 
            sm:text-6xl lg:text-8xl tracking-tighter py-4">Find your Dream Job{""}
              <span className="flex items-center gap-2 sm:gap-6"> and get{" "}
                <Image src="/logo.png" alt="Logo"
                  width={150}
                  height={150}
                  className="h-14 sm:h-24 lg:32" />
              </span>
            </h1>
            <p className="text-gray-300 sm:mt-4 text-xs sm:text-xl">Find the perfect job that matches your skills and interests.</p>
          </section>
          
      <div className="">
        <Link href="/jobs" >
        <Button variant="blue" size="xl">Find Jobs</Button>
        </Link>
         <Link href="/post-job" >
        <Button variant="blue" size="xl">Post a Job</Button>
        </Link>
            {/* buttons */}
            {/* carousel */}
          </div>


          <div className="">
            {/* banner */}
          </div>

          <div className="">
            {/* cards */}
          </div>

          {/* accordian */}
        </div>
      </main>
      <div className="p-3 text-center bg-gray-800 sm:p-8">
        Helping you land the job you deserve.
      </div>
    </div>
  );
}
