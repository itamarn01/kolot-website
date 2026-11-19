"use client";

import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Keyboard, A11y } from "swiper/modules";
import type { Swiper as SwiperT } from "swiper";
import "swiper/css";
import { Chevron } from "../icons";
import { UI } from "@/lib/site";
import type { Lang } from "@/lib/types";

export default function Gallery({ images, lang }: { images: string[]; lang: Lang }) {
  const t = UI[lang];
  // drive the carousel through its instance: always works, even before/after re-renders
  const [sw, setSw] = useState<SwiperT | null>(null);
  return (
    <section className="section section--flush gallery c-cyan" aria-label={t.gallery} data-reveal="zoom">
      <div style={{ position: "relative" }}>
        <Swiper
          dir="rtl"
          modules={[Autoplay, Keyboard, A11y]}
          onSwiper={setSw}
          slidesPerView={1}
          loop
          speed={600}
          grabCursor
          slideToClickedSlide
          autoplay={{ delay: 5000, pauseOnMouseEnter: true, disableOnInteraction: true }}
          keyboard={{ enabled: true }}
          a11y={{ prevSlideMessage: t.prev, nextSlideMessage: t.next }}
        >
          {images.map((src, k) => (
            <SwiperSlide key={src}>
              <figure>
                <img src={src} alt={`KOLOT ${k + 1}`} loading={k < 2 ? "eager" : "lazy"} width={800} height={533} draggable={false} />
              </figure>
            </SwiperSlide>
          ))}
        </Swiper>
        <button className="car-arrow car-arrow--prev" type="button" aria-label={t.prev} onClick={() => sw?.slidePrev()}>
          <Chevron dir="right" />
        </button>
        <button className="car-arrow car-arrow--next" type="button" aria-label={t.next} onClick={() => sw?.slideNext()}>
          <Chevron dir="left" />
        </button>
      </div>
    </section>
  );
}
