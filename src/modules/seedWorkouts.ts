import db from "./db";

export async function seedWorkouts(userId: string) {
  const notification = await db.notification.create({
    data: {
      message: `For demo purposes, seed data was added to this account on ${Date()}.`,
      dismissable: true,
      buttonUrl: "/deleteseed",
      userId,
    },
  });
  console.log("Notification created", notification);

  const workoutTypes = await db.workoutType.findMany({});

  const numWorkoutsToCreate = 60 * 2;
  const potentialLocations = [
    "Lakeshore Park",
    "Lakeshore Park",
    "Lakeshore Park",
    "National Fitness West",
    "Downtown YMCA",
    "My Neighborhood",
  ];

  const workouts = await db.workout.createMany({
    data: new Array(numWorkoutsToCreate).fill(1).map((_, i) => {
      let startTicks =
        Date.now() - Math.floor(Math.random() * 45 * 24 * 60 * 60 * 1000);
      let endTicks = startTicks + Math.floor(Math.random() * 45 * 60 * 1000);

      return {
        location:
          potentialLocations[
            Math.floor(Math.random() * potentialLocations.length)
          ],
        steps: Math.floor(Math.random() * 1500),
        calories: Math.floor(Math.random() * 1200),
        distance: (Math.random() * 5).toFixed(1),
        start: new Date(startTicks),
        end: new Date(endTicks),
        seed: true,
        workoutTypeId:
          workoutTypes[Math.floor(Math.random() * workoutTypes.length)].id,
        userId,
      };
    }),
  });
  console.log("Workouts created", workouts);
}
// main()
//   .then(async () => {
//     await db.$disconnect();
//   })
//   .catch(async (e) => {
//     console.error(e);
//     await db.$disconnect();
//     process.exit(1);
//   });
