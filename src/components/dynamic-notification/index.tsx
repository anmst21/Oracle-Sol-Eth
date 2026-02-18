"use client";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { InputCross } from "../icons";
import { AnimatePresence, motion } from "motion/react";
import classNames from "classnames";
import Link from "next/link";
// import { ProgressData } from "@reservoir0x/relay-sdk";

type NotificationType = "error" | "success" | "reminder";

type Notification = {
  id: string;
  message: string;
  type: NotificationType;
  href?: string;
  ticker?: string;
  time: number;
};

type Props = {
  message: string;
  type: NotificationType | null;
  time: number;
};

// const time = 5;

const DynamicNotification = ({ message, type, time }: Props) => {
  const [toasts, setToasts] = useState<Notification[]>([]);

  const pushToast = (message: string, type: NotificationType, time: number) => {
    const id = Date.now().toString();

    setToasts((prev) => [{ id, message, type, time }, ...prev]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, time * 1000);
  };

  useEffect(() => {
    if (message && type && time) {
      pushToast(message, type, time);
    }
  }, [message, type, time]);

  if (typeof document === "undefined") return null;

  return createPortal(
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
                  transition={{ duration: t.time, ease: "linear" }}
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
    </AnimatePresence>,
    document.body
  );
};

export default DynamicNotification;
