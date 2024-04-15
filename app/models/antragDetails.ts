import db from "../db.server";
import type { AntragDetailsData } from "./types";

export async function createAntragDetails(antragData: AntragDetailsData) {
  try {
    const antragDetailsData = await db.antragDetails.create({
      data: { ...antragData },
    });
    console.log("antragDetailsData", antragDetailsData);
    return antragDetailsData;
  } catch (error) {
    console.error("create AntragDetails failed", error);
    return null;
  }
}

// export async function getAntragDetails(antragnr: number) {
//   const pluginConfData = await db.antragDetails.findUnique({
//     where: { antragnr },
//   });

//   return { ...pluginConfData };
// }
