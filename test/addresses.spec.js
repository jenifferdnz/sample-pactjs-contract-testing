import 'dotenv/config'

import { Pact } from "@pact-foundation/pact"
import { resolve } from 'path'
import { eachLike, somethingLike } from '@pact-foundation/pact/src/dsl/matchers';
import { addressList } from '../request/address.request';

const mockProvider = new Pact({
    consumer: 'ebac-demo-store-admin',
    provider: 'ebac-demo-store-server',
    port: parseInt(process.env.MOCK_PORT),
    log: resolve(process.cwd(), 'logs', 'pact.log'),
    dir: resolve(process.cwd(), 'pacts')
})

describe('Address Test', () => {

    beforeAll(async () => {
        await mockProvider.setup().then(() => {
            mockProvider.addInteraction({
                uponReceiving: 'a request',
                withRequest: {
                    method: 'POST',
                    path: '/graphql',
                    headers: {
                        Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNjM3NjM1OTk4LCJleHAiOjE2Mzc4MDg3OTh9.oDPW0raH0iF-y5UGGb1_OkcD8AW_iLUV3EagvF0jzfQ',
                        "Content-Type": 'application/json'
                    },
                    body: {
                        "operationName": "addresses",
                        "variables": {},
                        "query": "query addresses($where: AddressWhereInput, $orderBy: AddressOrderByInput, $skip: Float, $take: Float) {\n  items: addresses(where: $where, orderBy: $orderBy, skip: $skip, take: $take) {\n    address_1\n    address_2\n    city\n    createdAt\n    id\n    state\n    updatedAt\n    zip\n    customers {\n      id\n      __typename\n    }\n    __typename\n  }\n  total: _addressesMeta(where: $where, orderBy: $orderBy, skip: $skip, take: $take) {\n    count\n    __typename\n  }\n}\n"
                    }
                },
                willRespondWith: {
                    status: 200,
                    headers: {
                        "Content-Type": 'application/json; charset=utf-8'
                    },
                    body: {
                        "data": {
                            "items": eachLike(
                                {
                
                                        "firstName": "Pedrinho",
                                        "lastName": "Silvaa",
                                        "password": "342",
                                        "roles": [
                                          "string"
                                        ],
                                        "username": "pedross"
                                      
                                },
                                { min: 2 }
                            ),
                            "total": {
                                "count": "2",
                                "__typename": "MetaQueryPayload"
                            }
                        }
                    }

                }
            })
        })
    })

    afterAll(() => mockProvider.finalize())
    afterEach(() => mockProvider.verify())

    it('should return address list', () => {
        addressList().then(response => {
            const { firstName, lastName} = response.data.data.items[0]

            expect(response.status).toEqual(201)
            expect(firstName).toBe('Pedrinho')
            expect(lastName).toBe('Silvaa')
        })
    });
});