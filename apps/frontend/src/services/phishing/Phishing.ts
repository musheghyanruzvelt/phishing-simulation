import { AxiosError } from "axios";
import axiosClient from "../axios/axios";
import {
  PhishingAttemptsResponse,
  PhishingEmailRequest,
  PhishingSimulationResponse,
} from "./Phishing.types";

export const sendPhishingEmail = async (
  sendPhishingEmailRequest: PhishingEmailRequest
): Promise<PhishingSimulationResponse> => {
  try {
    const { data } = await axiosClient.post(
      "/simulation/phishing/send",
      sendPhishingEmailRequest
    );
    return data;
  } catch (e) {
    console.error(
      "Send Phishing Email Api Error:",
      (e as AxiosError).response?.data
    );
    throw e;
  }
};

export const fetchPhishingAttempts =
  async (): Promise<PhishingAttemptsResponse> => {
    try {
      const { data } = await axiosClient.get("/management/phishing-attempts");
      return data;
    } catch (e) {
      console.error(
        "Fetch Attempts Api Error:",
        (e as AxiosError).response?.data
      );
      throw e;
    }
  };
