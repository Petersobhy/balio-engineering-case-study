export class Record {
    /**
     * @param sequence number
     * @param totalRooms number
     * @param soldRooms number
     * @param revenue number
     */
    constructor(public sequence: number, public totalRooms: number, public soldRooms: number, public revenue: number) {
        this.sequence = sequence;
        this.totalRooms = totalRooms;
        this.soldRooms = soldRooms;
        this.revenue = revenue;
    }

    get occupancy() {
        if (this.totalRooms <= 0) {
            return 0
        }

        return (this.soldRooms / this.totalRooms).toFixed(2)
    }
}

export class Snapshot {
    /**
     * @param hotelName string
     * @param records Array<Record>
     */
    constructor(public hotelName: string, public records: Record[]) {
        this.hotelName = hotelName;
        this.records = records;
    }
}
