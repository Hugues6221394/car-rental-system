"use client";

import type {PaymentDTO} from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import {CheckCircle, XCircle, Clock, RefreshCw, Badge} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";

interface PaymentStatusProps {
    payment: PaymentDTO;
    onRetry?: () => void;
}

export function PaymentStatus({ payment, onRetry }: PaymentStatusProps) {
    const getStatusIcon = () => {
        switch (payment.status) {
            case 'COMPLETED':
                return <CheckCircle className="w-6 h-6 text-green-600" />;
            case 'FAILED':
                return <XCircle className="w-6 h-6 text-red-600" />;
            case 'PENDING':
                return <Clock className="w-6 h-6 text-yellow-600" />;
            case 'REFUNDED':
                return <RefreshCw className="w-6 h-6 text-blue-600" />;
            default:
                return <Clock className="w-6 h-6 text-gray-600" />;
        }
    };

    const getStatusColor = () => {
        switch (payment.status) {
            case 'COMPLETED':
                return 'bg-green-100 text-green-800';
            case 'FAILED':
                return 'bg-red-100 text-red-800';
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800';
            case 'REFUNDED':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <Card>
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {getStatusIcon()}
                        <div>
                            <h3 className="font-semibold">Payment Status</h3>
                            <p className="text-sm text-muted-foreground">
                                Transaction: {payment.transactionId}
                            </p>
                        </div>
                    </div>

                    <Badge className={getStatusColor()}>
                        {payment.status}
                    </Badge>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <span className="font-medium">Amount:</span>
                        <p>${payment.amount.toFixed(2)}</p>
                    </div>
                    <div>
                        <span className="font-medium">Method:</span>
                        <p>{payment.paymentMethod}</p>
                    </div>
                    <div>
                        <span className="font-medium">Date:</span>
                        <p>{new Date(payment.paymentDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                        <span className="font-medium">Reservation:</span>
                        <p>#{payment.reservationId}</p>
                    </div>
                </div>

                {payment.status === 'FAILED' && onRetry && (
                    <div className="mt-4">
                        <Button onClick={onRetry} variant="outline" size="sm">
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Retry Payment
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}