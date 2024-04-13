import { getPluginConf } from "~/models/methods.server";
import type {
  Antragsdaten,
  GetProduktgruppen,
  GetVertragsarten,
  GetZahlungsweisen,
  Method,
} from "../types/methods";
import type { ModulZugangsdatenData } from "../types/pluginConfigurator";

type GetRate = {
  kaufpreis: string;
  prodgrp: string;
  mietsz: string;
  vertragsart: string;
  zahlweise: string;
};
export interface GetMethodsDataRequest {
  method: Method;
  credentials?: ModulZugangsdatenData;
  shop?: string;
  werte?: GetRate;
  antragsdaten?: Antragsdaten;
  antragnr?: number;
}

export const getRequestTemplate = (template: GetMethodsDataRequest) => {
  const params = Object.entries(template).reduce(
    (acc, [key, value]) => {
      if (value !== undefined && key !== "method") {
        acc[key] = value;
      }
      return acc;
    },
    {} as { [key: string]: unknown },
  );

  console.log("params", params);
  return {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: template.method,
      params,
      id: 1,
    }),
  };
};

export const getAlbisMethodsData = async ({
  method,
  antragnr,
  antragsdaten,
  credentials,
  shop,
  werte,
}: GetMethodsDataRequest) => {
  const pluginConfData = !credentials && shop && (await getPluginConf(shop));
  const requestCredentials =
    pluginConfData && pluginConfData.ModulZugangsdaten
      ? {
          apiLink: pluginConfData.ModulZugangsdaten.apiLink,
          benutzer: pluginConfData.ModulZugangsdaten.benutzer,
          passwort: pluginConfData.ModulZugangsdaten.passwort,
        }
      : credentials;

  if (!requestCredentials) throw new Error(`Invalid credentials`);

  const methodsPromise = await fetch(
    requestCredentials.apiLink,
    getRequestTemplate({
      method,
      credentials: requestCredentials,
      werte,
      antragsdaten,
      antragnr,
    }),
  );

  if (!methodsPromise.ok) {
    throw new Error(
      `HTTP error! status: ${methodsPromise.status} for method: ${method}`,
    );
  }
  const methodsData = await methodsPromise.json();
  return methodsData;
};

export const getAllMethodData = async (credentials: ModulZugangsdatenData) => {
  const [zahlungsweisen, produktgruppen, vertragsarten]: [
    GetZahlungsweisen,
    GetProduktgruppen,
    GetVertragsarten,
  ] = await Promise.all([
    getAlbisMethodsData({ method: "getZahlungsweisen", credentials }),
    getAlbisMethodsData({ method: "getProduktgruppen", credentials }),
    getAlbisMethodsData({ method: "getVertragsarten", credentials }),
  ]);

  return { zahlungsweisen, produktgruppen, vertragsarten };
};

// const getMethodsData = async (
//   method: string,
//   credentials: ModulZugangsdatenData,
// ) => {
//   try {
//     const requestBody = { method, credentials };
//     const response = await fetch(`${baseServerUrl}/api/getMethodsData`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(requestBody),
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error! Status: ${response.status}`);
//     }
//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error("Error fetching method data:", error);
//     return null;
//   }
// };

// export const getAllMethodData = async (credentials: ModulZugangsdatenData) => {
//   const [zahlungsweisen, produktgruppen, vertragsarten]: [
//     GetZahlungsweisen,
//     GetProduktgruppen,
//     GetVertragsarten,
//   ] = await Promise.all([
//     getMethodsData("getZahlungsweisen", credentials),
//     getMethodsData("getProduktgruppen", credentials),
//     getMethodsData("getVertragsarten", credentials),
//   ]);

//   return { zahlungsweisen, produktgruppen, vertragsarten };
// };