import { LocationType } from '@prisma/client';

export class LocationDetailsDto {
  locationName: string;
  locationType: LocationType;
}

export class AttendanceWithLocationDto {
  id: string;
  employeeId: string;
  date: Date;
  checkIn: Date | null;
  checkOut: Date | null;
  checkInLocation?: LocationDetailsDto;
  checkOutLocation?: LocationDetailsDto;
  status: string;
  hoursWorked: number | null;
  notes: string | null;
}

export class CheckInResponseDto {
  success: boolean;
  data: {
    id: string;
    employeeId: string;
    checkIn: Date;
    checkInLocation: LocationDetailsDto;
    status: string;
  };
}

export class CheckOutResponseDto {
  success: boolean;
  data: {
    id: string;
    employeeId: string;
    checkOut: Date;
    checkOutLocation: LocationDetailsDto;
    hoursWorked: number;
    status: string;
  };
}

export class AttendanceRecordResponseDto {
  id: string;
  employeeId: string;
  date: Date;
  checkIn: Date | null;
  checkOut: Date | null;
  checkInLatitude: number | null;
  checkInLongitude: number | null;
  checkInLocationName: string | null;
  checkInLocationType: LocationType | null;
  checkOutLatitude: number | null;
  checkOutLongitude: number | null;
  checkOutLocationName: string | null;
  checkOutLocationType: LocationType | null;
  status: string;
  hoursWorked: number | null;
  notes: string | null;
}
