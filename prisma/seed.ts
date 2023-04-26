import { User, Workout } from "@prisma/client";
import db from "../src/modules/db";

async function main() {
  console.log("deleting all info from database...");
  await db.badge.deleteMany({});
  await db.notification.deleteMany({});
  await db.reaction.deleteMany({});
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
      city: "Knoxville",
      state: "TN",
      badges: {
        create: {
          type: "Dev Mastermind",
          notes: "Created when database was seeded",
        },
      },
      notifications: {
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

  async function createWorkouts(userId: string) {
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
            workoutTypeArr[Math.floor(Math.random() * workoutTypeArr.length)]
              .id,
          userId,
        };
      }),
    });
    console.log(`Workouts created for user ${userId}`, workouts);
  }

  const userSeedStarter = [
    {
      firstName: "Aaron",
      lastName: "Rodgers",
      city: "Chico",
      state: "CA",
    },
    {
      firstName: "Adrian",
      lastName: "Gonzalez",
      city: "San Diego",
      state: "CA",
    },
    {
      firstName: "Barry",
      lastName: "Zito",
      city: "Las Vegas Valley",
      state: "NV",
    },
    {
      firstName: "Blake",
      lastName: "Griffin",
      city: "Oklahoma City",
      state: "OK",
    },
    {
      firstName: "Branden",
      lastName: "Albert",
      city: "Rochester",
      state: "NY",
    },
    {
      firstName: "Carmelo",
      lastName: "Anthony",
      city: "New York City",
      state: "NY",
    },
    {
      firstName: "Chris",
      lastName: "Paul",
      city: "Forsyth County",
      state: "GA",
    },
    {
      firstName: "Chris",
      lastName: "Bosh",
      city: "Dallas",
      state: "TX",
    },
    {
      firstName: "Cole",
      lastName: "Hamels",
      city: "San Diego",
      state: "TX",
    },
    {
      firstName: "Darrelle",
      lastName: "Revis",
      city: "Aliquippa",
      state: "PA",
    },
    {
      firstName: "Derrick",
      lastName: "Rose",
      city: "Chicago",
      state: "IL",
    },
    {
      firstName: "Dwight",
      lastName: "Howard",
      city: "Atlanta",
      state: "GA",
    },
    {
      firstName: "Dwyane",
      lastName: "Wade",
      city: "Chicago",
      state: "IL",
    },
    {
      firstName: "Eli",
      lastName: "Manning",
      city: "New Orleans",
      state: "LA",
    },
    {
      firstName: "Floyd",
      lastName: "Mayweather",
      city: "Grand Rapids",
      state: "MI",
    },
    {
      firstName: "Geno",
      lastName: "Atkins",
      city: "Pembroke Pines",
      state: "FL",
    },
    {
      firstName: "Jairus",
      lastName: "Byrd",
      city: "San Diego",
      state: "CA",
    },
    {
      firstName: "Jason",
      lastName: "Peters",
      city: "Queen City",
      state: "TX",
    },
    {
      firstName: "Jeff",
      lastName: "Gordon",
      city: "Vallejo",
      state: "CA",
    },
    {
      firstName: "Jimmie",
      lastName: "Johnson",
      city: "El Cajon",
      state: "CA",
    },
    {
      firstName: "Matthew",
      lastName: "Stafford",
      city: "Tampa",
      state: "FL",
    },
    {
      firstName: "Joe",
      lastName: "Haden",
      city: "Fort Washington",
      state: "MD",
    },
    {
      firstName: "Julius",
      lastName: "Peppers",
      city: "Wilson",
      state: "NC",
    },
    {
      firstName: "Matt",
      lastName: "Ryan",
      city: "Exton",
      state: "PA",
    },
    {
      firstName: "Phil",
      lastName: "Mickelson",
      city: "San Diego",
      state: "CA",
    },
    {
      firstName: "Dale",
      lastName: "Earnhardt",
      city: "Kannapolis",
      state: "MD",
    },
    {
      firstName: "Serena",
      lastName: "Williams",
      city: "Saginaw",
      state: "MI",
    },
    {
      firstName: "Terrell",
      lastName: "Suggs",
      city: "Minneapolis",
      state: "MN",
    },
  ];

  const userSeed: any[] = [];
  userSeedStarter.map((i) => {
    const updatedObject = {
      ...i,
      email: `email${Math.floor(Math.random() * 100000)}@yahoo.com`,
      password: "Password@123",
      seed: true,
    };
    userSeed.push(updatedObject);
  });

  await db.user.deleteMany({ where: { seed: true } });

  const userSummary = await db.user.createMany({
    data: userSeed,
  });
  console.log("users created", userSummary);

  const users = await db.user.findMany({});
  users.forEach((u) => createWorkouts(u.id));

  const workouts = await db.workout.findMany({});
  const emojis = ["👍", "😀", "🙄", "😫", "😱"];

  type PossibleCombo = {
    sort: number;
    workoutId: string;
    userId: string;
    emojiSymbol: string;
  };

  const workoutIds = workouts.map((w) => w.id);
  const userIds = users.map((u) => u.id);
  console.log("workoutIds", workoutIds.slice(-10));
  console.log("userIds", userIds.slice(-10));

  async function createReactions(
    workoutIds: string[],
    userIds: string[],
    emojis: string[]
  ) {
    const participationRate = Math.random() * 0.3 + 0.1; // 10% to 40%
    const numReactionsToCreate = Math.round(
      workoutIds.length * userIds.length * participationRate
    );
    console.log(
      `creating reactions for ${userIds.length} users, 
      and ${workoutIds.length} workouts, 
      with a ${Math.round(participationRate * 100)}% participation rate,
      which makes ${numReactionsToCreate} new records`
    );
    let possibleCombosWithSort: PossibleCombo[] = [];
    for (let i = 0; i < workoutIds.length; i++) {
      let workoutId = workoutIds[i];
      for (let j = 0; j < userIds.length; j++) {
        let userId = userIds[j];
        for (let k = 0; k < emojis.length; k++) {
          let emojiSymbol = emojis[k];
          possibleCombosWithSort.push({
            sort: Math.floor(Math.random() * 1000000),
            workoutId,
            userId,
            emojiSymbol,
          });
        }
      }
    }
    possibleCombosWithSort.sort((a, b) => a.sort - b.sort);
    const possibleCombos = possibleCombosWithSort.map((c) => {
      return {
        userId: c.userId,
        workoutId: c.workoutId,
        emojiSymbol: c.emojiSymbol,
      };
    });
    const reactionsToCreate = possibleCombos.slice(0, numReactionsToCreate);
    console.log("possibleCombos array head:", reactionsToCreate.slice(0, 10));
    const reactionsCreatedSummary = await db.reaction.createMany({
      data: reactionsToCreate,
    });
    console.log("reactionsCreatedSummary", reactionsCreatedSummary);
  }
  createReactions(workoutIds, userIds, emojis);

  async function createBadges() {
    const badgesCreatedSummary = await db.badge.createMany({
      data: [
        {
          type: "Fastest Mile Run in Town",
          notes: "Created when database was originally seeded",
          userId: userIds[1],
        },
        {
          type: "Super Cross Trainer",
          notes: "Created when database was originally seeded",
          userId: userIds[2],
        },
        {
          type: "Fastest Mile Run in Town",
          notes: "Created when database was originally seeded",
          userId: userIds[3],
        },
      ],
    });
    console.log("badgesCreatedSummary", badgesCreatedSummary);
  }
  createBadges();
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
