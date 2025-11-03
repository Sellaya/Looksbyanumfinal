import { z } from "zod";

export const BookingSchema = z
  .object({
    // Unique booking identifier
    unique_id: z.string().optional(),

    // Client information (matches backend model)
    first_name: z
      .string()
      .min(1, "First name is required")
      .min(2, "First name must be at least 2 characters"),
    last_name: z
      .string()
      .min(1, "Last name is required")
      .min(2, "Last name must be at least 2 characters"),
    name: z.string().optional(), // Constructed from first_name + last_name
    email: z
      .string()
      .min(1, "Email address is required")
      .email("Please enter a valid email address")
      .refine((email) => {
        // Additional email validation for common issues
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
      }, "Please enter a valid email address"),
    phone: z
      .string()
      .min(1, "Phone number is required")
      .max(10, "Phone number cannot exceed 10 digits") // 10 digits without country code
      .refine((phone) => {
        // Canadian phone number validation - 10 digits only (country code added automatically)
        const digitsOnly = phone.replace(/\D/g, "");
        return digitsOnly.length === 10 && /^\d{10}$/.test(digitsOnly);
      }, "Please enter a valid 10-digit Canadian phone number (e.g., 6045555555)"),

    // Region and service type (matches backend model)
    region: z.string().min(1, "Region is required"),
    service_type: z.enum(["Bridal", "Semi-Bridal", "Non-Bridal"]),

    // Service mode for determining flow type
    service_mode: z
      .enum(["Studio Service", "Mobile Makeup Artist"])
      .default("Mobile Makeup Artist"),

    // Pricing
    price: z.number().nonnegative().default(0),

    // Event details (conditional validation based on region)
    event_date: z.string().optional(),
    ready_time: z.string().optional(),

    // Artist selection
    artist: z.enum(["Lead", "Team"]).optional().or(z.literal("")).default(""),

    // Destination wedding fields (conditional validation based on region)
    event_start_date: z.string().optional(),
    event_end_date: z.string().optional(),
    destination_details: z.string().optional(),

    // Bridal service fields
    bride_service: z.string().optional(),
    needs_trial: z.enum(["Yes", "No"]).optional().default("No"),
    trial_service: z.string().optional(),
    trial_date: z.string().optional(),
    needs_jewelry: z.enum(["Yes", "No"]).optional().default("No"),
    needs_extensions: z.enum(["Yes", "No"]).optional().default("No"),
    needs_saree_draping: z.enum(["Yes", "No"]).optional().default("No"),

    selectedDates: z.array(z.any()).optional(),
    services_by_date: z.record(z.string()).optional(),
    addons_by_date: z.record(z.array(z.string())).optional(),
    bridalPartySelections: z.record(z.any()).optional(),

    // Party member counts
    has_party_members: z.enum(["Yes", "No"]).optional().default("No"),
    party_both_count: z
      .union([z.number().int().nonnegative(), z.string()])
      .transform((val) =>
        val === "" ? 0 : typeof val === "string" ? parseInt(val) || 0 : val
      )
      .default(0),
    party_makeup_count: z
      .union([z.number().int().nonnegative(), z.string()])
      .transform((val) =>
        val === "" ? 0 : typeof val === "string" ? parseInt(val) || 0 : val
      )
      .default(0),
    party_hair_count: z
      .union([z.number().int().nonnegative(), z.string()])
      .transform((val) =>
        val === "" ? 0 : typeof val === "string" ? parseInt(val) || 0 : val
      )
      .default(0),
    party_dupatta_count: z
      .union([z.number().int().nonnegative(), z.string()])
      .transform((val) =>
        val === "" ? 0 : typeof val === "string" ? parseInt(val) || 0 : val
      )
      .default(0),
    party_extensions_count: z
      .union([z.number().int().nonnegative(), z.string()])
      .transform((val) =>
        val === "" ? 0 : typeof val === "string" ? parseInt(val) || 0 : val
      )
      .default(0),
    party_saree_draping_count: z
      .union([z.number().int().nonnegative(), z.string()])
      .transform((val) =>
        val === "" ? 0 : typeof val === "string" ? parseInt(val) || 0 : val
      )
      .default(0),
    party_hijab_setting_count: z
      .union([z.number().int().nonnegative(), z.string()])
      .transform((val) =>
        val === "" ? 0 : typeof val === "string" ? parseInt(val) || 0 : val
      )
      .default(0),

    // Airbrush for party
    has_airbrush: z.enum(["Yes", "No"]).optional().default("No"),
    airbrush_count: z
      .union([z.number().int().nonnegative(), z.string()])
      .transform((val) =>
        val === "" ? 0 : typeof val === "string" ? parseInt(val) || 0 : val
      )
      .default(0),

    // Non-bridal service fields
    non_bridal_count: z
      .union([z.number().int().nonnegative(), z.string()])
      .transform((val) =>
        val === "" ? 0 : typeof val === "string" ? parseInt(val) || 0 : val
      )
      .default(0),
    non_bridal_everyone_both: z.enum(["Yes", "No"]).optional().default("No"),
    non_bridal_both_count: z
      .union([z.number().int().nonnegative(), z.string()])
      .transform((val) =>
        val === "" ? 0 : typeof val === "string" ? parseInt(val) || 0 : val
      )
      .default(0),
    non_bridal_makeup_count: z
      .union([z.number().int().nonnegative(), z.string()])
      .transform((val) =>
        val === "" ? 0 : typeof val === "string" ? parseInt(val) || 0 : val
      )
      .default(0),
    non_bridal_hair_count: z
      .union([z.number().int().nonnegative(), z.string()])
      .transform((val) =>
        val === "" ? 0 : typeof val === "string" ? parseInt(val) || 0 : val
      )
      .default(0),
    non_bridal_extensions_count: z
      .union([z.number().int().nonnegative(), z.string()])
      .transform((val) =>
        val === "" ? 0 : typeof val === "string" ? parseInt(val) || 0 : val
      )
      .default(0),
    non_bridal_jewelry_count: z
      .union([z.number().int().nonnegative(), z.string()])
      .transform((val) =>
        val === "" ? 0 : typeof val === "string" ? parseInt(val) || 0 : val
      )
      .default(0),
    non_bridal_has_airbrush: z.enum(["Yes", "No"]).optional().default("No"),
    non_bridal_airbrush_count: z
      .union([z.number().int().nonnegative(), z.string()])
      .transform((val) =>
        val === "" ? 0 : typeof val === "string" ? parseInt(val) || 0 : val
      )
      .default(0),
    non_bridal_has_saree_draping: z
      .enum(["Yes", "No"])
      .optional()
      .default("No"),
    non_bridal_saree_draping_count: z
      .union([z.number().int().nonnegative(), z.string()])
      .transform((val) =>
        val === "" ? 0 : typeof val === "string" ? parseInt(val) || 0 : val
      )
      .default(0),

    // Status fields
    status: z
      .enum(["lead", "booked", "paid", "completed"])
      .optional()
      .default("lead"),
    payment_status: z
      .enum(["pending", "deposit_paid", "fully_paid"])
      .optional()
      .default("pending"),

    // URLs and IDs
    stripe_session_id: z.string().optional(),
    quote_url: z.string().optional(),
    contract_pdf_url: z.string().optional(),
    remaining_invoice_url: z.string().optional(),

    // Inspiration fields
    inspiration_link: z.string().url().optional().or(z.literal("")),
    inspiration_images: z.array(z.string().url()).optional(),

    // Submission date
    submission_date: z.date().optional(),
  })
  .refine(
    (data) => {
      // Conditional validation based on region
      if (data.region === "Destination Wedding") {
        // For destination weddings, require start and end dates
        return (
          data.event_start_date &&
          data.event_start_date.trim() !== "" &&
          data.event_end_date &&
          data.event_end_date.trim() !== ""
        );
      } else {
        // For regular weddings, require event date and ready time
        return (
          data.event_date &&
          data.event_date.trim() !== "" &&
          data.ready_time &&
          data.ready_time.trim() !== ""
        );
      }
    },
    {
      message:
        "Please provide the required event details for your selected region",
      path: ["event_date"], // This will show the error on event_date field
    }
  );

export type Booking = z.infer<typeof BookingSchema>;
