import HistoryModalWrapper from "../history/history-modal-wrapper";
import { MoonpayFiatCurrency } from "@/types/moonpay-api";
import CurrencyItem from "./currency-item";
import { InputCross, SearchGlass } from "../icons";
import { useEffect, useState } from "react";

type Props = {
  closeModal: () => void;
  fiatCurrencies: MoonpayFiatCurrency[];
  fiatCurrency: MoonpayFiatCurrency;
  onCurrencyChange: (value: MoonpayFiatCurrency) => void;
};

const CurrenciesModal = ({
  closeModal,
  fiatCurrencies,
  fiatCurrency,
  onCurrencyChange,
}: Props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCurrencies, setFilteredCurrencies] =
    useState<MoonpayFiatCurrency[]>(fiatCurrencies);

  // fiatCurrency.name;
  // fiatCurrency.code;

  useEffect(() => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) {
      setFilteredCurrencies(fiatCurrencies);
      return;
    }

    setFilteredCurrencies(
      fiatCurrencies.filter((c) => {
        const name = (c.name ?? "").toLowerCase();
        const code = (c.code ?? "").toLowerCase();
        return name.includes(term) || code.includes(term);
      })
    );
  }, [searchTerm, fiatCurrencies]);

  return (
    <HistoryModalWrapper
      closeModal={closeModal}
      header="Supported Currencies"
      modalCenter
      info="Choose your fiat currency for pricing and checkout. Search by name or code (e.g., “Canadian Dollar” / “CAD”)."
    >
      <div className="currencies-modal">
        <div className="history-modal__input">
          <label className="address-modal__input">
            <div
              style={{
                display: "flex",
                width: 24,
                height: 24,
                alignItems: "center",
                justifyContent: "center",
              }}
              // className="chain-sidebar__input__abandon"
            >
              <SearchGlass />
            </div>
            <input
              type="text"
              placeholder="Search Currency"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {searchTerm.length > 0 && (
              <button
                onClick={() => {
                  if (searchTerm.length > 0) setSearchTerm("");
                }}
                className="chain-sidebar__input__abandon"
              >
                <InputCross />
              </button>
            )}
          </label>
        </div>

        <div className="currencies-modal__scroll">
          {filteredCurrencies.map((currency, i) => {
            return (
              <CurrencyItem
                callback={() => onCurrencyChange(currency)}
                isActive={fiatCurrency.id === currency.id}
                currency={currency}
                key={i}
              />
            );
          })}
        </div>
      </div>
    </HistoryModalWrapper>
  );
};

export default CurrenciesModal;
