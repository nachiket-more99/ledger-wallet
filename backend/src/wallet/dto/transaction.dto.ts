export class TransactionDto {
  title: string        // "Added Money" | "Sent to Name"
  date: string         // ISO string
  amount: number
  type: string
  direction: "IN" | "OUT"
  referenceId: string
}