export type Coordinates = {
  latitude: number;
  longitude: number;
};

export async function getAttendanceCoordinates(): Promise<Coordinates> {
  if (globalThis.window === undefined || !navigator.geolocation) {
    throw new Error("Geolocation is not supported in this browser.");
  }

  return new Promise<Coordinates>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      () => reject(new Error("Location access is required for attendance sign-in/sign-out.")),
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  });
}
