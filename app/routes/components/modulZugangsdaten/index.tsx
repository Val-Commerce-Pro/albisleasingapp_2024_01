import { Form, useSubmit } from "@remix-run/react";
import { useState } from "react";
import type { ModulZugangsdatenData } from "~/routes/types/pluginConfigurator";
import { checkFormValues } from "~/routes/utils/checkFormValues";
import { Divider } from "../divider";
import { TextField } from "../textfield";
import styles from "./styles.module.css";

type ModulZugangsdatenProps = {
  initialValues: ModulZugangsdatenData;
  isCredentialsValid: boolean;
};

export const ModulZugangsdaten = ({
  initialValues,
  isCredentialsValid,
}: ModulZugangsdatenProps) => {
  console.log("Modul Zugangsdaten render");
  console.log("initial values:", initialValues);
  console.log("isCredentialsValid:", isCredentialsValid);
  const submit = useSubmit();
  const [credentials, setCredentials] =
    useState<ModulZugangsdatenData>(initialValues);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  }

  function handleSave() {
    if (checkFormValues(credentials)) {
      submit({ ...credentials, _action: "zugangsdaten" }, { method: "POST" });
    }
  }
  return (
    <div className={`sectionContainer`}>
      <Divider title="Zugangsdaten" type="section" />
      <Form title="Zugangsdaten" method="POST" className={styles.formContainer}>
        <TextField
          name="apiLink"
          label="Albis API Link:"
          type="text"
          handleOnChange={handleChange}
          handleOnBlur={handleSave}
          textFieldValue={credentials.apiLink}
          required
        />
        <TextField
          name="benutzer"
          label="Benutzer:"
          type="text"
          handleOnChange={handleChange}
          handleOnBlur={handleSave}
          textFieldValue={credentials.benutzer}
          required
        />
        <TextField
          name="passwort"
          label="Passwort:"
          type="password"
          handleOnChange={handleChange}
          handleOnBlur={handleSave}
          textFieldValue={credentials.passwort}
          required
        />
      </Form>

      <div className={styles.flagContainer}>
        <div
          className={styles.flag}
          style={{
            backgroundColor: isCredentialsValid ? "#73ce8880" : "#f94d4d80",
          }}
        >
          {`Credentials ${isCredentialsValid ? "Success" : "Error"}`}
        </div>
      </div>
    </div>
  );
};
