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

  const userSeedStarter = [
    {
      firstName: "Aaron",
      lastName: "Rodgers",
      city: "Chico",
    },
    {
      firstName: "Adrian",
      lastName: "Gonzalez",
      city: "San Diego",
    },
    {
      firstName: "Barry",
      lastName: "Zito",
      city: "Las Vegas Valley",
    },
    {
      firstName: "Blake",
      lastName: "Griffin",
      city: "Oklahoma City",
    },
    {
      firstName: "Branden",
      lastName: "Albert",
      city: "Rochester",
    },
    {
      firstName: "Carmelo",
      lastName: "Anthony",
      city: "New York City",
    },
    {
      firstName: "Chris",
      lastName: "Paul",
      city: "Forsyth County",
    },
    {
      firstName: "Chris",
      lastName: "Bosh",
      city: "Dallas",
    },
    {
      firstName: "Cole",
      lastName: "Hamels",
      city: "San Diego",
    },
    {
      firstName: "Darrelle",
      lastName: "Revis",
      city: "Aliquippa",
    },
    {
      firstName: "Derrick",
      lastName: "Rose",
      city: "Chicago",
    },
    {
      firstName: "Dwight",
      lastName: "Howard",
      city: "Atlanta",
    },
    {
      firstName: "Dwyane",
      lastName: "Wade",
      city: "Chicago",
    },
    {
      firstName: "Eli",
      lastName: "Manning",
      city: "New Orleans",
    },
    {
      firstName: "Floyd",
      lastName: "Mayweather",
      city: "Grand Rapids",
    },
    {
      firstName: "Geno",
      lastName: "Atkins",
      city: "Pembroke Pines",
    },
    {
      firstName: "Jairus",
      lastName: "Byrd",
      city: "San Diego",
    },
    {
      firstName: "Jason",
      lastName: "Peters",
      city: "Queen City",
    },
    {
      firstName: "Jeff",
      lastName: "Gordon",
      city: "Vallejo",
    },
    {
      firstName: "Jimmie",
      lastName: "Johnson",
      city: "El Cajon",
    },
    {
      firstName: "Matthew",
      lastName: "Stafford",
      city: "Tampa",
    },
    {
      firstName: "Joe",
      lastName: "Haden",
      city: "Fort Washington",
    },
    {
      firstName: "Julius",
      lastName: "Peppers",
      city: "Wilson",
    },
    {
      firstName: "Matt",
      lastName: "Ryan",
      city: "Exton",
    },
    {
      firstName: "Phil",
      lastName: "Mickelson",
      city: "San Diego",
    },
    {
      firstName: "Dale",
      lastName: "Earnhardt",
      city: "Kannapolis",
    },
    {
      firstName: "Serena",
      lastName: "Williams",
      city: "Saginaw",
    },
    {
      firstName: "Terrell",
      lastName: "Suggs",
      city: "Minneapolis",
    },
  ];

  const userSeed: any[] = [];
  userSeedStarter.map((i) => {
    const updatedObject = {
      ...i,
      email: `email${Math.floor(Math.random() * 100000)}@yahoo.com`,
      state: "TX",
      password: "Abc123!",
      seed: true,
    };
    userSeed.push(updatedObject);
  });

  await db.user.deleteMany({ where: { seed: true } });

  const users = await db.user.createMany({
    data: userSeed,
  });

  console.log("users created", users);
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
