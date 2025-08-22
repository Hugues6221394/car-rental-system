import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { PaymentForm } from "@/components/PaymentForm";
import { reservations } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface ReservationDetails {
    id: number;
    totalPrice: number;
    carMake: string;
    carModel: string;
    startDate: string;
    endDate: string;
    status: string;
}

export default function PaymentPage() {
    const navigate = useNavigate();
    const [reservation, setReservation] = useState<ReservationDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Get reservationId from URL params - using a safer approach
    const reservationId = typeof window !== 'undefined'
        ? new URLSearchParams(window.location.search).get('reservationId')
        : null;

    useEffect(() => {
        if (reservationId) {
            fetchReservationDetails();
        }
    }, [reservationId]);

    const fetchReservationDetails = async () => {
        try {
            setIsLoading(true);
            const reservationData = await reservations.getById(Number(reservationId));

            if (reservationData.status !== 'PENDING') {
                setError('This reservation has already been processed');
                return;
            }

            setReservation(reservationData);
        } catch (error: any) {
            console.error('Failed to fetch reservation:', error);
            setError('Reservation not found or access denied');
            toast.error('Failed to load reservation details');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePaymentSuccess = () => {
        toast.success('Payment completed successfully!');
        // Redirect to reservations page with success message
        navigate({ to: "/reservations" });
    };

    const handlePaymentCancel = () => {
        // Redirect back to reservations
        navigate({ to: "/reservations" });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                    <p>Loading reservation details...</p>
                </div>
            </div>
        );
    }

    if (error || !reservation) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card className="w-full max-w-md mx-4">
                    <CardContent className="p-6 text-center">
                        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold mb-2">Error</h2>
                        <p className="text-gray-600 mb-4">{error || 'Reservation not found'}</p>
                        <Button onClick={() => navigate({ to: "/reservations" })}>
                            Back to Reservations
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <Button
                        variant="ghost"
                        onClick={() => navigate({ to: "/reservations" })}
                        className="mb-4"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Reservations
                    </Button>

                    <h1 className="text-3xl font-bold text-center mb-2">Complete Payment</h1>
                    <p className="text-gray-600 text-center">
                        Secure payment for your reservation
                    </p>
                </div>

                {/* Reservation Summary */}
                <Card className="max-w-2xl mx-auto mb-8">
                    <CardContent className="p-6">
                        <h2 className="text-xl font-semibold mb-4">Reservation Summary</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="font-medium">Car:</span>
                                <p>{reservation.carMake} {reservation.carModel}</p>
                            </div>
                            <div>
                                <span className="font-medium">Duration:</span>
                                <p>
                                    {new Date(reservation.startDate).toLocaleDateString()} -
                                    {new Date(reservation.endDate).toLocaleDateString()}
                                </p>
                            </div>
                            <div>
                                <span className="font-medium">Reservation ID:</span>
                                <p>#{reservation.id}</p>
                            </div>
                            <div>
                                <span className="font-medium">Total Amount:</span>
                                <p className="text-green-600 font-bold">${reservation.totalPrice.toFixed(2)}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Payment Form */}
                <div className="flex justify-center">
                    <PaymentForm
                        reservationId={reservation.id}
                        amount={reservation.totalPrice}
                        carDetails={`${reservation.carMake} ${reservation.carModel}`}
                        onPaymentSuccess={handlePaymentSuccess}
                        onPaymentCancel={handlePaymentCancel}
                    />
                </div>
            </div>
        </div>
    );
}