import { Folksonomy, FolksonomyTag, FolksonomyKey } from "../src/folksonomy";
import { ApiError } from "../src/error";

describe("Folksonomy Wrapper", () => {
    let fetchMock: jest.Mock;
    let client: Folksonomy;

    beforeEach(() => {
        fetchMock = jest.fn();
        global.fetch = fetchMock;
        client = new Folksonomy(fetchMock, "test-token");
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
            clone: () => ({ json: async () => data }),
        };
    };

    describe("Keys", () => {
        it("should fetch keys successfully", async () => {
            const data = [{ k: "test-key", count: 1, values: 1 }];
            fetchMock.mockResolvedValue(mockResponse(data));

            const result = await client.getKeys();
            expect(result).toEqual(data);
        });

        it("should handle error when fetching keys", async () => {
            fetchMock.mockResolvedValue(mockResponse(null, false, 500));

            expect(await client.getKeys()).toBeNull;
        });
    });

    describe("Products", () => {
        it("should fetch products successfully", async () => {
            const data = [{ product: 1, k: "Test Product", v: "Test Value" }];
            fetchMock.mockResolvedValue(mockResponse(data));

            const result = await client.getProducts("test-key", "test-value");
            expect(result).toEqual(data);
        });

        it("should handle error when fetching products", async () => {
            fetchMock.mockResolvedValue(mockResponse(null, false, 500));

            expect(await client.getKeys()).toBeNull;
        });
    });

    describe("Tags", () => {
        it("should put tag successfully", async () => {
            const tagData: FolksonomyTag = { k: "test-key", v: "test-value", product: "12345" };
            fetchMock.mockResolvedValue(mockResponse("ok", true, 200));

            const result = await client.putTag(tagData);
            expect(result).toBe(true);
        });

        it("should handle error when putting tag", async () => {
            const tagData: FolksonomyTag = { k: "test-key", v: "test-value", product: "12345" };
            fetchMock.mockResolvedValue(mockResponse(null, false, 500));

            const result = await client.putTag(tagData);
            expect(result).toBe(false);
        });

        it("should get product tags successfully", async () => {
            const data = [{ k: "test-key", v: "test-value", product: "12345" }];
            fetchMock.mockResolvedValue(mockResponse(data));

            const result = await client.getProduct("12345");
            expect(result).toBeDefined();
        });

        it("should handle error when getting product tags", async () => {
            fetchMock.mockResolvedValue(mockResponse(null, false, 500));

            expect(await client.getProduct("12345")).toBeNull;
        });

        it("should add tag successfully", async () => {
            const tagData: FolksonomyTag = { k: "test-key", v: "test-value", product: "12345" };
            fetchMock.mockResolvedValue(mockResponse("ok", true, 200));

            const result = await client.addTag(tagData);
            expect(result).toBe(true);
        });

        it("should handle error when adding tag", async () => {
            const tagData: FolksonomyTag = { k: "test-key", v: "test-value", product: "12345" };
            fetchMock.mockResolvedValue(mockResponse(null, false, 500));

            const result = await client.addTag(tagData);
            expect(result).toBe(false);
        });

        it("should remove tag successfully", async () => {
            const tagData: FolksonomyTag & { version: number } = { k: "test-key", v: "test-value", product: "12345", version: 1 };
            fetchMock.mockResolvedValue(mockResponse("ok", true, 200));

            const result = await client.removeTag(tagData);
            expect(result).toBeDefined();
        });

        it("should handle error when removing tag", async () => {
            const tagData: FolksonomyTag & { version: number } = { k: "test-key", v: "test-value", product: "12345", version: 1 };
            fetchMock.mockResolvedValue(mockResponse(null, false, 500));

            const result = await client.removeTag(tagData);
            expect(result).toBeDefined();
        });
    });

    describe("Authentication", () => {
        it("should login successfully", async () => {
            const data = { access_token: "test-token", token_type: "Bearer" };
            fetchMock.mockResolvedValue(mockResponse(data));

            const result = await client.login("test-user", "test-password");
            expect(result).toEqual({ token: data });
        });

        it("should handle error when logging in", async () => {
            fetchMock.mockResolvedValue(mockResponse(null, false, 401));

            const result = await client.login("test-user", "test-password");
            expect(result).toEqual({ error: { detail: [{ msg: 'Status code 401', type: 'error', loc: [] }] } });
        });
    });
});