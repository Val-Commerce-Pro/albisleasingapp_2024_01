import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { useActionData, useLoaderData, useSubmit } from "@remix-run/react";

// import db from "../db.server";
import { authenticate } from "../shopify.server";

import type { ChangeEvent } from "react";
import { useState } from "react";
// import type { PluginConfiguratorMockData } from "~/mockData/pluginConfiguratorMockData";
import { getPluginConf } from "~/models/methods.server";
import { updateOrCreateModulAktiv } from "~/models/modulAktiv.server";
import { Divider } from "./components/divider";
import { ModulAktiv } from "./components/modulAktiv";
import { ModulEinstellungen } from "./components/modulEinstellungen";
import { Zagangsdaten } from "./components/zagangsdaten";
import styles from "./styles/appStyles.module.css";
import { getAllMethodData } from "./utils/getMethodsData";

export const action: ActionFunction = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const formData = await request.formData();
  const { _action, ...values } = Object.fromEntries(formData);

  switch (_action) {
    case "modulAktiv":
      const isModulAktiv: boolean = values["isAppActive"] === "true";
      console.log("isModulAktiv:", isModulAktiv);

      const modulAktivData = await updateOrCreateModulAktiv({
        shop: session.shop,
        isModulAktiv,
      });
      console.log("modulAktivData RESPONSE", modulAktivData);
      return modulAktivData ?? false;

    case "zagangsdaten":
      console.log("zagangsdaten _action, values - ", _action, values);

      const { zahlungsweisen, produktgruppen, vertragsarten } =
        await getAllMethodData();

      return {
        zahlungsweisen,
        produktgruppen,
        vertragsarten,
        isCredentialsValid: zahlungsweisen && produktgruppen && vertragsarten,
      };
    case "einstellungen":
      console.log("einstellungen _action, values - ", _action, values);
      return "Einstellungen No Action";
    default:
      return "No Action";
  }
};

// type LoaderResponse = {
//   pluginConfData: PluginConfiguratorMockData | string;
// };

export const loader: LoaderFunction = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const pluginConfData = await getPluginConf(session.shop);
  // console.log("pluginConfData", pluginConfData);
  // console.log("Loader function renders");
  // const { zahlungsweisen, produktgruppen, vertragsarten } =
  //   await getAllMethodData();

  return pluginConfData;
  // return {
  //   pluginConfData,
  // };
};

export default function Index() {
  const loaderData = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  console.log("actionData", actionData);
  console.log("loaderData", loaderData);
  // console.log("loaderData", loaderData);
  const submit = useSubmit();

  const [isAppActive, setIsAppActive] = useState(false);

  const handleModulAktivChange = (e: ChangeEvent<HTMLInputElement>): void => {
    console.log("handleModulAktivChange renders");

    setIsAppActive(e.target.checked);

    const data = {
      isAppActive: e.target.checked,
      _action: "modulAktiv",
    };
    console.log("handleModulAktivChange submitted data", data);
    submit(data, { method: "POST" });
    //send data to action and save it into the database
  };
  // console.log("isAppActive", isAppActive);

  // const { zahlungsweisen, produktgruppen, vertragsarten } = loaderData;

  // console.log("getVertragsarten", vertragsarten);
  // console.log("getZahlungsweisen", zahlungsweisen);
  // console.log("getProduktgruppen", produktgruppen);

  // function handleSave() {
  // setSavingCofig(true);
  // if (id === undefined) {
  //   console.error("could not load ID from server, cant submit without ID");
  // } else {
  //   const data = {
  //     id,
  //     shop: shop ?? "",
  //     ...appConfig,
  //   };
  //   submit(data, { method: "post" });
  // }
  // setSavingCofig(false);
  // }

  return (
    <div className={styles.container}>
      <div className={styles.formTitle}>
        <h1>Albis Leasing</h1>
        <p>Konfiguration</p>
      </div>
      <Divider type="main" />
      <ModulAktiv
        handleOnChange={handleModulAktivChange}
        checkboxValue={isAppActive}
      />
      {isAppActive && (
        <>
          <Zagangsdaten />
          <ModulEinstellungen />
        </>
      )}
    </div>
  );
}
