"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "_/components/ui/carousel"

const slides = [
  {
    src: "https://i.pinimg.com/736x/5f/21/24/5f2124ee766032d850899008ada7a85c.jpg",
    lines: ["Fast & free", "delivery"],
    text: "Order in a few taps and get it at your door.",
  },
  {
    src: "https://i.pinimg.com/1200x/25/45/e7/2545e7252e6ae24ba0588acea7b721e3.jpg",
    lines: ["Fresh products,", "at your door"],
    text: "Browse categories and brands, and fill your cart in minutes.",
  },
  {
    src: "https://i.pinimg.com/1200x/20/f1/13/20f113dc4e45b38e8bd2c479ede6a825.jpg",
    lines: ["Premium quality,", "guaranteed"],
    text: "Pick from products rated by other shoppers.",
  },
]

export function HeroSlider() {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)

  React.useEffect(() => {
    if (!api) return
    const onSelect = () => setCurrent(api.selectedScrollSnap())
    onSelect()
    api.on("select", onSelect)
    return () => {
      api.off("select", onSelect)
    }
  }, [api])

  return (
    <section
      aria-label="Featured"
      className="hero-root relative overflow-hidden rounded-3xl bg-deep"
    >
      <Carousel setApi={setApi} opts={{ loop: true }}>
        <CarouselContent className="ml-0">
          {slides.map((slide, i) => (
            <CarouselItem
              key={slide.src}
              data-active={current === i}
              className="hero-slide relative h-[420px] pl-0 md:h-[540px]"
            >
              <img
                src={slide.src}
                alt=""
                loading={i === 0 ? "eager" : "lazy"}
                className="absolute inset-0 size-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-deep/90 via-deep/55 to-transparent" />

              <div className="relative z-10 flex h-full max-w-2xl flex-col justify-center gap-5 px-6 sm:px-12 md:px-16">
                <h2 className="font-heading text-4xl font-bold leading-[1.05] text-white sm:text-5xl md:text-6xl">
                  {slide.lines.map((line, li) => (
                    <span
                      key={line}
                      className="hero-line"
                      style={{ "--i": li } as React.CSSProperties}
                    >
                      <span>{line}</span>
                    </span>
                  ))}
                </h2>

                <p
                  className="hero-fade max-w-md text-base text-white/80 md:text-lg"
                  style={{ "--d": "600ms" } as React.CSSProperties}
                >
                  {slide.text}
                </p>

                <Link
                  href="#products"
                  className="hero-fade group/cta inline-flex w-fit items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-deep transition-all duration-200 hover:bg-marigold hover:shadow-lg active:scale-95"
                  style={{ "--d": "750ms" } as React.CSSProperties}
                >
                  Shop now
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover/cta:translate-x-1" />
                </Link>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="left-4 hidden size-11 border-0 bg-white/90 text-deep shadow-lg backdrop-blur transition-all hover:scale-105 hover:bg-white sm:inline-flex" />
        <CarouselNext className="right-4 hidden size-11 border-0 bg-white/90 text-deep shadow-lg backdrop-blur transition-all hover:scale-105 hover:bg-white sm:inline-flex" />
      </Carousel>

      {/* Progress indicators: the active bar fills, and its end moves to the next slide */}
      <div className="absolute bottom-4 left-6 z-10 flex gap-2 sm:left-12 md:left-16">
        {slides.map((slide, i) => (
          <button
            key={slide.src}
            type="button"
            onClick={() => api?.scrollTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={current === i}
            className="flex h-6 w-10 items-center sm:w-14"
          >
            <span className="relative h-1.5 w-full overflow-hidden rounded-full bg-white/30">
              {current === i && (
                <span
                  className="hero-progress absolute inset-0 rounded-full bg-white"
                  onAnimationEnd={() => api?.scrollNext()}
                />
              )}
            </span>
          </button>
        ))}
      </div>
    </section>
  )
}