
import * as Yup from "yup";

// CONTACT FORM VALIDATION SCHEMA
export const contactFormSchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .required("Please enter your name")
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name must be at most 50 characters"),
  
  email: Yup.string()
    .trim()
    .required("Please enter your email")
    .email("Please enter a valid email address")
    .min(5, "Email must be at least 5 characters")
    .max(100, "Email must be at most 100 characters"),
  
  subject: Yup.string()
    .trim()
    .required("Please enter a subject")
    .min(3, "Subject must be at least 3 characters")
    .max(100, "Subject must be at most 100 characters"),

  message: Yup.string()
    .trim()
    .required("Please enter your message")
    .min(10, "Message must be at least 10 characters")
    .max(500, "Message must be at most 500 characters"),
});