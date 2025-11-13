"use client";

import React from "react";
import {
  CheckMark,
  ContactsMail,
  ContactsName,
  ContactsPhone,
  ContactsSubject,
} from "@/components/icons/contacts-form";

import {
  ButtonFunds,
  ButtonPrivy,
  ButtonToken,
  BtnPolygons,
  ButtonValue,
  ButtonWallet,
  ButtonSwap,
  ButtonLoad,
  InputCross,
  ButtonSend,
} from "@/components/icons";
import { getCookieConsentValue } from "react-cookie-consent";

const ContactsForm = () => {
  const cookieValue = getCookieConsentValue("cookieConsentDisplay");

  return <div className="contacts-form">ContactsForm</div>;
};

export default ContactsForm;
