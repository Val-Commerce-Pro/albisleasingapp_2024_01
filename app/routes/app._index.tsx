import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { useActionData, useLoaderData, useSubmit } from "@remix-run/react";

// import db from "../db.server";
import { authenticate } from "../shopify.server";

import type { ChangeEvent } from "react";
import { useState } from "react";
import { getOrCreatePluginConfiguration } from "~/models/methods.server";
import { getOrCreateModulAktiv } from "~/models/modulAktiv.server";
import { Divider } from "./components/divider";
import { ModulAktiv } from "./components/modulAktiv";
import { ModulEinstellungen } from "./components/modulEinstellungen";
import { Zagangsdaten, actionZagangsdaten } from "./components/zagangsdaten";
import styles from "./styles/appStyles.module.css";

export const action: ActionFunction = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const formData = await request.formData();
  const { _action, ...values } = Object.fromEntries(formData);
  console.log("action", _action);
  console.log("values", values);

  switch (_action) {
    case "zagangsdaten":
      const { zahlungsweisen, produktgruppen, vertragsarten } =
        await actionZagangsdaten();
      console.log("zagangsdaten _action, values - ", _action, values);
      return {
        zahlungsweisen,
        produktgruppen,
        vertragsarten,
      };
    case "einstellungen":
      console.log("einstellungen _action, values - ", _action, values);
      return "Einstellungen No Action";
    case "modulAktiv":
      console.log("modulAktiv _action, values - ", values);
      // const getModulAktivData = async () => {
      //   const modulAktivData = await getOrCreateModulAktiv({
      //     shop: session.shop,
      //   });
      //   return;
      // };
      return "modulAktiv No Action";
    default:
      return "No Action";
  }
};

export const loader: LoaderFunction = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const pluginConfData = await getOrCreatePluginConfiguration(session.shop);
  console.log("pluginConfData", pluginConfData);

  //Check if the credentials exists into the database, if yes, call actionZagangsdaten
  //   return {
  //     vertragsarten,
  //     zahlungsweisen,
  //     produktgruppen,
  //   };
  return null;
};

export default function Index() {
  //data should come from the database
  const savedCheckboxValue = true;

  // const [savingConfig, setSavingCofig] = useState(false);
  // const [accessData, setAccessData] = useState<AccessData>({
  //   apiLink: "",
  //   userName: "",
  //   password: "",
  //   _action: "",
  // });
  const loaderData = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  console.log("actionData", actionData);
  console.log("loaderData", loaderData);
  // console.log("loaderData", loaderData);
  const submit = useSubmit();

  const [isAppActive, setIsAppActive] = useState(savedCheckboxValue ?? false);

  const handleModulAktivChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setIsAppActive((prev) => !prev);
    const data = {
      isAppActive,
      formAction: "modulAktiv",
    };
    submit(data, { method: "POST" });
    //send data to action and save it into the database
  };
  console.log("isAppActive", isAppActive);

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
