'use client';

import { useState, useCallback, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { HouseImage } from '@/types';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Play, Home as HomeIcon, Pause } from 'lucide-react';

interface MediaCarouselProps {
  media: HouseImage[];
  className?: string;
  autoplay?: boolean;
}

export default function MediaCarousel({ media, className = '', autoplay = true }: MediaCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, autoplay ? [Autoplay({ delay: 4000, stopOnInteraction: false })] : []);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoplay);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const toggleAutoplay = useCallback(() => {
    const autoplayPlugin = emblaApi?.plugins()?.autoplay;
    if (!autoplayPlugin) return;
    
    const isCurrentlyPlaying = autoplayPlugin.isPlaying();
    if (isCurrentlyPlaying) {
      autoplayPlugin.stop();
      setIsPlaying(false);
    } else {
      autoplayPlugin.play();
      setIsPlaying(true);
    }
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  if (!media || media.length === 0) {
    return (
      <div className={`bg-dark-800 flex items-center justify-center ${className}`}>
        <div className="text-center text-dark-500 py-20">
          <HomeIcon className="w-20 h-20 mx-auto mb-4 opacity-30" />
          <p className="text-lg">No media available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Main Carousel */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {media.map((item, index) => (
            <div key={item.id} className="flex-[0_0_100%] min-w-0 relative">
              {item.media_type === 'VIDEO' ? (
                <div className="relative w-full h-full bg-black">
                  <video
                    src={item.image_url}
                    controls
                    className="w-full h-full object-contain"
                    poster={item.image_url.replace(/\.[^.]+$/, '.jpg')} // Attempt to use thumbnail
                  >
                    Your browser does not support the video tag.
                  </video>
                  <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
                    <Play className="w-4 h-4" />
                    Video
                  </div>
                </div>
              ) : (
                <div className="relative w-full h-full">
                  <Image
                    src={item.image_url}
                    alt={`Media ${index + 1}`}
                    fill
                    className="object-cover"
                    priority={index === 0}
                  />
                  {item.is_primary && (
                    <div className="absolute top-4 right-4 bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Primary
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      {media.length > 1 && (
        <>
          <button
            onClick={scrollPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors backdrop-blur-sm"
            aria-label="Previous"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors backdrop-blur-sm"
            aria-label="Next"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Indicators */}
      {media.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {media.map((_, index) => (
            <button
              key={index}
              onClick={() => emblaApi?.scrollTo(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === selectedIndex 
                  ? 'bg-primary-500 w-8' 
                  : 'bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Counter & Controls */}
      <div className="absolute top-4 left-4 flex items-center gap-2">
        <div className="bg-black/70 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
          {selectedIndex + 1} / {media.length}
        </div>
        {autoplay && media.length > 1 && (
          <button
            onClick={toggleAutoplay}
            className="bg-black/70 hover:bg-black/80 text-white p-2 rounded-full backdrop-blur-sm transition-colors"
            aria-label={isPlaying ? 'Pause autoplay' : 'Play autoplay'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
        )}
      </div>
    </div>
  );
}
