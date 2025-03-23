import { PhishingAttemptStatus } from "@phishing-simulation/types";
import { FC } from "react";

interface Props {
  status: PhishingAttemptStatus;
}

export const StatusBadge: FC<Props> = ({ status }) => {
  switch (status) {
    case PhishingAttemptStatus.PENDING:
      return (
        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
          Pending
        </span>
      );
    case PhishingAttemptStatus.CLICKED:
      return (
        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
          Clicked
        </span>
      );
    default:
      return (
        <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
          {status}
        </span>
      );
  }
};
