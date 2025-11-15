"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  CheckMark,
  ContactsText,
  ContactsMail,
  ContactsName,
  ContactsPhone,
  ContactsSubject,
} from "@/components/icons/contacts-form";
import FormInput from "./form-input";
import { InputCross, ButtonSend } from "@/components/icons";
import { LoaderIcon } from "../swap/buy-btn";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema, FormSchema } from "./form-schema";
import { getCookieConsentValue } from "react-cookie-consent";
import { useForm } from "react-hook-form";
import classNames from "classnames";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { AnimatePresence, motion } from "motion/react";
import { sendLetter } from "@/actions/send-letter";
import DynamicNotification from "../dynamic-notification";

const ContactsForm = () => {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isCaptchaError, setIsCaptchaError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cookieValue = getCookieConsentValue("cookieConsentOracle");
  const { executeRecaptcha } = useGoogleReCaptcha();

  const {
    reset,
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitted },
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  });

  const errorsArray = useMemo(() => Object.entries(errors), [errors]);

  useEffect(() => {
    if (cookieValue) {
      setValue("consent", true);
    }
  }, [cookieValue, setValue]);

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

  const handleReCaptchaVerify = useCallback(async () => {
    if (!executeRecaptcha) {
      console.log("Execute recaptcha not yet available");
      return;
    }

    const token = await executeRecaptcha("yourAction");
    return token;
    // Do whatever you want with the token
  }, [executeRecaptcha]);

  const onSubmit = async (data: FormSchema) => {
    try {
      setIsSubmitting(true);
      const token = await handleReCaptchaVerify();
      //   console.log(token);
      if (token) {
        const result = await sendLetter(data, token);
        // console.log(result);
        if (!result.success) {
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
      console.error("err", err);
    } finally {
      setIsSubmitting(false);
    }
    // reset();
  };

  const firstErrorMessage = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const firstError = errorsArray.find(([_, value]) => value?.message);
    return firstError ? firstError[1].message : null;
  }, [errorsArray]);

  const messageData = useMemo(() => {
    if (errorsArray.length > 0 && isSubmitted) {
      return {
        key: "error",
        text: firstErrorMessage,
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
        text: "Successfully submitted form",
        className: "contacts-form__warning--success",
      };
    }
    return {
      key: "default",
      text: "I consent to my data being stored and used to contact me in response to my inquiry.",
      className: "",
    };
  }, [
    isCaptchaError,
    showSuccessMessage,
    errorsArray,
    isSubmitted,
    firstErrorMessage,
  ]);

  const btnIconResolved = isSubmitting ? (
    <LoaderIcon />
  ) : errorsArray.length > 0 || isCaptchaError ? (
    <InputCross />
  ) : (
    <ButtonSend />
  );

  const btnKeyResolved = isSubmitting
    ? "Submitting"
    : errorsArray.length > 0 || isCaptchaError
      ? "Error"
      : "Send";

  const animatedProps = {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -20, opacity: 0 },
    transition: { duration: 0.3 },
  } as const;

  const fadeAnimationProps = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.2, ease: "easeOut" },
  } as const;

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="contacts-form">
        <div className="contacts-form__main">
          <FormInput
            icon={<ContactsName />}
            type="text"
            register={register("name")}
            placeholder={"Steve Jobs"}
            isError={!!errors.name}
          />
          <FormInput
            icon={<ContactsMail />}
            type="email"
            register={register("email")}
            placeholder={"example@oracleswap.app"}
            isError={!!errors.email}
          />
          <FormInput
            icon={<ContactsPhone />}
            type="tel"
            register={register("phone")}
            placeholder={"+11234567890"}
            isError={!!errors.phone}
            optional
          />
          <FormInput
            icon={<ContactsSubject />}
            register={register("subject")}
            type="subject"
            placeholder={"Subject"}
            isError={!!errors.subject}
            optional
          />
          <FormInput
            icon={<ContactsText />}
            register={register("message")}
            type="subject"
            placeholder={"How can we help you?"}
            isError={!!errors.message}
            textArea
          />
          <label
            className={classNames("checkbox-container", {
              "checkbox-container--error": !!errors.consent,
            })}
          >
            Privacy consent
            <div className="check">
              <input type="checkbox" {...register("consent")} />
              <CheckMark />
            </div>
          </label>
          <div className={`contacts-form__warning ${messageData.className}`}>
            <AnimatePresence mode="wait">
              <motion.span key={messageData.key} {...fadeAnimationProps}>
                {messageData.text}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>
        <button
          disabled={isSubmitting}
          type="submit"
          className={classNames("contacts-form__btn", {
            "contacts-form__btn--error": btnKeyResolved === "Error",
            "contacts-form__btn--loading": btnKeyResolved === "Submitting",
          })}
        >
          <AnimatePresence mode="popLayout">
            <motion.div
              className="contacts-form__btn__icon"
              key={btnKeyResolved + "-icon-submit-left"}
              {...animatedProps}
            >
              {btnIconResolved}
            </motion.div>
          </AnimatePresence>
          <AnimatePresence mode="popLayout">
            <motion.span key={btnKeyResolved} {...animatedProps}>
              {btnKeyResolved}
            </motion.span>
          </AnimatePresence>
          <AnimatePresence mode="popLayout">
            <motion.div
              className="contacts-form__btn__icon"
              key={btnKeyResolved + "-icon-submit-roght"}
              {...animatedProps}
            >
              {btnIconResolved}
            </motion.div>
          </AnimatePresence>
        </button>
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

export default ContactsForm;
