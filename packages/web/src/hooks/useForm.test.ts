import { act, renderHook } from "@testing-library/react";
import type { ChangeEvent, FocusEvent, FormEvent } from "react";
import { describe, expect, it, vi } from "vitest";
import { useForm } from "./useForm";

const submitEvent = { preventDefault: () => {} } as FormEvent<HTMLFormElement>;

describe("useForm", () => {
  it("behält die Eingaben, wenn der Submit fehlschlägt", async () => {
    const onSubmit = vi.fn().mockRejectedValue(new Error("Unique-Violation"));

    const { result } = renderHook(() =>
      useForm({
        initialValue: { title: "" },
        onSubmit,
        validate: (values) => (values.title ? {} : { title: "Titel notwendig" }),
      }),
    );

    act(() => {
      result.current.handleChange({
        target: { name: "title", value: "Dune" },
      } as ChangeEvent<HTMLInputElement>);
    });

    await act(async () => {
      await result.current.handleSubmit(submitEvent);
    });

    expect(result.current.formData).toEqual({ title: "Dune" });
  });

  it("blockiert den Submit bei Validierungsfehlern", async () => {
    const onSubmit = vi.fn();

    const { result } = renderHook(() =>
      useForm({
        initialValue: { title: "" },
        onSubmit,
        validate: (values) => (values.title ? {} : { title: "Titel notwendig" }),
      }),
    );

    await act(async () => {
      await result.current.handleSubmit(submitEvent);
    });

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("übergibt die Werte und leert das Formular bei Erfolg", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);

    const { result } = renderHook(() =>
      useForm({
        initialValue: { title: "" },
        onSubmit,
        validate: (values) => (values.title ? {} : { title: "Titel notwendig" }),
      }),
    );

    act(() => {
      result.current.handleChange({
        target: { name: "title", value: "Dune" },
      } as ChangeEvent<HTMLInputElement>);
    });

    await act(async () => {
      await result.current.handleSubmit(submitEvent);
    });

    expect(onSubmit).toHaveBeenCalledWith({ title: "Dune" });
    expect(result.current.formData).toEqual({ title: "" });
  });

  it("merkt sich ein Feld erst, wenn es verlassen wurde", () => {
    const { result } = renderHook(() =>
      useForm({
        initialValue: { title: "" },
        onSubmit: vi.fn(),
      }),
    );

    expect(result.current.touched.title).toBeUndefined();

    act(() => {
      result.current.handleBlur({
        target: { name: "title" },
      } as FocusEvent<HTMLInputElement>);
    });

    expect(result.current.touched.title).toBe(true);
  });
});
