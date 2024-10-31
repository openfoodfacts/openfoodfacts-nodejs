import { NutriPatrolError } from "../src/error";
import { Flag, NutriPatrol, Ticket } from "../src/nutripatrol";

describe("NutriPatrol Wrapper", () => {
    let fetchMock: jest.Mock;
    let client: NutriPatrol;

    beforeEach(() => {
        fetchMock = jest.fn();
        global.fetch = fetchMock;
        client = new NutriPatrol(fetchMock);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    afterAll(() => {
        jest.clearAllMocks();
    });

    const mockResponse = (data: any, ok = true, status = 200) => {
        return {
            ok,
            status,
            headers: {
                get: (header: string) => {
                    const headers: { [key: string]: string } = {
                        "Content-Type": "application/json",
                    };
                    return headers[header];
                },
            },
            json: async () => data,
            text: async () => JSON.stringify(data),
            clone: () => ({ json: async () => data }),
        };
    };

    describe("Flags", () => {
        it("should fetch flags successfully", async () => {
            const data = { flags: [{ id: 1 }] };
            fetchMock.mockResolvedValue(mockResponse(data));

            const result = await client.getFlags();
            expect(result).toEqual([{ id: 1 }]);
        });

        it("should handle error when fetching flags", async () => {
            fetchMock.mockResolvedValue(mockResponse(null, false, 500));

            const result = await client.getFlags();
            expect((result as NutriPatrolError).error.statusCode).toBe(500);
        });

        it("should fetch a flag by ID successfully", async () => {
            const data = { __data__: { id: 1, name: "Test Flag" } };
            fetchMock.mockResolvedValue(mockResponse(data));

            const result = await client.getFlagById(1);
            expect(result).toEqual(data.__data__);
        });

        it("should handle error when fetching a flag by ID", async () => {
            fetchMock.mockResolvedValue(mockResponse(null, false, 404));

            const result = await client.getFlagById(1);
            expect((result as NutriPatrolError).error.statusCode).toBe(404);
        });

        it("should handle error when fetching a flag by a wrong ID", async () => {
            const data = {
                detail: [
                    {
                        type: "int_parsing",
                        loc: [
                            "path",
                            "ticket_id"
                        ],
                        msg: "Input should be a valid integer, unable to parse string as an integer",
                        input: "a",
                        url: "https://errors.pydantic.dev/2.9/v/int_parsing"
                    }
                ]
            }
            fetchMock.mockResolvedValue(mockResponse(data, false, 422));

            const result = await client.getFlagById("wrong-id" as any);
            expect((result as NutriPatrolError).error.statusCode).toBe(422);
            expect((result as NutriPatrolError).error.details[0]).toBe("Input should be a valid integer, unable to parse string as an integer");
        });

        it("should create a flag successfully", async () => {
            const flagData: Flag = {
                barcode: "barcode-test",
                type: "product",
                url: "url-test",
                image_id: "1",
                flavor: "off",
                created_at: "2024-10-12T15:49:28.485Z",
                user_id: "1",
                source: "web"
            };
            fetchMock.mockResolvedValue(mockResponse(flagData));

            const result = await client.createFlag(flagData);
            expect(result).toEqual(flagData);
        });

        it("should handle error when creating a flag", async () => {
            const data = {
                detail: [
                    {
                        type: "enum",
                        loc: [
                            "body",
                            "type"
                        ],
                        msg: "Input should be 'product', 'image' or 'search'",
                        input: "producst",
                        ctx: {
                            expected: "'product', 'image' or 'search'"
                        },
                        url: "https://errors.pydantic.dev/2.9/v/enum"
                    }
                ]
            }
            fetchMock.mockResolvedValue(mockResponse(data, false, 422));

            const flagData: Flag = {
                barcode: "barcode-test",
                type: "product",
                url: "url-test",
                image_id: "1",
                flavor: "off",
                created_at: "2024-10-12T15:49:28.485Z",
                user_id: "1",
                source: "web"
            };;
            const result = await client.createFlag(flagData);
            expect((result as NutriPatrolError).error.statusCode).toBe(422);
            expect((result as NutriPatrolError).error.details[0]).toBe("Input should be 'product', 'image' or 'search'");
        });

        it("should fetch flags by ticket batch successfully", async () => {
            const data = { ticket_id_to_flags: { "1": [{ id: 1, name: "Test Flag" }] } };
            fetchMock.mockResolvedValue(mockResponse(data));

            const result = await client.getFlagsByTicketBatch([1]);
            expect(result).toEqual(data.ticket_id_to_flags);
        });

        it("should handle error when fetching flags by ticket batch", async () => {
            fetchMock.mockResolvedValue(mockResponse(null, false, 500));

            const result = await client.getFlagsByTicketBatch([1]);
            expect((result as NutriPatrolError).error.statusCode).toBe(500);
        });
    });

    describe("Tickets", () => {

        it("should fetch tickets successfully", async () => {
            const data = { tickets: [{ id: 1, status: "open" }] };
            fetchMock.mockResolvedValue(mockResponse(data));

            const result = await client.getTickets({ status: "open" });
            expect(result).toEqual(data.tickets);
        });

        it("should handle error when fetching tickets", async () => {
            fetchMock.mockResolvedValue(mockResponse(null, false, 404));

            const result = await client.getTickets({ status: "open" });
            expect((result as NutriPatrolError).error.statusCode).toBe(404);
        });

        it("should fetch a ticket by ID successfully", async () => {
            const ticketData: Ticket = {
                id: 1,
                barcode: "barcode-test",
                type: "image",
                url: "url-test",
                status: "open",
                image_id: "2",
                flavor: "off",
                created_at: "2024-03-25T14:33:41.785848"
            };
            fetchMock.mockResolvedValue(mockResponse(ticketData));

            const result = await client.getTicketById(1);
            expect(result).toEqual(ticketData);
        });

        it("should handle error when fetching a ticket by ID", async () => {
            fetchMock.mockResolvedValue(mockResponse(null, false, 500));

            const result = await client.getTicketById(1);
            expect((result as NutriPatrolError).error.statusCode).toBe(500);
        });

        it("should create a ticket successfully", async () => {
            const ticketData: Omit<Ticket, "id"> = {
                type: "product",
                barcode: "barcode-test",
                url: "url-test",
                status: "open",
                image_id: "1",
                flavor: "off"
            };
            fetchMock.mockResolvedValue(mockResponse(ticketData));

            const result = await client.createTicket(ticketData);
            expect(result).toEqual(ticketData);
        });

        it("should handle error when creating a ticket", async () => {
            const data = {
                detail: [
                    {
                        type: "enum",
                        loc: [
                            "body",
                            "status"
                        ],
                        msg: "Input should be 'open' or 'closed'",
                        input: "opsen",
                        ctx: {
                            "expected": "'open' or 'closed'"
                        },
                        url: "https://errors.pydantic.dev/2.9/v/enum"
                    }
                ]
            }

            fetchMock.mockResolvedValue(mockResponse(data, false, 422));

            const ticketData: Ticket = { status: "opsen" } as any;
            const result = await client.createTicket(ticketData);
            expect((result as NutriPatrolError).error.statusCode).toBe(422);
            expect((result as NutriPatrolError).error.details[0]).toBe("Input should be 'open' or 'closed'");
        });

        it("should update a ticket status successfully", async () => {
            const updatedTicketData: Ticket = {
                id: 1,
                barcode: "barcode-test",
                type: "product",
                url: "url-test",
                status: "open",
                image_id: "1",
                flavor: "off"
            };
            fetchMock.mockResolvedValue(mockResponse(updatedTicketData));

            const result = await client.updateTicketStatus(1, "closed");
            expect(result).toEqual(updatedTicketData);
        });

        it("should handle error when updating a ticket status", async () => {
            fetchMock.mockResolvedValue(mockResponse(null, false, 404));

            const result = await client.updateTicketStatus(1, "closed");
            expect((result as NutriPatrolError).error.statusCode).toBe(404);
        });
    });

    describe("API Status", () => {
        it("should get API status successfully", async () => {
            const data = { status: "ok" };
            fetchMock.mockResolvedValue(mockResponse(data));

            const result = await client.getApiStatus();
            expect(result).toEqual(data);
        });

        it("should handle error when getting API status", async () => {
            fetchMock.mockResolvedValue(mockResponse(null, false, 500));

            const result = await client.getApiStatus();
            expect((result as NutriPatrolError).error.statusCode).toBe(500);
        });
    });
});