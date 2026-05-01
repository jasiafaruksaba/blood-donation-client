import { useEffect, useState, useCallback } from "react";
import { Link, useLocation } from "react-router"; 
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const Funding = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const location = useLocation(); 
  const [payments, setPayments] = useState([]);
  const [amount, setAmount] = useState(500);
  const [loading, setLoading] = useState(false);
  const [fetchingPayments, setFetchingPayments] = useState(false);

  // ✅ Total Funding Calculate
  const totalFund = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

  // Function to fetch payments
  const fetchPayments = useCallback(async () => {
    setFetchingPayments(true);
    try {
      const res = await axiosSecure.get("/payments");
      setPayments(Array.isArray(res.data.payments) ? res.data.payments : res.data || []);
    } catch (err) {
      console.error("Failed to load payments", err);
      setPayments([]);
    } finally {
      setFetchingPayments(false);
    }
  }, [axiosSecure]);

  // Load payments on mount
  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  // ✅ Success/Cancel handling + REFRESH
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const success = urlParams.get("success");
    const canceled = urlParams.get("canceled");

    if (success === "true") {
      Swal.fire({
        title: "🎉 Thank You!",
        html: `
          <div>
            <p>Your generous donation of <strong>৳${amount}</strong> has been received!</p>
            <p class="mt-2"><strong>Total Funds Raised:</strong> ৳${totalFund.toLocaleString('en-BD')}</p>
          </div>
        `,
        icon: "success",
        confirmButtonColor: "#e11d48",
        confirmButtonText: "Continue",
      });

      // ✅ REFETCH payments after success
      fetchPayments();
      
      // Clean URL
      window.history.replaceState({}, document.title, "/dashboard/funding");
    }

    if (canceled === "true") {
      Swal.fire({
        title: "Payment Canceled",
        text: "Your payment was canceled. No amount was charged.",
        icon: "info",
        confirmButtonColor: "#64748b",
      });
      window.history.replaceState({}, document.title, "/dashboard/funding");
    }
  }, [location.search, amount, totalFund, fetchPayments]);

  const handleGiveFund = async () => {
    if (!amount || amount < 100) {
      Swal.fire({
        title: "Minimum Amount",
        text: "Minimum donation amount is ৳100",
        icon: "warning",
      });
      return;
    }

    setLoading(true);

    try {
      const res = await axiosSecure.post("/payments", {
        name: user?.displayName || "Anonymous Donor",
        email: user?.email || "anonymous@lifedrop.com",
        amount: Number(amount),
      });

      if (res.data?.url) {
        // Save amount for success message
        localStorage.setItem('donationAmount', amount);
        window.location.href = res.data.url; // Stripe এ redirect
      } else {
        Swal.fire("Error", "Payment session could not be created", "error");
      }
    } catch (err) {
      console.error("PAYMENT ERROR:", err);
      Swal.fire(
        "Failed", 
        err.response?.data?.message || "Something went wrong with payment", 
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-red-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white rounded-3xl p-6 shadow-xl">
          <Link
            to="/dashboard"
            className="flex items-center gap-3 group hover:no-underline"
          >
            <div className="bg-red-50 p-3 rounded-2xl group-hover:bg-red-100 transition-all">
              <span className="text-3xl">🩸</span>
            </div>
            <div>
              <span className="text-3xl font-black text-red-600">LifeDrop</span>
              <p className="text-xs text-slate-500 -mt-1">Blood Donation</p>
            </div>
          </Link>

          <div className="text-lg text-right">
            <span className="font-semibold text-slate-900">
              Welcome, {user?.displayName?.split(" ")[0] || "Donor"}
            </span>
          </div>
        </div>

        {/* Total Funding Hero Card */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-10 rounded-3xl text-center shadow-2xl">
          <h3 className="text-3xl font-bold mb-4">Total Funds Raised</h3>
          <p className="text-6xl lg:text-7xl font-black mb-2">
            ৳{totalFund.toLocaleString("en-BD")}
          </p>
          <p className="text-red-100 text-lg font-medium">
            {payments.length} generous donations
          </p>
        </div>

        {/* Donate Form Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-10">
          <h2 className="text-4xl font-black mb-6 text-slate-900 text-center">
            Support Our Mission
          </h2>
          <p className="text-slate-600 mb-10 text-lg text-center max-w-2xl mx-auto">
            Every taka helps us connect more donors with those in need of blood
          </p>

          <div className="max-w-md mx-auto">
            <label className="block text-xl font-bold text-slate-700 mb-4 text-center">
              Enter Donation Amount (BDT)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full text-6xl font-black text-center py-12 border-4 border-red-200 rounded-4xl focus:outline-none focus:border-red-500 focus:ring-8 focus:ring-red-50 transition-all shadow-xl"
              min="100"
              placeholder="500"
            />

            <button
              onClick={handleGiveFund}
              disabled={loading || !amount || amount < 100}
              className="mt-10 w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-red-400 disabled:to-red-500 text-white font-black py-6 rounded-3xl text-2xl transition-all shadow-2xl hover:shadow-3xl active:scale-[0.98] disabled:cursor-not-allowed"
            >
              {loading 
                ? (
                  <span className="flex items-center gap-3">
                    <span className="loading loading-spinner loading-lg"></span>
                    Processing...
                  </span>
                ) 
                : `Donate ৳${Number(amount).toLocaleString("en-BD")}`
              }
            </button>

            <p className="text-xs text-slate-500 text-center mt-4">
              Secure payment powered by Stripe • Minimum ৳100
            </p>
          </div>
        </div>

        {/* Recent Donations Table */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <h3 className="text-3xl font-bold mb-8 text-slate-900 flex items-center gap-3">
            Recent Donations
            {fetchingPayments && <span className="loading loading-spinner loading-md"></span>}
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gradient-to-r from-slate-50 to-slate-100">
                  <th className="p-5 text-left font-black text-slate-700">Donor Name</th>
                  <th className="p-5 text-left font-black text-slate-700">Amount</th>
                  <th className="p-5 text-left font-black text-slate-700">Date</th>
                </tr>
              </thead>
              <tbody>
                {payments.length > 0 ? (
                  payments.map((p, index) => (
                    <tr key={index} className="border-t hover:bg-red-50 transition-colors">
                      <td className="p-5 font-semibold text-slate-900">{p.name}</td>
                      <td className="p-5">
                        <span className="text-2xl font-black text-emerald-600">
                          ৳{p.amount.toLocaleString('en-BD')}
                        </span>
                      </td>
                      <td className="p-5 text-slate-600 font-medium">
                        {p.paymentDate 
                          ? new Date(p.paymentDate).toLocaleDateString('en-BD', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })
                          : 'Just now'
                        }
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="p-16 text-center">
                      <div className="text-slate-400 space-y-4">
                        <span className="text-6xl">💰</span>
                        <p className="text-xl font-semibold">No donations yet</p>
                        <p>Be the first to support our mission!</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Funding;