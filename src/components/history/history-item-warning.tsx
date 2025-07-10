import classNames from "classnames";
import { HistoryWarning } from "../icons";

const HistoryItemWarning = ({
  error,
  callback,
}: {
  error?: string | null;
  callback?: () => void;
}) => {
  return (
    <div
      className={classNames("history-item-warning", {
        "history-item-warning--error": error,
      })}
    >
      <div className="history-item__section">
        <div className="history-item__time__icon">
          <HistoryWarning />
        </div>
        <div className="history-item__key" />
        <div className="history-item__key" />
        <div className="history-item__key" />
        <div className="history-item__time__icon">
          <HistoryWarning />
        </div>
      </div>
      <div className="history-item__section">
        <div className="history-item__key" />
      </div>
      <div className="history-item__section">
        <div className="history-item__key history-item__key__header">
          <span>{error ? "Error" : "No transactions yet."}</span>
        </div>
      </div>

      <div className="history-item__section">
        <div className="history-item__key history-item__text">
          <span>{error ? error : "Record your first transaction now."}</span>
        </div>
      </div>
      <div className="history-item__section">
        <div className="history-item__time__icon">
          <HistoryWarning />
        </div>
        <div className="history-item__key" />
        <button onClick={callback} className="history-item__cta">
          {error ? "Refresh" : "Go to Swap"}
        </button>
        <div className="history-item__key" />
        <div className="history-item__time__icon">
          <HistoryWarning />
        </div>
      </div>
    </div>
  );
};

export default HistoryItemWarning;
