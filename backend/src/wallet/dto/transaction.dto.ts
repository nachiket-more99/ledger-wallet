export class TransactionDto {
  title: string        // "Added Money" | "Sent to Name"
  date: string         // ISO string
  amount: number
  direction: "IN" | "OUT"
  referenceId: string
}