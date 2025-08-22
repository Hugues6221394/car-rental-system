import { payments } from "@/lib/api";
import { useState } from "react";

export function usePayment() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const initiatePayment = async (reservationId: number) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await payments.initiate(reservationId);
            return response;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || "Failed to initiate payment";
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const completePayment = async (paymentData: any) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await payments.create(paymentData);
            return response;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || "Failed to complete payment";
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const getPaymentStatus = async (reservationId: number) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await payments.getByReservationId(reservationId);
            return response;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || "Failed to fetch payment status";
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const getPaymentById = async (paymentId: number) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await payments.getById(paymentId);
            return response;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || "Failed to fetch payment";
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const updatePaymentStatus = async (paymentId: number, status: string) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await payments.updateStatus(paymentId, status);
            return response;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || "Failed to update payment status";
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const getAllPayments = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await payments.getAll();
            return response;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || "Failed to fetch payments";
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isLoading,
        error,
        initiatePayment,
        completePayment,
        getPaymentStatus,
        getPaymentById,
        updatePaymentStatus,
        getAllPayments,
        clearError: () => setError(null),
    };
}