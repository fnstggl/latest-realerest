
import * as React from "react";
import { cn } from "@/lib/utils";

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
    const [current, setCurrent] = React.useState(0);

    const goToNext = () => {
      setCurrent((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
    };

    const goToPrev = () => {
      setCurrent((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
    };

    React.useEffect(() => {
      const timer = setTimeout(goToNext, 5000);
      return () => clearTimeout(timer);
    }, [current]);

    return (
      <div ref={ref} className={cn("py-16", className)} {...props}>
        <div className="max-w-screen-xl mx-auto px-4 lg:px-8">
          <div className="flex flex-col items-center">
            <div className="w-full max-w-2xl">
              <div className="relative overflow-hidden">
                {testimonials.map((testimonial, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "transition-opacity duration-500 flex flex-col items-center",
                      idx === current ? "opacity-100" : "opacity-0 absolute top-0 left-0"
                    )}
                  >
                    <p className="max-w-xl text-balance text-center text-xl sm:text-2xl text-foreground">
                      {testimonial.review}
                    </p>
                    <h5 className="mt-5 font-medium text-muted-foreground">
                      {testimonial.name}
                    </h5>
                    <h5 className="mt-1.5 font-medium text-foreground/40">
                      {testimonial.role}
                    </h5>
                    <div className="mt-5 relative h-12 w-12 rounded-full overflow-hidden bg-muted">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 flex items-center justify-center gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={cn(
                    "h-1.5 w-1.5 rounded-full transition-all",
                    index === current ? "bg-primary" : "bg-primary/35"
                  )}
                  onClick={() => setCurrent(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

TestimonialCarousel.displayName = "TestimonialCarousel";
