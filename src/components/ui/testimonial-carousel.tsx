
import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

interface Testimonial {
  name: string;
  role: string;
  review: string;
  avatar: string;
}

interface TestimonialCarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  testimonials: Testimonial[];
}

export const TestimonialCarousel = React.forwardRef<HTMLDivElement, TestimonialCarouselProps>(
  ({ className, testimonials, ...props }, ref) => {
    const [api, setApi] = React.useState<CarouselApi>();
    const [current, setCurrent] = React.useState(0);

    React.useEffect(() => {
      if (!api) return;
      api.on("select", () => {
        setCurrent(api.selectedScrollSnap());
      });
    }, [api]);

    // Add auto-cycle functionality
    React.useEffect(() => {
      if (!api) return;
      
      const interval = setInterval(() => {
        api.scrollNext();
      }, 10000); // 10 seconds

      return () => clearInterval(interval);
    }, [api]);

    return (
      <div ref={ref} className={cn("py-16", className)} {...props}>
        <Carousel
          setApi={setApi}
          className="max-w-screen-xl mx-auto px-4 lg:px-8"
        >
          <CarouselContent>
            {testimonials.map((testimonial, idx) => (
              <CarouselItem
                key={idx}
                className="flex flex-col items-center cursor-grab"
              >
                <p className="max-w-xl text-balance text-center text-xl sm:text-2xl text-foreground">
                  {testimonial.review}
                </p>
                <h5 className="mt-5 font-medium text-muted-foreground">
                  {testimonial.name}
                </h5>
                <h5 className="mt-1.5 font-medium text-foreground/40" dangerouslySetInnerHTML={{
                  __html: testimonial.role.replace(/\*(.*?)\*/g, '<em>$1</em>')
                }} />
                <div className="mt-5 relative h-12 w-12 rounded-full overflow-hidden bg-muted">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        <div className="mt-6 text-center">
          <div className="flex items-center justify-center gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={cn(
                  "h-1.5 w-1.5 rounded-full transition-all",
                  index === current ? "bg-black" : "bg-black/35"
                )}
                onClick={() => api?.scrollTo(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
);

TestimonialCarousel.displayName = "TestimonialCarousel";
