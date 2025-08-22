import React from "react";
import { Link } from "@tanstack/react-router";

const Contact: React.FC = () => {
    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <div className="relative h-[400px] overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800">
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-0 w-full h-full opacity-20">
                        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-white blur-3xl animate-pulse"></div>
                        <div
                            className="absolute bottom-1/3 right-1/3 w-96 h-96 rounded-full bg-blue-300 blur-3xl animate-pulse"
                            style={{ animationDelay: "1s" }}
                        ></div>
                    </div>
                </div>

                <div className="absolute inset-0 bg-black/30" />
                <div className="relative container mx-auto px-4 h-full flex items-center">
                    <div className="w-full text-white z-10 text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in">
                            Contact <span className="text-blue-200">Support</span>
                        </h1>
                        <p className="text-xl mb-8 text-gray-100 animate-slide-up max-w-2xl mx-auto leading-relaxed">
                            Get in touch with us for any questions, issues, or support needs.
                            We're here to help you with your car rental experience.
                        </p>
                    </div>
                </div>
            </div>

            {/* Contact Information Section */}
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Contact Details */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                            <h2 className="text-2xl font-bold text-foreground mb-6">Get In Touch</h2>

                            <div className="space-y-6">
                                <div className="flex items-start">
                                    <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg mr-4">
                                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground">Email</h3>
                                        <a
                                            href="mailto:hugues.ngabonziza@auca.ac.rw"
                                            className="text-blue-600 dark:text-blue-400 hover:underline"
                                        >
                                            hugues.ngabonziza@auca.ac.rw
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg mr-4">
                                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground">Phone</h3>
                                        <p className="text-gray-600 dark:text-gray-400">+250786221394</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="bg-blue-100 dark:blue-900/30 p-3 rounded-lg mr-4">
                                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground">WhatsApp</h3>
                                        <a
                                            href="https://wa.me/250786221394"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center text-green-600 dark:text-green-400 hover:underline mt-1"
                                        >
                                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.864 3.488"/>
                                            </svg>
                                            Message us on WhatsApp
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Support Information */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                            <h2 className="text-2xl font-bold text-foreground mb-6">Customer Support</h2>

                            <div className="space-y-4">
                                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                                    <h3 className="font-semibold text-foreground flex items-center">
                                        <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Response Time
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                                        We typically respond to all inquiries within 24 hours during business days.
                                    </p>
                                </div>

                                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                                    <h3 className="font-semibold text-foreground flex items-center">
                                        <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Business Hours
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                                        Monday - Thursday: 8:00 AM - 6:00 PM<br />
                                        Friday: 8:00 AM - 15:00 PM <br/>
                                        Sabbath-Day/Saturday: Close <br/>
                                        Sunday: 9:00 AM - 4:00 PM
                                    </p>
                                </div>

                                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                                    <h3 className="font-semibold text-foreground flex items-center">
                                        <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Common Issues
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                                        For booking modifications, cancellations, or urgent roadside assistance, please call directly for faster service.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Back to Home Link */}
                    <div className="mt-12 text-center">
                        <Link
                            to="/"
                            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Homepage
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;