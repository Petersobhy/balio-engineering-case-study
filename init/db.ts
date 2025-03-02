import {open} from "sqlite";
import sqlite3 from "sqlite3";

(async () => {

    const db = await open({
        filename: 'db.sqlite',
        driver: sqlite3.Database
    })

    await db.exec(`
        CREATE TABLE hotel_snapshots
        (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            hotel_name  VARCHAR(255)       NOT NULL,
            sequence    INTEGER            NOT NULL,
            total_rooms INTEGER            NOT NULL,
            sold_rooms  INTEGER            NOT NULL,
            revenue     DECIMAL(12, 2)     NOT NULL,
            soruce_format VARCHAR(10)      NULL,
            created_at  DATETIME DEFAULT current_timestamp
        )`
    )
})()

