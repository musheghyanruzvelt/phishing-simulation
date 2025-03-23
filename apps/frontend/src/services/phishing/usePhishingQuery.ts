import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
  PhishingAttemptsResponse,
  PhishingEmailRequest,
  PhishingSimulationResponse,
} from "./Phishing.types";
import { fetchPhishingAttempts, sendPhishingEmail } from "./Phishing";

export const usePhishingQuery = () => {
  const queryClient = useQueryClient();

  const useSendPhishingMutation = () =>
    useMutation<PhishingSimulationResponse, AxiosError, PhishingEmailRequest>({
      mutationFn: sendPhishingEmail,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["phishing-attempts"] });
      },
      onError: (error) => {
        console.error(
          "Phishing simulation failed:",
          error.response?.data || error.message
        );
      },
    });

  const usePhishingAttempts = () =>
    useQuery<PhishingAttemptsResponse, AxiosError>({
      queryKey: ["phishing-attempts"],
      queryFn: fetchPhishingAttempts,
    });

  return {
    useSendPhishingMutation,
    usePhishingAttempts,
  };
};
