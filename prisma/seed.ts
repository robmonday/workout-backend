import db from "../src/modules/db";

async function main() {
  console.log("deleting all info from database...");
  await db.badge.deleteMany({});
  await db.notification.deleteMany({});
  await db.workout.deleteMany({});

  await db.workoutType.deleteMany({});
  await db.user.deleteMany({});

  const workoutTypeNames = ["Run", "Walk", "Swim", "Other"];
  const workoutTypeArr = await Promise.all(
    workoutTypeNames.map(async (name) => {
      console.log("creating workout type: ", name);
      return await db.workoutType.create({ data: { name, sortOrder: 100 } });
    })
  );

  const rob = await db.user.upsert({
    where: { email: "rob.monday@outlook.com" },
    update: {},
    create: {
      email: "rob.monday@outlook.com",
      firstName: "Rob A",
      lastName: "Monday",
      password: "$2b$05$Vbs7Ctwa9xzFfo36MGxsTuPhjy7XgCHwBZ//yf5tv1GsbbWOE7CrO",
      Badges: {
        create: {
          type: "Dev Mastermind",
          notes: "Created when database was seeded",
        },
      },
      Notifications: {
        create: {
          message: `Database was seeded on ${Date()}.`,
          buttonUrl: "/deleteseed",
          dismissable: true,
        },
      },
    },
  });
  console.log("created a user: ", { rob });

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
          workoutTypeArr[Math.floor(Math.random() * workoutTypeArr.length)].id,
        userId: rob.id,
      };
    }),
  });

  console.log("Workouts created", workouts);
}
main()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });
