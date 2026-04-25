"use client"

import * as React from "react"

import { Card, CardContent } from "_/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "_/components/ui/carousel"

const images = [
  {
    src: "https://i.pinimg.com/736x/5f/21/24/5f2124ee766032d850899008ada7a85c.jpg",
    title: "Fast & Free Delivery",
  },
  {
    src: "https://i.pinimg.com/1200x/25/45/e7/2545e7252e6ae24ba0588acea7b721e3.jpg",
    title: "Fresh Products Delivered to your Door",
  },
  {
    src: "https://i.pinimg.com/1200x/20/f1/13/20f113dc4e45b38e8bd2c479ede6a825.jpg",
    title: "Premium Quality Guaranteed",
  },
]

export function HeroSlider() {
  return (
    <Carousel className="w-full mb-12">

      <CarouselContent>
        {images.map((item, index) => (
          <CarouselItem key={index}>
            <Card className="overflow-hidden border-none shadow-none">

              <CardContent className="p-0 relative">

                {/* Image */}
                <img
                  src={item.src}
                  className="w-full h-[450px] object-cover"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/20 flex items-center px-10">

                  <div className="max-w-lg">
                    <h2 className="text-white text-4xl font-bold m-4">
                      {item.title}
                    </h2>

                  </div>

                </div>

              </CardContent>

            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>

      {/* Arrows */}
      <CarouselPrevious className="left-4" />
      <CarouselNext className="right-4" />

    </Carousel>
  )
}