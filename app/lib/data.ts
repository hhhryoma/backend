import { Query, selectQuery } from "@/app/lib/db";
import { QueryResult } from "mysql2";

interface DataProvider {
    tableName: string
    fetch: (arg: any) => Promise<any>
    update: (arg: any) => Promise<any>
}

type HelloDTO = {
    id: number
    world: string
}

export class Hello implements DataProvider {
    tableName = "hello"
    plojection = [
        "id", "world"
    ]
    async fetch(userId: number) {
        try {
            const query: Query = {
                sql: `SELECT ${this.plojection.join(",")} FROM ${this.tableName} WHERE id = ?`,
                params: [userId]
            }

            const response = await selectQuery(query)
            const datas = response.map((data) => {
                const dto: HelloDTO = {
                    id: data.id,
                    world: data.world
                }
                return dto
            })
            const jsonData = JSON.stringify(datas)

            console.debug({ query, response, datas })

            return jsonData
        } catch (error) {
            console.error(error)
            throw new Error("Failed fetch data");
        }
    }
    async update() {
        return null
    }
}

