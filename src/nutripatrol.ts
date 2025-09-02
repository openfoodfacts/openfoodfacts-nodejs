import createClient from "openapi-fetch";

import type { components, paths } from "./schemas/nutripatrol.js";

import { DEFAULT_NUTRIPATROL_API_URL, USER_AGENT } from "./consts.js";

export class NutriPatrol {
  private readonly fetch: typeof global.fetch;
  private readonly baseUrl: string;
  readonly client: ReturnType<typeof createClient<paths>>;

  constructor(
    fetch: typeof global.fetch,
    options: { baseUrl: string } = {
      baseUrl: DEFAULT_NUTRIPATROL_API_URL,
    },
  ) {
    this.fetch = fetch;
    this.baseUrl = options.baseUrl;
    this.client = createClient({
      baseUrl: this.baseUrl,
      fetch,
      headers: {
        "Content-Type": "application/json",
        "User-Agent": USER_AGENT,
      },
    });
  }

  /**
   * List all flags.
   *
   * @returns - A promise that resolves with the list of flag data or error.
   * @example
   * const { data, error } = await nutripatrol.getFlags();
   * if (error) console.error("Error fetching flags:", error);
   * else console.log("Flags:", data);
   */
  getFlags() {
    return this.client.GET("/api/v1/flags");
  }

  /**
   * Retrieves a specific flag by its ID from the NutriPatrol API.
   *
   * @param {number} flagId - The ID of the flag to fetch.
   * @returns A promise that resolves with the flag data if found or error.
   * @example
   * const { data, error } = await nutripatrol.getFlagById(123);
   */
  getFlagById(flagId: number) {
    return this.client.GET(`/api/v1/flags/{flag_id}`, {
      params: { path: { flag_id: flagId } },
    });
  }

  /**
   * Create a flag in the NutriPatrol API.
   *
   * @param flag - Data for the flag to create.
   */
  createFlag(flag: components["schemas"]["FlagCreate"]) {
    return this.client.POST(`/api/v1/flags`, { body: flag });
  }

  /**
   * Get flags by ticket batch.
   *
   * @param {number[]} ticketIds - Ids of ticket to get flags from.
   * @returns A promise that resolves with the flags data or error.
   * @example
   * const { data, error } = await nutripatrol.getFlagsByTicketBatch([123, 456]);
   */
  getFlagsByTicketBatch(ticketIds: number[]) {
    return this.client.POST("/api/v1/flags/batch", {
      body: { ticket_ids: ticketIds },
    });
  }

  /**
   * List all tickets.
   *
   * @param {object} query - Parameters to filter the tickets.
   * @returns A promise that resolves with the list of tickets or error.
   * @example
   * const { data, error } = await nutripatrol.getTickets({
   *   status: "open",
   *   type: "spam",
   *   reason: ["inappropriate", "human"],
   *   page: 1,
   *   page_size: 20,
   * });
   */
  getTickets(query: {
    status: "open" | "closed";
    type?: string;
    reason?: ("inappropriate" | "human" | "beauty" | "other")[];
    page?: number;
    page_size?: number;
  }) {
    return this.client.GET("/api/v1/tickets", { params: { query } });
  }

  /**
   * Retrieves a specific ticket by its ID from the NutriPatrol API.
   *
   * @param {number} ticketId - The ID of the ticket to fetch.
   * @example
   * const { data, error } = await nutripatrol.getTicketById(123);
   * if (!data) console.error("Error fetching ticket:", error);
   */
  getTicketById(ticketId: number) {
    return this.client.GET("/api/v1/tickets/{ticket_id}", {
      params: { path: { ticket_id: ticketId } },
    });
  }

  /**
   * Update a ticket status in the NutriPatrol API.
   *
   * @param {number} ticketId - The ID of the ticket to update.
   * @param {"open" | "closed"} status - The new status of the ticket.
   * @example
   * const { data, error } = await nutripatrol.updateTicketStatus(123, "closed");
   * if (!data) console.error("Error updating ticket status:", error);
   */
  updateTicketStatus(ticketId: number, status: "open" | "closed") {
    return this.client.PUT("/api/v1/tickets/{ticket_id}/status", {
      params: {
        path: { ticket_id: ticketId },
        query: { status },
      },
    });
  }

  /**
   * Get the status of the NutriPatrol API.
   *
   * If the returned `status.data` is undefined, it indicates that
   * the API is down or unreachable.
   *
   * @example
   * const { data } = await nutripatrol.getApiStatus();
   * if (!data) throw new Error("API is down or unreachable");
   */
  getApiStatus() {
    return this.client.GET(`/api/v1/status`);
  }
}
