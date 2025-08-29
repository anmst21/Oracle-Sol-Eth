"use client";

import React from "react";
import { FooterSend } from "../icons";
import { useState, useEffect, useCallback } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { SubscribeFormSchema, subscribeFormSchema } from "./schema";
import classNames from "classnames";

type Props = {};

const FooterForm = (props: Props) => {
  const formMethods = useForm<SubscribeFormSchema>({
    resolver: zodResolver(subscribeFormSchema),
  });
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const {
    handleSubmit,
    reset,
    register,
    formState: { errors },

    // ...rest
  } = formMethods;

  const onSubmit = useCallback(
    async (data: SubscribeFormSchema) => {
      reset();
    },
    [reset]
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="footer-form">
      <label
        className={classNames("footer-form__input", {
          "footer-form__input--error": !!errors.email,
        })}
      >
        <input
          disabled={isLoadingSubmit}
          {...register}
          type={"email"}
          placeholder={"Enter your email"}
        />
        <button
          className="email-submit"
          disabled={isLoadingSubmit}
          type="submit"
        >
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
    </form>
  );
};

export default FooterForm;
