// components/companies-carousel.tsx
"use client";

import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

type Company = {
  id: number;
  name: string;
  path: string;
};

interface CompaniesCarouselProps {
  companies: Company[];
}

export default function CompaniesCarousel({ companies }: CompaniesCarouselProps) {
  return (
    <div className="w-full max-w-7xl mx-auto px-4">
      <Carousel
        plugins={[
          Autoplay({
            delay: 2000,
          }),
        ]}
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {companies.map((company: Company) => (
            <CarouselItem 
              key={company.id} 
              className="pl-2 md:pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5"
            >
              <div className="flex items-center justify-center p-4 sm:p-6 md:p-8 h-20 sm:h-24 md:h-28">
                <Image
                  src={company.path}
                  alt={company.name}
                  width={200}
                  height={80}
                  className="w-auto h-full object-contain opacity-70 hover:opacity-100 transition-opacity "
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}