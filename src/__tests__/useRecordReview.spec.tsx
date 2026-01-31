import { renderHook, act } from "@testing-library/react";
import { vi } from "vitest";

import { useRecordReview } from "@/app/interview/hooks/useRecordReview";
import type { RecordItem } from "@/app/interview/types";

const updateRecordMock = vi.fn();

vi.mock("@/app/interview/hooks/useRecords", () => ({
  useRecords: () => ({
    updateRecord: updateRecordMock,
  }),
}));

describe("useRecordReview", () => {
  beforeEach(() => {
    updateRecordMock.mockReset();
  });

  it("saves a valid update", async () => {
    const record: RecordItem = {
      id: "1",
      name: "Specimen A",
      status: "pending",
      description: "Pending specimen",
    };
    updateRecordMock.mockResolvedValue(undefined);

    const { result } = renderHook(() => useRecordReview(record));

    act(() => {
      result.current.setStatus("approved");
      result.current.setNote("Looks good");
    });

    let success = false;
    await act(async () => {
      success = await result.current.save();
    });

    expect(success).toBe(true);
    expect(updateRecordMock).toHaveBeenCalledWith("1", {
      status: "approved",
      note: "Looks good",
    });
  });

  it("requires a note for 'flagged' status", async () => {
    const record: RecordItem = {
      id: "1",
      name: "Specimen A",
      status: "pending",
      description: "Pending specimen",
    };
    updateRecordMock.mockResolvedValue(undefined);

    const { result } = renderHook(() => useRecordReview(record));

    act(() => {
      result.current.setStatus("flagged");
      result.current.setNote("");
    });

    let success = true;
    await act(async () => {
      success = await result.current.save();
    });

    expect(success).toBe(false);
    expect(updateRecordMock).not.toHaveBeenCalled();
    expect(result.current.validationMessage).toBe(
      "A note is required when flagging or requesting revision.",
    );
  });

  it("requires a note for 'needs_revision' status", async () => {
    const record: RecordItem = {
      id: "1",
      name: "Specimen A",
      status: "pending",
      description: "Pending specimen",
    };
    updateRecordMock.mockResolvedValue(undefined);

    const { result } = renderHook(() => useRecordReview(record));

    act(() => {
      result.current.setStatus("needs_revision");
      result.current.setNote(" ");
    });

    let success = true;
    await act(async () => {
      success = await result.current.save();
    });

    expect(success).toBe(false);
    expect(updateRecordMock).not.toHaveBeenCalled();
    expect(result.current.validationMessage).toBe(
      "A note is required when flagging or requesting revision.",
    );
  });

  it("clears validation once a note is provided", async () => {
    const record: RecordItem = {
      id: "1",
      name: "Specimen A",
      status: "pending",
      description: "Pending specimen",
    };
    updateRecordMock.mockResolvedValue(undefined);

    const { result } = renderHook(() => useRecordReview(record));

    act(() => {
      result.current.setStatus("flagged");
      result.current.setNote("");
    });

    expect(result.current.validationMessage).toBe(
      "A note is required when flagging or requesting revision.",
    );

    act(() => {
      result.current.setNote("Added details");
    });

    expect(result.current.validationMessage).toBeNull();
  });
});
