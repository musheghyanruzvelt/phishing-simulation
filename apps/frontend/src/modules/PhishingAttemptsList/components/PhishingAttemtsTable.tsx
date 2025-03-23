import { FC } from "react";
import { PhishingAttempt } from "@phishing-simulation/types";
import { StatusBadge } from "./StatusBadge";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "../PhishingAttemptsList.utils";
import { locale } from "../locale";

interface PhishingAttemptsTableProps {
  attempts: PhishingAttempt[];
}

export const PhishingAttemptsTable: FC<PhishingAttemptsTableProps> = ({
  attempts,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[150px]">
                {locale.table.headers.status}
              </TableHead>
              <TableHead>{locale.table.headers.targetEmail}</TableHead>
              <TableHead className="w-[250px]">
                {locale.table.headers.content}
              </TableHead>
              <TableHead>{locale.table.headers.created}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attempts.map((attempt) => (
              <TableRow key={attempt.id} className="hover:bg-gray-50">
                <TableCell>
                  <StatusBadge status={attempt.status} />
                </TableCell>
                <TableCell className="font-medium">
                  {attempt.recipientEmail}
                </TableCell>
                <TableCell>
                  <div className="max-w-[250px] max-h-[100px] overflow-y-auto whitespace-pre-wrap text-sm">
                    {attempt.emailContent}
                  </div>
                </TableCell>
                <TableCell>{formatDate(attempt.createdAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
