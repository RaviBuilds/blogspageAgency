"use server";

export type LeadActionState = {
  success: boolean;
  message: string;
  errors?: {
    name?: string;
    email?: string;
    message?: string;
  };
};

export async function submitLead(
  _prevState: LeadActionState,
  formData: FormData
): Promise<LeadActionState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const source = String(formData.get("source") ?? "").trim();

  const errors: LeadActionState["errors"] = {};

  if (!name) errors.name = "Name is required.";
  if (!email) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Enter a valid email address.";
  }
  if (!message) errors.message = "Tell us about your project.";

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      message: "Please fix the highlighted fields.",
      errors,
    };
  }

  const payload = {
    name,
    email,
    phone: phone || null,
    message,
    source: source || "website",
    submittedAt: new Date().toISOString(),
  };

  console.log("[Lead Submission]", JSON.stringify(payload, null, 2));

  return {
    success: true,
    message: "Thanks — we'll respond within one business day.",
  };
}
