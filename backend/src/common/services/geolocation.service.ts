import { Injectable, Logger } from '@nestjs/common';

export interface LocationDetails {
  address: string;
  locationType: 'IN_OFFICE' | 'NEARBY' | 'ELSEWHERE';
}

export interface OfficeLocationInfo {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  radiusMeters: number;
}

@Injectable()
export class GeolocationService {
  private readonly logger = new Logger(GeolocationService.name);

  /**
   * Calculate distance between two coordinates using Haversine formula
   * Returns distance in meters
   */
  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const R = 6371000; // Earth's radius in meters
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * Reverse geocode lat/long to address (basic implementation)
   * For production, integrate with Google Maps API, OpenStreetMap, etc.
   */
  async reverseGeocode(latitude: number, longitude: number): Promise<string> {
    try {
      // PLACEHOLDER: Replace with actual reverse geocoding API
      // For now, return coordinates as string
      // Example integration with Google Maps:
      // const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.GOOGLE_MAPS_API_KEY}`;
      // const response = await fetch(url);
      // const data = await response.json();
      // return data.results[0]?.formatted_address || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;

      return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
    } catch (error) {
      this.logger.error('Reverse geocoding failed:', error);
      return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
    }
  }

  /**
   * Determine location type based on distance from offices
   * Priority: IN_OFFICE > NEARBY > ELSEWHERE
   */
  determineLocationType(
    employeeLatitude: number,
    employeeLongitude: number,
    officeLocations: OfficeLocationInfo[],
  ): { locationType: 'IN_OFFICE' | 'NEARBY' | 'ELSEWHERE'; officeInfo?: OfficeLocationInfo } {
    if (!officeLocations || officeLocations.length === 0) {
      return { locationType: 'ELSEWHERE' };
    }

    // Define proximity zones
    const NEARBY_MULTIPLIER = 2; // 2x the office radius is "nearby"

    let closestOffice: OfficeLocationInfo | null = null;
    let minDistance = Infinity;
    let locationType: 'IN_OFFICE' | 'NEARBY' | 'ELSEWHERE' = 'ELSEWHERE';

    for (const office of officeLocations) {
      const distance = this.calculateDistance(
        employeeLatitude,
        employeeLongitude,
        office.latitude,
        office.longitude,
      );

      if (distance < minDistance) {
        minDistance = distance;
        closestOffice = office;

        if (distance <= office.radiusMeters) {
          locationType = 'IN_OFFICE';
        } else if (distance <= office.radiusMeters * NEARBY_MULTIPLIER) {
          locationType = 'NEARBY';
        } else {
          locationType = 'ELSEWHERE';
        }
      }
    }

    return {
      locationType,
      officeInfo: closestOffice || undefined,
    };
  }

  /**
   * Get detailed location information
   * Combines reverse geocoding, distance calculation, and location type determination
   */
  async getDetailedLocation(
    latitude: number,
    longitude: number,
    officeLocations: OfficeLocationInfo[],
  ): Promise<LocationDetails> {
    const [address, { locationType }] = await Promise.all([
      this.reverseGeocode(latitude, longitude),
      Promise.resolve(
        this.determineLocationType(latitude, longitude, officeLocations),
      ),
    ]);

    return {
      address,
      locationType,
    };
  }
}
