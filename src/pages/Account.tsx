import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import styles from "./Account.module.css"; // Import custom styles
import { registerUser } from "../services/auth";

// Validation Schema
const schema = yup.object({
  username: yup
    .string()
    .required("Username is required")
    .min(3, "Must be at least 3 characters"),
    // .matches(/^[a-zA-Z0-9]*$/, "Only alphanumeric characters allowed"),
  email: yup
    .string()
    .required("Email is required"),
    // .email("Must be a valid email"),
  password: yup
    .string()
    .required("Password is required")
    // .min(8, "Must be at least 8 characters")
    // .matches(/[A-Z]/, "Must contain one uppercase letter")
    // .matches(/[a-z]/, "Must contain one lowercase letter")
    // .matches(/\d/, "Must contain one number"),
});

const Account: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [IsSubmitting, setIsSubmitting] = useState<any>();

  const navigate = useNavigate();

  const onSubmit = async (data: any) => {
    setIsSubmitting(true); // Disable the submit button
    try {
      // Destructure data object to pass individual arguments
      const { username, email, password } = data;
      // Now calling registerUser with three separate arguments
      const result = await registerUser(username, email, password);
      // Handle success (redirect or show a success message)
      navigate("/login"); // Redirect after successful registration (example)
    } catch (error) {
      console.error("Error during registration:", error);
      // Handle error (display error message to the user)
    } finally {
      setIsSubmitting(false); // Re-enable the submit button
    }
  };

  const handleGoogleSignIn = () => {
    console.log("Google Sign-In clicked");
    // Implement Google Sign-In logic here
  };

  return (
    <div className={styles.accountPage}>
      <h2 className={`${styles.textCenter} ${styles.my4}`}>
        Create Your Account
      </h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={`${styles.card} shadow`}
      >
        {/* Google Sign-In */}
        <button
          type="button"
          className={`${styles.btnOutlinePrimary} mb-3`}
          onClick={handleGoogleSignIn}
        >
          Sign in with Google
        </button>

        <hr />

        {/* Username Input */}
        <div className="mb-3">
          <label className="form-label">Username</label>
          <input
            type="text"
            className={`form-control ${errors.username ? "is-invalid" : ""}`}
            {...register("username")}
          />
          {errors.username && (
            <div className={`${styles.invalidFeedback}`}>
              {errors.username.message}
            </div>
          )}
        </div>

        {/* Email Input */}
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className={`form-control ${errors.email ? "is-invalid" : ""}`}
            {...register("email")}
          />
          {errors.email && (
            <div className={`${styles.invalidFeedback}`}>
              {errors.email.message}
            </div>
          )}
        </div>

        {/* Password Input */}
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className={`form-control ${errors.password ? "is-invalid" : ""}`}
            {...register("password")}
          />
          {errors.password && (
            <div className={`${styles.invalidFeedback}`}>
              {errors.password.message}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button type="submit" className={`${styles.btnPrimary} ${styles.w100}`}>
          Create Account
        </button>
      </form>

      {/* Link to Login Page */}
      <p className={`${styles.textCenter} mt-3`}>
        Already have an account?{" "}
        <span
          className={`${styles.textPrimary} ${styles.textDecorationUnderline}`}
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/login")}
        >
          Login
        </span>
      </p>
    </div>
  );
};

export default Account;