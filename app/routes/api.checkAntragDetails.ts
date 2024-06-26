import type { AntragDetails } from "@prisma/client";
import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { updateAntragDetails } from "~/models/antragDetails";
import { getShopifyOrders } from "~/models/createDbShopifyOrder";
import { addNoteToOrder } from "./shopify/graphql/addNoteToOrder";
import { cancelOrder } from "./shopify/graphql/orderCancel";
import { orderMarkAsPaid } from "./shopify/graphql/orderMarkAsPaid";
import type { GetAntragDetails, JsonRpcErrorResponse } from "./types/methods";
import { isJsonRpcErrorResponse } from "./utils/formatData";
import { getAlbisMethodsData } from "./utils/getAlbisMethodsData";
import { checkAntragStatus, getCurrentFormattedTime } from "./utils/helpers";

type CheckAntrageDetailsBody = {
  shop: string;
  antragnrData: AntragDetails;
};

export const action: ActionFunction = async ({ request }) => {
  const data = await request.json();
  const { shop, antragnrData }: CheckAntrageDetailsBody = data;
  console.log("CheckAntragDetails route called", data);
  try {
    const newAntragDetails: GetAntragDetails | JsonRpcErrorResponse =
      await getAlbisMethodsData({
        method: "getAntragDetails",
        shop,
        antragnr: antragnrData.antragnr,
      });

    if (isJsonRpcErrorResponse(newAntragDetails)) {
      console.error("RPC Error AntragDetails:", newAntragDetails);
      return json(newAntragDetails, {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      });
    }
    const shopifyOrders = await getShopifyOrders(antragnrData.antragnr);
    if (!shopifyOrders) {
      return new Response("Error processing shopify Orders Data", {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      });
    }
    const { result } = newAntragDetails;
    const statusData = checkAntragStatus(result.status, result.status_txt);
    const checkDates = antragnrData.lastCheckAt
      ? JSON.parse(antragnrData.lastCheckAt)
      : "";
    console.log("checkDates", checkDates);
    const newLastCheckAt = [...checkDates, getCurrentFormattedTime()];
    console.log("newLastCheckAt", newLastCheckAt);
    if (!statusData.isStatusFinish) {
      await updateAntragDetails({
        antragnr: result.antragnr,
        lastCheckAt: JSON.stringify(newLastCheckAt),
      });
      await addNoteToOrder(shop, shopifyOrders.orderId, statusData.statusNote);
      return json(
        {
          antragnr: result.antragnr,
          complete: false,
          currentStatus: result.status,
        },
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        },
      );
    }

    const updatedAntragData = await updateAntragDetails({
      antragnr: result.antragnr,
      complete: true,
      eingegangen: result.eingegangen,
      gf_name: result.gf_name,
      gf_vname: result.gf_vname,
      kaufpreis: result.kaufpreis,
      ln_email: result.ln_email,
      ln_mobil: result.ln_mobil,
      ln_name: result.ln_name,
      ln_telefon: result.ln_telefon,
      status: result.status,
      status_txt: result.status_txt,
      lastCheckAt: JSON.stringify([...checkDates, getCurrentFormattedTime()]),
    });
    if (!updatedAntragData) {
      return new Response("Error processing updated Antrag Data", {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      });
    }
    console.log("newNote", statusData.statusNote);
    await addNoteToOrder(shop, shopifyOrders.orderId, statusData.statusNote);

    switch (statusData.action) {
      case "Cancel":
        const cancellingOrder = await cancelOrder(shop, shopifyOrders.orderId, {
          notifyCustomer: true,
          reason: "OTHER",
          refund: false,
          restock: true,
        });
        console.log("cancelledOrder", cancellingOrder);
        break;
      case "Paid":
        const paidOrder = await orderMarkAsPaid(shop, shopifyOrders.orderId);
        console.log("orderMarkAsPaid", paidOrder);
        break;
      case "Refund":
        const refundedOrder = await cancelOrder(shop, shopifyOrders.orderId, {
          notifyCustomer: true,
          reason: "OTHER",
          refund: true,
          restock: true,
        });
        console.log("refundedOrder", refundedOrder);
        break;

      default:
        console.log("No Action found");
        break;
    }
    console.log("CheckAntragDetails Final func");
    return json(
      {
        antragnr: result.antragnr,
        complete: true,
        currentStatus: result.status,
      },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      },
    );
  } catch (error) {
    console.error("Error while processing AntragDetails", error);
    return new Response("Error processing requests", {
      status: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
};
