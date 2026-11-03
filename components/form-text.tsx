"use client";
import { createContext, useContext } from "react";
import { mergeText, type PageText } from "@/lib/page-text";

/** Form labels and messages from Admin → Page text → Forms. Provided once in the root layout; falls back to the original wording. */
const Ctx = createContext<PageText<"forms">>(mergeText("forms", null));
export const FormTextProvider = ({ value, children }: { value: PageText<"forms">; children: React.ReactNode }) => <Ctx.Provider value={value}>{children}</Ctx.Provider>;
export const useFormText = () => useContext(Ctx);
