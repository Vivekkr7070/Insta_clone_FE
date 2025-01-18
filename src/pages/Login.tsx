import React, { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import styles from "./Login.module.css";
import axios from "axios";
import { login } from "../services/auth";

// Validation Schema
const schema = yup.object({
  username: yup.string().required("Username is required"),
  password: yup.string().required("Password is required"),
  rememberMe: yup.boolean().default(false),
});

interface LoginFormData {
  username: string;
  password: string;
  rememberMe: boolean;
}

const Login: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(schema),
    defaultValues: { rememberMe: false },
  });

  const { setAuthData } = useContext(AuthContext);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const onSubmit = async (data: LoginFormData) => {
    const { username, password, rememberMe } = data;

    try {
      const response = await login(username, password);

      // Validate if the response has status 200 and a token
      if (response.data?.status === 200 && response.data?.token) {
        const token = response.data.token;
        const userId = response.data.userId;
        console.log(userId);

        setAuthData(token, userId);

        if (rememberMe) {
          localStorage.setItem("authToken", token);
        }

        alert("Logged in successfully!");
        navigate("/");
      } else {
        setErrorMessage(
          response.data?.message || "Login failed. Please try again."
        );
      }
    } catch (error) {
      console.error("Login Error:", error);

      if (axios.isAxiosError(error) && error.response) {
        setErrorMessage(
          error.response.data?.message || "Invalid username or password"
        );
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className={styles.loginPage}>
      <h2 className="text-center my-4">Login</h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={`card p-4 shadow ${styles.card}`}
      >
        {errorMessage && (
          <div className={`${styles.alertDanger} alert`}>{errorMessage}</div>
        )}

        <div className="mb-3">
          <label className="form-label">Username</label>
          <input
            type="text"
            className={`form-control ${errors.username ? "is-invalid" : ""}`}
            {...register("username")}
          />
          {errors.username && (
            <div className="invalid-feedback">{errors.username.message}</div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className={`form-control ${errors.password ? "is-invalid" : ""}`}
            {...register("password")}
          />
          {errors.password && (
            <div className="invalid-feedback">{errors.password.message}</div>
          )}
        </div>

        <div className="mb-3 form-check">
          <input
            type="checkbox"
            className="form-check-input"
            {...register("rememberMe")}
          />
          <label className="form-check-label">Remember Me</label>
        </div>

        <button
          type="submit"
          className={`btn btn-primary w-100 ${styles.btnPrimary}`}
        >
          Login
        </button>
      </form>
      <p className={`${styles.textCenter} mt-3`}>
        New User ?{" "}
        <span
          className={`${styles.textPrimary} ${styles.textDecorationUnderline}`}
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/account")}
        >
          create
        </span>
      </p>
    </div>
  );
};

export default Login;
