import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthContext";
import { cn } from "@/lib/utils";
import { Link, useNavigate } from "@tanstack/react-router";

export default function HomePage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [, setCurrentFeature] = useState(0);
    const [isVisible, setIsVisible] = useState<Record<string, boolean>>({});

    if (user) {
        navigate({ to: "/dashboard" });
    }

    // Auto-rotate featured cars
    const featuredCars = [
        { name: "Luxury Sedan", image: "/cars/sedan.jpg" },
        { name: "Sports Car", image: "/cars/sports.jpg" },
        { name: "SUV", image: "/cars/suv.jpg" },
    ];

    // Static cars for reservation
    const availableCars = [
        {
            id: 1,
            name: "Toyota Camry 2023",
            type: "Sedan",
            price: "$89/day",
            image: "/cars/Toyota Camry.jpg",
            features: ["Automatic", "5 Seats", "Bluetooth"],
        },
        {
            id: 2,
            name: "Ford Mustang GT",
            type: "Sports Car",
            price: "$149/day",
            image: "/cars/Ford Mustang GT.jpg",
            features: ["Manual", "2 Seats", "Premium Sound"],
        },
        {
            id: 3,
            name: "Tesla Model 3",
            type: "Electric",
            price: "$129/day",
            image: "/cars/Tesla Model 3.png",
            features: ["Automatic", "5 Seats", "Self-Driving"],
        },
        {
            id: 4,
            name: "Jeep Wrangler",
            type: "SUV",
            price: "$99/day",
            image: "/cars/Jeep Wrangler.jpg",
            features: ["4WD", "7 Seats", "Off-road"],
        },
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentFeature((prev) => (prev + 1) % featuredCars.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [featuredCars.length]);

    // Intersection Observer for animations
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
                    }
                });
            },
            { threshold: 0.1 }
        );

        const elements = document.querySelectorAll("[data-animate]");
        elements.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    const stats = [
        {
            number: "10,000+",
            label: "Happy Customers",
            icon: (
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
            ),
        },
        {
            number: "500+",
            label: "Premium Cars",
            icon: (
                <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9L18.4 9H5.6L3.5 11.1C2.7 11.3 2 12.1 2 13v3c0 .6.4 1 1 1h2m0-6v10m16-10v10m-8-2.3V19m0-8.3V14"
                    />
                    <circle cx="7" cy="17" r="2" />
                    <path d="M9 17h6" />
                    <circle cx="17" cy="17" r="2" />
                </svg>
            ),
        },
        {
            number: "50+",
            label: "Locations",
            icon: (
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                    />
                </svg>
            ),
        },
        {
            number: "24/7",
            label: "Support",
            icon: (
                <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
            ),
        },
    ];

    const features = [
        {
            icon: (
                <svg
                    className="w-12 h-12"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                </svg>
            ),
            title: "Instant Booking",
            description:
                "Book your perfect car in under 60 seconds with our streamlined process",
        },
        {
            icon: (
                <svg
                    className="w-12 h-12"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                </svg>
            ),
            title: "Fully Insured",
            description: "Complete coverage and peace of mind for every journey",
        },
        {
            icon: (
                <svg
                    className="w-12 h-12"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                    />
                </svg>
            ),
            title: "Premium Fleet",
            description:
                "From economy to luxury - find the perfect car for any occasion",
        },
        {
            icon: (
                <svg
                    className="w-12 h-12"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                </svg>
            ),
            title: "Mobile Ready",
            description: "Manage your bookings anywhere with our responsive platform",
        },
        {
            icon: (
                <svg
                    className="w-12 h-12"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                </svg>
            ),
            title: "24/7 Support",
            description: "Round-the-clock assistance whenever you need help",
        },
        {
            icon: (
                <svg
                    className="w-12 h-12"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
            ),
            title: "Best Prices",
            description: "Competitive rates with no hidden fees or surprises",
        },
    ];

    const testimonials = [
        {
            name: "Sarah Johnson",
            role: "Business Traveler",
            content:
                "Absolutely seamless experience! The booking was quick and the car was perfect.",
            rating: 5,
        },
        {
            name: "Mike Chen",
            role: "Weekend Explorer",
            content:
                "Great selection of cars and excellent customer service. Highly recommended!",
            rating: 5,
        },
        {
            name: "Emma Davis",
            role: "City Commuter",
            content:
                "Reliable, affordable, and convenient. This is my go-to car rental service.",
            rating: 5,
        },
    ];

    return (
        <>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                {/* Hero Section */}
                <section className="relative min-h-screen overflow-hidden">
                    {/* Animated Background */}
                    <div className="absolute inset-0">
                        <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-red-700 to-red-800" />
                        <div className="absolute inset-0 bg-black/20" />
                        {/* Floating shapes */}
                        <div className="absolute top-20 left-10 w-72 h-72 bg-red-400/10 rounded-full blur-3xl animate-pulse" />
                        <div className="absolute bottom-20 right-10 w-96 h-96 bg-red-400/10 rounded-full blur-3xl animate-pulse delay-1000" />
                    </div>

                    <div className="relative z-10 container mx-auto px-4 py-20">
                        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
                            {/* Left Column - Content */}
                            <div className="space-y-8 animate-fade-in-up">
                                <div className="space-y-6">
                                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white">
                                        <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></span>
                                        <span className="text-sm font-medium">
                      Now Available 24/7
                    </span>
                                    </div>

                                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight">
                                        Your Perfect
                                        <span className="block bg-gradient-to-r from-red-300 to-red-400 bg-clip-text text-transparent">
                      Ride Awaits
                    </span>
                                    </h1>

                                    <p className="text-xl text-red-100 max-w-xl leading-relaxed">
                                        Experience premium car rentals with our cutting-edge
                                        platform. From luxury sedans to rugged SUVs - find your
                                        perfect match in seconds.
                                    </p>
                                </div>

                                {/* CTA Buttons */}
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Link
                                        to="/sign-up"
                                        className={cn(
                                            "group flex items-center justify-center gap-2",
                                            "px-8 py-4 rounded-2xl",
                                            "bg-white text-red-600",
                                            "font-bold text-lg",
                                            "transition-all duration-300",
                                            "hover:bg-gray-50 hover:scale-105",
                                            "shadow-xl hover:shadow-2xl",
                                            "transform-gpu"
                                        )}
                                    >
                                        <span>Start Your Journey</span>
                                        <svg
                                            className="w-5 h-5 transition-transform group-hover:translate-x-1"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M13 7l5 5m0 0l-5 5m5-5H6"
                                            />
                                        </svg>
                                    </Link>

                                    <Link
                                        to="/sign-in"
                                        className={cn(
                                            "group flex items-center justify-center gap-2",
                                            "px-8 py-4 rounded-2xl",
                                            "bg-transparent text-white",
                                            "font-bold text-lg",
                                            "border-2 border-white/30 backdrop-blur-sm",
                                            "transition-all duration-300",
                                            "hover:bg-white/10 hover:border-white",
                                            "hover:scale-105"
                                        )}
                                    >
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                                            />
                                        </svg>
                                        <span>Sign In</span>
                                    </Link>
                                </div>

                                {/* Quick Stats */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8">
                                    {stats.map((stat, index) => (
                                        <div
                                            key={stat.label}
                                            className={`text-center space-y-2 animate-fade-in-up delay-${
                                                index * 100
                                            }`}
                                        >
                                            <div className="text-2xl text-red-300">{stat.icon}</div>
                                            <div className="text-2xl font-bold text-white">
                                                {stat.number}
                                            </div>
                                            <div className="text-red-100 text-sm">{stat.label}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Right Column - Car Showcase */}
                            <div className="hidden lg:block relative">
                                <div className="relative h-[600px] perspective-1000">
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent rounded-3xl backdrop-blur-sm border border-white/10" />
                                    <div className="relative h-full flex items-center justify-center">
                                        <img
                                            src="/cars/heroo.png"
                                            alt="Featured Car"
                                            className="max-w-full max-h-full object-contain drop-shadow-2xl animate-float"
                                        />
                                        {/* Floating elements */}
                                        <div className="absolute top-10 right-10 bg-white/10 backdrop-blur-sm rounded-2xl p-4 animate-bounce-soft">
                                            <div className="text-white text-sm font-medium">
                                                Premium Quality
                                            </div>
                                        </div>
                                        <div className="absolute bottom-10 left-10 bg-red-500/20 backdrop-blur-sm rounded-2xl p-4 animate-pulse">
                                            <div className="text-red-300 text-sm font-medium">
                                                ✓ Available Now
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Scroll indicator */}
                    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
                            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
                        </div>
                    </div>
                </section>

                {/* Available Cars Section */}
                <section
                    id="cars"
                    data-animate
                    className="py-20 bg-white dark:bg-gray-800"
                >
                    <div className="container mx-auto px-4">
                        <div
                            className={cn(
                                "text-center mb-16 transition-all duration-1000",
                                isVisible.cars
                                    ? "opacity-100 translate-y-0"
                                    : "opacity-0 translate-y-10"
                            )}
                        >
                            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                                Available Cars
                            </h2>
                            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                                Choose from our premium selection of vehicles
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {availableCars.map((car, index) => (
                                <div
                                    key={car.id}
                                    className={cn(
                                        "bg-white dark:bg-gray-700 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2",
                                        "border border-gray-200 dark:border-gray-600",
                                        isVisible.cars
                                            ? "opacity-100 translate-y-0"
                                            : "opacity-0 translate-y-10"
                                    )}
                                    style={{ transitionDelay: `${index * 100}ms` }}
                                >
                                    <div className="relative h-48 overflow-hidden">
                                        <img
                                            src={car.image}
                                            alt={car.name}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                                            {car.type}
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                            {car.name}
                                        </h3>
                                        <div className="flex items-center mb-4">
                      <span className="text-2xl font-bold text-red-600 dark:text-red-400">
                        {car.price}
                      </span>
                                        </div>
                                        <div className="flex flex-wrap gap-2 mb-6">
                                            {car.features.map((feature, i) => (
                                                <span
                                                    key={i}
                                                    className="text-xs bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200 px-2 py-1 rounded"
                                                >
                          {feature}
                        </span>
                                            ))}
                                        </div>
                                        <Link
                                            to="/sign-in"
                                            className={cn(
                                                "w-full block text-center",
                                                "px-4 py-3 rounded-lg",
                                                "bg-red-600 text-white",
                                                "font-medium",
                                                "transition-all duration-300",
                                                "hover:bg-red-700 hover:shadow-md"
                                            )}
                                        >
                                            Reserve Now
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section
                    id="features"
                    data-animate
                    className="py-20 bg-gray-50 dark:bg-gray-900"
                >
                    <div className="container mx-auto px-4">
                        <div
                            className={cn(
                                "text-center mb-16 transition-all duration-1000",
                                isVisible.features
                                    ? "opacity-100 translate-y-0"
                                    : "opacity-0 translate-y-10"
                            )}
                        >
                            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                                Why Choose Our Service?
                            </h2>
                            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                                We've designed every aspect of our service to make car rental
                                effortless and enjoyable
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {features.map((feature, index) => (
                                <div
                                    key={feature.title}
                                    className={cn(
                                        "group p-8 rounded-2xl transition-all duration-500 hover:scale-105",
                                        "bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600",
                                        "border border-gray-200 dark:border-gray-600 hover:border-red-200 dark:hover:border-red-500",
                                        "shadow-sm hover:shadow-xl",
                                        isVisible.features
                                            ? "opacity-100 translate-y-0"
                                            : "opacity-0 translate-y-10"
                                    )}
                                    style={{ transitionDelay: `${index * 100}ms` }}
                                >
                                    <div className="text-red-600 dark:text-red-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Testimonials Section */}
                <section
                    id="testimonials"
                    data-animate
                    className="py-20 bg-white dark:bg-gray-800"
                >
                    <div className="container mx-auto px-4">
                        <div
                            className={cn(
                                "text-center mb-16 transition-all duration-1000",
                                isVisible.testimonials
                                    ? "opacity-100 translate-y-0"
                                    : "opacity-0 translate-y-10"
                            )}
                        >
                            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                                What Our Customers Say
                            </h2>
                            <p className="text-xl text-gray-600 dark:text-gray-300">
                                Don't just take our word for it
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {testimonials.map((testimonial, index) => (
                                <div
                                    key={testimonial.name}
                                    className={cn(
                                        "bg-white dark:bg-gray-700 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500",
                                        "border border-gray-200 dark:border-gray-600",
                                        isVisible.testimonials
                                            ? "opacity-100 translate-y-0"
                                            : "opacity-0 translate-y-10"
                                    )}
                                    style={{ transitionDelay: `${index * 200}ms` }}
                                >
                                    <div className="flex mb-4">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <svg
                                                key={i}
                                                className="w-5 h-5 text-red-400"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-300 mb-6 italic">
                                        "{testimonial.content}"
                                    </p>
                                    <div>
                                        <div className="font-bold text-gray-900 dark:text-white">
                                            {testimonial.name}
                                        </div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            {testimonial.role}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 bg-gradient-to-r from-red-600 to-red-800">
                    <div className="container mx-auto px-4 text-center">
                        <div className="max-w-3xl mx-auto space-y-8">
                            <h2 className="text-4xl font-bold text-white">
                                Ready to Hit the Road?
                            </h2>
                            <p className="text-xl text-red-100">
                                Join thousands of satisfied customers and experience the future
                                of car rental today.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    to="/sign-up"
                                    className="px-8 py-4 bg-white text-red-600 rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all duration-300 hover:scale-105 shadow-xl"
                                >
                                    Get Started Free
                                </Link>
                                <Link
                                    to="/cars"
                                    className="px-8 py-4 bg-transparent text-white border-2 border-white rounded-2xl font-bold text-lg hover:bg-white/10 transition-all duration-300"
                                >
                                    Browse Cars
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}