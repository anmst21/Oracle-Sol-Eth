import { PastedWallet, SwapWallet } from "@/components/swap/types";
import { Dispatch, SetStateAction, useCallback, useState } from "react";
import { isValidSolanaAddress } from "@/helpers/is-valid-solana-address";
import { isAddress as isValidEthereumAddress } from "viem";
import { useActiveWallet } from "@/context/ActiveWalletContext";
import { ConnectedSolanaWallet, ConnectedWallet } from "@privy-io/react-auth";

interface UseAddressReturn {
  setManualAddress: Dispatch<SetStateAction<string>>;
  manualAddress: string;
  setError: Dispatch<SetStateAction<string | null>>;
  error: string | null;
  handleSave: () => void;
}

interface AddressModalProps {
  closeModal: () => void;
  setActiveWallet:
    | React.Dispatch<
        React.SetStateAction<
          SwapWallet | ConnectedWallet | ConnectedSolanaWallet | null
        >
      >
    | Dispatch<SetStateAction<SwapWallet | null>>;
}

export function useAddressModal({
  closeModal,
  setActiveWallet,
}: AddressModalProps): UseAddressReturn {
  const [manualAddress, setManualAddress] = useState("");
  const [error, setError] = useState<string | null>(null);

  const {
    ethLinked,
    solLinked,

    setPastedWallets,
    pastedWallets,
  } = useActiveWallet();

  const handleEthAddress = useCallback(
    (address: string) => {
      const newActiveItem: PastedWallet = {
        address,
        type: "ethereum",
        chainId: 1,
        isPasted: true,
      };

      setActiveWallet(newActiveItem);

      const existingConnected = ethLinked.find(
        (wallet) => wallet.address === address
      );
      const existingPasted = pastedWallets.find(
        (wallet) => wallet.address === address
      );

      if (!existingConnected && !existingPasted) {
        setPastedWallets([...pastedWallets, newActiveItem]);
      }

      //   setIsAddressModalOpen(false);
    },
    [setActiveWallet, setPastedWallets, ethLinked, pastedWallets]
  );

  const handleSolAddress = useCallback(
    (address: string) => {
      const newActiveItem: PastedWallet = {
        address,
        type: "solana",
        chainId: 792703809,
        isPasted: true,
      };
      setActiveWallet(newActiveItem);
      const existingConnected = solLinked.find(
        (wallet) => wallet.address === address
      );
      const existingPasted = pastedWallets.find(
        (wallet) => wallet.address === address
      );

      if (!existingConnected && !existingPasted) {
        setPastedWallets([...pastedWallets, newActiveItem]);
      }

      // setIsAddressModalOpen(false);
    },
    [setActiveWallet, pastedWallets, setPastedWallets, solLinked]
  );

  const handleSave = () => {
    setError(null);
    if (isValidEthereumAddress(manualAddress)) {
      handleEthAddress(manualAddress);
    } else if (isValidSolanaAddress(manualAddress)) {
      handleSolAddress(manualAddress);
    } else {
      setError("Invalid ETH or SOL address");
    }

    closeModal();
  };

  return {
    handleSave,
    setManualAddress,
    manualAddress,
    setError,
    error,
  };
}
