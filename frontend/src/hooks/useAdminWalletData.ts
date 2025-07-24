// Custom hook for wallet data and transactions
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { format } from "date-fns";
import { toast } from "sonner";
import { fetchPlatformWalletDataAPI, fetchPlatformTransactionsAPI, withdrawPlatformWalletAPI } from "@/api/wallet.api.service";
import { IWalletTransaction } from "@/interfaces/transaction.interface";

export function useAdminWalletData(transactionsPerPage: number) {
  const user = useSelector((state: RootState) => state.adminAuth.admin);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({ from: undefined, to: undefined });
  const [transactionType, setTransactionType] = useState<string>("all");
  const [transactions, setTransactions] = useState<IWalletTransaction[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoadingWallet, setIsLoadingWallet] = useState(true);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(true);
  const [withdrawAmount, setWithdrawAmount] = useState<string>("");
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

  // Fetch wallet data
  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        setIsLoadingWallet(true);
        const response = await fetchPlatformWalletDataAPI(user?.id as string);
        if (response.success) {
          setWalletBalance(response.wallet.balance);
        }
      } catch (error: any) {
        toast.error(error.message || "Failed to fetch wallet data", { duration: 3000 });
      } finally {
        setIsLoadingWallet(false);
      }
    };
    if (user?.id) {
      fetchWalletData();
    }
  }, [user?.id]);

  // Fetch transactions
  const fetchTransactions = async () => {
    try {
      setIsLoadingTransactions(true);
      const response = await fetchPlatformTransactionsAPI(
        user?.id as string,
        currentPage,
        transactionsPerPage,
        transactionType,
        dateRange.from ? format(dateRange.from, "yyyy-MM-dd") : "",
        dateRange.to ? format(dateRange.to, "yyyy-MM-dd") : ""
      );
      if (response.success) {
        setTransactions(response.transactions);
        setTotalPages(Math.ceil(response.total / transactionsPerPage));
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch transactions", { duration: 3000 });
    } finally {
      setIsLoadingTransactions(false);
    }
  };

  // Fetch transactions on mount or filter/page change
  useEffect(() => {
    if (user?.id) {
      fetchTransactions();
    }
  }, [user?.id, currentPage, transactionType, dateRange]);

  // Handle withdrawal
  const handleWithdraw = async () => {
    const amountNum = parseFloat(withdrawAmount);
    if (!withdrawAmount || amountNum <= 0) {
      toast.error("Please enter a valid amount", { duration: 3000 });
      return;
    }
    if (walletBalance !== null && amountNum > walletBalance) {
      toast.error("Insufficient balance", { duration: 3000 });
      return;
    }
    try {
      const response = await withdrawPlatformWalletAPI(user?.id as string, amountNum);
      if (response.success) {
        setWalletBalance(response.wallet.balance);
        setTransactions((prev) => [response.transaction, ...prev]);
        toast.success("Withdrawal successfully!", { duration: 3000 });
        setIsWithdrawModalOpen(false);
        setWithdrawAmount("");
      } else {
        throw new Error("Failed to withdraw money");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to withdraw money", { duration: 3000 });
    }
  };

  // Handle date change
  const handleDateChange = (field: "from" | "to", value: string) => {
    if (!value) {
      setDateRange((prev) => ({ ...prev, [field]: undefined }));
      return;
    }
    const date = new Date(value);
    if (!isNaN(date.getTime())) {
      setDateRange((prev) => ({ ...prev, [field]: date }));
    }
  };

  // Handle apply filters
  const handleApplyFilters = () => {
    setCurrentPage(1);
    fetchTransactions();
  };

  // Handle clear filters
  const handleClearFilters = () => {
    setDateRange({ from: undefined, to: undefined });
    setTransactionType("all");
    setCurrentPage(1);
    fetchTransactions();
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return {
    walletBalance,
    dateRange,
    transactionType,
    setTransactionType,
    transactions,
    currentPage,
    totalPages,
    isLoadingWallet,
    isLoadingTransactions,
    withdrawAmount,
    setWithdrawAmount,
    isWithdrawModalOpen,
    setIsWithdrawModalOpen,
    handleWithdraw,
    handleDateChange,
    handleApplyFilters,
    handleClearFilters,
    handlePageChange,
  };
}