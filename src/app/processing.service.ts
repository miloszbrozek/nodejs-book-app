import {ProcessableEntity} from "./types";
import * as _ from "lodash";

export class ProcessingService<T extends ProcessableEntity> {
    private entities:T[] = [];

    constructor(private readonly processingDelayMap: Record<T['type'], number>) {
    }

    _createSetTimeoutPromise(delayMs: number) {
        return new Promise<void>((resolve) => {
            setTimeout(resolve, delayMs);
        })
    }

    process(processed: ProcessableEntity) {
        const delaySec = this.processingDelayMap[processed.type];
        this._createSetTimeoutPromise(delaySec * 1000)
            .then(()=> {
                processed.state = 'finished'
                processed.updated_at = new Date();
            })
    }

    create(newProcessable: Omit<T, "created_at" | "state">) {
        const newEntity = {
            ...newProcessable,
            created_at: new Date(),
            state: "pending",
        } as T;
        this.entities.push(newEntity);
        this.process(newEntity);
        return newEntity;
    }

    getListByStates()  {
        return _.groupBy(this.entities, "state") as _.Dictionary<T[]>;
    }
}
