import { open } from "sqlite";
import sqlite3 from "sqlite3";
import { DataParser } from "./data-parser.ts";

export class UploadHandler {
  async process(data: string) {
    try {
      if (data.length > 1000000) {
        throw new Error("Payload size exceeds 1 MB");
      }

      const snapshot = new DataParser().parse(data);

      let maxSequence = -Infinity;
      for (let r of snapshot.records) {
        if (r.sequence > maxSequence) {
          maxSequence = r.sequence;
        }
      }

      if (maxSequence > 365) {
        throw new Error(
          "Invalid payload. Sequences are more than 365 sequences"
        );
      }

      if (maxSequence < 365) {
        throw new Error(
          "Invalid payload. Sequences are less than 365 sequences"
        );
      }

      if (maxSequence === 365) {
        const db = await open({
          filename: "db.sqlite",
          driver: sqlite3.Database,
        });

        for (let r of snapshot.records) {
          await db.run(
            `INSERT INTO hotel_snapshots (hotel_name, sequence, total_rooms, sold_rooms, revenue, soruce_format)
                          VALUES (:hotelName, 
                                  :sequence, :totalRooms, :soldRooms,
                                  :revenue, :soruce_format)
            `,
            {
              ":hotelName": snapshot.hotelName,
              ":sequence": r.sequence,
              ":totalRooms": r.totalRooms,
              ":soldRooms": r.soldRooms,
              ":revenue": r.revenue,
              ":soruce_format": snapshot.soruceFormat,
            }
          );
        }
      }
    } catch (e) {
      throw e;
    }
  }
}
