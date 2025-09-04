import React, { useEffect, useState } from "react";

const Rate = () => {
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [prevRates, setPrevRates] = useState({});

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/rates");
        const data = await res.json();
        if (data.rates) {
          setPrevRates(
            rates.reduce((acc, r) => {
              acc[r.label] = r.price;
              return acc;
            }, {})
          );
          setRates(data.rates);
        }
      } catch (err) {
        console.error("Error fetching rates:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
    const interval = setInterval(fetchRates, 5000); // auto refresh every 10s
    return () => clearInterval(interval);
  }, [rates]);

  const getChangeClass = (label, price) => {
    const prev = prevRates[label];
    if (!prev) return "";
    if (Number(price) > Number(prev)) return "bg-green-300 text-green-700";
    if (Number(price) < Number(prev)) return "bg-red-300 text-red-700";
    return "";
  };

  return (
    <div className="mt-8 px-4">
      <h2 className="text-2xl font-bold text-center mb-6">Today's Price</h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading live rates...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rates.map((rate, idx) => (
            <div
              key={idx}
              className={`p-5 rounded-2xl shadow-md border transition-all duration-500 ${getChangeClass(
                rate.label,
                rate.price
              )}`}
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-2xl font-bold text-yellow-700">
                  ₹ {rate.price}
                </p>
                <span className="flex items-center text-red-500 text-xs font-bold animate-pulse">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-1"></span>
                  LIVE
                </span>
              </div>
              <p className="text-gray-700 font-medium">{rate.label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Rate;
