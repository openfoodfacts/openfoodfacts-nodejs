import createClient from "openapi-fetch";

import { components, paths } from "./schemas/nutripatrol";
import { NutriPatrolError } from "./error";

export type Flag = components["schemas"]["FlagCreate"];
export type Ticket = components["schemas"]["Ticket"];
export type FlagResponse = {
  __data__: Flag;
  _dirty: any[];
  __rel__: object;
};

export type FlagsResponse = {
  flags: Flag[];
};

export type FlagBatchResponse = {
  ticket_id_to_flags: {
    [ticketId: string]: Flag[];
  };
};

export type TicketsResponse = {
  tickets: Ticket[];
};

export class NutriPatrol {
  private readonly fetch: typeof global.fetch;
  private readonly baseUrl: string;
  readonly raw: ReturnType<typeof createClient<paths>>;

  constructor(fetch: typeof global.fetch) {
    this.baseUrl = "https://nutripatrol.openfoodfacts.org";

    this.fetch = fetch;
    this.raw = createClient({
      baseUrl: this.baseUrl,
      fetch,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  private async fetchApi(
    method: "GET" | "POST" | "PUT" | "DELETE",
    path: string,
    options: any = {},
  ): Promise<any> {
    const methods = {
      GET: this.raw.GET,
      POST: this.raw.POST,
      PUT: this.raw.PUT,
      DELETE: this.raw.DELETE,
    };

    try {
      const fct = methods[method] as any;
      const res = await fct(path as any, options as any);

      if (!res.response.ok) {
        switch (res.response.status) {
          case 422:
            throw new NutriPatrolError(
              422,
              "Validation error",
              res.error?.detail?.map((d: any) => d.msg),
            );
          default:
            const errorDetails = await res.response.json();
            throw new NutriPatrolError(
              res.response.status,
              "Error while requesting Nutripatrol API",
              errorDetails,
            );
        }
      }

      const data = await res.response.json();

      if (!data) {
        throw new NutriPatrolError(500, `Malformed API response.`);
      }

      return data;
    } catch (error) {
      if (error instanceof NutriPatrolError) {
        throw error;
      }
      throw new NutriPatrolError(500, "An unexpected error occurred");
    }
  }

  /**
   * List all flags.
   *
   * @returns {Promise<Flag[]>} - A promise that resolves with the list of flag data.
   * @throws {NutriPatrolError} - Throws an error if the request fails, if the response is malformed.
   *
   * The thrown error can be one of the following:
   * - A `NutriPatrolError` with status 422 if there is a validation issue (e.g., invalid flag ID).
   * - A `NutriPatrolError` with the corresponding HTTP status code for other types of errors (e.g., 404, 500).
   * - A generic `NutriPatrolError` with status 500 for unexpected errors.
   *
   */
  async getFlags(): Promise<Flag[]> {
    const data: FlagsResponse = await this.fetchApi("GET", `/api/v1/flags`);
    return data.flags;
  }

  /**
   * Retrieves a specific flag by its ID from the NutriPatrol API.
   *
   * @param {number} flagId - The ID of the flag to fetch.
   * @returns {Promise<Flag>} - A promise that resolves with the flag data if found.
   * @throws {NutriPatrolError} - Throws an error if the request fails, if the response is malformed, or if there is a validation error (HTTP 422).
   *
   * The thrown error can be one of the following:
   * - A `NutriPatrolError` with status 422 if there is a validation issue (e.g., invalid flag ID).
   * - A `NutriPatrolError` with the corresponding HTTP status code for other types of errors (e.g., 404, 500).
   * - A generic `NutriPatrolError` with status 500 for unexpected errors.
   *
   */
  async getFlagById(flagId: number): Promise<Flag> {
    const data: FlagResponse = await this.fetchApi(
      "GET",
      `/api/v1/flags/{flag_id}`,
      {
        params: { path: { flag_id: flagId } },
      },
    );
    return data.__data__;
  }

  /**
   * Create a flag in the NutriPatrol API.
   *
   * @param {Flag} flagData - Data for the flag to create.
   * @returns {Promise<Flag>} - A promise that resolves with the flag created.
   * @throws {NutriPatrolError} - Throws an error if the request fails, if the response is malformed, or if there is a validation error (HTTP 422).
   *
   * The thrown error can be one of the following:
   * - A `NutriPatrolError` with status 422 if there is a validation issue (e.g., invalid flag ID).
   * - A `NutriPatrolError` with the corresponding HTTP status code for other types of errors (e.g., 404, 500).
   * - A generic `NutriPatrolError` with status 500 for unexpected errors.
   *
   */
  async createFlag(flagData: Flag): Promise<Flag> {
    const data: Flag = await this.fetchApi("POST", `/api/v1/flags`, {
      body: flagData,
    });
    return data;
  }

  /**
   * Get flags by ticket batch.
   *
   * @param {number[]} ticketIds - Ids of ticket to get flags from.
   * @returns {Promise<{ [ticketId: string]: Flag[] }>} - A promise that resolves with the flags associated to each ticket.
   * @throws {NutriPatrolError} - Throws an error if the request fails, if the response is malformed, or if there is a validation error (HTTP 422).
   *
   * The thrown error can be one of the following:
   * - A `NutriPatrolError` with status 422 if there is a validation issue (e.g., invalid flag ID).
   * - A `NutriPatrolError` with the corresponding HTTP status code for other types of errors (e.g., 404, 500).
   * - A generic `NutriPatrolError` with status 500 for unexpected errors.
   *
   */
  async getFlagsByTicketBatch(
    ticketIds: number[],
  ): Promise<{ [ticketId: string]: Flag[] }> {
    const data: FlagBatchResponse = await this.fetchApi(
      "POST",
      `/api/v1/batch`,
      {
        body: {
          ticket_ids: ticketIds,
        },
      },
    );
    return data.ticket_id_to_flags;
  }

  /**
   * List all tickets.
   *
   * @param {object} query - Parameters to filter the tickets.
   * @returns {Promise<Ticket[]>} - A promise that resolves with the list of ticket data.
   * @throws {NutriPatrolError} - Throws an error if the request fails, if the response is malformed.
   *
   * The thrown error can be one of the following:
   * - A `NutriPatrolError` with status 422 if there is a validation issue (e.g., invalid filter value).
   * - A `NutriPatrolError` with the corresponding HTTP status code for other types of errors (e.g., 404, 500).
   * - A generic `NutriPatrolError` with status 500 for unexpected errors.
   *
   */
  async getTickets(query: {
    status: "open" | "closed";
    type?: string;
    reason?: "inappropriate" | "human" | "beauty" | "other";
    page?: number;
    page_size?: number;
  }): Promise<Ticket[]> {
    const data: TicketsResponse = await this.fetchApi(
      "GET",
      `/api/v1/tickets`,
      { params: { query } },
    );
    return data.tickets;
  }

  /**
   * Retrieves a specific ticket by its ID from the NutriPatrol API.
   *
   * @param {number} ticketId - The ID of the ticket to fetch.
   * @returns {Promise<Ticket>} - A promise that resolves with the ticket data if found.
   * @throws {NutriPatrolError} - Throws an error if the request fails, if the response is malformed, or if there is a validation error (HTTP 422).
   *
   * The thrown error can be one of the following:
   * - A `NutriPatrolError` with status 422 if there is a validation issue (e.g., invalid ticket ID).
   * - A `NutriPatrolError` with the corresponding HTTP status code for other types of errors (e.g., 404, 500).
   * - A generic `NutriPatrolError` with status 500 for unexpected errors.
   *
   */
  async getTicketById(ticketId: number): Promise<Ticket> {
    const data: Ticket = await this.fetchApi(
      "GET",
      `/api/v1/tickets/{ticket_id}`,
      {
        params: { path: { ticket_id: ticketId } },
      },
    );
    return data;
  }

  /**
   * Create a ticket in the NutriPatrol API.
   *
   * @param {Ticket} ticketData - Data for the ticket to create.
   * @returns {Promise<Ticket>} - A promise that resolves with the ticket created.
   * @throws {NutriPatrolError} - Throws an error if the request fails, if the response is malformed, or if there is a validation error (HTTP 422).
   *
   * The thrown error can be one of the following:
   * - A `NutriPatrolError` with status 422 if there is a validation issue (e.g., invalid ticket status).
   * - A `NutriPatrolError` with the corresponding HTTP status code for other types of errors (e.g., 404, 500).
   * - A generic `NutriPatrolError` with status 500 for unexpected errors.
   *
   */
  async createTicket(ticketData: Omit<Ticket, "id">): Promise<Ticket> {
    const data: Ticket = await this.fetchApi("POST", `/api/v1/tickets`, {
      body: ticketData,
    });
    return data;
  }

  /**
   * Update a ticket status in the NutriPatrol API.
   *
   * @param {number} ticketId - The ID of the ticket to update.
   * @param {"open" | "closed"} status - The new status of the ticket.
   * @returns {Promise<Ticket>} - A promise that resolves with the ticket updated.
   * @throws {NutriPatrolError} - Throws an error if the request fails, if the response is malformed, or if there is a validation error (HTTP 422).
   *
   * The thrown error can be one of the following:
   * - A `NutriPatrolError` with status 422 if there is a validation issue (e.g., invalid ticket status).
   * - A `NutriPatrolError` with the corresponding HTTP status code for other types of errors (e.g., 404, 500).
   * - A generic `NutriPatrolError` with status 500 for unexpected errors.
   *
   */
  async updateTicketStatus(
    ticketId: number,
    status: "open" | "closed",
  ): Promise<Ticket> {
    const data: Ticket = await this.fetchApi(
      "PUT",
      `/api/v1/tickets/{ticket_id}/status`,
      {
        params: {
          path: { ticket_id: ticketId },
          query: { status },
        },
      },
    );
    return data;
  }

  /**
   * Get the status of the NutriPatrol API.
   *
   * @returns {Promise<{ status: string }>} - A promise that resolves with the API status.
   * @throws {NutriPatrolError} - Throws an error if the request fails, if the response is malformed, or if there is a validation error (HTTP 422).
   *
   * The thrown error can be one of the following:
   * - A `NutriPatrolError` with the corresponding HTTP status code for other types of errors (e.g., 404, 500).
   * - A generic `NutriPatrolError` with status 500 for unexpected errors.
   *
   */
  async getApiStatus(): Promise<{ status: string }> {
    const data: { status: string } = await this.fetchApi(
      "GET",
      `/api/v1/status`,
    );
    return data;
  }
}
