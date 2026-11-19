"use client";

import { useState, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Thumbs, Keyboard, A11y } from "swiper/modules";
import type { Swiper as SwiperT } from "swiper";
import "swiper/css";
import { Chevron, PlayIcon } from "../icons";
import YouTubeModal from "../YouTubeModal";
import { UI } from "@/lib/site";
import type { Lang, Slide } from "@/lib/types";

/** Elementor "media carousel – slideshow" skin: big slide + thumbnails, opens YouTube in a lightbox. */
export function VideoCarousel({ slides, lang, width }: { slides: Slide[]; lang: Lang; width?: number }) {
  const t = UI[lang];
  const [thumbs, setThumbs] = useState<SwiperT | null>(null);
  const [main, setMain] = useState<SwiperT | null>(null);
  const [playing, setPlaying] = useState<string | null>(null);
  const close = useCallback(() => setPlaying(null), []);
  const thumbFor = (s: Slide) => s.thumb ?? `https://i.ytimg.com/vi/${s.id}/hqdefault.jpg`;
  return (
    <div className="videos__wrap" style={{ ["--vw" as string]: width ? `${width}px` : undefined }}>
      <div style={{ position: "relative" }}>
        <div className="videos__main">
          <Swiper
            dir="rtl"
            modules={[Autoplay, Thumbs, Keyboard, A11y]}
            onSwiper={setMain}
            loop={slides.length > 2}
            speed={500}
            autoplay={{ delay: 5000, pauseOnMouseEnter: true, disableOnInteraction: true }}
            thumbs={{ swiper: thumbs && !thumbs.destroyed ? thumbs : null }}
            keyboard={{ enabled: true }}
          >
            {slides.map((s, k) => (
              <SwiperSlide key={s.id + k}>
                <button
                  type="button"
                  className="video-slide"
                  style={{ backgroundImage: `url("${thumbFor(s)}")` }}
                  onClick={() => setPlaying(s.id)}
                  aria-label={`${t.play} ${k + 1}`}
                >
                  <span className="play-btn">
                    <PlayIcon />
                  </span>
                </button>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        {slides.length > 1 && (
          <>
            <button className="car-arrow car-arrow--prev" type="button" aria-label={t.prev} onClick={() => main?.slidePrev()}>
              <Chevron dir="right" />
            </button>
            <button className="car-arrow car-arrow--next" type="button" aria-label={t.next} onClick={() => main?.slideNext()}>
              <Chevron dir="left" />
            </button>
          </>
        )}
      </div>
      {slides.length > 1 && (
        <div className="videos__thumbs">
          <Swiper dir="rtl" modules={[Thumbs]} onSwiper={setThumbs} slidesPerView={Math.min(5, slides.length)} spaceBetween={10} watchSlidesProgress>
            {slides.map((s, k) => (
              <SwiperSlide key={s.id + k}>
                <img src={thumbFor(s)} alt="" loading="lazy" />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
      {playing && <YouTubeModal id={playing} onClose={close} lang={lang} />}
    </div>
  );
}

export default function Videos({ slides, lang, wide }: { slides: Slide[]; lang: Lang; wide?: boolean }) {
  return (
    <section className="section videos" style={{ marginTop: 70 }} data-reveal="up">
      <VideoCarousel slides={slides} lang={lang} width={wide ? 1136 : 994} />
    </section>
  );
}
