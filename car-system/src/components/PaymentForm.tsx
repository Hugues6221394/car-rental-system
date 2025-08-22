"use client";

import { useState } from "react";
import { payments } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CreditCard, Shield } from "lucide-react";
import { toast } from "sonner";

interface PaymentFormProps {
    reservationId: number;
    amount: number;
    carDetails: string;
    onPaymentSuccess: (payment: any) => void;
    onPaymentCancel: () => void;
}

export function PaymentForm({ reservationId, amount, carDetails, onPaymentSuccess, onPaymentCancel }: PaymentFormProps) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("credit_card");
    const [cardDetails, setCardDetails] = useState({
        number: "",
        expiry: "",
        cvv: "",
        name: ""
    });

    const handlePayment = async () => {
        setIsProcessing(true);

        try {
            // Initiate payment
            await payments.initiate(reservationId);

            // Simulate payment processing (replace with actual gateway integration)
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Complete payment
            const completedPayment = await payments.create({
                reservationId,
                amount,
                paymentMethod,
                transactionId: `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                paymentDetails: `Payment for ${carDetails} via ${paymentMethod}`
            });

            toast.success("Payment completed successfully!");
            onPaymentSuccess(completedPayment);

        } catch (error: any) {
            console.error("Payment error:", error);

            if (error.message?.includes('Network') || error.message?.includes('timeout')) {
                toast.error("Network error. Please check your connection.");
            } else if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Payment failed. Please try again.");
            }
        } finally {
            setIsProcessing(false);
        }
    };

    const handleInputChange = (field: keyof typeof cardDetails, value: string) => {
        setCardDetails(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const formatCardNumber = (value: string) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = matches && matches[0] || '';
        const parts = [];

        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }

        return parts.length ? parts.join(' ') : value;
    };

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                    <Shield className="w-6 h-6 text-blue-600" />
                    Secure Payment
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* Payment Summary */}
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">${amount.toFixed(2)}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{carDetails}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Reservation #{reservationId}</p>
                </div>

                {/* Payment Method Selection */}
                <div className="space-y-3">
                    <Label>Payment Method</Label>
                    <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-full p-3 border rounded-md bg-background"
                        disabled={isProcessing}
                    >
                        <option value="credit_card">Credit Card</option>
                        <option value="debit_card">Debit Card</option>
                        <option value="paypal">PayPal</option>
                    </select>
                </div>

                {/* Card Details Form */}
                {paymentMethod.includes('card') && (
                    <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                        <div className="space-y-2">
                            <Label htmlFor="cardNumber">Card Number</Label>
                            <Input
                                id="cardNumber"
                                type="text"
                                placeholder="1234 5678 9012 3456"
                                value={formatCardNumber(cardDetails.number)}
                                onChange={(e) => handleInputChange('number', e.target.value)}
                                disabled={isProcessing}
                                maxLength={19}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="expiry">Expiry Date</Label>
                                <Input
                                    id="expiry"
                                    type="text"
                                    placeholder="MM/YY"
                                    value={cardDetails.expiry}
                                    onChange={(e) => handleInputChange('expiry', e.target.value)}
                                    disabled={isProcessing}
                                    maxLength={5}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="cvv">CVV</Label>
                                <Input
                                    id="cvv"
                                    type="text"
                                    placeholder="123"
                                    value={cardDetails.cvv}
                                    onChange={(e) => handleInputChange('cvv', e.target.value)}
                                    disabled={isProcessing}
                                    maxLength={4}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="cardName">Cardholder Name</Label>
                            <Input
                                id="cardName"
                                type="text"
                                placeholder="John Doe"
                                value={cardDetails.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                disabled={isProcessing}
                            />
                        </div>
                    </div>
                )}

                {/* Security Notice */}
                <div className="text-xs text-center text-muted-foreground flex items-center justify-center gap-1">
                    <Shield className="w-3 h-3" />
                    Your payment details are encrypted and secure
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                    <Button
                        onClick={handlePayment}
                        disabled={isProcessing || (paymentMethod.includes('card') && (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv))}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        size="lg"
                    >
                        {isProcessing ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <CreditCard className="w-4 h-4 mr-2" />
                                Pay ${amount.toFixed(2)}
                            </>
                        )}
                    </Button>

                    <Button
                        onClick={onPaymentCancel}
                        disabled={isProcessing}
                        variant="outline"
                        size="lg"
                    >
                        Cancel
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}