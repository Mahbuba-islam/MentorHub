import {
  index_default,
  prisma
} from "./chunk-7BKPH2BP.js";

// src/server.ts
var PORT = process.env.PORT || 5e3;
async function main() {
  try {
    await prisma.$connect();
    console.log("connected to database");
    const PORT2 = Number(process.env.PORT) || 5e3;
    index_default.listen(PORT2, "0.0.0.0", () => {
      console.log(`server is running on port ${PORT2}`);
    });
  } catch (err) {
    console.log(err);
    await prisma.$disconnect();
    process.exit(1);
  }
}
main();
