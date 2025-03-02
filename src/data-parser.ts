import { XMLParser } from "fast-xml-parser";
import { Record, Snapshot, SourceFormat } from "./models.ts";

export class DataParser {
  parse(data: string) {
    if (data.length === 0) {
      throw new Error("Payload is empty");
    }

    const firstChar = data[0];

    const contentType = this.getContentType(firstChar);

    switch (contentType) {
      case SourceFormat.XML: {
        return this.mapXmlToSnapshot(data);
      }
      case SourceFormat.JSON: {
        return this.mapJsonToSnapshot(data);
      }

      default:
        throw new Error(
          "Invalid payload. Only XML and JSON payloads are supported"
        );
    }
  }

  mapXmlToSnapshot(data: string) {
    try {
      const { payload } = new XMLParser().parse(data);
      const snapshot = new Snapshot(
        payload.hotelName,
        payload.data.map(
          (r: any) =>
            new Record(r.sequence, r.totalRooms, r.soldRooms, r.revenue)
        ),
        SourceFormat.XML
      );
      return snapshot;
    } catch (e) {
      throw new Error("Invalid payload. Failed to parse XML.");
    }
  }

  mapJsonToSnapshot(data: string) {
    try {
      const payload = JSON.parse(data);

      const recrods = [];

      // we need to get the total rooms from the first day
      const totalRooms = this.getTotalRoom(payload.days);

      // we need to check if the days are missing in the payload
      for (let i = 0, d = 1; d <= 365; i++, d++) {
        if (payload.days[i] == undefined || payload.days[i].day_number != d) {
          // if the day is missing, we need to add a new record with 0 values
          recrods.push(new Record(d, totalRooms, 0, 0));

          // if the day is missing, we need to decrement the counter to check the same day again
          i -= 1;
        } else {
          // if the day is not missing, we need to add the record with the values from the payload
          recrods.push(
            new Record(
              payload.days[i].day_number,
              payload.days[i].available_rooms,
              payload.days[i].reserved_rooms,
              payload.days[i].day_revenue
            )
          );
        }
      }
      const snapshot = new Snapshot(
        payload.property,
        recrods,
        SourceFormat.JSON
      );

      return snapshot;
    } catch (e) {
      throw new Error("Invalid payload. Failed to parse JSON.");
    }
  }

  getTotalRoom(snapshop: any[]) {
    return snapshop[0].available_rooms;
  }

  getContentType(firstChar: string) {
    switch (firstChar) {
      case "<":
        return SourceFormat.XML;
      case "{":
        return SourceFormat.JSON;
    }
  }
}
