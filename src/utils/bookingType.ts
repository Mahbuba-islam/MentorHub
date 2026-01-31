import { BookingStatus } from "@prisma/client"

export type BookingCreateInput = {
  tutorId: string
  date: string
  startTime: string
  endTime: string
  studentId: string
  status?: BookingStatus
}
