import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react";
import { vi } from "vitest";

import RecordList from "@/app/interview/components/RecordList";
import { RecordsProvider } from "@/app/interview/context/RecordsContext";
import type { RecordItem } from "@/app/interview/types";

function createFetchMock(records: RecordItem[]) {
  return vi.fn(async (_input: RequestInfo | URL, init?: RequestInit) => {
    const method = init?.method ?? "GET";

    if (method === "GET") {
      return new Response(
        JSON.stringify({ records, totalCount: records.length }),
        { status: 200 },
      );
    }

    if (method === "PATCH") {
      const body = JSON.parse(init?.body as string) as Partial<RecordItem> & {
        id: string;
      };

      const index = records.findIndex((record) => record.id === body.id);
      if (index === -1) {
        return new Response(
          JSON.stringify({ error: `Record with id ${body.id} not found.` }),
          { status: 404 },
        );
      }

      records[index] = { ...records[index], ...body };
      return new Response(JSON.stringify(records[index]), { status: 200 });
    }

    return new Response("Method not allowed", { status: 405 });
  });
}

async function selectOption(label: string, trigger: HTMLElement) {
  fireEvent.pointerDown(trigger);
  fireEvent.click(trigger);
  const option = await screen.findByRole("option", { name: label });
  fireEvent.click(option);
}

describe("Record review flow", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("updates status via dialog and refreshes summary + history", async () => {
    const records: RecordItem[] = [
      {
        id: "1",
        name: "Specimen A",
        status: "pending",
        description: "Pending specimen",
      },
      {
        id: "2",
        name: "Specimen B",
        status: "approved",
        description: "Approved specimen",
      },
    ];
    global.fetch = createFetchMock(records) as unknown as typeof fetch;

    render(
      <RecordsProvider>
        <RecordList />
      </RecordsProvider>,
    );

    await screen.findByText("Specimen A");

    fireEvent.click(screen.getAllByRole("button", { name: "Review" })[0]);

    const dialog = await screen.findByRole("dialog");
    const statusSelect = within(dialog).getByRole("combobox");
    await selectOption("Approved", statusSelect);

    fireEvent.change(within(dialog).getByPlaceholderText("Add a note..."), {
      target: { value: "Reviewed and approved." },
    });

    fireEvent.click(within(dialog).getByRole("button", { name: "Save" }));

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByLabelText("approved count").textContent).toBe("2");
      expect(screen.getByLabelText("pending count").textContent).toBe("0");
      expect(screen.getByText(/pending → approved/)).toBeInTheDocument();
    });
  });

  it("removes records from a filtered view after status change", async () => {
    const records: RecordItem[] = [
      {
        id: "1",
        name: "Specimen A",
        status: "pending",
        description: "Pending specimen",
      },
      {
        id: "2",
        name: "Specimen B",
        status: "approved",
        description: "Approved specimen",
      },
    ];
    global.fetch = createFetchMock(records) as unknown as typeof fetch;

    render(
      <RecordsProvider>
        <RecordList />
      </RecordsProvider>,
    );

    await screen.findByText("Specimen A");

    const filterSelect = screen.getByRole("combobox");
    await selectOption("Pending", filterSelect);

    await waitFor(() => {
      expect(screen.getByText("Specimen A")).toBeInTheDocument();
      expect(screen.queryByText("Specimen B")).not.toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: "Review" }));
    const dialog = await screen.findByRole("dialog");
    const statusSelect = within(dialog).getByRole("combobox");
    await selectOption("Approved", statusSelect);
    fireEvent.click(within(dialog).getByRole("button", { name: "Save" }));

    await waitFor(() => {
      expect(
        screen.getByText("No records match the current filter."),
      ).toBeInTheDocument();
    });

    expect(filterSelect).toHaveTextContent("Pending");
    expect(screen.getByLabelText("approved count").textContent).toBe("2");
    expect(screen.getByLabelText("pending count").textContent).toBe("0");
  });

  it("keeps summary counts based on full data even when filtered", async () => {
    const records: RecordItem[] = [
      {
        id: "1",
        name: "Specimen A",
        status: "pending",
        description: "Pending specimen",
      },
      {
        id: "2",
        name: "Specimen B",
        status: "approved",
        description: "Approved specimen",
      },
    ];
    global.fetch = createFetchMock(records) as unknown as typeof fetch;

    render(
      <RecordsProvider>
        <RecordList />
      </RecordsProvider>,
    );

    await screen.findByText("Specimen A");

    const filterSelect = screen.getByRole("combobox");
    await selectOption("Pending", filterSelect);

    await waitFor(() => {
      expect(screen.getByText("Specimen A")).toBeInTheDocument();
      expect(screen.queryByText("Specimen B")).not.toBeInTheDocument();
    });

    expect(screen.getByLabelText("approved count").textContent).toBe("1");
    expect(screen.getByLabelText("pending count").textContent).toBe("1");
  });

  it("blocks save when validation fails for flagged status", async () => {
    const records: RecordItem[] = [
      {
        id: "1",
        name: "Specimen A",
        status: "pending",
        description: "Pending specimen",
      },
    ];
    const fetchMock = createFetchMock(records);
    global.fetch = fetchMock as unknown as typeof fetch;

    render(
      <RecordsProvider>
        <RecordList />
      </RecordsProvider>,
    );

    await screen.findByText("Specimen A");
    fireEvent.click(screen.getByRole("button", { name: "Review" }));

    const dialog = await screen.findByRole("dialog");
    const statusSelect = within(dialog).getByRole("combobox");
    await selectOption("Flagged", statusSelect);

    fireEvent.click(within(dialog).getByRole("button", { name: "Save" }));

    expect(
      within(dialog).getByText(
        "A note is required when flagging or requesting revision.",
      ),
    ).toBeInTheDocument();

    const patchCalls = fetchMock.mock.calls.filter(
      (_call) => _call[1]?.method === "PATCH",
    );
    expect(patchCalls.length).toBe(0);
  });
});
