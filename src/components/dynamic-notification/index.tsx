"use client";
import React, { useEffect, useState } from "react";
import { InputCross } from "../icons";
import { AnimatePresence, motion } from "motion/react";
import classNames from "classnames";
import Link from "next/link";
import { ProgressData } from "@reservoir0x/relay-sdk";

type FromTokenMeta = {
  ticker: string | undefined;
  address: string | undefined;
  chainId: number | undefined;
};

type Props = {
  error: string | null;
  fromTokenMeta: FromTokenMeta;
  isInsuficientBalance: boolean;
  progress: ProgressData | null;
};

type Notification = {
  id: string;
  message: string;
  type: "error" | "success" | "reminder";
  href?: string;
  ticker?: string;
};

const time = 5;

const DynamicNotification = ({ error, progress }: Props) => {
  const [toasts, setToasts] = useState<Notification[]>([]);

  const pushToast = (message: string | null, progress: ProgressData | null) => {
    const id = Date.now().toString();
    if (message?.includes("'send'")) {
      setToasts((prev) => [{ id, message, type: "reminder" }, ...prev]);
    } else if (progress && !progress.currentStep) {
      setToasts((prev) => [
        {
          id,
          message: "Successfully fullfilled you swap order!",
          type: "success",
        },
        ...prev,
      ]);
    } else if (message) {
      setToasts((prev) => [{ id, message, type: "error" }, ...prev]);
    }

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, time * 1000);
  };

  useEffect(() => {
    if (error || progress) {
      pushToast(error, progress);
    }
  }, [error, progress]);

  return (
    <AnimatePresence mode="sync">
      {toasts.map((t) => {
        return (
          <motion.div
            className={classNames("toast", {
              "toast--error": t.type === "error",
              "toast--success": t.type === "success",
              "toast--notification": t.type === "reminder",
            })}
            key={t.id}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="toast-header">
              <div className="toast-header__status">
                <motion.div
                  className="toast-header__status__progress"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: time, ease: "linear" }}
                />
                <div className="toast-header__status__grey" />
              </div>
              <button
                onClick={() =>
                  setToasts(toasts.filter((toast) => toast.id !== t.id))
                }
              >
                <InputCross />
              </button>
            </div>
            <div className="toast__header">
              {t.type === "error"
                ? "Error"
                : t.type === "reminder"
                ? "Reminder"
                : "Success"}
            </div>
            <div className="toast__text">
              <span>
                {t.message}
                {t.href && t.ticker && (
                  <Link href={t.href}>
                    <br />
                    Buy More {t.ticker}
                  </Link>
                )}
              </span>
            </div>
          </motion.div>
        );
      })}
    </AnimatePresence>
  );
};

export default DynamicNotification;
