import tf from "@tensorflow/tfjs-node";

const crimeData = [
  {
    date: "2024-01-01",
    latitude: 23.8103,
    longitude: 90.4125,
    crimeDensity: 5,
  },
  { date: "2024-01-02", latitude: 23.8105, longitude: 90.415, crimeDensity: 7 },
  { date: "2024-01-03", latitude: 23.812, longitude: 90.42, crimeDensity: 4 },
  { date: "2024-01-04", latitude: 23.8135, longitude: 90.425, crimeDensity: 8 },
  { date: "2024-01-05", latitude: 23.815, longitude: 90.43, crimeDensity: 6 },
  { date: "2024-01-06", latitude: 23.818, longitude: 90.435, crimeDensity: 9 },
  { date: "2024-01-07", latitude: 23.8205, longitude: 90.44, crimeDensity: 7 },
  { date: "2024-01-08", latitude: 23.822, longitude: 90.445, crimeDensity: 10 },
  { date: "2024-01-09", latitude: 23.8235, longitude: 90.45, crimeDensity: 12 },
  { date: "2024-01-10", latitude: 23.825, longitude: 90.455, crimeDensity: 15 },
  { date: "2024-01-11", latitude: 23.8265, longitude: 90.46, crimeDensity: 11 },
  { date: "2024-01-12", latitude: 23.828, longitude: 90.465, crimeDensity: 13 },
  { date: "2024-01-13", latitude: 23.8305, longitude: 90.47, crimeDensity: 14 },
  { date: "2024-01-14", latitude: 23.832, longitude: 90.475, crimeDensity: 10 },
  { date: "2024-01-15", latitude: 23.835, longitude: 90.48, crimeDensity: 17 },
  {
    date: "2024-01-16",
    latitude: 23.8375,
    longitude: 90.485,
    crimeDensity: 18,
  },
  { date: "2024-01-17", latitude: 23.84, longitude: 90.49, crimeDensity: 16 },
  {
    date: "2024-01-18",
    latitude: 23.8425,
    longitude: 90.495,
    crimeDensity: 19,
  },
  { date: "2024-01-19", latitude: 23.845, longitude: 90.5, crimeDensity: 20 },
  { date: "2024-01-20", latitude: 23.848, longitude: 90.505, crimeDensity: 21 },
];

export async function trainCrimeModel(data) {
  const timeSeries = data.map((_, i) => [i]);
  const crimeDensity = data.map((d) => d.crimeDensity);

  const model = tf.sequential();
  model.add(
    tf.layers.dense({ inputShape: [1], units: 16, activation: "relu" })
  );
  model.add(tf.layers.dense({ units: 1 }));

  model.compile({ optimizer: "adam", loss: "meanSquaredError" });

  const xs = tf.tensor2d(timeSeries);
  const ys = tf.tensor2d(crimeDensity, [crimeDensity.length, 1]);

  await model.fit(xs, ys, { epochs: 100 });

  return model;
}

export const predictNextWeekCrimes = async () => {
  const model = await trainCrimeModel(crimeData);

  const futureDays = [...Array(7).keys()].map((i) => [crimeData.length + i]);
  const futurePredictions = model.predict(tf.tensor2d(futureDays)).dataSync();

  return crimeData.slice(-7).map((crime, index) => ({
    date: `2024-02-${index + 21}`,
    latitude: crime.latitude + 0.0005,
    longitude: crime.longitude + 0.0005,
    predictedCrimeDensity: Math.max(0, futurePredictions[index].toFixed(2)),
  }));
};
