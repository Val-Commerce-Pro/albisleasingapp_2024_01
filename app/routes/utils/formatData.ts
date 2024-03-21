import type { OptionsMethodData } from "../components/select";
import type {
  ResultProduktgruppen,
  ResultVertragsarten,
  ResultZahlungsweisen,
} from "../types/methods";

type FormatData = {
  [k: string]: FormDataEntryValue;
};

export const formatData = (
  values: FormatData,
  hasBoolean: boolean = false,
): {
  [key: string]: string | boolean;
} => {
  const booleanKeys = [
    "restwertInBeiTAVertrag",
    "auswahlZahlungsweiseAnzeigen",
    "objektVersicherung",
    "auswahlObjektVersicherungAnzeigen",
    "eingabeSonderzahlungErmoglichen",
    "pInfoseiteZeigeAlle",
    "antragOhneArtikelMoglich",
    "kundeKannFinanzierungsbetragAndern",
  ];
  const castedValues = Object.entries(values).reduce(
    (acc, [key, value]) => {
      if (hasBoolean && booleanKeys.includes(key)) {
        acc[key] = value.toString() === "true";
      } else {
        acc[key] = value.toString();
      }
      return acc;
    },
    {} as { [key: string]: string | boolean },
  );
  return castedValues;
};

export const getOptionsMethodData = (
  methodData:
    | ResultZahlungsweisen[]
    | ResultProduktgruppen[]
    | ResultVertragsarten[],
  bdSelectedOpt?: string,
): OptionsMethodData => {
  const optionsMethodData = methodData.map((item) => ({
    id: item.id.toString(),
    labelValue: item.bezeichnung,
    selected: !!bdSelectedOpt && item.bezeichnung.includes(bdSelectedOpt),
  }));
  return optionsMethodData;
};