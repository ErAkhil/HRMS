export type Employee = {
  id: string;
  firstName: string;
  lastName: string;
  title: string;
  avatarUrl: string | null;
  department: { name: string } | null;
};

export type FormState = {
  name: string;
  description: string;
  color: string;
  headId: string;
};

export const BLANK_FORM: FormState = { name: "", description: "", color: "#6366F1", headId: "" };

export const COLOR_SWATCHES = [
  { hex: "#6366F1", label: "Indigo" },
  { hex: "#8B5CF6", label: "Violet" },
  { hex: "#10B981", label: "Emerald" },
  { hex: "#F59E0B", label: "Amber" },
  { hex: "#EF4444", label: "Red" },
  { hex: "#EC4899", label: "Pink" },
  { hex: "#14B8A6", label: "Teal" },
  { hex: "#F97316", label: "Orange" },
  { hex: "#3B82F6", label: "Blue" },
  { hex: "#6B7280", label: "Gray" },
];
