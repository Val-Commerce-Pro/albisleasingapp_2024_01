// const selectedStatus = {
//   "505": "Warten auf Entscheidungsunterlagen",
//   "510": "Warten auf Entscheidungsunterlagen",
//   "930": "Antrag abgelehnt",
//   "970": "Antrag genehmigt. Bitte Unterlagen einsenden.",
//   "971": "Vertragsunterlagen unvollständig.",
//   "972": "Vertragsunterlagen unvollständig.",
//   "976": "Prüfung/Abrechnung",
//   "978": "Prüfung/Abrechnung",
//   "980": "abgerechnet",
//   "996": "wird storniert",
//   "997": "storniert",

export function getCurrentFormattedTime(): string {
  const date = new Date();
  const options: Intl.DateTimeFormatOptions = {
    timeZone: "Europe/Berlin",
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  };
  const formatter = new Intl.DateTimeFormat("en-US", {
    ...options,
    timeZone: "Europe/Berlin",
  });
  const formattedDate = formatter.format(date);
  console.log("formattedDate with timeZone Europe/Berlin:", formattedDate);
  return formattedDate;
}

type FinishStatus = "Cancel" | "Paid" | "Refund" | "None";

const statusToFinishLeasingRequest: Record<string, FinishStatus> = {
  "930": "Cancel",
  "980": "Paid",
  "996": "Refund",
  "997": "Refund",
};

type CheckAntragStatusResponse = {
  isStatusFinish: boolean;
  statusNote: string;
  action: FinishStatus;
};

export const checkAntragStatus = (
  status: number,
  statusTxt: string,
): CheckAntragStatusResponse => {
  const statusKey = status.toString();
  const isStatusFinish = !!statusToFinishLeasingRequest[statusKey];

  return {
    isStatusFinish: isStatusFinish,
    statusNote: `Albis Leasing Request Status: ${statusTxt} - Checked at ${getCurrentFormattedTime()}`,
    action: isStatusFinish ? statusToFinishLeasingRequest[statusKey] : "None",
  };
};
