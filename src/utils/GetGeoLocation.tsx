
export const GetGeoLoactions = () => {
  return new Promise((resolve, reject) => {
    resolve({ latitude: "30.7333", longitude: "76.7794" });
    // Check if the browser supports Geolocation API
    // if (navigator.geolocation) {
    //   // Get the current location

    //   navigator.geolocation.getCurrentPosition(
    //     (position) => {
    //       const { latitude, longitude } = position.coords;
    //       resolve({ latitude, longitude });
    //     },
    //     (error) => {
    //       reject(error.message);
    //     }
    //   );
    // } else {
    //   reject('Geolocation is not supported by your browser');
    // }
  });
}

