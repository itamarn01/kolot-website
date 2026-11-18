"use client";

import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Keyboard, A11y } from "swiper/modules";
import "swiper/css";
import { Chevron } from "../icons";
import { UI } from "@/lib/site";
import type { Lang } from "@/lib/types";

export default function Gallery({ images, lang }: { images: string[]; lang: Lang }) {
  const t = UI[lang];
  const [prev, setPrev] = useState<HTMLButtonElement | null>(null);
  const [next, setNext] = useState<HTMLButtonElement | null>(null);
  return (
    <section className="section section--flush gallery c-cyan" aria-label={t.gallery} data-reveal="zoom">
      <div style={{ position: "relative" }}>
        <Swiper
          dir="rtl"
          modules={[Autoplay, Navigation, Keyboard, A11y]}
          slidesPerView={1}
          loop
          speed={600}
          autoplay={{ delay: 5000, pauseOnMouseEnter: true, disableOnInteraction: true }}
          keyboard={{ enabled: true }}
          navigation={{ prevEl: prev, nextEl: next }}
          a11y={{ prevSlideMessage: t.prev, nextSlideMessage: t.next }}
        >
          {images.map((src, k) => (
            <SwiperSlide key={src}>
              <figure>
                <img src={src} alt={`KOLOT ${k + 1}`} loading={k < 2 ? "eager" : "lazy"} width={800} height={533} />
              </figure>
            </SwiperSlide>
          ))}
        </Swiper>
        <button ref={setPrev} className="car-arrow car-arrow--prev" type="button" aria-label={t.prev}>
          <Chevron dir="right" />
        </button>
        <button ref={setNext} className="car-arrow car-arrow--next" type="button" aria-label={t.next}>
          <Chevron dir="left" />
        </button>
      </div>
    </section>
  );
}
