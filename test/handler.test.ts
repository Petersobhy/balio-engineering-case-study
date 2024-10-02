import {describe, it, beforeEach} from "node:test";
import assert from "node:assert";
import {readFileSync} from "node:fs";
import {UploadHandler} from "../src/handler.ts";
import {open} from "sqlite";
import sqlite3 from "sqlite3";
import {Record, Snapshot} from "../src/models.ts";
import {expectedCleanResult} from "./fixtures/clean.expected.ts";

function mapToSnapshot(rows: any[]) {
    const hotelName = rows[0].hotel_name;
    return new Snapshot(hotelName, rows.map(r => new Record(r.sequence, r.total_rooms, r.sold_rooms, r.revenue)))
}
describe("handler", async () => {
    const db = await open({
        filename: 'db.sqlite',
        driver: sqlite3.Database
    })
    beforeEach(async () => {
        await db.exec(`
            DELETE FROM hotel_snapshots;
            DELETE FROM sqlite_sequence WHERE name='hotel_snapshots';
        `)
    })
    it("Rejects the payload if it has more than 365 sequences", async () => {
        const payload = readFileSync(`${process.cwd()}/samples/extra-day.xml`, 'utf-8')

        await assert.rejects(() => new UploadHandler().process(payload), new Error("Invalid payload. Sequences are more than 365 sequences"));
    })
    it("Stores the snapshot when all validations pass", async () => {
        const payload = readFileSync(`${process.cwd()}/samples/clean.xml`, 'utf-8')
        await new UploadHandler().process(payload);

        const saved = await db.all(`SELECT * FROM hotel_snapshots WHERE hotel_name = 'Hotel CleanX'`)

        await assert.deepEqual(mapToSnapshot(saved), expectedCleanResult);
    })
    it("Rejects the payload if it's more than 1mb in size", async () => {
        const payload = readFileSync(`${process.cwd()}/samples/over-size-limit.xml`, 'utf-8')

        await assert.rejects(() => new UploadHandler().process(payload), new Error("Payload size exceeds 1 MB"));
    })


})
