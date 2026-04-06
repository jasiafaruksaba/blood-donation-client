import { useEffect, useState } from "react";
import axiosSecure from "../../api/axiosSecure";
import useAuth from "../../hooks/useAuth";

const Funding = () => {
  const [funds, setFunds] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    axiosSecure.get("/payments").then((res) => setFunds(res.data));
  }, []);

  const handleFund = async () => {
    const data = {
      name: user.displayName,
      email: user.email,
      amount: 10,
      date: new Date(),
    };

    await axiosSecure.post("/payments", data);
    alert("Fund Added");

    setFunds([...funds, data]);
  };

  return (
    <div className="p-5">

      <button onClick={handleFund} className="btn btn-primary mb-4">
        Give Fund
      </button>

      <table className="table w-full">
        <thead>
          <tr>
            <th>Name</th>
            <th>Amount</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>
          {funds.map((f, i) => (
            <tr key={i}>
              <td>{f.name}</td>
              <td>${f.amount}</td>
              <td>{new Date(f.date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
};

export default Funding;