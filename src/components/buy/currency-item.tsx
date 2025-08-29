import { MoonpayFiatCurrency } from "@/types/moonpay-api";
import classNames from "classnames";
import Image from "next/image";
type Props = {
  currency: MoonpayFiatCurrency;
  isActive: boolean;
  callback: () => void;
};

const CurrencyItem = ({ currency, callback, isActive }: Props) => {
  const { icon, name, code } = currency;
  return (
    <div
      className={classNames("currency-item", {
        "currency-item--active": isActive,
      })}
    >
      <div className="currency-item__top">
        <div className="currency-item__top__name">
          <span>{name}</span>
          <div className="currency-item__top__tag">{code}</div>
        </div>
        <div className="currency-item__top__image">
          <Image width={20} height={20} src={icon} alt={`${name} icon`} />
        </div>
      </div>
      <button onClick={callback} className="currency-item__bottom">
        Select
      </button>
    </div>
  );
};

export default CurrencyItem;
