"use client";

import React, { useEffect, useMemo } from "react";
import { FooterSend } from "../icons";
import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { SubscribeFormSchema, subscribeFormSchema } from "./schema";
import classNames from "classnames";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { subscribeUser } from "@/actions/subscribe";
import DynamicNotification from "../dynamic-notification";
import { AnimatePresence, motion } from "motion/react";

const FooterForm = () => {
  const formMethods = useForm<SubscribeFormSchema>({
    resolver: zodResolver(subscribeFormSchema),
  });
  const [isCaptchaError, setIsCaptchaError] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isError, setIsError] = useState(false);
  const {
    handleSubmit,
    reset,
    register,
    formState: { errors, isSubmitted },

    // ...rest
  } = formMethods;

  useEffect(() => {
    if (showSuccessMessage) {
      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessMessage]);

  useEffect(() => {
    if (isCaptchaError) {
      const timer = setTimeout(() => {
        setIsCaptchaError(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isCaptchaError]);
  useEffect(() => {
    if (isError) {
      const timer = setTimeout(() => {
        setIsError(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isError]);

  const errorsArray = useMemo(() => Object.entries(errors), [errors]);

  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleReCaptchaVerify = useCallback(async () => {
    if (!executeRecaptcha) {
      console.warn("Execute recaptcha not yet available");
      return;
    }

    const token = await executeRecaptcha("subscribeNewsletter");
    return token;
    // Do whatever you want with the token
  }, [executeRecaptcha]);

  const onSubmit = async (data: SubscribeFormSchema) => {
    // Replace "kek" with your actual token logic or reCaptcha verification
    try {
      setIsSubmitting(true);
      const token = await handleReCaptchaVerify();
      // const token = "kek";
      //    console.log(token);
      if (token) {
        const result = await subscribeUser(data, token);
        //     console.log(result);
        if (!result?.success) {
          setIsCaptchaError(true);
          return;
        } else {
          setShowSuccessMessage(true);
          setIsCaptchaError(false);
        }
      } else {
        setIsCaptchaError(true);
        return;
      }
      reset();
    } catch (err) {
      if (err instanceof Error) {
        setIsError(true);
        reset();
      }
      // console.log("err", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const messageData = useMemo(() => {
    if (errorsArray.length > 0 && isSubmitted) {
      return {
        key: "error",
        text: errors.email?.message,
        className: "contacts-form__warning--error",
      };
    } else if (isCaptchaError) {
      return {
        key: "captcha",
        text: "Captcha error. Try again later, or message us directly through mail",
        className: "contacts-form__warning--error",
      };
    } else if (showSuccessMessage) {
      return {
        key: "success",
        text: "Successfully subscribed",
        className: "contacts-form__warning--success",
      };
    } else if (isError) {
      return {
        key: "error",
        text: "Already subscribed",
        className: "contacts-form__warning--error",
      };
    }
    // return null;
    return {
      key: null,
      text: "I consent to my data being stored and used to contact me in response to my inquiry.",
      className: "",
    };
  }, [
    isCaptchaError,
    showSuccessMessage,
    errorsArray,
    isSubmitted,
    errors,
    isError,
  ]);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="footer-form">
        <label
          className={classNames("footer-form__input", {
            "footer-form__input--error": !!errors.email,
            "footer-form__input--submitting": isSubmitting,
          })}
        >
          <input
            disabled={isSubmitting}
            {...register("email")}
            type={"email"}
            placeholder={"Enter your email"}
          />
          <button
            disabled={isSubmitting}
            className="email-submit"
            type="submit"
          >
            <span>send</span>
            <FooterSend />
          </button>
        </label>
        <div className="footer-form__bottom">
          <div className="footer-form__bottom__header">
            <span>Example</span>
          </div>
          <div className="footer-form__bottom__example">
            <span>user@oracleswap.app</span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {messageData.key && messageData.key !== "success" && (
            <motion.div
              key={messageData.key}
              className="footer-form__error"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              {messageData.text}
            </motion.div>
          )}
        </AnimatePresence>
      </form>
      <DynamicNotification
        message={messageData.text as string}
        time={3}
        type={
          messageData.key === "success"
            ? "success"
            : messageData.key === "error"
              ? "error"
              : messageData.key === "capcha"
                ? "error"
                : null
        }
      />
    </>
  );
};

export default FooterForm;
