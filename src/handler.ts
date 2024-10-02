import {XMLParser} from "fast-xml-parser";
import {open} from "sqlite";
import sqlite3 from "sqlite3";
import {Record,

    Snapshot} from "./models.ts";

export class UploadHandler {
    async process(data: string) {
        const db = await open({        filename: 'db.sqlite',  driver: sqlite3.Database    })

        if (data.length > 10000000) {        throw new Error('Payload size exceeds 1 MB')    }

        const {payload} = new XMLParser()
            .parse(data);

        const snapshot = new Snapshot(payload.hotelName, payload.data.map((r: any) => new Record(r.sequence, r.totalRooms, r.soldRooms, r.revenue)))

        let maxSequence = -Infinity
        for (let r of snapshot.records) {
            if (r.sequence > maxSequence) {  maxSequence = r.sequence  }
        }

        if (maxSequence > 365)

        {
            throw new Error('Invalid payload. Sequences are more than 365 sequences') }

        if (maxSequence < 365)
        {
            throw new Error('Invalid payload. Sequences are less than 365 sequences')
        }

        if (maxSequence === 365) {
            for (let r of snapshot.records) {
                await db.run(`INSERT INTO hotel_snapshots (hotel_name, sequence, total_rooms, sold_rooms, revenue)
                          VALUES (:hotelName, 
                                  :sequence, :totalRooms, :soldRooms,
                                  :revenue)
            `, {
                    ':hotelName': snapshot.hotelName,
                    ':sequence': r.sequence,':totalRooms': r.totalRooms,':soldRooms': r.soldRooms,':revenue': r.revenue
                })
            }
        }
    }
}
